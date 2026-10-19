import {mountHud} from './view.js';
import {config} from './settings.js';
const $=s=>document.querySelector(s);$('#title').textContent=config.title;
let state,minimum,offset=0;
const actions={restart:()=>reset(),menu:()=>{state.phase='menu';update();}};
const ui=mountHud($('#ui-layer'),config,actions);
function update(){ui?.render(state);$('#status').textContent=state.phase;}
function reset(){state={life:config.life,score:0,fuel:100,highScore:100,phase:'playing'};minimum=config.minimum??58;offset=0;$('#world').style.transform='translateX(0px)';ui?.setMinimum(minimum);update();}
$('#hit').onclick=()=>{if(state.phase==='playing'){state.score+=100;state.fuel=Math.max(0,state.fuel-10);update();}};
$('#damage').onclick=()=>{if(state.phase==='playing'){state.life=Math.max(0,state.life-(config.life===100?20:1));if(!state.life)state.phase='gameover';update();}};
$('#pan').onclick=()=>{if(state.phase==='playing'){$('#world').style.transform=`translateX(${offset-=40}px)`;}};
$('#grow').onclick=()=>ui?.setMinimum(minimum+=30);
$('#reset').onclick=reset;reset();
