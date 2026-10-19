export class TraitUI{
 constructor(host){this.element=document.createElement('section');this.element.id='trait';this.element.innerHTML='<div id="trait-top"><div id="icon-background"><img id="trait-icon" alt="Trait icon"></div><div><div id="active-units">0</div><div id="levels"></div></div></div><div id="trait-name"></div>';host.append(this.element);this.icon=this.element.querySelector('#trait-icon');this.label=this.element.querySelector('#trait-name');this.count=this.element.querySelector('#active-units');this.levels=this.element.querySelector('#levels');this.active=false;}
 set traitData(value){this._trait=value;this.icon.src=value.icon;this.label.textContent=value.name;}
 get traitData(){return this._trait;}
 set active(value){this._active=value;this.element.style.opacity=value?'1':'0.5';}
 get active(){return this._active;}
 update(units){const count=this.traitData.countUnique(units);this.count.textContent=count;this.levels.replaceChildren();for(const token of this.traitData.formatLevels(count)){const span=document.createElement('span');span.textContent=token.text;if(token.color)span.style.color=token.color;this.levels.append(span);}this.active=this.traitData.isActive(count);}
 dispose(){this.element.remove();}
}
