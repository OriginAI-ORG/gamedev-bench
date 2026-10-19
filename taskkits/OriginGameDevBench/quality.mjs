import assert from 'node:assert/strict';
import {screenshotPixels} from '../../environments/verification/visual.mjs';

// Independent mathematical oracle checked against browser-produced screenshot
// pixels. Palette is unrestricted; interior and escape regions must differ.
export async function assertFractal(page,kind){
  const image=screenshotPixels(await page.locator('#fractal').screenshot());
  const inside=[],outside=[];
  const color=(x,y)=>{
    const xx=Math.min(image.width-1,Math.floor((x+.5)*image.width/320)),yy=Math.min(image.height-1,Math.floor((y+.5)*image.height/220));
    const at=(yy*image.width+xx)*image.channels;
    return [...image.pixels.subarray(at,at+3)];
  };
  for(let y=8;y<212;y+=7)for(let x=8;x<312;x+=7){
    const cx=(x-160)/85,cy=(y-110)/85;
    let zr=kind==='Julia'?cx:0,zi=kind==='Julia'?cy:0,n=0;
    const cr=kind==='Julia'?.4:cx,ci=kind==='Julia'?-.2:cy;
    while(zr*zr+zi*zi<4&&n<40){[zr,zi]=[zr*zr-zi*zi+cr,2*zr*zi+ci];n++;}
    if(n===40)inside.push(color(x,y));else if(n<10)outside.push(color(x,y));
  }
  assert.ok(inside.length>10&&outside.length>10,'oracle samples');
  const distance=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
  const center=inside[Math.floor(inside.length/2)];
  assert.ok(inside.filter(c=>distance(c,center)<20).length/inside.length>.90,kind+': coherent interior set');
  assert.ok(outside.filter(c=>distance(c,center)>30).length/outside.length>.90,kind+': escape region differs from interior');
}
