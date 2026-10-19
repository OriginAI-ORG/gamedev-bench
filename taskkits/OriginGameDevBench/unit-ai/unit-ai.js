export class UnitAI{
 constructor({actor,debugLabel}){this.actor=actor;this.debugLabel=debugLabel;this.state='IDLE';this._enabled=true;this.update();}
 update(){if(this.debugLabel){this.debugLabel.textContent=this.state;this.debugLabel.hidden=!this._enabled;}}
 set enabled(value){this._enabled=Boolean(value);this.update();}get enabled(){return this._enabled;}
 setState(state){this.state=state;this.update();}
}
