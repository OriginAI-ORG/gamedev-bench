import test from 'node:test';
import assert from 'node:assert/strict';
import {launchBrowser} from '../environments/verification/browser.mjs';
import {assertRenderedGame,assertVisibleElement,guardNavigation,VISUAL_MUTATIONS} from '../environments/verification/visual.mjs';

test('rendered game rejects transparency, clipping and opaque occlusion while accepting visible UI',async()=>{
  const browser=await launchBrowser();
  try{
    const page=await browser.newPage({viewport:{width:800,height:600}});
    const html='<style>body{margin:0}#scene{margin:30px;width:600px;height:400px;background:#234;color:white}button{margin:50px;padding:20px}</style><main><div id="scene"><button>Move player</button></div></main>';
    await page.setContent(html);await assertRenderedGame(page);
    for(const css of [...Object.values(VISUAL_MUTATIONS),'body{filter:opacity(0)}','#scene{transform:translateX(-2000px)}']){
      await page.setContent(html+'<style>'+css+'</style>');
      await assert.rejects(assertRenderedGame(page),/Rendered game:/);
    }
    await page.setContent(html+'<div style="display:none">intentional hidden modal</div>');
    await assertRenderedGame(page);
    await page.setContent(html.replace('<button>','<p>Visible scene label</p><button>')+'<style>button{opacity:0}</style>');
    await assertRenderedGame(page);
    await assert.rejects(assertVisibleElement(page.locator('button')),/Rendered element: transparent/);
    await page.setContent(html.replace('<button>','<div style="filter:opacity(0)"><button>').replace('</button>','</button></div>'));
    await assert.rejects(assertVisibleElement(page.locator('button')),/Rendered element: transparent/);
    await page.setContent(html.replace('<main>','<main><b id="stage">1</b>'));
    await assertRenderedGame(page);
    await page.setContent('<svg width="200" height="100"><line id="target-line" x1="10" y1="50" x2="180" y2="50" stroke="gold" stroke-width="3"/></svg>');
    await assertVisibleElement(page.locator('line'));
    await page.addStyleTag({content:'svg{opacity:0}'});
    await assert.rejects(assertVisibleElement(page.locator('line')),/Rendered element: transparent/);
  }finally{await browser.close();}
});

test('navigation guard waits for asynchronous drawing but still rejects a permanently blank scene',async()=>{
  const browser=await launchBrowser();
  try{
    const page=await browser.newPage({viewport:{width:800,height:600}});
    await page.route('http://127.0.0.1/fixture/**',route=>route.fulfill({contentType:'text/html',body:'<style>body{margin:0}#scene{width:600px;height:400px;background:#234;color:white}</style><div id="scene"></div>'+(route.request().url().endsWith('/delayed')?'<script>setTimeout(()=>{const b=document.createElement("button");b.textContent="Ready";b.style.cssText="margin:50px;padding:30px";document.getElementById("scene").append(b)},250)</script>':'')}));
    guardNavigation(page);
    await page.goto('http://127.0.0.1/fixture/delayed');
    assert.equal(await page.locator('button').innerText(),'Ready');
    await assert.rejects(page.goto('http://127.0.0.1/fixture/blank'),/Rendered game: blank or covered pixels/);
  }finally{await browser.close();}
});
