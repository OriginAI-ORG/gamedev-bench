import assert from 'node:assert/strict';
import {inflateSync} from 'node:zlib';

// Inspect browser-produced PNG pixels in the trusted verifier process.
export function screenshotPixels(png) {
  let offset=8,width=0,height=0,channels=0;
  const chunks=[];
  while(offset<png.length){
    const size=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8),data=png.subarray(offset+8,offset+8+size);
    if(type==='IHDR'){
      width=data.readUInt32BE(0);height=data.readUInt32BE(4);
      assert.equal(data[8],8,'8-bit screenshot required');
      channels=data[9]===2?3:data[9]===6?4:0;
      assert.ok(channels,'RGB/RGBA screenshot required');
    }
    if(type==='IDAT')chunks.push(data);
    offset+=size+12;
  }
  const raw=inflateSync(Buffer.concat(chunks)),stride=width*channels,out=Buffer.alloc(stride*height),histogram=new Map();
  const paeth=(a,b,c)=>{const p=a+b-c,aa=Math.abs(p-a),bb=Math.abs(p-b),cc=Math.abs(p-c);return aa<=bb&&aa<=cc?a:bb<=cc?b:c;};
  let at=0,total=0;
  for(let y=0;y<height;y++){
    const filter=raw[at++];
    for(let x=0;x<stride;x++){
      const i=y*stride+x,a=x>=channels?out[i-channels]:0,b=y?out[i-stride]:0,c=y&&x>=channels?out[i-stride-channels]:0;
      out[i]=(raw[at++]+(filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):0))&255;
    }
    if(y%3===0)for(let x=0;x<width;x+=3){
      const i=y*stride+x*channels,key=(out[i]>>4)*256+(out[i+1]>>4)*16+(out[i+2]>>4);
      histogram.set(key,(histogram.get(key)??0)+1);total++;
    }
  }
  return {width,height,channels,pixels:out,colors:histogram.size,nonDominant:1-Math.max(...histogram.values())/total};
}

export async function assertRenderedGame(page) {
  const state=await page.evaluate(()=>{
    const stage=document.querySelector('#stage');
    const root=(stage&&['SECTION','DIV','SVG','CANVAS'].includes(stage.tagName.toUpperCase())?stage:null)||document.querySelector('#scene')||document.querySelector('#board')||document.querySelector('main')||document.body;
    if(!root)return {error:'missing game surface'};
    let opacity=1;
    for(let e=root;e;e=e.parentElement){
      const css=getComputedStyle(e);opacity*=Number(css.opacity);
      if(css.display==='none'||css.visibility!=='visible'||css.contentVisibility==='hidden')return {error:'hidden game surface'};
      if(css.clipPath!=='none'||(css.clip&&css.clip!=='auto'))return {error:'game surface is clipped'};
      const filter=css.filter.match(/opacity\(([^)]+)\)/);
      if(filter)opacity*=filter[1].includes('%')?parseFloat(filter[1])/100:parseFloat(filter[1]);
    }
    if(opacity<.05)return {error:'transparent game surface'};
    const b=root.getBoundingClientRect(),x=Math.max(0,b.left),y=Math.max(0,b.top),width=Math.min(innerWidth,b.right)-x,height=Math.min(innerHeight,b.bottom)-y;
    if(width<16||height<16)return {error:'game surface outside viewport or too small'};
    let exposed=0;
    for(const fx of [.15,.5,.85])for(const fy of [.15,.5,.85]){
      const top=document.elementFromPoint(x+width*fx,y+height*fy);
      if(top&&(root===top||root.contains(top)))exposed++;
    }
    if(exposed<3)return {error:'game surface is occluded'};
    return {clip:{x,y,width,height},selector:root.id||root.tagName.toLowerCase(),opacity,exposed};
  });
  assert.ok(!state.error,'Rendered game: '+state.error);
  const {colors,nonDominant}=screenshotPixels(await page.screenshot({clip:state.clip,timeout:5000}));
  const spread={colors,nonDominant};
  assert.ok(spread.colors>=2&&spread.nonDominant>.0005,'Rendered game: blank or covered pixels');
  return {...state,...spread};
}

// Playwright isVisible() alone accepts opacity:0. Use this for required outputs
// and actors; intentional hidden elements should be checked by the task itself.
export async function assertVisibleElement(locator) {
  if(await locator.isVisible())await locator.scrollIntoViewIfNeeded();
  else{
    // A horizontal/vertical SVG line has a zero-size geometric axis but its
    // stroke still paints pixels; Playwright's box-only visibility misses it.
    const stroked=await locator.evaluate(e=>{
      const b=e.getBoundingClientRect(),css=getComputedStyle(e);
      return e instanceof SVGGeometryElement&&(b.width>0||b.height>0)&&css.stroke!=='none'&&parseFloat(css.strokeWidth)>0&&Number(css.strokeOpacity)>0;
    }).catch(()=>false);
    assert.ok(stroked,'Rendered element: missing or hidden');
  }
  const error=await locator.evaluate(element=>{
    let opacity=1;
    for(let e=element;e;e=e.parentElement){
      const css=getComputedStyle(e);opacity*=Number(css.opacity);
      if(css.display==='none'||css.visibility!=='visible'||css.contentVisibility==='hidden')return 'hidden ancestor';
      if(/inset\(100%/.test(css.clipPath))return 'clipped';
      for(const filter of css.filter.matchAll(/opacity\(([^)]+)\)/g))opacity*=filter[1].includes('%')?parseFloat(filter[1])/100:parseFloat(filter[1]);
    }
    if(opacity<.05)return 'transparent';
    const b=element.getBoundingClientRect();
    if(b.right<=0||b.bottom<=0||b.left>=innerWidth||b.top>=innerHeight)return 'outside viewport';
    return null;
  });
  assert.ok(!error,'Rendered element: '+error);
}

export function guardNavigation(page) {
  const goto=page.goto.bind(page);
  page.goto=async(...args)=>{
    const response=await goto(...args),deadline=Date.now()+1200;
    // Async modules may finish fetching their scene/image just after load.
    // Retry only blank pixels; hidden, clipped and occluded surfaces still fail.
    for(;;){try{await assertRenderedGame(page);break;}catch(error){
      if(!String(error.message).includes('Rendered game: blank or covered pixels')||Date.now()>=deadline)throw error;
      await page.waitForTimeout(50);
    }}
    return response;
  };
}

export const VISUAL_MUTATIONS={
  'transparent-body':'body{opacity:0!important}',
  'transparent-surface':'#stage,#scene,#board,main{opacity:0!important}',
  'clipped-surface':'#stage,#scene,#board,main{clip-path:inset(100%)!important}',
  'covered-surface':'body::after{content:"";position:fixed;inset:0;background:#111;z-index:2147483647;pointer-events:auto}'
};
