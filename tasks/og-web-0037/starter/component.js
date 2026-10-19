export function configureMovement(p){return p;}
export function physicsStep(p,input,dt){p.velocity[1]+=p.gravity*dt;p.velocity[0]=input.getAxis()*p.speed;p.moveAndSlide(dt);if(input.justPressed('jump')&&p.isOnFloor())p.velocity[1]=p.jumpSpeed;}
