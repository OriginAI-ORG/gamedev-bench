import{CardView}from './services.js';import{CardStateMachine}from './state-machine.js';import{CardBaseState,CardClickedState,CardDraggingState,CardReleasedState}from './states.js';
export class Card extends CardView{
 constructor(title,environment){super(title,environment);const states=[new CardBaseState(),new CardClickedState(),new CardDraggingState(),new CardReleasedState()];this.machine=new CardStateMachine(states,states[0]);}
 ready(){}onInput(_event){}onGuiInput(_event){}onMouseEntered(){}onMouseExited(){}onAreaEntered(_area){}onAreaExited(_area){}
}
