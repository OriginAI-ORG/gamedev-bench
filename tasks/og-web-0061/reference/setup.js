import*as services from './components.js';import{configureAnimations}from './component.js';
export function makePlayer(){const p={lowerSprite:new services.Sprite('ninja_lower.png',15,1,{position:[-2,-13],offset:[16,0]}),lower:new services.Animator()};configureAnimations(p,services);p.lower.play('stand');return p;}
export const settings={kind:'lower',title:'Lower-body clip configuration',origin:[160,168],actions:['stand','run']};
