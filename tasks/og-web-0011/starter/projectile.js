export const SPEED=500;
export function createProjectile({id,position,direction,tank,world,quests}){
  const p={id,x:position.x,y:position.y,direction:{...direction},tank,active:true};
  p.tick=delta=>{
    if(!p.active)return;
    const length=Math.hypot(p.direction.x,p.direction.y);
    if(length){p.x+=p.direction.x/length*SPEED*delta;p.y+=p.direction.y/length*SPEED*delta;}
    // TODO: clean up projectiles beyond the play area.
  };
  p.onSensor=target=>{
    if(!p.active)return;
    // TODO: integrate enemy contacts with the existing quest service.
    world.removeProjectile(p);
  };
  p.onBody=()=>{if(p.active)world.removeProjectile(p);};
  return p;
}
