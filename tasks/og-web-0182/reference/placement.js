import{reparentPreservingPosition}from './services.js';
export function moveToDragLayer(card){const layer=card.scene.getByGroup(card.config.dragGroup);if(layer)reparentPreservingPosition(card.element,layer,card.scene);}
