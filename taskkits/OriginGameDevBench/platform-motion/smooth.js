export function configureMovement(p){p.friction=.1;p.acceleration=.25;return p;}
export function physicsStep(p,input,dt){p.velocity[1]+=p.gravity*dt;const dir=input.getAxis();p.velocity[0]=dir!==0?p.velocity[0]+(dir*p.speed-p.velocity[0])*p.acceleration:p.velocity[0]+(0-p.velocity[0])*p.friction;p.moveAndSlide(dt);if(input.justPressed('jump')&&p.isOnFloor())p.velocity[1]=p.jumpSpeed;}
