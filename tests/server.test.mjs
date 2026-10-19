import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from '../runner/common.mjs';
import { serve } from '../environments/verification/server.mjs';

test('static verifier server exposes only submission files and blocks active outbound connections',async()=>{
  const server=await serve(path.join(ROOT,'tasks','og-web-9001','reference'));
  try {
    const response=await fetch(server.url);
    assert.equal(response.status,200);
    assert.match(response.headers.get('content-security-policy'),/connect-src 'self';/);
    assert.match(await response.text(),/仓库小队/);
    assert.equal((await fetch(server.url+'.git/config')).status,403);
    assert.equal((await fetch(server.url+'%2e%2e%2f%2e%2e%2fconfigs/pilot.json')).status,403);
    assert.equal((await fetch(server.url+'index.html',{method:'POST',body:'x'})).status,405);
    assert.equal((await fetch(server.url+'missing.js')).status,404);
  } finally { await server.close(); }
});

test('downloaded or exported code is not required by public task prompts',async()=>{
  for(const task of ['og-web-9001','og-web-9002']) {
    const prompt=await fs.readFile(path.join(ROOT,'tasks',task,'prompt.md'),'utf8');
    assert.doesNotMatch(prompt,/upstream\/|vendor\/|verifier\/scenarios/);
  }
});
