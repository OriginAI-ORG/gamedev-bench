export class SceneNode extends EventTarget{
 constructor(name,position=[0,0]){super();this.name=name;this.position=position.slice();this.parent=null;this.children=[];this.groups=new Set();this.active=true;}
 add(node){node.parent=this;this.children.push(node);return node;}
 get globalPosition(){const p=this.parent?.globalPosition??[0,0];return this.position.map((v,i)=>v+p[i]);}
}
export class UnitStats{static Team={PLAYER:0,ENEMY:1};static TARGET={};constructor(team=0,attackRange=1){this.team=team;this.attackRange=attackRange;}clone(){return new UnitStats(this.team,this.attackRange);}}
export class BattleUnit extends SceneNode{
 constructor(name,position,stats){super(name,position);this.collisionMask=0;this.size=[24,24];this.onStats=null;this.stats=stats;}
 set stats(value){this._stats=value.clone();this.collisionLayer=this._stats.team+1;this.onStats?.();}
 get stats(){return this._stats;}
}
export class Scene extends SceneNode{
 constructor(){super('Scene');}
 get allNodes(){const walk=node=>node.children.flatMap(child=>[child,...walk(child)]);return walk(this);}
 getNodesInGroup(group){return this.allNodes.filter(n=>n.active&&n.groups.has(group));}
 scan(){const nodes=this.allNodes;for(const actor of nodes){const detector=actor.detectRange;if(!actor.active||!detector)continue;const current=new Set(),center=detector.globalPosition,radius=detector.colShape?.shape?.radius??0;
  for(const other of nodes){if(other===actor||!other.active||!(detector.collisionMask&other.collisionLayer))continue;const p=other.globalPosition,half=(other.size??[24,24]).map(v=>v/2),dx=Math.max(Math.abs(p[0]-center[0])-half[0],0),dy=Math.max(Math.abs(p[1]-center[1])-half[1],0);if(dx*dx+dy*dy<=radius*radius)current.add(other);}
  const previous=detector.overlaps??new Set();for(const other of current)if(!previous.has(other))detector.dispatchEvent(new CustomEvent('area-entered',{detail:other}));for(const other of previous)if(!current.has(other))detector.dispatchEvent(new CustomEvent('area-exited',{detail:other}));detector.overlaps=current;
 }}
}
