import test from 'node:test';
import assert from 'node:assert/strict';
import {launchBrowser} from '../environments/verification/browser.mjs';
import {assertFractal} from '../taskkits/OriginGameDevBench/quality.mjs';
import {isTransportRetry,completedGeneration} from '../agents/events.mjs';

test('recovered transport errors require an actual completed turn',()=>{
  const stream=[{type:'error',message:'Reconnecting... 2/5 (tls handshake eof)'},{type:'turn.completed'}];
  const errors=stream.filter(e=>e.type==='error'&&!isTransportRetry(e.message));
  assert.equal(completedGeneration(0,stream.some(e=>e.type==='turn.completed'),errors),true);
  assert.equal(completedGeneration(0,false,errors),false);
  assert.equal(completedGeneration(1,true,errors),false);
  assert.equal(completedGeneration(0,true,['unauthorized']),false);
});

test('fractal verifier rejects decorative multicolor patterns with no fractal geometry',async()=>{
  const browser=await launchBrowser();
  try{
    const page=await browser.newPage();
    await page.setContent('<canvas id="fractal" width="320" height="220"></canvas>');
    await page.evaluate(()=>{const ctx=document.querySelector('canvas').getContext('2d');ctx.fillStyle='#123';ctx.fillRect(0,0,320,220);ctx.fillStyle='#eeb';for(let y=0;y<220;y+=10)ctx.fillRect(0,y,320,5);});
    for(const kind of ['Mandelbrot','Julia'])await assert.rejects(assertFractal(page,kind),/interior|escape/);
  }finally{await browser.close();}
});
