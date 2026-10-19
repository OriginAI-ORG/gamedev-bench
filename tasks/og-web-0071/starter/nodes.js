export class SceneNode{
 constructor(name,{position=[0,0],rotation=0,z=0,texture=null,properties={}}={}){Object.assign(this,{name,position:[...position],rotation,z,texture,properties:structuredClone(properties),parent:null,children:[]});}
 add(child){if(child.parent)child.parent.children=child.parent.children.filter(n=>n!==child);child.parent=this;this.children.push(child);return child;}
 child(name){return this.children.find(n=>n.name===name);}
 clone(){const n=new SceneNode(this.name,{position:this.position,rotation:this.rotation,z:this.z,texture:this.texture,properties:this.properties});for(const c of this.children)n.add(c.clone());return n;}
 matrix(){const radians=this.rotation*Math.PI/180,c=Math.cos(radians),s=Math.sin(radians),m=[c,s,-s,c,...this.position];if(!this.parent)return m;const p=this.parent.matrix();return[p[0]*m[0]+p[2]*m[1],p[1]*m[0]+p[3]*m[1],p[0]*m[2]+p[2]*m[3],p[1]*m[2]+p[3]*m[3],p[0]*m[4]+p[2]*m[5]+p[4],p[1]*m[4]+p[3]*m[5]+p[5]];}
}
