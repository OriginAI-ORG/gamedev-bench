import {buildUI}from './render.js';import{Minimap}from './component.js';import{configureWorld}from './world.js';
const settings=await(await fetch('settings.json')).json(),config=await(await fetch('ui.json')).json(),resources=await(await fetch('resources.json')).json();
const root=document.getElementById('minimap');await buildUI(root,config,resources);
const player={position:[500,400],rotation:0},make=(name,kind,position)=>Object.assign(new EventTarget(),{name,kind,position,groups:new Set(),active:true}),objects=[make('Mob A','mob',[600,430]),make('Mob B','mob',[2500,-1800]),make('Crate','alert',[470,480])];
let minimap=null;
if(settings.live&&root.querySelector('#Grid')){minimap=new Minimap({root});configureWorld({player,objects,minimap});await minimap.ready(objects);document.getElementById('help').textContent='W/S move, A/D turn. Scroll over the minimap to zoom.';}
if(!settings.live){document.getElementById('stage').classList.add('ui-only');document.getElementById('remove').hidden=true;}
export const state={root,player,objects,minimap,config};
const canvas=document.getElementById('world'),ctx=canvas.getContext('2d'),keys=new Set();addEventListener('keydown',e=>{if(['w','s','a','d'].includes(e.key.toLowerCase())){e.preventDefault();keys.add(e.key.toLowerCase());}});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
let last=performance.now();function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(settings.live){player.rotation+=((keys.has('d')?1:0)-(keys.has('a')?1:0))*2*dt;const move=((keys.has('w')?1:0)-(keys.has('s')?1:0))*250*dt;player.position[0]+=Math.cos(player.rotation)*move;player.position[1]+=Math.sin(player.rotation)*move;minimap?.update();}
 ctx.fillStyle='#304b59';ctx.fillRect(0,0,600,360);ctx.strokeStyle='#496675';for(let x=0;x<600;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,360);ctx.stroke();}for(let y=0;y<360;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(600,y);ctx.stroke();}
 for(const o of objects)if(o.active){ctx.fillStyle=o.kind==='mob'?'#e86a59':'#f2d472';ctx.fillRect(300+(o.position[0]-player.position[0])*.3-7,180+(o.position[1]-player.position[1])*.3-7,14,14);}
 ctx.save();ctx.translate(300,180);ctx.rotate(player.rotation);ctx.fillStyle='#f2f6f0';ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-10,-9);ctx.lineTo(-10,9);ctx.fill();ctx.restore();requestAnimationFrame(tick);
}requestAnimationFrame(tick);
document.getElementById('remove').onclick=()=>objects[2].remove?.();document.getElementById('reset').onclick=()=>location.reload();document.getElementById('status').textContent='Ready';
