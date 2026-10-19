import{reparentPreservingPosition}from './services.js';
export function moveToDragLayer(card){reparentPreservingPosition(card.element,card.homeParent.parentElement,card.scene);}
