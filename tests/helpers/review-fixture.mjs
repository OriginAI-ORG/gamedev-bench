import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {startProgressServer} from '../../scripts/progress.mjs';

export async function reviewFixture() {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'webgame-review-'));
  const folder=path.join(root,'artifacts/batches/test-batch'),task='fixture-game',id='attempt-fixture-game-1',run='fixture-run';
  const write=async(file,value)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,typeof value==='string'?value:JSON.stringify(value));};
  const game='<!doctype html><html><h1>测试游戏</h1><button id="hit">击中</button><b id="score">0</b><button id="reset">重开</button><script>let n=0;hit.onclick=()=>score.textContent=++n;reset.onclick=()=>score.textContent=n=0;</script></html>';
  const digest=createHash('sha256').update(game).digest('hex');
  const prompt='点击击中增加分数；重开恢复 0。';
  const scenarios='export const scenarios=[{id:"score",description:"点击计分",query:{mode:"test"},steps:[["click","#hit"],["text","#score","1"]]}];';
  const digestOf=value=>createHash('sha256').update(value).digest('hex');
  const attempt={task,id,state:'finished',successful:false,model_submitted:true,task_version_sha256:{'prompt.md':digestOf(prompt),'verifier/scenarios.mjs':digestOf(scenarios)},acceptance:{run_id:run,status:'functional-failure',passed_checks:0,total_checks:1}};
  await write(path.join(folder,'batch.json'),{id:'test-batch',model:'fixture',effort:'high',concurrency:1,tasks:[task],attempts:[attempt]});
  await write(path.join(root,'tasks',task,'task.json'),{title:'测试夹具游戏'});
  await write(path.join(root,'tasks',task,'prompt.md'),prompt);
  await write(path.join(root,'tasks',task,'verifier/scenarios.mjs'),scenarios);
  await write(path.join(root,'artifacts/attempts',id,'workspace/instruction.md'),prompt);
  await write(path.join(root,'artifacts/attempts',id,'workspace/task.json'),{title:'测试夹具游戏'});
  await write(path.join(root,'artifacts/attempts',id,'submitted_project/index.html'),game);
  await write(path.join(root,'artifacts/runs',run,'verdict.json'),{run_id:run,submission_sha256:{'index.html':digest},checks:[{id:'score',passed:false,message:'fixture failure',duration_ms:12,evidence:'evidence/score/'}]});
  await write(path.join(root,'artifacts/runs',run,'evidence/score/actions.json'),'[{"action":"click","id":"hit"}]');
  const service=await startProgressServer({folder,root,port:0});
  const payload=detail=>({attempt_id:id,digest:detail.digest,revision:0,verdict:'verifier_issue',ratings:{playable:'pass',rules:'pass',visuals:'not_checked'},reviewer:'自动化测试夹具',notes:'仅测试保存流程，不是用户复审。'});
  return {root,folder,id,service,payload,close:async()=>{await service.close();const target=await fs.realpath(root),tempRoot=await fs.realpath(os.tmpdir());if(path.dirname(target)!==tempRoot||!path.basename(target).startsWith('webgame-review-'))throw new Error('Unexpected cleanup path');await fs.rm(target,{recursive:true,force:true});}};
}
