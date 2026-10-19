export const SPEED=500;

export function createProjectile({id,position,direction,tank,world,quests}){
  const p={id,x:position.x,y:position.y,direction:{...direction},tank,active:true};
  const remove=()=>world.removeProjectile(p);
  p.tick=delta=>{
    if(!p.active)return;
    const length=Math.hypot(p.direction.x,p.direction.y);
    if(length){p.x+=p.direction.x/length*SPEED*delta;p.y+=p.direction.y/length*SPEED*delta;}
    if(p.x < -50||p.y < -50||p.x > world.width+50||p.y > world.height+50)remove();
  };
  p.onSensor=target=>{
    if(!p.active)return;
    if(quests&&target?.group==='enemy')quests.progressQuest('Shoot Em Up','kill_step',p.id);
    remove();
  };
  p.onBody=body=>{if(!p.active)return;if(!quests&&body?.kind==='crate')world.destroyBody(body);remove();};
  return p;
}
