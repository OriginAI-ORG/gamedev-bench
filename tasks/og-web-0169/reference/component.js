import{SceneNode,BattleUnit,UnitStats}from './services.js';import{bind,applyStats}from './bindings.js';import{connectForwarding}from './forwarding.js';
export class DetectRange extends SceneNode{
 constructor(baseRangeSize,mode='standard'){super('DetectRange');this.baseRangeSize=baseRangeSize;this.mode=mode;this.colShape=this.add(new SceneNode('Collider'));this.colShape.shape=null;this.collisionLayer=0;this.collisionMask=0;this._stats=null;this._actor=null;this.disconnectForwarding=()=>{};}
 set stats(value){this._stats=value;this.configure(value);}get stats(){return this._stats;}
 set actor(value){this._actor=value;if(value)this.configure(value.stats);}get actor(){return this._actor;}
 configure(stats){if(!stats)return;this.collisionLayer=4*(stats.team+1);this.collisionMask=2-stats.team;this.colShape.shape={type:'circle',radius:this.baseRangeSize*stats.attackRange};}
 ready(){if(this.mode==='forward')this.disconnectForwarding=connectForwarding(this);}
 onAreaEntered(area){if(area instanceof BattleUnit)this.dispatchEvent(new CustomEvent('unit-entered-range',{detail:area}));}
 onAreaExited(area){if(area instanceof BattleUnit)this.dispatchEvent(new CustomEvent('unit-exited-range',{detail:area}));}
 dispose(){this.disconnectForwarding();}
}
export class TargetFinder extends SceneNode{
 constructor(scene,mode='standard'){super('TargetFinder');this.scene=scene;this.mode=mode;this._actor=null;this.detector=null;this.target=null;this.targetsInRange=[];this.listening=false;this.disconnect=()=>{};}
 set actor(value){this._actor=value;if(this.listening&&this.mode==='setter')this.connect();}get actor(){return this._actor;}
 ready(){this.listening=true;this.connect();}
 connect(){this.disconnect();const detector=this.mode==='explicit'?this.detector:this.mode==='nested'?this.parent:this.actor?.detectRange;if(!this.actor||!detector)return;const entered=event=>this.onEntered(event.detail),exited=event=>this.onExited(event.detail),names=this.mode==='forward'?['unit-entered-range','unit-exited-range']:['area-entered','area-exited'];detector.addEventListener(names[0],entered);detector.addEventListener(names[1],exited);this.disconnect=()=>{detector.removeEventListener(names[0],entered);detector.removeEventListener(names[1],exited);};}
 onEntered(unit){if(!(unit instanceof BattleUnit)||this.targetsInRange.includes(unit))return;this.targetsInRange.push(unit);this.dispatchEvent(new Event('targets-in-range-changed'));}
 onExited(unit){if(!(unit instanceof BattleUnit))return;const index=this.targetsInRange.indexOf(unit);if(index<0)return;this.targetsInRange.splice(index,1);this.dispatchEvent(new Event('targets-in-range-changed'));}
 findTarget(){this.target=null;if(!this.actor)return null;let best=Infinity;for(const candidate of this.scene.getNodesInGroup(UnitStats.TARGET[this.actor.stats.team])){if(!(candidate instanceof BattleUnit)||candidate===this.actor)continue;const d=candidate.globalPosition.reduce((sum,v,i)=>sum+(v-this.actor.globalPosition[i])**2,0);if(d<best){best=d;this.target=candidate;}}return this.target;}
 hasTargetInRange(){return this.targetsInRange.length>0;}
 dispose(){this.listening=false;this.disconnect();this.targetsInRange.length=0;this.target=null;}
}
export function assemble(unit,scene,config){unit.detectRange=unit.add(new DetectRange(config.baseRange,config.mode));unit.targetFinder=(config.mode==='nested'?unit.detectRange:unit).add(new TargetFinder(scene,config.mode));bind(unit,config);unit.onStats=()=>applyStats(unit,config);unit.onStats();unit.detectRange.ready();unit.targetFinder.ready();return unit;}
