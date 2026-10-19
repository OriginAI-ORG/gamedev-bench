export const gridCellSize=32;
export class Sprite{constructor(src,columns,rows,frame=0){Object.assign(this,{src,columns,rows,frame});}}
export class RectangleCollider{constructor(size){this.size=[...size];}contains(point){return Math.abs(point[0])<=this.size[0]/2&&Math.abs(point[1])<=this.size[1]/2;}}
export class RayProbe{
 constructor(){this.collideWithAreas=false;this.length=64;}
 cast(direction,targets){let closest=null,distance=Infinity;for(const target of targets){if(target.type==='area'&&!this.collideWithAreas)continue;let near=0,far=this.length;for(let i=0;i<2;i++){const lo=target.position[i]-target.size[i]/2,hi=target.position[i]+target.size[i]/2;if(Math.abs(direction[i])<1e-9){if(lo>0||hi<0)far=-1;}else{const a=lo/direction[i],b=hi/direction[i];near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));}}if(near<=far&&near<distance){closest=target;distance=near;}}return closest;}
}
export class AnimationClip{constructor({duration,loop,tracks}){Object.assign(this,{duration,loop,tracks});}}
export class Animator{
 constructor(clips){this.clips=clips;this.current=null;this.position=0;this.playing=false;}
 play(name){this.current=name;this.position=0;this.playing=true;this.apply();}
 apply(){const c=this.clips[this.current];if(!c)return;for(const track of c.tracks){let value=track.keys[0]?.[1];for(const[at,next]of track.keys)if(at<=this.position+1e-9)value=next;track.target[track.property]=value;}}
 advance(dt){const c=this.clips[this.current];if(!c)return;this.position+=dt;if(c.loop)this.position%=c.duration;else if(this.position>=c.duration){this.position=c.duration;this.playing=false;}this.apply();}
}
