import {State,FiniteStateMachine} from './machine.js';const $=id=>document.getElementById(id);let machine,states,log=[];
const append=line=>{log.push(line);$('log').textContent=log.join('\n');};
class PoseState extends State{constructor(actor,name){super(actor);this.name=name;}enter(){this.actor.dataset.pose=this.name;append('enter:'+this.name);}exit(){append('exit:'+this.name);}}
function reset(){log=[];$('log').textContent='';$('actor').dataset.pose='IDLE';$('status').textContent='IDLE';states=Object.fromEntries(['IDLE','RUN','ATTACK'].map(name=>[name,new PoseState($('actor'),name)]));machine=new FiniteStateMachine();machine.addEventListener('state-changed',e=>{$('status').textContent=e.detail.name;append('changed:'+e.detail.name);});machine.changeState(states.IDLE);log=[];$('log').textContent='';}
for(const name of ['IDLE','RUN','ATTACK'])$('state-'+name).onclick=()=>machine.changeState(states[name]);$('reset').onclick=reset;reset();
