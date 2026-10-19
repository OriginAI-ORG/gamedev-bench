export class InteractableItem{
 constructor(prefabId,position,shape){this.prefabId=prefabId;this.position=[...position];this.shape=shape;this.collisionLayer=2;this.collisionMask=3;this.highlight={visible:false};this.removed=false;}
 gainFocus(){this.highlight.visible=true;}loseFocus(){this.highlight.visible=false;}remove(){this.removed=true;this.loseFocus();}
}
export class ItemData{constructor(name,prefabId){this.name=name;this.prefabId=prefabId;}}
export const itemTypes=[new ItemData('Test Cube','cube'),new ItemData('Test Sphere','sphere')];
export const makeItems=()=>[new InteractableItem('cube',[1.25,.5,-2],'cube'),new InteractableItem('sphere',[-2.5,.5,-3.5],'sphere')];
