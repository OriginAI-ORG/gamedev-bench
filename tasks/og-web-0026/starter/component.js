import {createBasePickup} from './renderer.js';
export class InteractableItem{
 constructor(body,highlight){this.body=body;this.highlight=highlight;}
 gainFocus(){/* TODO */}
 loseFocus(){/* TODO */}
}
export class ItemData{constructor(itemName,itemModel){/* TODO: retain reusable metadata. */}}
export function createPickup(){const body=createBasePickup();body.highlight.emissive=true;body.highlight.flipFaces=true;return{body,interaction:new InteractableItem(body,body.highlight)};}
// Replace this placeholder record with an ItemData instance bound to the factory.
export const testCube={itemName:'Unnamed pickup',itemModel:createPickup};
