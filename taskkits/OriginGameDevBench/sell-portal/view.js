export class PortalView{
 constructor(element){this.element=element;this.events=new EventTarget();this.sprite=element.querySelector('#portal-sprite');this.preview=element.querySelector('#preview');}
 get position(){return{x:this.element.offsetLeft+this.element.offsetWidth/2,y:this.element.offsetTop+this.element.offsetHeight/2};}
 setHighlighted(value){this.element.style.outline=value?'4px solid #f5d16c':'0px solid transparent';}
 showGold(value){this.preview.hidden=value===null;this.preview.textContent=value===null?'':String(value);}
 faceUnit(unit){this.sprite.style.transform=unit.position.x>this.position.x?'scaleX(-1)':'scaleX(1)';}
}
