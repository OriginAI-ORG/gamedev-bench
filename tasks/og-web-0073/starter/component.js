import {createBasePickup} from './renderer.js';
export class InteractableItem{
 constructor(body,highlight){this.body=body;this.highlight=highlight;this.highlight.visible=false;}
 gainFocus(){this.highlight.visible=true;}
 loseFocus(){this.highlight.visible=false;}
}
export class ItemData{constructor(itemName,itemModel){/* TODO: retain reusable metadata. */}}
export function createPickup(){const body=createBasePickup();body.collisionLayer=2;body.collisionMask=3;return{body,interaction:new InteractableItem(body,body.highlight)};}
// Complete the material, hull and reusable metadata configuration.
export const testCube={itemName:'Test Cube',itemModel:createPickup};
