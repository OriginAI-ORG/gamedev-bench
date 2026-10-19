import test from 'node:test';
import assert from 'node:assert/strict';
import {schedulingPlan,runPool} from '../scripts/elastic-batch.mjs';

test('elastic handoff excludes finished tasks and adopts existing sessions once',async()=>{
 const state={tasks:['old-pass','old-fail','active','new-a','new-b'],attempts:[{task:'old-pass',state:'finished'},{task:'old-fail',state:'finished'},{task:'active',state:'running'}]};
 const plan=schedulingPlan(state);assert.deepEqual(plan.pending,['new-a','new-b']);
 let adoptions=0;const generated=[];
 await runPool({pending:plan.pending,initial:[async()=>{adoptions++;}],concurrency:async()=>8,run:async task=>generated.push(task),tick:()=>new Promise(r=>setTimeout(r,5))});
 assert.equal(adoptions,1);assert.deepEqual(generated,['new-a','new-b']);
});

test('elastic pool increases concurrency without restarting in-flight work',async()=>{
 let desired=2,active=0,maximum=0;const started=[],gates=[];
 const worker=async id=>{started.push(id);active++;maximum=Math.max(maximum,active);await new Promise(r=>gates.push(r));active--;};
 const done=runPool({pending:['c','d','e','f','g','h'],initial:[()=>worker('a'),()=>worker('b')],concurrency:async()=>desired,run:worker,tick:()=>new Promise(r=>setTimeout(r,5))});
 await new Promise(r=>setTimeout(r,20));assert.equal(started.length,2);
 desired=8;await new Promise(r=>setTimeout(r,20));assert.equal(started.length,8);assert.equal(maximum,8);
 desired=1;for(const release of gates)release();await done;
 assert.equal(new Set(started).size,8,'each model session starts at most once');
});

test('infrastructure stop drains live sessions without scheduling more model calls',async()=>{
 let stopped=false;const started=[];
 const remaining=await runPool({pending:['a','b','c'],initial:[],concurrency:async()=>1,stop:()=>stopped,run:async id=>{started.push(id);stopped=true;},tick:()=>new Promise(r=>setTimeout(r,5))});
 assert.deepEqual(started,['a']);assert.deepEqual(remaining,['b','c']);
 assert.throws(()=>schedulingPlan({tasks:['x'],attempts:[{task:'x',state:'running'},{task:'x',state:'running'}]}),/Ambiguous/);
});
