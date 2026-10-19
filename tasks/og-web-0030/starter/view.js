export class TraitUI{
 constructor(host){this.element=document.createElement('section');this.element.id='trait';this.element.innerHTML='<div id="trait-top"><div id="icon-background"><img id="trait-icon" alt="Trait icon"></div><div><div id="active-units">0</div><div id="levels"></div></div></div><div id="trait-name"></div>';host.append(this.element);this.icon=this.element.querySelector('#trait-icon');this.label=this.element.querySelector('#trait-name');this.count=this.element.querySelector('#active-units');this.levels=this.element.querySelector('#levels');this.active=false;}
 set traitData(value){this._trait=value;/* TODO: apply resource icon and name. */}
 get traitData(){return this._trait;}
 set active(value){this._active=value;/* TODO: apply panel alpha. */}
 get active(){return this._active;}
 update(units){/* TODO: use resource counting, formatted levels and activation. */}
 dispose(){this.element.remove();}
}
