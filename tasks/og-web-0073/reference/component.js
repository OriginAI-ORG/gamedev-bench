import {createBasePickup} from './renderer.js';
export class InteractableItem{
 constructor(body,highlight){this.body=body;this.highlight=highlight;this.highlight.visible=false;}
 gainFocus(){this.highlight.visible=true;}
 loseFocus(){this.highlight.visible=false;}
}
export class ItemData{constructor(itemName,itemModel){this.itemName=itemName;this.itemModel=itemModel;}}
export function createPickup(){const body=createBasePickup();body.collisionLayer=2;body.collisionMask=3;body.highlight.emissive=true;body.highlight.flipFaces=true;body.highlight.color=[1,1,0];return{body,interaction:new InteractableItem(body,body.highlight)};}
export const testCube=new ItemData('Test Cube',createPickup);
