export class Body{constructor(){this.position=[80,0];this.velocity=[0,0];this.collider={size:[15,17.25],position:[-.5,-2.625]};this.grounded=true;this.gravity=980;}
 jump(){if(this.grounded){this.velocity[1]=-300;this.grounded=false;}}
 move(dt){if(!this.grounded)this.velocity[1]+=this.gravity*dt;this.position[0]+=this.velocity[0]*dt;this.position[1]+=this.velocity[1]*dt;if(this.position[1]>=0){this.position[1]=0;this.velocity[1]=0;this.grounded=true;}}
}
