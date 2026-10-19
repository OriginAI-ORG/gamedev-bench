import{LEVELS}from './levels.js';export{LEVELS};
export const NOUNS={SWORD:0,SHIELD:1,HEART:2,SKULL:3,FIRE:4,ICE:5};export const PROPERTIES=['YOU','STOP','PUSH','WIN','DEFEAT'];
export class Rewrite{
 constructor(level=1){this.completed=new Set();this.load(level);}
 load(level){this.level=typeof level==='object'?structuredClone(level):structuredClone(LEVELS.find(l=>l.id===Number(level))??LEVELS[0]);this.width=this.level.width??12;this.height=this.level.height??9;this.words=[];for(const[text,x,y,vertical]of this.level.sentences)for(const[token,i]of text.split(' ').map((w,i)=>[w,i]))this.words.push({id:'w'+this.words.length,text:token,x:x+(vertical?0:i),y:y+(vertical?i:0)});for(const[text,x,y]of this.level.words??[])this.words.push({id:'w'+this.words.length,text,x,y});this.objects=this.level.objects.map(([noun,x,y],i)=>({id:'o'+i,noun,x,y}));this.serial=this.objects.length;this.history=[];this.moves=0;this.state='playing';this.message=this.level.hint??'Move word blocks to rewrite the world.';this.parse();this.resolve(false);}
 parse(){
  this.rules=[];this.activeWords=new Set();const at=(x,y)=>this.words.find(w=>w.x===x&&w.y===y);
  for(const w of this.words){
   if(!Object.hasOwn(NOUNS,w.text))continue;
   for(const[dx,dy]of[[1,0],[0,1]]){
    // A conditional noun is part of the longer sentence, not another subject.
    if(at(w.x-dx,w.y-dy)?.text==='ON'&&Object.hasOwn(NOUNS,at(w.x-2*dx,w.y-2*dy)?.text))continue;
    const parts=[w];for(let i=1;i<5;i++)parts.push(at(w.x+dx*i,w.y+dy*i));let rule=null,used=3;
    if(parts[1]?.text==='ON'&&Object.hasOwn(NOUNS,parts[2]?.text)&&parts[3]?.text==='IS'&&PROPERTIES.includes(parts[4]?.text)){rule={subject:w.text,condition:parts[2].text,verb:'IS',target:parts[4].text};used=5;}
    else if(['IS','HAS'].includes(parts[1]?.text)&&(Object.hasOwn(NOUNS,parts[2]?.text)||parts[1].text==='IS'&&PROPERTIES.includes(parts[2]?.text)))rule={subject:w.text,condition:null,verb:parts[1].text,target:parts[2].text};
    if(rule){rule.words=parts.slice(0,used).map(p=>p.id);this.rules.push(rule);for(const p of rule.words)this.activeWords.add(p);}
   }
  }
 }
 matches(rule,o){return rule.subject===o.noun&&(!rule.condition||this.objects.some(other=>other.id!==o.id&&other.noun===rule.condition&&other.x===o.x&&other.y===o.y));}
 properties(o){return new Set(this.rules.filter(r=>r.verb==='IS'&&PROPERTIES.includes(r.target)&&this.matches(r,o)).map(r=>r.target));}
 snapshot(){return structuredClone({objects:this.objects,words:this.words,serial:this.serial,moves:this.moves,state:this.state,message:this.message});}
 undo(){const saved=this.history.pop();if(!saved)return false;Object.assign(this,saved);this.parse();return true;}
 reset(){this.load(this.level);}
 resolve(transform=true){this.parse();if(transform){const before=this.objects.slice(),replaced=[];for(const o of before){const targets=[...new Set(this.rules.filter(r=>r.verb==='IS'&&Object.hasOwn(NOUNS,r.target)&&this.matches(r,o)).map(r=>r.target))];if(!targets.length||targets.includes(o.noun)){replaced.push(o);continue;}for(let i=0;i<targets.length;i++)replaced.push({...o,id:i===0?o.id:'o'+this.serial++,noun:targets[i]});}this.objects=replaced;}
 const properties=new Map(this.objects.map(o=>[o.id,this.properties(o)])),dead=this.objects.filter(o=>properties.get(o.id).has('YOU')&&this.objects.some(d=>d.x===o.x&&d.y===o.y&&properties.get(d.id).has('DEFEAT'))),spawned=[];for(const o of dead){const inherits=[...new Set(this.rules.filter(r=>r.verb==='HAS'&&this.matches(r,o)).map(r=>r.target))];for(const noun of inherits)spawned.push({id:'o'+this.serial++,noun,x:o.x,y:o.y});}const deadIds=new Set(dead.map(o=>o.id));this.objects=this.objects.filter(o=>!deadIds.has(o.id)).concat(spawned);const you=this.objects.filter(o=>this.properties(o).has('YOU'));const victory=you.some(o=>this.objects.some(g=>g.x===o.x&&g.y===o.y&&this.properties(g).has('WIN')));if(victory){this.state='won';this.completed.add(this.level.id);this.message='The words agree. Level complete.';}else if(!you.length){this.state='stranded';this.message='No controlled object remains. Undo or reset to rewrite this outcome.';}else{this.state='playing';if(dead.length)this.message='Defeat changed the world. HAS preserved what remained.';}}
 move(dx,dy){if(this.state!=='playing'||![[1,0],[-1,0],[0,1],[0,-1]].some(d=>d[0]===dx&&d[1]===dy))return false;const saved=this.snapshot(),all=[...this.words,...this.objects],props=new Map(this.objects.map(o=>[o.id,this.properties(o)])),actors=this.objects.filter(o=>props.get(o.id).has('YOU')).sort((a,b)=>(b.x*dx+b.y*dy)-(a.x*dx+a.y*dy)),moved=new Set();const hard=(x,y)=>x<0||x>=this.width||y<0||y>=this.height||this.level.walls.some(w=>w[0]===x&&w[1]===y);let changed=false;
 const plan=(entity,group,visiting)=>{if(moved.has(entity.id)||group.has(entity.id))return true;const x=entity.x+dx,y=entity.y+dy;if(hard(x,y)||visiting.has(entity.id))return false;visiting.add(entity.id);for(const other of all.filter(o=>o.id!==entity.id&&o.x===x&&o.y===y)){if(other.text||props.get(other.id)?.has('PUSH')){if(!plan(other,group,visiting))return false;}else if(props.get(other.id)?.has('STOP'))return false;}visiting.delete(entity.id);group.add(entity.id);return true;};
 for(const actor of actors){if(moved.has(actor.id))continue;const group=new Set();if(!plan(actor,group,new Set()))continue;for(const id of group){const e=all.find(o=>o.id===id);e.x+=dx;e.y+=dy;moved.add(id);}changed=true;}if(!changed)return false;this.history.push(saved);this.moves++;this.message='Words and objects moved.';this.resolve(true);return true;}
}
