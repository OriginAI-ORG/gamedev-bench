import {nextFrame} from './render.js';
export class Minimap{
 constructor({root,player=null,viewport=()=>[innerWidth,innerHeight],frame=nextFrame}){
  this.root=root;this.player=player;this.viewport=viewport;this.frame=frame;this.grid=root.querySelector('#Grid');this.playerMarker=root.querySelector('#PlayerMarker');
  this.icons={mob:root.querySelector('#MobMarker'),alert:root.querySelector('#AlertMarker')};this.markers=new Map();this.gridScale=[0,0];this._zoom=1.5;this.wheel=event=>this.onWheel(event);
 }
 get zoom(){return this._zoom;}set zoom(value){this.setZoom(value);}
 measure(){return[this.grid.clientWidth,this.grid.clientHeight];}
 setZoom(value){this._zoom=Math.max(.5,Math.min(5,value));const size=this.measure(),viewport=this.viewport();this.gridScale=size.map((v,i)=>v/(viewport[i]*this._zoom));}
 async ready(objects){await this.frame();const size=this.measure();this.playerMarker.style.left=size[0]/2+'px';this.playerMarker.style.top=size[1]/2+'px';this.setZoom(this.zoom);
  for(const object of objects){if(!object.groups.has('minimap_objects'))continue;const marker=this.icons[object.minimapIcon].cloneNode();marker.removeAttribute('id');marker.dataset.object=object.name;marker.hidden=false;this.grid.append(marker);this.markers.set(object,marker);}
  this.root.addEventListener('wheel',this.wheel,{passive:false});this.update();
 }
 update(){if(!this.player)return;const size=this.measure();this.playerMarker.style.transform=`translate(-50%,-50%) rotate(${this.player.rotation+Math.PI/2}rad)`;
  for(const[object,marker]of this.markers){const p=object.position.map((v,i)=>(v-this.player.position[i])*this.gridScale[i]+size[i]/2),inside=p.every((v,i)=>v>=0&&v<size[i]);marker.style.left=Math.max(0,Math.min(size[0],p[0]))+'px';marker.style.top=Math.max(0,Math.min(size[1],p[1]))+'px';marker.style.transform=`translate(-50%,-50%) scale(${inside?1:.75})`;}
 }
 removeObject(object){this.markers.get(object)?.remove();this.markers.delete(object);}
 onWheel(event){if(event.deltaY===0)return;event.preventDefault?.();this.zoom+=event.deltaY<0?.1:-.1;this.update();}
 dispose(){this.root.removeEventListener('wheel',this.wheel);for(const object of this.markers.keys())this.removeObject(object);}
}
