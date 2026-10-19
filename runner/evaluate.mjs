import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ROOT, json, writeJson, hashes } from './common.mjs';
import { serve } from '../environments/verification/server.mjs';
import { launchBrowser } from '../environments/verification/browser.mjs';
import {assertRenderedGame,guardNavigation} from '../environments/verification/visual.mjs';

export async function evaluateRequest(requestPath) {
  const request = await json(requestPath), output = path.dirname(requestPath);
  const checks = [], measurements = [], errors = [];
  const started = Date.now();
  const beforeHashes = await hashes(path.join(output,'submitted_project'));
  const trajectory = path.join(output,'trajectory.jsonl');
  const append = event => fs.appendFile(trajectory,JSON.stringify({at:new Date().toISOString(),...event})+'\n');
  let server, browser, infrastructureError = false;
  const finishCheck = check => { checks.push(check); return writeJson(path.join(output,'partial-checks.json'),checks); };
  await append({event:'acceptance-start',task:request.task,submission_hashes:beforeHashes});
  try {
    // Load trusted scenarios from the evaluator, never from the submission.
    const verifier = await import(pathToFileURL(path.join(ROOT,'tasks',request.task,'verifier','scenarios.mjs')).href);
    server = await serve(path.join(output,'submitted_project'));
    browser = await launchBrowser();
    request.runtime.browser = browser.version();
    for (const scenario of verifier.scenarios) {
      const scenarioDir = path.join(output,'evidence',scenario.id);
      await fs.mkdir(scenarioDir,{recursive:true});
      const context = await browser.newContext({
        viewport:{width:1100,height:760}, locale:'zh-CN', timezoneId:'Asia/Taipei',
        serviceWorkers:'block', acceptDownloads:false, recordVideo:{dir:scenarioDir,size:{width:1100,height:760}}
      });
      const log = [], pageErrors = [], resources = [];
      await context.route('**/*', async route => {
        const url = route.request().url();
        if (url.startsWith(server.url)) await route.continue();
        else { resources.push({url,reason:'outside-submission-origin'}); await route.abort('blockedbyclient'); }
      });
      await context.routeWebSocket('**/*', socket => socket.close());
      const page = await context.newPage();
      guardNavigation(page);
      page.setDefaultTimeout(2200); page.setDefaultNavigationTimeout(7000);
      page.on('pageerror', error => pageErrors.push(String(error)));
      page.on('console', message => { if(message.type()==='error') pageErrors.push(message.text()); });
      page.on('response', response => { if(response.status()>=400 && !response.url().endsWith('/favicon.ico')) resources.push({url:response.url(),status:response.status()}); });
      const t0 = Date.now();
      let passed = true, message = scenario.description;
      try {
        await verifier.runScenario(page,server.url,scenario,event=>log.push({elapsed_ms:Date.now()-t0,...event}));
        await assertRenderedGame(page);
        if(pageErrors.length || resources.length) throw new Error('Runtime/resource errors: '+JSON.stringify({pageErrors,resources}));
      } catch(error) { passed=false; message=String(error.message || error); }
      try { await page.screenshot({path:path.join(scenarioDir,'final.png'),fullPage:true,timeout:5000}); }
      catch(error) { passed=false; message += '; screenshot failed: '+error.message; }
      const video = page.video();
      await context.close();
      if(video) await video.saveAs(path.join(scenarioDir,'gameplay.webm'));
      // Playwright's recording basename is random; retain only the stable evidence name.
      if(video) { const original=await video.path(); if(path.resolve(original)!==path.join(scenarioDir,'gameplay.webm')) await fs.unlink(original); }
      await writeJson(path.join(scenarioDir,'actions.json'),log);
      await writeJson(path.join(scenarioDir,'runtime-errors.json'),{pageErrors,resources});
      const evidence='evidence/'+scenario.id+'/';
      await finishCheck({id:scenario.id,passed,message,duration_ms:Date.now()-t0,evidence});
      measurements.push({scenario:scenario.id,actions:log});
      await append({event:'acceptance-check',id:scenario.id,passed,evidence});
    }
  } catch(error) {
    infrastructureError = true; errors.push(String(error.stack||error));
    await finishCheck({id:'acceptance-infrastructure',passed:false,message:String(error.message||error)});
  } finally {
    if(browser) await browser.close().catch(error=>errors.push(String(error)));
    if(server) await server.close();
  }
  const afterHashes = await hashes(path.join(output,'submitted_project'));
  const immutable = JSON.stringify(beforeHashes)===JSON.stringify(afterHashes);
  if(!immutable) await finishCheck({id:'submission-unchanged',passed:false,message:'Submitted files changed during acceptance.'});
  const verdict = {
    schema_version:1,run_id:request.run_id,task:request.task,task_version:request.task_version,
    classification:request.classification, expected:request.expected??null,
    status:infrastructureError?'infrastructure-error':checks.length && checks.every(c=>c.passed)?'passed':'functional-failure',
    functional_pass:!infrastructureError && checks.length>0 && checks.every(c=>c.passed),
    started_at:new Date(started).toISOString(),finished_at:new Date().toISOString(),duration_ms:Date.now()-started,
    runtime:request.runtime,checks,errors,submission_sha256:beforeHashes,submission_unchanged:immutable,
    usage:{input_tokens:null,output_tokens:null,cost:null,reason:'Artifact acceptance; no model API call made.'},
    isolation:{browser_context:'fresh-per-scenario',browser_sandbox_requested:true,network:'submission-origin-only',agent_filesystem:request.model?.filesystem_isolation??'not-applicable-to-fixture-evaluation',profile_sha256:request.model?.isolation_profile_sha256??null,claim:'Browser isolation and per-attempt native command probes are recorded separately.'},
    human_review:{status:'pending',scope:'Compare visible screenshots/video with measured DOM output; no automatic visual score.'}
  };
  await writeJson(path.join(output,'measurements.json'),measurements);
  await writeJson(path.join(output,'verdict.json'),verdict);
  await writeJson(requestPath,request);
  const exported = spawnSync(process.env.PYTHON || (process.platform==='win32'?'python':'python3'),['-B',path.join(ROOT,'runner','export_results.py'),output],{
    encoding:'utf8',timeout:15000,env:{...process.env,PYTHONIOENCODING:'utf-8'},windowsHide:true
  });
  await fs.writeFile(path.join(output,'export.log'),(exported.stdout||'')+(exported.stderr||''));
  if(exported.status!==0) throw new Error('Upstream result export failed: '+exported.stderr);
  await append({event:'acceptance-finished',status:verdict.status});
  console.log(request.run_id+': '+verdict.status+' ('+checks.filter(c=>c.passed).length+'/'+checks.length+')');
  return verdict;
}
