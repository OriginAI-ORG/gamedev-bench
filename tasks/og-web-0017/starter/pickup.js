export class Tank extends EventTarget{constructor(){super();this.position=[0,0];this.size=[24,24];}collect(pickup){this.dispatchEvent(new CustomEvent('collected',{detail:pickup}));}}
export class Pickup extends EventTarget{
 constructor(){super();this.name='';this.position=[0,0];this.scale=[1,1];this.sprite=null;this.collider=null;this.audio=null;this.pending=false;this.removed=false;}
 async onBodyEntered(body){if(!(body instanceof Tank)||this.pending||this.removed)return;this.pending=true;body.collect(this);await this.audio.play();this.removed=true;}
}
