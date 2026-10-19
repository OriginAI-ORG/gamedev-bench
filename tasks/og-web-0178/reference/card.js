import{CardView}from './services.js';import{CardStateMachine}from './state-machine.js';import{CardBaseState,CardClickedState,CardDraggingState,CardReleasedState}from './states.js';
export class Card extends CardView{
 constructor(title,environment){super(title,environment);const states=[new CardBaseState(),new CardClickedState(),new CardDraggingState(),new CardReleasedState()];this.machine=new CardStateMachine(states,states[0]);}
 ready(){this.machine.init(this);}onInput(event){this.machine.onInput(event);}onGuiInput(event){this.machine.onGuiInput(event);}onMouseEntered(){this.machine.onMouseEntered();}onMouseExited(){this.machine.onMouseExited();}
 onAreaEntered(area){if(!this.targets.includes(area))this.targets.push(area);}
 onAreaExited(area){const index=this.targets.indexOf(area);if(index>=0)this.targets.splice(index,1);}
}
