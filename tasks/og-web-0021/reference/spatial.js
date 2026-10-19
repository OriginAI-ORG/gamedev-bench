export class SpatialNode{
 constructor(name,{position=[0,0,0],rotationY=0}={}){this.name=name;this.position=[...position];this.rotationY=rotationY;this.parent=null;this.children=[];}
 add(child){if(child.parent)child.parent.children=child.parent.children.filter(n=>n!==child);child.parent=this;this.children.push(child);return child;}
 worldPosition(){let p=[...this.position];for(let node=this.parent;node;node=node.parent){const c=Math.cos(node.rotationY),s=Math.sin(node.rotationY);p=[c*p[0]+s*p[2]+node.position[0],p[1]+node.position[1],-s*p[0]+c*p[2]+node.position[2]];}return p;}
}
export function project(position,camera,width=800,height=400){const d=camera[2]-position[2];return{x:width/2+(position[0]-camera[0])*300/d,y:height/2-(position[1]-camera[1])*300/d,visible:d>0};}
