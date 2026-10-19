export class Sprite{constructor(src){this.src=src;}}
export class RectangleCollider{constructor(size){this.size=[...size];}}
export class Body{
 constructor(){this.name='';this.position=[0,-34];this.velocity=[0,0];this.floor=false;this.sprite=null;this.collider=null;}
 moveAndSlide(dt){this.position[0]+=this.velocity[0]*dt;this.position[1]+=this.velocity[1]*dt;const half=(this.collider?.size[1]??0)/2;this.floor=false;if(this.position[1]+half>=0){this.position[1]=-half;this.velocity[1]=Math.min(0,this.velocity[1]);this.floor=true;}}
 isOnFloor(){return this.floor;}
}
