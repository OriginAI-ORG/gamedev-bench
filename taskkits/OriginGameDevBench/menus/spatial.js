export class SceneObject{constructor(name){this.name=name;this.position=[0,0,0];this.children=[];this.parent=null;this.visible=true;}add(object){object.parent=this;this.children.push(object);return object;}}
export class Camera extends SceneObject{constructor(name){super(name);this.basis=[[1,0,0],[0,1,0],[0,0,1]];this.current=false;}}
export function createPlayer(){const player=new SceneObject('PlayerBody');player.add(new Camera('PlayerCamera'));return player;}
export function project(position,camera,width=1000,height=600){const relative=position.map((v,i)=>v-camera.position[i]),local=camera.basis.map(axis=>axis.reduce((sum,v,i)=>sum+v*relative[i],0)),depth=-local[2];if(depth<=.1)return null;return[width/2+local[0]*height*.8660254/depth,height/2-local[1]*height*.8660254/depth,depth];}
