import * as component from './projectile.js';
import {settings} from './settings.js';
import {QuestService} from './quests.js';

const $=s=>document.querySelector(s),stage=$('#world'),quests=new QuestService();
const directions={right:{x:10,y:0},diagonal:{x:10,y:10},left:{x:-10,y:0},up:{x:0,y:-10},down:{x:0,y:10},zero:{x:0,y:0}};
const targets=settings.mode==='missile'?[
  ['enemy',2,'sensor'],['bridge',8,'body'],['power',16,'body'],['friendly',1,'sensor'],['projectile',4,'sensor']
]:[['enemy',4,'sensor'],['crate',8,'body'],['wall',32,'body'],['friendly',1,'sensor']];
for(const [name]of targets){const option=document.createElement('option');option.value=name;option.textContent=name;$('#target-kind').append(option);}
$('#title').textContent=settings.title;$('#quest-panel').hidden=settings.mode!=='quest';
const definition=component.definition??{size:[3,3],layer:16,mask:44,texture:{src:'atlas.svg',region:[12,8,3,3]},visibility:[3,3]};
const texture=new Image();texture.src=definition.texture?.src??'atlas.svg';await texture.decode();
let bullets=[],body,paused=false,nextId=1,lastTime=null;
const log=message=>{const li=document.createElement('li');li.textContent=message;$('#event-log').prepend(li);if($('#event-log').children.length>30)$('#event-log').lastChild.remove();};
const world={width:800,height:420,
  removeProjectile(p){if(!p.active)return;p.active=false;p.element?.remove();p.detach?.();log('dispose:'+p.id);},
  destroyBody(b){if(!b.active)return;b.active=false;b.element?.remove();log('destroy:'+b.kind);}
};
function updateLabels(){
  $('#shots').textContent=bullets.filter(b=>b.active).length;
  $('#quest-progress').textContent=quests.value('Shoot Em Up','kill_step');
  $('#supply-progress').textContent=quests.value('Supply Run','collect_step');
}
quests.addEventListener('progress',updateLabels);
function setTarget(){
  body?.element.remove();const [kind,layer,contact]=targets.find(t=>t[0]===$('#target-kind').value);
  const element=document.createElement('div');element.className='target';element.id='target';element.textContent=kind;stage.append(element);
  body={kind,group:kind==='enemy'?'enemy':'neutral',layer,contact,x:370,y:210,width:40,height:40,active:true,element};
}
function defaultProjectile(input){
  const p=Object.assign(new EventTarget(),{...input.position,id:input.id,direction:{...input.direction},tank:input.tank,active:true});
  p.tick=dt=>{if(!p.active)return;const len=Math.hypot(p.direction.x,p.direction.y);if(len){p.x+=p.direction.x/len*500*dt;p.y+=p.direction.y/len*500*dt;}};
  if(settings.mode==='wiring')p.detach=component.wireContacts?.(p,world);
  else {p.addEventListener('sensorcontact',()=>world.removeProjectile(p));p.addEventListener('bodycontact',()=>world.removeProjectile(p));}
  return p;
}
function fire(){
  const input={id:'shot-'+nextId++,position:{x:80,y:210},direction:{...directions[$('#aim').value]},tank:$('#tank').value,world,quests:settings.mode==='quest'?quests:null};
  const p=['missile','wiring'].includes(settings.mode)?defaultProjectile(input):component.createProjectile?.(input);
  if(!p){$('#notice').textContent='Complete projectile.js to activate the projectile.';return;}
  const [w,h]=definition.size??[3,3],canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.className='shot';canvas.dataset.owner=p.tank;
  const [sx,sy,sw,sh]=definition.texture?.region??[12,8,3,3];canvas.getContext('2d').drawImage(texture,sx,sy,sw,sh,0,0,w,h);
  p.element=canvas;p.width=w;p.height=h;stage.append(canvas);bullets.push(p);render(p);$('#owner').textContent=p.tank;updateLabels();
}
function render(p){p.element.style.left=p.x-p.width/2+'px';p.element.style.top=p.y-p.height/2+'px';}
function tick(dt){
  for(const p of bullets){
    if(!p.active)continue;p.tick(dt);
    if(!p.active)continue;
    if(body?.active&&((definition.mask??44)&body.layer)&&Math.abs(p.x-body.x)*2<=p.width+body.width&&Math.abs(p.y-body.y)*2<=p.height+body.height){
      if(typeof p.dispatchEvent==='function')p.dispatchEvent(new CustomEvent(body.contact==='sensor'?'sensorcontact':'bodycontact',{detail:body}));
      else if(body.contact==='sensor')p.onSensor(body);else p.onBody(body);
    }
    if(['missile','wiring'].includes(settings.mode)){
      const [w,h]=definition.visibility??definition.size??[3,3];
      if(p.x+w/2<0||p.x-w/2>world.width||p.y+h/2<0||p.y-h/2>world.height)world.removeProjectile(p);
    }
    if(p.active)render(p);
  }
  bullets=bullets.filter(p=>p.active);updateLabels();
}
function reset(){for(const p of bullets)world.removeProjectile(p);bullets=[];quests.reset();$('#event-log').replaceChildren();$('#aim').value='right';$('#tank').value='alpha';$('#owner').textContent='—';$('#notice').textContent='';setTarget();updateLabels();}
$('#fire').onclick=fire;$('#target-kind').onchange=setTarget;$('#reset').onclick=reset;
$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'Resume':'Pause';};
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target.tagName!=='SELECT'){e.preventDefault();fire();}});
new ResizeObserver(()=>{stage.style.transform=`scale(${$('#scene').clientWidth/800})`;}).observe($('#scene'));
function frame(now){if(lastTime!==null&&!paused){const elapsed=Math.min((now-lastTime)/1000,.25);let remaining=elapsed;while(remaining>0){const dt=Math.min(remaining,.005);tick(dt);remaining-=dt;}}lastTime=now;requestAnimationFrame(frame);}
reset();requestAnimationFrame(frame);
