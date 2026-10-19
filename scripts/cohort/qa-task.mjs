import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT,json,writeJson,taskEvidenceHashes} from '../../runner/common.mjs';
import {serve} from '../../environments/verification/server.mjs';
import {launchBrowser} from '../../environments/verification/browser.mjs';
import {assertRenderedGame,guardNavigation,VISUAL_MUTATIONS} from '../../environments/verification/visual.mjs';
import {acquireLock} from '../../runner/lock.mjs';

const task=process.argv[2];
if(!/^og-web-\d{4}$/.test(task||''))throw new Error('Invalid task');
const folder=path.join(ROOT,'tasks',task),output=path.join(ROOT,'artifacts','og-qa',task);
await fs.mkdir(output,{recursive:true});
const releaseLock=acquireLock(path.join(output,'runner.lock'));
const started=Date.now(),before=await taskEvidenceHashes(task),outcomes=[];
let browser,browserVersion=null;
async function check(source,scenario,kind,run,css=null,mutation=null){
  const server=await serve(source),context=await browser.newContext({viewport:{width:1100,height:760},locale:'zh-CN',timezoneId:'Asia/Taipei',serviceWorkers:'block',acceptDownloads:false});
  const page=await context.newPage(),events=[],runtimeErrors=[];let mutationApplied=false,mutationError=null;
  guardNavigation(page);
  const name=kind+'-'+scenario.id;
  page.setDefaultTimeout(2200);page.setDefaultNavigationTimeout(7000);
  await context.route('**/*',async route=>{
    if(!route.request().url().startsWith(server.url))return route.abort();
    const requestPath=new URL(route.request().url()).pathname;
    if(mutation&&(requestPath==='/'+mutation.file||(mutation.file==='index.html'&&requestPath==='/'))){
      const response=await route.fetch(),original=await response.text();
      if(!mutation.find||original.split(mutation.find).length!==2){mutationError='Mutation must match exactly once: '+mutation.file;return route.fulfill({response});}
      mutationApplied=true;
      return route.fulfill({response,body:original.replace(mutation.find,mutation.replace)});
    }
    if(css&&route.request().isNavigationRequest()){
      const response=await route.fetch();
      return route.fulfill({response,body:(await response.text())+'<style>'+css+'</style>'});
    }
    return route.continue();
  });
  await context.routeWebSocket('**/*',socket=>socket.close());
  page.on('pageerror',error=>runtimeErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')runtimeErrors.push(message.text());});
  let passed=true,error=null;
  try{await run(page,server.url,scenario,event=>events.push(event));await assertRenderedGame(page);if(runtimeErrors.length)throw new Error(runtimeErrors.join('\n'));if(mutationError)throw new Error(mutationError);if(mutation&&!mutationApplied)throw new Error('Mutation was not exercised');}
  catch(ex){passed=false;error=String(ex.message||ex);}
  try{if(kind==='reference-1'||!passed)await page.screenshot({path:path.join(output,name+'.png'),fullPage:true,timeout:4000});}catch{}
  await context.close();await server.close();
  await writeJson(path.join(output,name+'.json'),{task,kind,scenario:scenario.id,passed,error,runtimeErrors,events});
  return {kind,scenario:scenario.id,passed,error,runtime_errors:runtimeErrors.length,evidence:name+'.json',...(mutation?{mutation_applied:mutationApplied}:{})};
}
try{
  const verifier=await import(pathToFileURL(path.join(folder,'verifier','scenarios.mjs')).href);
  const publicCheck=await import(pathToFileURL(path.join(folder,'public-check.mjs')).href);
  const negatives=await json(path.join(folder,'negative_cases','manifest.json'));
  if(verifier.scenarios.length<3||negatives.length<2)throw new Error('Insufficient private scenarios or mutation cases');
  browser=await launchBrowser();
  browserVersion=browser.version();
  const pub=await check(path.join(folder,'reference'),{id:'public'},'reference-public',(page,url,_s,record)=>publicCheck.runPublicCheck(page,url,record));
  outcomes.push({...pub,ok:pub.passed});
  for(let repeat=1;repeat<=3;repeat++){
    for(const scenario of verifier.scenarios){
      const result=await check(path.join(folder,'reference'),scenario,'reference-'+repeat,verifier.runScenario);
      outcomes.push({...result,ok:result.passed});
    }
    if(outcomes.some(o=>!o.ok))break;
  }
  for(const negative of negatives){
    const scenario=verifier.scenarios.find(s=>s.id===negative.must_fail_check);
    if(!scenario)throw new Error('Missing mutation scenario '+negative.must_fail_check);
    const result=await check(negative.mutation?path.join(folder,'reference'):path.join(folder,'negative_cases',negative.fault),scenario,'negative-'+negative.fault,verifier.runScenario,null,negative.mutation);
    // A runtime crash is not evidence that the intended behavioral fault was detected.
    outcomes.push({...result,ok:!result.passed&&result.runtime_errors===0&&(!negative.mutation||result.mutation_applied),expected:'functional-failure'});
  }
  for(const [mutation,css] of Object.entries(VISUAL_MUTATIONS)){
    const result=await check(path.join(folder,'reference'),verifier.scenarios[0],'visual-'+mutation,verifier.runScenario,css);
    outcomes.push({...result,ok:!result.passed&&result.runtime_errors===0&&result.error?.includes('Rendered game:'),expected:'visual-failure'});
  }
  let starterRejected=false;
  for(const scenario of verifier.scenarios){
    const result=await check(path.join(folder,'starter'),scenario,'starter',verifier.runScenario);
    outcomes.push({...result,ok:true,expected:'at-least-one-failure'});
    if(!result.passed){starterRejected=true;break;}
  }
  outcomes.push({kind:'starter-rejected',ok:starterRejected});
}catch(error){outcomes.push({kind:'infrastructure',ok:false,error:String(error.stack||error)});}
finally{if(browser)await browser.close();}
const after=await taskEvidenceHashes(task);
const result={task,started_at:new Date(started).toISOString(),finished_at:new Date().toISOString(),duration_ms:Date.now()-started,task_hashes:after,files_unchanged:JSON.stringify(before)===JSON.stringify(after),reference_repetitions:3,model_run:false,runtime:{node:process.version,chromium:browserVersion,platform:process.platform,chromium_sandbox:true,network:'submission-origin-only'},outcomes};
result.passed=result.files_unchanged&&outcomes.length>0&&outcomes.every(o=>o.ok);
await writeJson(path.join(output,'result.json'),result);
releaseLock();
console.log(task+' '+(result.passed?'PASS':'FAIL')+' '+Math.round(result.duration_ms/1000)+'s');
if(!result.passed)process.exitCode=1;
