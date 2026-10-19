export class Draggable extends EventTarget{
 constructor(host,{position,scale=[1,1],targets}){super();this.host=host;this.position={...position};this.targets=targets;this.destroyed=false;this.element=document.createElement('div');this.element.className='draggable';this.element.innerHTML='<img class="decoration" src="star.svg" alt="Star decoration" draggable="false">';this.element.style.left=position.x+'px';this.element.style.top=position.y+'px';host.append(this.element);}
 beginDrag(){}
 movePointer(point){}
 release(){}
 cancelDrag(){}
 playSpawnAnimation(){}
 selfDestruct(){}
 update(delta){}
 dispose(){this.destroyed=true;this.element.remove();}
}
