export const crateCells=[[11,14],[23,12],[40,9],[46,18],[31,23],[20,25],[10,24],[10,29],[6,21],[11,6],[6,13],[20,8],[31,17],[29,5],[42,26],[52,8],[41,14],[53,28],[46,3]];
const rotate=([x,y],angle)=>[x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle)];
export class World{
 constructor(){this.name='World';this.rotation=.000588424;this.walls=[];for(let x=0;x<60;x++)for(let y=0;y<34;y++)if(x===0||x===59||y===0||y===33)this.walls.push(rotate([x*16+8,y*16+8],this.rotation));this.crates=crateCells.map(([x,y])=>({position:rotate([x*16+8,y*16+8],this.rotation),active:true}));this.pickups=[];this.bullets=[];this.Pickup=null;}
 destroy(crate){if(!crate.active)return;crate.active=false;this.pickups.push(new this.Pickup(crate.position));}
 step(dt,tank,keys){tank.step(dt,keys);tank.weapon.tick(dt);for(const bullet of this.bullets){if(!bullet.active)continue;for(let i=0,n=Math.ceil(500*dt/2);i<n&&bullet.active;i++){bullet.position=bullet.position.map((v,j)=>v+bullet.direction[j]*500*dt/n);const crate=this.crates.find(c=>c.active&&c.position.every((v,j)=>Math.abs(v-bullet.position[j])<=10));if(crate){this.destroy(crate);bullet.active=false;}else if(this.walls.some(p=>p.every((v,j)=>Math.abs(v-bullet.position[j])<=10)))bullet.active=false;}}for(const pickup of this.pickups)if(pickup.active&&pickup.position.every((v,i)=>Math.abs(v-tank.position[i])<=17))pickup.bodyEntered(tank);}
}
export class TankBase extends EventTarget{
 constructor(world){super();this.name='Tank';this.world=world;this.position=[480,272];this.rotation=0;this.weaponRotation=0;this.velocity=[0,0];this.frame=0;this.elapsed=0;this.weapon=null;}
 step(dt,keys){const turn=Number(keys.has('KeyD'))-Number(keys.has('KeyA')),drive=Number(keys.has('KeyW'))-Number(keys.has('KeyS'));this.rotation+=turn*Math.PI*dt;this.weaponRotation+=(Number(keys.has('KeyE'))-Number(keys.has('KeyQ')))*20*Math.PI/180*Math.PI*dt;this.elapsed+=dt;this.frame=drive?Math.floor(this.elapsed/.1)%2:0;const direction=[Math.cos(this.rotation),Math.sin(this.rotation)];this.velocity=this.velocity.map((v,i)=>drive?v+(direction[i]*drive*64-v)*Math.min(1,64*dt):0);for(let axis=0;axis<2;axis++){const p=this.position.slice();p[axis]+=this.velocity[axis]*dt;const obstacles=[...this.world.walls,...this.world.crates.filter(c=>c.active).map(c=>c.position)];if(!obstacles.some(o=>o.every((v,i)=>Math.abs(v-p[i])<21)))this.position=p;}}
 collectPickup(_points){}
}
export class WeaponBase extends EventTarget{
 constructor(world,tank){super();this.name='Weapon';this.world=world;this.tank=tank;this.state='READY';this.duration=.5;this.remaining=0;this.shots=0;}
 fire(){if(this.state!=='READY')return false;this.state='FIRING';const angle=this.tank.rotation+this.tank.weaponRotation;this.world.bullets.push({position:this.tank.position.slice(),direction:[Math.cos(angle),Math.sin(angle)],active:true});this.shots++;this.state='RELOADING';this.remaining=this.duration;this.onFired();return true;}
 tick(dt){if(this.state!=='RELOADING')return;this.remaining=Math.max(0,this.remaining-dt);this.onReloadTick(1-this.remaining/this.duration);if(this.remaining<=1e-9){this.remaining=0;this.state='READY';this.onReloadFinished();}}
 onFired(){}onReloadTick(_progress){}onReloadFinished(){}
}
export class PickupBase extends EventTarget{constructor(position){super();this.position=position.slice();this.active=true;}bodyEntered(body){if(body instanceof TankBase)this.active=false;}}
