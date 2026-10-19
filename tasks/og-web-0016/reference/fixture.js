import {StatsUI} from './view.js';const $=id=>document.getElementById(id);let ui,stats;
function apply(){ui.updateStats(stats);$('block-input').value=stats.block;$('health-input').value=stats.health;}
function reset(){ui?.dispose();$('ui-layer').replaceChildren();ui=new StatsUI($('ui-layer'));stats={block:4,health:10,maxHealth:10};apply();}
$('apply').onclick=()=>{stats.block=Math.max(0,Number($('block-input').value));stats.health=Math.max(0,Number($('health-input').value));apply();};$('zero-block').onclick=()=>{stats.block=0;apply();};$('zero-health').onclick=()=>{stats.health=0;apply();};$('reset').onclick=reset;reset();
