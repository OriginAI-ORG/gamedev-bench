import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT,json,writeJson,id,hashes,treeFiles } from '../runner/common.mjs';
import { report } from '../runner/report.mjs';
import {runOne} from '../runner/submission.mjs';
import {listTasks} from '../core/tasks.mjs';
import { serve } from '../environments/verification/server.mjs';

const [command,...args] = process.argv.slice(2);
const TASKS=(await listTasks()).map(task=>task.id);
const python=process.env.PYTHON || (process.platform==='win32'?'python':'python3');
function taskName(name) { if(!TASKS.includes(name)) throw new Error('Unknown task: '+name+'. See tasks/ or configs/OriginGameDevBench.json.'); return name; }

async function negativeCases(task) {
  if(task!=='og-web-9001' && task!=='og-web-9002') {
    const manifest=await json(path.join(ROOT,'tasks',task,'negative_cases','manifest.json'));
    if(!Array.isArray(manifest)||!manifest.length)throw new Error('Missing negative cases for '+task);
    return manifest.map(item=>{
      if(!/^[a-z0-9][a-z0-9-]*$/.test(item.fault)||!item.must_fail_check)throw new Error('Invalid negative case for '+task);
      return {fault:item.fault,check:item.must_fail_check,folder:path.join(ROOT,'tasks',task,'negative_cases',item.fault)};
    });
  }
  const spec=task==='og-web-9001' ? [
    ['through-wall','wall-and-movement'],['early-win','all-boxes-win'],['broken-reset','reset-state']
  ] : [
    ['all-match','mismatch-and-lock'],['self-match','match-and-repeat'],['stale-count','reset-counts']
  ];
  const reference=await fs.readFile(path.join(ROOT,'tasks',task,'reference','index.html'),'utf8');
  const generated=[];
  for(const [fault,check] of spec) {
    const folder=path.join(ROOT,'tasks',task,'negative_cases',fault);
    await fs.mkdir(folder,{recursive:true});
    if(!reference.includes("const fault = 'none';")) throw new Error('Mutation marker missing');
    await fs.writeFile(path.join(folder,'index.html'),reference.replace("const fault = 'none';","const fault = '"+fault+"';"));
    generated.push({fault,check,folder});
  }
  await writeJson(path.join(ROOT,'tasks',task,'negative_cases','manifest.json'),generated.map(({fault,check})=>({fault,must_fail_check:check})));
  return generated;
}

try {
  if(command==='worker') {
    const {evaluateRequest}=await import('../runner/evaluate.mjs');
    await evaluateRequest(args[0]);
  } else if(command==='attempt') {
    const {attemptCommand}=await import('../core/run-attempt.mjs');
    await attemptCommand(args);
  } else if(command==='doctor') {
    const {launchBrowser}=await import('../environments/verification/browser.mjs');
    const py=spawnSync(python,['--version'],{encoding:'utf8',windowsHide:true});
    if(py.status!==0) throw new Error('Python unavailable: '+py.stderr);
    const browser=await launchBrowser();
    const version=browser.version(); await browser.close();
    const result={checked_at:new Date().toISOString(),node:process.version,python:py.stdout.trim(),
      playwright:(await json(path.join(ROOT,'node_modules','playwright','package.json'))).version,
      chromium:version,chromium_sandbox_requested:true,platform:process.platform,arch:process.arch,
      agent_filesystem_isolation:'not-validated',model_api_required_for_selftest:false};
    await writeJson(path.join(ROOT,'artifacts','doctor.json'),result); console.log(JSON.stringify(result,null,2));
  } else if(command==='self-test') {
    const outcomes=[], started=new Date().toISOString();
    const selected=args.length?args.map(taskName):TASKS;
    for(const task of selected) {
      for(let repetition=1;repetition<=3;repetition++) {
        const result=await runOne(task,path.join(ROOT,'tasks',task,'reference'),'reference-validation','passed');
        outcomes.push({task,case:'reference-'+repetition,ok:result.functional_pass,run_id:result.run_id});
        if(result.status==='infrastructure-error') throw new Error('Infrastructure unavailable; fix before further self-tests.');
      }
      for(const mutant of await negativeCases(task)) {
        const result=await runOne(task,mutant.folder,'negative-validation','functional-failure');
        outcomes.push({task,case:mutant.fault,ok:result.status==='functional-failure' && result.checks.some(c=>c.id===mutant.check&&!c.passed),run_id:result.run_id,required_detection:mutant.check});
      }
      const empty=await runOne(task,path.join(ROOT,'tasks',task,'starter'),'empty-submission-validation','functional-failure');
      outcomes.push({task,case:'empty-starter',ok:empty.status==='functional-failure',run_id:empty.run_id});
      await report();
    }
    const result={started_at:started,finished_at:new Date().toISOString(),passed:outcomes.every(o=>o.ok),outcomes};
    await writeJson(path.join(ROOT,'artifacts','self-test.json'),result);
    console.log('Self-test '+(result.passed?'PASSED':'FAILED')+': '+outcomes.filter(o=>o.ok).length+'/'+outcomes.length);
    if(!result.passed) process.exitCode=1;
  } else if(command==='evaluate') {
    const [task,source]=args;
    if(!source) throw new Error('Usage: npm run evaluate -- TASK SUBMISSION_DIRECTORY');
    const result=await runOne(taskName(task),path.resolve(source),'local-submission');
    await report(); if(!result.functional_pass) process.exitCode=result.status==='infrastructure-error'?2:1;
  } else if(command==='sample') {
    const result=await runOne('og-web-9001',path.join(ROOT,'samples','current-session','og-web-9001'),'current-session-development');
    await report(); if(!result.functional_pass) process.exitCode=1;
  } else if(command==='prepare') {
    const task=taskName(args[0]), target=path.join(ROOT,'workspaces',id(task));
    await fs.mkdir(target,{recursive:true});
    await fs.cp(path.join(ROOT,'tasks',task,'starter'),path.join(target,'game'),{recursive:true});
    await fs.copyFile(path.join(ROOT,'tasks',task,'prompt.md'),path.join(target,'instruction.md'));
    await fs.copyFile(path.join(ROOT,'tasks',task,'public-test.mjs'),path.join(target,'public-test.mjs'));
    await writeJson(path.join(target,'workspace.json'),{task,version:'0.1.0',created_at:new Date().toISOString(),isolation:'not-validated',formal_run_allowed:false});
    console.log(target);
  } else if(command==='serve') {
    const selected=args[0]||'report', port=Number(args[1]||8080);
    if(!Number.isInteger(port)||port<0||port>65535) throw new Error('Invalid port');
    const folder=selected==='report'?path.join(ROOT,'artifacts'):path.join(ROOT,'tasks',taskName(selected),'reference');
    const server=await serve(folder,port); console.log(server.url);
    const close=async()=>{await server.close();process.exit(0);};
    process.on('SIGINT',close);process.on('SIGTERM',close);
  } else if(command==='report') {
    console.log(await report());
  } else {
    throw new Error('Commands: doctor | self-test [TASK ...] | evaluate TASK DIR | sample | prepare TASK | report | serve [report|TASK] [PORT]');
  }
} catch(error) {
  console.error(error.stack||error); process.exitCode=2;
}
