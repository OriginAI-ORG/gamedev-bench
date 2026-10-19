import{TankBase,WeaponBase,PickupBase}from './base.js';import{drawAmmo}from './hud-render.js';
export class Tank extends TankBase{collectPickup(points){this.dispatchEvent(new CustomEvent('pickup-collected',{detail:points}));}}
export class Pickup extends PickupBase{
 bodyEntered(body){if(!this.active||!(body instanceof TankBase))return;this.active=false;body.collectPickup(this.points);this.dispatchEvent(new CustomEvent('collected',{detail:this.points}));}
}
export class Weapon extends WeaponBase{
 onFired(){this.dispatchEvent(new CustomEvent('reload-progress',{detail:0}));}
 onReloadTick(progress){this.dispatchEvent(new CustomEvent('reload-progress',{detail:progress}));}
 onReloadFinished(){this.dispatchEvent(new CustomEvent('reload-progress',{detail:1}));this.dispatchEvent(new Event('reload-finished'));}
}
export class HUD{
 constructor(root,config){this.name='UI';this.root=document.createElement('div');this.root.id='UI';this.root.className='hud';this.score=document.createElement('output');this.score.id='Score';this.reload=document.createElement('canvas');this.reload.id='ReloadProgress';this.reload.width=32;this.reload.height=48;this.reload.setAttribute('role','progressbar');this.reload.setAttribute('aria-valuemin','0');this.reload.setAttribute('aria-valuemax','1');this.reload.setAttribute('aria-label','Reload');this.root.append(this.score,this.reload);root.append(this.root);this.config=config;this.step=config.step;this.min=0;this.max=1;this.fill='bottom-to-top';this.setScore(0);this.setReload(1);}
 setScore(value){this.score.textContent=String(value);}
 setReload(value){this.value=Math.min(1,Math.max(0,Math.round(value/this.step)*this.step));this.reload.setAttribute('aria-valuenow',String(this.value));drawAmmo(this.reload,this.config,this.value);}
}
