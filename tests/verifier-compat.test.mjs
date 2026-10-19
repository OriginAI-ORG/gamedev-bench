import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT} from '../runner/common.mjs';
import {serve} from '../environments/verification/server.mjs';
import {launchBrowser} from '../environments/verification/browser.mjs';

// Routed alternatives must actually change a requested file. An obsolete route
// must never make a compatibility test pass without exercising its alternative.
async function probe({task,file,find,replace,scenario,accept=true}){
 const server=await serve(path.join(ROOT,'tasks',task,'reference')),browser=await launchBrowser();
 try{
  const verifier=await import(pathToFileURL(path.join(ROOT,'tasks',task,'verifier/scenarios.mjs')));
  const selected=verifier.scenarios.filter(s=>!scenario||s.id===scenario);assert.ok(selected.length);
  for(const item of selected){
   const context=await browser.newContext({viewport:{width:1100,height:760}}),page=await context.newPage(),errors=[];let applied=0;
   page.setDefaultTimeout(2500);page.on('pageerror',error=>errors.push(error.message));
   await page.route('**/'+file,async route=>{const response=await route.fetch(),before=await response.text();assert.equal(before.split(find).length,2,'alternative must match once');applied++;await route.fulfill({response,body:before.replace(find,replace)});});
   try{if(accept)await verifier.runScenario(page,server.url,item);else await assert.rejects(verifier.runScenario(page,server.url,item));assert.ok(applied>0,'alternative file was loaded');assert.deepEqual(errors,[],'rejection must be behavioral, not a runtime crash');}finally{await context.close();}
  }
 }finally{await browser.close();await server.close();}
}

test('dialog accepts CSS grid centering with the same rendered geometry',()=>probe({task:'og-web-0084',file:'style.css',find:'display:flex;align-items:center;justify-content:center;',replace:'display:grid;place-items:center;'}));
test('audio directory accepts alphabetical order rather than enumeration order',()=>probe({task:'og-web-0039',file:'component.js',find:'for(const name of await listFiles(soundDir))',replace:'for(const name of (await listFiles(soundDir)).sort())',scenario:'directory-binding'}));
test('minimap accepts degree rotation equivalent to its radian transform',()=>probe({task:'og-web-0041',file:'component.js',find:'${this.player.rotation+Math.PI/2}rad',replace:'${this.player.rotation*180/Math.PI+90}deg'}));
test('sprite component rejects the wrong animation duration',()=>probe({task:'og-web-0034',file:'component.js',find:'duration:.6',replace:'duration:1.2',scenario:'configuration',accept:false}));
test('spatial focus rejects a flattened depth coordinate',()=>probe({task:'og-web-0028',file:'component.js',find:'23.0185,2.63927,-86.6948',replace:'23.0185,2.63927,-36.6948',scenario:'projection',accept:false}));
