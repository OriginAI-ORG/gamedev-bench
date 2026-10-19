export class RemapBase extends EventTarget{
 constructor(action,inputs){super();this.action=action;this.inputs=inputs;this.element=document.createElement('button');this.element.className='remap';this.element.dataset.action=action;this.listening=false;this.click=()=>this.toggle(!this.listening);this.key=event=>{if(!this.listening||event.repeat||!event.code)return;event.preventDefault();event.stopImmediatePropagation();this.inputs.set(this.action,event);this.toggle(false);this.completed(this.inputs.get(this.action));};this.element.addEventListener('click',this.click);window.addEventListener('keydown',this.key,true);this.updateText();}
 updateText(){const event=this.inputs.get(this.action);this.element.textContent=event.code==='Space'?'Space':event.key.length===1?event.key.toUpperCase():event.key;}
 toggle(active){this.listening=active;this.element.setAttribute('aria-pressed',String(active));if(active){this.element.textContent='... Awaiting Input ...';this.element.blur();}else{this.updateText();this.element.focus();}}
 completed(_event){}
 dispose(){this.element.removeEventListener('click',this.click);window.removeEventListener('keydown',this.key,true);}
}
