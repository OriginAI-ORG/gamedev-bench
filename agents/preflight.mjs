import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {ROOT,writeJson} from '../runner/common.mjs';
import {redact} from './events.mjs';
import {benchmarkPermissions,permissionArgs,shellRuntimeArgs} from './permissions.mjs';

export async function preflightCodex(attempt,settings) {
  const probeName='benchmark-probe-'+randomUUID(),canary=path.join(attempt.folder,probeName);
  await fs.writeFile(canary,randomUUID());
  for(const name of ['requests','temp'])await fs.mkdir(path.join(attempt.workspace,name),{recursive:true});
  const denied=[canary,path.join(ROOT,'README.md'),path.join(ROOT,'tasks',attempt.record.task_id,'reference','index.html'),path.join(ROOT,'tasks',attempt.record.task_id,'verifier','scenarios.mjs')];
  for(const file of denied)await fs.access(file);
  const source=`const fs=require('node:fs');const path=require('node:path');
const denied=${JSON.stringify(denied)},marker=${JSON.stringify(probeName)};
fs.readFileSync('instruction.md');fs.writeFileSync('game/'+marker,'ok');fs.unlinkSync('game/'+marker);
fs.writeFileSync('requests/'+marker,'ok');fs.unlinkSync('requests/'+marker);
function rejects(label,fn){let denied=false;try{fn();}catch(e){if(['EACCES','EPERM','ENOENT'].includes(e.code))denied=true;else throw e;}if(!denied)throw new Error('Isolation failed: '+label);}
for(const file of denied){rejects('outside read',()=>{const fd=fs.openSync(file,'r');fs.closeSync(fd)});}
rejects('parent listing',()=>fs.readdirSync('..'));
rejects('parent write',()=>{fs.writeFileSync('../'+marker,'bad');fs.unlinkSync('../'+marker)});
rejects('task contract write',()=>{const fd=fs.openSync('instruction.md','r+');fs.closeSync(fd)});
console.log('BENCHMARK_ISOLATION_OK');`;
  const checks=[],modes=process.platform==='win32'?[...new Set([settings.windows_sandbox||'mxc','mxc'])]:[null];
  const probeFile=path.join(attempt.workspace,'temp',probeName+'.cjs');
  await fs.writeFile(probeFile,source);
  try{
    for(const mode of modes){
      const args=[...permissionArgs(attempt.workspace,settings.binary,settings.shell),...shellRuntimeArgs()];
      if(mode)args.push('-c','windows.sandbox='+JSON.stringify(mode));
      args.push('sandbox','--include-managed-config','--permission-profile','benchmark','-C',attempt.workspace,'--');
      const commands=[{name:'node',argv:[process.execPath,'-e',source]}];
      if(process.platform==='win32'){
        if(!settings.shell)throw new Error('Windows solver shell was not resolved. Model was not called.');
        commands.push({name:'solver-cmd-script',argv:[settings.shell,'/d','/s','/c','node temp\\'+probeName+'.cjs']});
      }
      let passed=true;
      for(const command of commands){
        const check=spawnSync(settings.binary,[...args,...command.argv],{encoding:'utf8',timeout:45000,windowsHide:true,maxBuffer:128*1024});
        const ok=check.status===0&&check.stdout.includes('BENCHMARK_ISOLATION_OK');
        checks.push({mode,command:command.name,passed:ok,exit_code:check.status,stdout:redact(check.stdout||''),stderr:redact(check.stderr||''),error:check.error?String(check.error):null});
        if(!ok){passed=false;break;}
      }
      if(passed){
        const profile=benchmarkPermissions(attempt.workspace,settings.binary,settings.shell);
        const isolation={passed:true,checked_at:new Date().toISOString(),checks,profile,profile_sha256:createHash('sha256').update(JSON.stringify(profile)).digest('hex'),checked:['workspace read','game/request writes','outside file reads denied','parent listing denied','parent write denied','public contract write denied',...(settings.shell?['solver cmd.exe loads a Node script file and uses relative workspace paths']:[])],read_boundary:'verified-for-listed-probes',scope:'Native sandbox command boundary; profile is reused by the model invocation.'};
        await writeJson(path.join(attempt.folder,'generation','sandbox-preflight.json'),isolation);
        console.log('Benchmark isolation preflight passed: '+(mode||process.platform));
        return {...settings,configured_windows_sandbox:settings.windows_sandbox,windows_sandbox:mode,isolation};
      }
    }
    await writeJson(path.join(attempt.folder,'generation','sandbox-preflight.json'),{passed:false,checks});
    throw new Error('No supported sandbox enforced the benchmark read/write boundary. Model was not called.');
  }finally{await fs.unlink(canary).catch(()=>{});await fs.unlink(probeFile).catch(()=>{});}
}
