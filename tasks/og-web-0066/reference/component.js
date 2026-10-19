export function configureAnimations(player,{Clip}){
 const tracks=frames=>[player.character,player.knife].map(target=>({target,property:'frame',keys:frames.map((f,i)=>[i*.1,f])}));
 player.animator.clips.hurt=new Clip({duration:.3,step:.1,tracks:tracks([70,71,72]),events:[{at:.3,target:player,method:'onActionComplete'}]});
 player.animator.clips.fall=new Clip({duration:.1,step:.1,loop:true,tracks:tracks([80])});
 player.animator.clips.grounded=new Clip({duration:.1,step:.1,loop:true,tracks:tracks([82])});
 return player;
}
