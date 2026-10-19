import {nextFrame} from './render.js';
export class Minimap{
 constructor({root,player=null,viewport=()=>[innerWidth,innerHeight],frame=nextFrame}){
  this.root=root;this.player=player;this.viewport=viewport;this.frame=frame;this.grid=root.querySelector('#Grid');this.playerMarker=root.querySelector('#PlayerMarker');
  this.icons={mob:root.querySelector('#MobMarker'),alert:root.querySelector('#AlertMarker')};this.markers=new Map();this.gridScale=[0,0];this._zoom=1.5;this.wheel=event=>this.onWheel(event);
 }
 get zoom(){return this._zoom;}set zoom(value){this.setZoom(value);}
 measure(){return[this.grid.clientWidth,this.grid.clientHeight];}
 setZoom(value){}
 async ready(objects){}
 update(){}
 removeObject(object){}
 onWheel(event){}
 dispose(){}
}
