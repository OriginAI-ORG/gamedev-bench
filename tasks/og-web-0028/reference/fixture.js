import {SpatialNode,project} from './spatial.js';import {setup} from './setup.js';import {config} from './settings.js';
const $=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg';let root,registry,context,camera;
function shape(tag,attrs,text){const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;$('scene').append(e);return e;}
function render(){
 $('scene').replaceChildren();shape('path',{d:'M0 330H800 M0 370H800 M100 400L300 260 M700 400L500 260',stroke:'#45647c',fill:'none'});
 if(context.chest){const b=project(context.chest.worldPosition(),camera),t=project(context.target.worldPosition(),camera);shape('path',{id:'cultist-body',d:`M${b.x-20} ${b.y+80} L${b.x} ${b.y-12} L${b.x+20} ${b.y+80}Z`,fill:'#9360b5'});shape('circle',{id:'chest-target',cx:t.x,cy:t.y,r:4,fill:'#8bc1ff'});}
 $('list').replaceChildren();
 for(const point of registry){const p=project(point.worldPosition(),camera);if(p.visible){if(point.hasBeenTargeted)shape('path',{d:`M400 390L${p.x} ${p.y}`,stroke:'#70f5c4','stroke-width':2});shape('circle',{id:'marker-'+point.name,class:'point'+(point.hasBeenTargeted?' targeted':''),cx:p.x,cy:p.y,r:7});shape('text',{x:p.x+12,y:p.y-12},point.name);}
 const row=document.createElement('div');row.className='entry';row.id='entry-'+point.name;row.textContent=point.name+' · '+point.priority+' · '+(point.hasBeenTargeted?'targeted':'ready');$('list').append(row);}
}
function reset(){root=new SpatialNode('world');registry=new Set();context={};camera=[...config.camera];if(config.mode==='chest'){const actor=root.add(new SpatialNode('Cultist'));context.chest=actor.add(new SpatialNode('ChestMarkerContainer',{position:[0,1.45,0],rotationY:Math.PI}));context.target=context.chest.add(new SpatialNode('ChestTarget',{position:[0,.25,0]}));}setup(root,registry,context);$('status').textContent='No target';render();}
$('title').textContent=config.title;$('target').onclick=()=>{const next=[...registry].filter(p=>!p.hasBeenTargeted).sort((a,b)=>b.priority-a.priority)[0];if(next){next.hasBeenTargeted=true;$('status').textContent=next.name;}else $('status').textContent='All targeted';render();};
$('move').onclick=()=>{root.position[0]+=1;root.position[1]+=.2;render();};$('camera').onclick=()=>{camera[0]+=2;render();};$('reset-targets').onclick=()=>{for(const p of registry)p.resetTargetState();$('status').textContent='No target';render();};$('reset').onclick=reset;reset();
