import {UnitAI} from './unit-ai.js';import {attachAI} from './component.js';
const $=id=>document.getElementById(id);let ai,actor,move=0;
function reset(){$('scene').innerHTML='<div id="actor"><div id="sprite"></div></div>';actor=$('actor');move=0;ai=attachAI(actor,UnitAI);$('status').textContent='IDLE';}
for(const [id,state]of[['patrol','PATROL'],['attack','ATTACK'],['stop','IDLE']])$(id).onclick=()=>{ai.setState(state);$('status').textContent=state;};
$('toggle').onclick=()=>{ai.enabled=!ai.enabled;};$('move').onclick=()=>{move+=30;actor.style.transform=`translate(${move}px,${move/2}px)`;};$('reset').onclick=reset;reset();
