export function configurePlayer(player,{Sprite,Clip,Animator}){
 player.sprite=new Sprite('dino.png',24,1,{position:[0,-2]});const target=player.sprite,clip=frames=>new Clip({duration:frames.length*.2,step:.2,loop:true,tracks:[{target,property:'frame',keys:frames.map((f,i)=>[i*.2,f])}]});
 player.animator=new Animator({default:clip([0,1,2,3]),run:clip([4,5,6,7,8,9])});player.animator.play('default');return player;
}
export function updatePlayer(player,axis){player.velocity[0]=axis*100;player.animator.play(axis===0?'default':'run');if(axis!==0)player.sprite.flipH=axis<0;}
