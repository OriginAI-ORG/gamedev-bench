import{createScene,SmokeSystem}from './services.js';import{Renderer}from './renderer.js';import{configure}from './configure.js';
export const target=await(await fetch('requirements.json')).json();const images={};await Promise.all(['campfire_base.png','flamelet.png','smokelet.png'].map(async name=>{const img=new Image();img.src='assets/'+name;await img.decode();images['assets/'+name]=img;}));
export const renderer=new Renderer(document.getElementById('scene'),images);export let scene,system,running=false;
export function render(){renderer.draw(scene,system);document.getElementById('status').textContent=`Smoke: ${system.particles.length} | Time: ${system.time.toFixed(2)} s`;}
export function reset(){scene=createScene();configure(scene,target);system=new SmokeSystem(scene.smoke);system.warm();render();}reset();
document.getElementById('step').onclick=()=>{system.advance(.1);render();};
document.getElementById('run').onclick=()=>{running=!running;document.getElementById('run').textContent=running?'Pause':'Run';};
document.getElementById('reset').onclick=()=>{running=false;document.getElementById('run').textContent='Run';reset();};
let previous,lastPaint=0;
function frame(t){if(running&&previous!==undefined)system.advance(Math.min(.05,(t-previous)/1000));if(running&&t-lastPaint>=100){render();lastPaint=performance.now();}previous=t;requestAnimationFrame(frame);}requestAnimationFrame(frame);
