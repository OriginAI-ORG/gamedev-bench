export class MenuHandler{
 constructor(root,game,actions){Object.assign(this,{root,game,actions,launchMenu:null,pauseMenu:null,deathMenu:null,transitionMaterial:null,playerNode:null,levelCamera:null,transition:null});}
 start(){if(this.launchMenu)this.launchMenu.hidden=false;if(this.pauseMenu)this.pauseMenu.hidden=true;if(this.deathMenu)this.deathMenu.hidden=true;if(this.playerNode)this.playerNode.visible=false;if(this.levelCamera)this.levelCamera.current=true;this.game.paused=true;this.tween(3,0);}
 toggleFullScreen(){this.actions.toggleFullScreen();}
 beginLaunch(){this.launchMenu.hidden=true;this.tween(0,3,()=>{if(this.playerNode)this.playerNode.visible=true;if(this.levelCamera)this.levelCamera.current=false;this.game.paused=false;this.game.playing=true;this.tween(3,0);});}
 showPauseMenu(){this.pauseMenu.hidden=false;this.game.paused=true;}
 hidePauseMenu(){this.pauseMenu.hidden=true;this.game.paused=false;}
 showDeathMenu(){this.pauseMenu.hidden=true;this.deathMenu.hidden=false;if(this.playerNode)this.playerNode.visible=false;if(this.levelCamera)this.levelCamera.current=true;this.game.playing=false;this.game.paused=false;this.tween(3,0);}
 restartLevel(){this.actions.restartLevel();}
 exitGame(){this.tween(0,3,()=>this.actions.exitGame());}
 tween(from,to,done){this.transition={from,to,elapsed:0,done};this.transitionMaterial?.setStrength(from);}
 update(dt){if(!this.transition)return;const t=this.transition;t.elapsed+=dt;const fraction=Math.min(1,t.elapsed/2);this.transitionMaterial?.setStrength(t.from+(t.to-t.from)*fraction);if(fraction===1){this.transition=null;t.done?.();}}
 dispose(){this.root.remove();this.transition=null;}
}
