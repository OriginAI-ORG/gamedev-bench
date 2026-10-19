export class Minimap{
 constructor({root,player=null,viewport,frame}){this.root=root;this.player=player;this.viewport=viewport;this.frame=frame;this.zoom=1.5;this.gridScale=[0,0];this.markers=new Map();}
 async ready(objects){}
 update(){}
 setZoom(value){}
 onWheel(event){}
 removeObject(object){}
 dispose(){}
}
