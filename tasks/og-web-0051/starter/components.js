export class Frame{constructor(src,region=null){this.src=src;this.region=region&&[...region];}}
export class Clip{constructor(frames,{fps=5,loop=true}={}){Object.assign(this,{frames,fps,loop});}}
export class RectangleCollider{constructor(size,position){this.size=[...size];this.position=[...position];}contains(p){return p.every((v,i)=>Math.abs(v-this.position[i])<=this.size[i]/2);}}
export class Sprite extends EventTarget{
 constructor(){super();this.animations={};this.animation='';this.speedScale=1;this.frame=0;this.elapsed=0;this.playing=false;this.finished=false;}
 play(name){this.animation=name;this.elapsed=0;this.frame=0;this.finished=false;this.playing=true;}
 advance(dt){const clip=this.animations[this.animation];if(!clip||!clip.frames.length)return;this.elapsed+=dt*this.speedScale;const index=Math.floor((this.elapsed+1e-9)*clip.fps);if(clip.loop)this.frame=index%clip.frames.length;else{this.frame=Math.min(index,clip.frames.length-1);if(index>=clip.frames.length&&!this.finished){this.finished=true;this.playing=false;this.dispatchEvent(new CustomEvent('animation-finished',{detail:this.animation}));}}}
 currentFrame(){return this.animations[this.animation]?.frames[this.frame]??null;}
}
