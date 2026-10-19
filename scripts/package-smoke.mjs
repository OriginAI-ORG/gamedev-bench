import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {ROOT,json,writeJson,harnessHashes,contained,benchmarkManifest} from '../runner/common.mjs';

const python=process.env.PYTHON||(process.platform==='win32'?'python':'python3');
const npmCli=process.env.NPM_CLI||process.env.npm_execpath||path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');
await fs.access(npmCli);
const env={...process.env,PLAYWRIGHT_BROWSERS_PATH:process.env.PLAYWRIGHT_BROWSERS_PATH||path.join(ROOT,'.browsers')};
const checks=[];
function run(command,args,cwd,timeout=180000){
  const result=spawnSync(command,args,{cwd,env,encoding:'utf8',windowsHide:true,timeout,maxBuffer:8*1024*1024});
  checks.push({command:path.basename(command),args:args.map(a=>path.isAbsolute(a)?path.basename(a):a),exit_code:result.status});
  if(result.status!==0)throw new Error((result.stdout||'')+(result.stderr||'')+(result.error||''));
  return result.stdout.trim();
}
const latest=await json(path.join(ROOT,'dist/latest.json'));
const output=run(python,['-B','scripts/check_release.py','--extract-smoke'],ROOT);
const extracted=output.split(/\r?\n/).at(-1);
if(!contained(path.join(ROOT,'artifacts/release-smoke'),extracted))throw new Error('Unexpected extraction directory');
console.log('Fresh archive extracted; installing locked dependencies from local cache.');
run(process.execPath,[npmCli,'ci','--ignore-scripts','--offline','--no-audit','--no-fund','--cache',path.join(ROOT,'.npm-cache')],extracted);
console.log(run(process.execPath,['scripts/benchmark.mjs','doctor'],extracted));
run(process.execPath,['scripts/validate-tests.mjs'],extracted);
for(const task of ['og-web-0001','og-web-0011','og-web-0110'])console.log(run(process.execPath,['scripts/cohort/qa-task.mjs',task],extracted));
run(process.execPath,['scripts/cohort/audit.mjs'],extracted);
run(process.execPath,['scripts/release-check.mjs'],extracted);
const manifest=await benchmarkManifest();
const copied=await benchmarkManifest(extracted);
if(JSON.stringify(manifest.candidates)!==JSON.stringify(copied.candidates))throw new Error('Extracted task audit differs');
const harness=await harnessHashes(),copiedTests=await json(path.join(extracted,'validation/tests.json'));
if(JSON.stringify(harness)!==JSON.stringify(copiedTests.harness_sha256))throw new Error('Extracted harness differs');
await writeJson(path.join(ROOT,'validation/package-smoke.json'),{passed:true,checked_at:new Date().toISOString(),
  clean_dependency_install:true,archive_integrity_verified:true,source_archive:latest.archive,archive_sha256:latest.sha256,
  browser_installation:'Reused locally installed matching Chromium; no fresh-machine browser download claim',
  no_upstream_clones:true,representative_tasks:['og-web-0001','og-web-0011','og-web-0110'],harness_sha256:harness,
  task_manifest_sha256:createHash('sha256').update(JSON.stringify(manifest.candidates)).digest('hex'),checks});
console.log('Clean archive installation passed; receipt: validation/package-smoke.json');
