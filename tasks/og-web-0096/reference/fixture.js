import {BattleOverPanel,Type} from './panel.js';
import {config} from './settings.js';
const $=id=>document.getElementById(id),events=new EventTarget();
let elapsed=0,phase='running',restarts=0,finishes=0,panel;
function render(){ $('status').textContent=phase;$('elapsed').textContent=elapsed.toFixed(3);$('actor').style.left=(24+elapsed*50%Math.max(1,$('scene').clientWidth-80))+'px';$('restarts').textContent=restarts;$('finishes').textContent=finishes; }
const game={pause(){phase='paused';render();},finish(){finishes++;phase='complete';render();},restart(){restarts++;elapsed=0;phase='running';render();}};
function request(text,type){events.dispatchEvent(new CustomEvent('battle-over',{detail:{text,type}}));$('events').textContent='Result requested: '+text;}
function reset(){panel?.dispose();$('ui-layer').replaceChildren();elapsed=0;phase='running';restarts=0;finishes=0;$('events').textContent='';panel=new BattleOverPanel($('ui-layer'),events,game,config);render();}
$('title').textContent=config.title;
$('win').onclick=()=>request(config.text,Type.WIN);$('lose').onclick=()=>request('Defeat',Type.LOSE);
$('request').onclick=()=>request($('message').value,Number($('outcome').value));$('reset').onclick=reset;
let previous;function frame(now){if(previous!==undefined&&phase==='running')elapsed+=Math.min(.25,(now-previous)/1000);previous=now;render();requestAnimationFrame(frame);}reset();requestAnimationFrame(frame);
