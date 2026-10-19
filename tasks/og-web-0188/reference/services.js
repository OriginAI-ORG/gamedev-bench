export class State extends EventTarget{
 constructor(id,name){super();this.state=id;this.name=name;this.card=null;}
 request(to){this.dispatchEvent(new CustomEvent('transition-requested',{detail:{from:this,to}}));}
 enter(){}exit(){}onInput(_event){}onGuiInput(_event){}onMouseEntered(){}onMouseExited(){}
}
export const clock={now:()=>performance.now()};
export function globalPosition(element,scene){const a=element.getBoundingClientRect(),b=scene.element.getBoundingClientRect(),scale=b.width/256;return[(a.left-b.left)/scale,(a.top-b.top)/scale];}
export function setGlobalPosition(element,position,scene){const parent=globalPosition(element.parentElement,scene);element.style.left=position[0]-parent[0]+'px';element.style.top=position[1]-parent[1]+'px';}
export function reparentPreservingPosition(element,parent,scene){const position=globalPosition(element,scene);parent.append(element);element.style.position='absolute';setGlobalPosition(element,position,scene);}
export class CardView extends EventTarget{
 constructor(title,environment){super();Object.assign(this,environment);this.title=title;this.element=document.createElement('div');this.element.className='card';this.element.tabIndex=0;this.element.dataset.title=title;this.titleLabel=document.createElement('span');this.titleLabel.className='title';this.titleLabel.textContent=title;this.stateLabel=document.createElement('span');this.stateLabel.className='state';this.stateLabel.textContent='Idle';this.element.append(this.titleLabel,this.stateLabel);this.targets=[];this.originalIndex=0;this.homeParent=null;this.pivot=[0,0];this.active=true;this.dropPointDetector={name:'DropPointDetector',monitoring:false,monitorable:false,collisionMask:2,size:[25,30],offset:[12.5,15],overlaps:new Set()};this.element.addEventListener('pointerdown',event=>{event.preventDefault();this.onGuiInput(this.scene.event(event));});this.element.addEventListener('mouseenter',()=>this.onMouseEntered());this.element.addEventListener('mouseleave',()=>this.onMouseExited());}
 get globalPosition(){return globalPosition(this.element,this.scene);}
 set globalPosition(value){setGlobalPosition(this.element,value,this.scene);}
 play(){this.active=false;this.element.remove();this.machine?.dispose();this.scene.played++;}
 updateDetector(){const d=this.dropPointDetector;if(!this.active)return;const current=new Set();if(d.monitoring){const[x,y]=this.globalPosition;for(const zone of this.scene.zones)if((d.collisionMask&zone.layer)&&x+25>=zone.x&&x<=zone.x+zone.width&&y+30>=zone.y&&y<=zone.y+zone.height)current.add(zone);}for(const zone of current)if(!d.overlaps.has(zone))this.onAreaEntered(zone);for(const zone of d.overlaps)if(!current.has(zone))this.onAreaExited(zone);d.overlaps=current;}
 ready(){}onInput(_event){}onGuiInput(_event){}onMouseEntered(){}onMouseExited(){}onAreaEntered(_area){}onAreaExited(_area){}
}
