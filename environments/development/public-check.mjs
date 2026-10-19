import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {serve} from '../verification/server.mjs';
import {launchBrowser,visibleText} from '../verification/browser.mjs';
import {assertRenderedGame,guardNavigation} from '../verification/visual.mjs';
import {ROOT,json,writeJson} from '../../runner/common.mjs';

// Only public examples from each task prompt. No private verifier imports.
export async function publicCheck(task,game,output,action='test') {
  await fs.mkdir(output,{recursive:true});
  let server,browser,context;
  try {
  server=await serve(game);browser=await launchBrowser();
  context=await browser.newContext({viewport:{width:1100,height:760},serviceWorkers:'block',
    recordVideo:{dir:output,size:{width:1100,height:760}}});
  const page=await context.newPage(),errors=[],checks=[];
  guardNavigation(page);
  page.setDefaultTimeout(3000);
  await context.route('**/*',route=>route.request().url().startsWith(server.url)?route.continue():route.abort());
  await context.routeWebSocket('**/*',socket=>socket.close());
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  let ok=true,message='Public development feedback';
  try {
    await page.goto(server.url,{waitUntil:'load',timeout:8000});
    if(action==='test') {
      const spec=await json(path.join(ROOT,'tasks',task,'task.json'));
      if(spec.public_verifier==='public-check.mjs') {
        const checker=await import(pathToFileURL(path.join(ROOT,'tasks',task,'public-check.mjs')).href);
        if(typeof checker.runPublicCheck!=='function') throw new Error('Task public checker must export runPublicCheck');
        const actions=[];
        await checker.runPublicCheck(page,server.url,event=>actions.push(event));
        checks.push({name:'task-public-example',passed:true});
        await writeJson(path.join(output,'public-actions.json'),actions);
      } else {
      await page.locator('#board').waitFor({state:'visible'});
      if(task==='og-web-9001') {
        await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(220);
        assert.equal(await visibleText(page,'#steps'),'1');
        assert.equal(await visibleText(page,'#status'),'胜利');
        checks.push({name:'public-one-push-win',passed:true});
        await page.screenshot({path:path.join(output,'public-win.png')});
        await page.getByRole('button',{name:'重新开始',exact:true}).click();
        assert.equal(await visibleText(page,'#steps'),'0');
        assert.equal(await visibleText(page,'#status'),'进行中');
      } else if(task==='og-web-9002') {
        await page.locator('[data-index="0"]').click();await page.locator('[data-index="2"]').click();
        assert.equal(await visibleText(page,'#pairs'),'1');
        assert.equal(await visibleText(page,'#attempts'),'1');
        checks.push({name:'public-one-pair',passed:true});
        await page.screenshot({path:path.join(output,'public-match.png')});
        await page.getByRole('button',{name:'重新开始',exact:true}).click();
        assert.equal(await visibleText(page,'#pairs'),'0');
        assert.equal(await visibleText(page,'#attempts'),'0');
      } else throw new Error('Unsupported runtime task');
      checks.push({name:'public-restart',passed:true});
      }
    }
    await assertRenderedGame(page);
    if(errors.length) throw new Error(errors.join('\n'));
  } catch(error) {ok=false;message=String(error.message||error);}
  try {await page.screenshot({path:path.join(output,'screenshot.png'),timeout:5000});}
  catch(error) {ok=false;message+='; screenshot unavailable: '+error.message;}
  const video=page.video();
  await context.close();
  if(video) {
    const original=await video.path();
    await video.saveAs(path.join(output,'public-test.webm'));
    if(path.resolve(original)!==path.join(output,'public-test.webm'))await fs.unlink(original);
  }
  const result={ok,action,message,checks,errors,screenshot:'screenshot.png',video:'public-test.webm',
    scope:'Public example only; independent acceptance occurs after submission.'};
  await writeJson(path.join(output,'result.json'),result);
  return result;
  } finally {
    if(context)await context.close().catch(()=>{});
    if(browser)await browser.close().catch(()=>{});
    if(server)await server.close();
  }
}
