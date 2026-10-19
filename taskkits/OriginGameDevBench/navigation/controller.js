export class Controller{
 constructor(body,agent,property){this.body=body;this.navigationAgent=agent;this.property=property;this[property]=null;this.speed=300;this.acceleration=7;}
 physics(dt){const next=this.navigationAgent.nextPathPosition(),position=this.body.globalPosition,direction=next.map((v,i)=>v-position[i]),length=Math.hypot(...direction),weight=this.acceleration*dt;this.body.velocity=this.body.velocity.map((v,i)=>v+((length?direction[i]/length:0)*this.speed-v)*weight);this.body.moveAndSlide(dt);}
 onTimer(){const target=this[this.property];if(target==null)return;this.navigationAgent.targetPosition=target.globalPosition;}
}
