export const identity=()=>[[1,0,0],[0,1,0],[0,0,1]];
export const multiply=(basis,v)=>v.map((_,i)=>basis[0][i]*v[0]+basis[1][i]*v[1]+basis[2][i]*v[2]);
export class SceneNode extends EventTarget{
 constructor(name,position=[0,0,0]){super();this.name=name;this.transform={position:[...position],basis:identity()};this.children=[];this.parent=null;this.removed=false;}
 add(child){child.parent=this;this.children.push(child);return child;}
 remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}
 worldTransform(){if(!this.parent)return structuredClone(this.transform);const p=this.parent.worldTransform(),t=multiply(p.basis,this.transform.position);return{position:t.map((v,i)=>v+p.position[i]),basis:this.transform.basis.map(axis=>multiply(p.basis,axis))};}
}
export class EnemyAIController extends SceneNode{constructor(){super('Cultist');this.didPlaceOnMesh=false;this.target=null;}placeOnMesh(){this.didPlaceOnMesh=true;}setNodeTarget(target){this.target=target;}}
export const createCultist=()=>new EnemyAIController();
