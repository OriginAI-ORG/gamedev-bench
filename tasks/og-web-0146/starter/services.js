import{isFreeCell,clearCircle,layers,wall}from './map.js';
export class SceneNode extends EventTarget{
 constructor(name,position=[0,0]){super();this.name=name;this.position=position.slice();this.parent=null;this.children=[];}
 add(child){child.parent=this;this.children.push(child);return child;}
 get globalPosition(){const p=this.parent?.globalPosition??[0,0];return this.position.map((v,i)=>v+p[i]);}
}
export class Body extends SceneNode{
 constructor(name){super(name,[317,246]);this.velocity=[0,0];this.radius=12;this.collisionLayer=2;this.collisionMask=1;this.motionMode='floating';this.wallMinSlideAngle=0;this.history=[];}
 moveAndSlide(dt){const steps=Math.max(1,Math.ceil(Math.hypot(...this.velocity)*dt/3));for(let n=0;n<steps;n++){for(let axis=0;axis<2;axis++){const p=this.globalPosition;p[axis]+=this.velocity[axis]*dt/steps;const collides=(this.collisionMask&wall.collisionLayer)&&(this.collisionLayer&wall.collisionMask)&&!clearCircle(p,this.radius);if(!collides)this.position[axis]+=this.velocity[axis]*dt/steps;else this.velocity[axis]=0;}}this.history.push(this.globalPosition);}
}
export class NavigationAgent extends SceneNode{
 constructor(body){super('Agent');this.body=body;this._targetPosition=null;this.path=[];this.queries=0;this.updates=0;}
 get targetPosition(){return this._targetPosition;}
 set targetPosition(value){this._targetPosition=value.slice();this.updates++;this.replan();}
 replan(){const start=this.body.globalPosition.map(v=>Math.floor(v/32)),end=this._targetPosition.map(v=>Math.floor(v/32)),key=p=>p.join(','),queue=[start],previous=new Map([[key(start),null]]);this.path=[];if(!isFreeCell(...end))return;
  for(let head=0;head<queue.length;head++){const p=queue[head];if(key(p)===key(end))break;for(const[dX,dY]of[[1,0],[0,1],[-1,0],[0,-1]]){const next=[p[0]+dX,p[1]+dY];if(isFreeCell(...next)&&!previous.has(key(next))){previous.set(key(next),p);queue.push(next);}}}
  if(!previous.has(key(end)))return;let at=end;while(previous.get(key(at))!==null){this.path.unshift(at.map(v=>v*32+16));at=previous.get(key(at));}this.path.push(this._targetPosition.slice());
 }
 nextPathPosition(){this.queries++;const p=this.body.globalPosition;while(this.path.length&&Math.hypot(...this.path[0].map((v,i)=>v-p[i]))<4)this.path.shift();return this.path[0]?.slice()??p;}
}
export class Timer extends SceneNode{
 constructor(waitTime=.1){super('Timer');this.waitTime=waitTime;this.autostart=true;this.elapsed=0;this.enabled=true;}
 tick(dt){if(!this.enabled||!this.autostart)return;this.elapsed+=dt;while(this.elapsed+1e-9>=this.waitTime){this.elapsed-=this.waitTime;this.dispatchEvent(new Event('timeout'));}}
}
export function createWorld(config){const world=new SceneNode('World'),region=world.add(new SceneNode('NavigationRegion')),map=region.add(new SceneNode('TileMap'));map.layers=layers;const actor=world.add(new Body(config.actor)),target=world.add(new SceneNode(config.target,[610,250]));return{world,region,map,actor,target,objects:new Map([[config.actor,actor],[config.target,target]])};}
