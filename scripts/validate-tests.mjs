import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {ROOT,harnessHashes,writeJson} from '../runner/common.mjs';
const before=await harnessHashes(),checks=[];
for(const [command,args] of [[process.execPath,['--test','tests/*.test.mjs']],[process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['-B','-m','unittest','discover','-s','tests','-p','test_*.py']]]){
  const result=spawnSync(command,args,{cwd:ROOT,encoding:'utf8',windowsHide:true,timeout:120000});
  process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
  checks.push({command:path.basename(command),args,exit_code:result.status});
}
const after=await harnessHashes(),passed=checks.every(c=>c.exit_code===0)&&JSON.stringify(before)===JSON.stringify(after);
await writeJson(path.join(ROOT,'validation/tests.json'),{passed,checked_at:new Date().toISOString(),harness_sha256:after,checks});
if(!passed)process.exitCode=1;
