export function configureAnimations(player,{Clip}){
 const target=player.lowerSprite;
 player.lower.clips.run=new Clip({duration:.6,step:.1,loop:true,tracks:[{target,property:'frame',keys:[[0,0],[.1,1],[.2,2],[.3,3],[.4,4],[.5,5]]}]});
 player.lower.clips.stand=new Clip({duration:.1,step:.1,loop:false,tracks:[{target,property:'frame',keys:[[0,6]]}]});
 return player;
}
