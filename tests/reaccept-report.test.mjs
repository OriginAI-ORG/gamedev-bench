import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {reviewFixture} from './helpers/review-fixture.mjs';

test('reacceptance report separates old scores, scopes evidence and escapes messages',async()=>{
 const f=await reviewFixture();
 try{
  const before=await fs.readFile(path.join(f.folder,'batch.json'),'utf8');
  const r={id:'reaccept-test',batch_id:'test-batch',created_at:'2026-10-15T01:00:00Z',status:'complete',original_evidence_unchanged:true,items:[{task:'fixture-game',attempt_id:f.id,original_run_id:'fixture-run',revised_run_id:'revised-run',original_functional_pass:false,revised_functional_pass:true,original_checks:[{id:'score',passed:false,message:'<script>evil()</script>',evidence:'evidence/score/'}],revised_checks:[{id:'score',passed:true,evidence:'evidence/score/'}]}]};
  const dir=path.join(f.root,'artifacts/reevaluations',r.id);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'results.json'),JSON.stringify(r));
  const evidence=path.join(f.root,'artifacts/runs/revised-run/evidence/score');await fs.mkdir(evidence,{recursive:true});await fs.writeFile(path.join(evidence,'actions.json'),'[]');
  const html=await(await fetch(f.service.url+'/reaccept')).text();assert.match(html,/原通过 0 → 修正后通过 1/);assert.match(html,/&lt;script&gt;evil/);assert.doesNotMatch(html,/<script>evil/);
  assert.equal((await fetch(f.service.url+'/reaccept-evidence/reaccept-test/revised-run/score/actions.json')).status,200);
  for(const suffix of ['foreign-run/score/actions.json','revised-run/unknown/actions.json','revised-run/score/index.html','revised-run/..%5Cscore/actions.json'])assert.ok([403,404].includes((await fetch(f.service.url+'/reaccept-evidence/reaccept-test/'+suffix)).status));
  assert.equal((await fetch(f.service.url+'/api/reaccept/result?round=unknown')).status,404);
  assert.equal((await fetch(f.service.url+'/reaccept',{method:'POST'})).status,405);
  assert.equal(await fs.readFile(path.join(f.folder,'batch.json'),'utf8'),before);
  const continued=JSON.parse(before);continued.id='continued-batch';continued.reacceptance={source_batch_id:'test-batch',id:r.id};
  continued.attempts[0].retained_reacceptance={id:r.id,original_acceptance:continued.attempts[0].acceptance};
  continued.attempts[0].acceptance={run_id:'revised-run'};
  await fs.writeFile(path.join(f.folder,'batch.json'),JSON.stringify(continued));
  assert.match(await(await fetch(f.service.url+'/reaccept')).text(),/原通过 0 → 修正后通过 1/);
  assert.equal((await fetch(f.service.url+'/reaccept-evidence/reaccept-test/revised-run/score/actions.json')).status,200,'continuation must retain access to the bound reacceptance');
  assert.equal((await fetch(f.service.url+'/reaccept-evidence/reaccept-test/fixture-run/score/actions.json')).status,200,'original evidence remains accessible');
  r.batch_id='other-batch';await fs.writeFile(path.join(dir,'results.json'),JSON.stringify(r));
  assert.equal((await fetch(f.service.url+'/reaccept-evidence/reaccept-test/revised-run/score/actions.json')).status,404);
 }finally{await f.close();}
});
