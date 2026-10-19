export class CardStateMachine{
 constructor(states,initialState){this.name='CardStateMachine';this.children=states;this.initialState=initialState;this.currentState=null;this.states=new Map();}
 init(card){for(const child of this.children){this.states.set(child.state,child);child.card=card;}}
 onInput(_event){}onGuiInput(_event){}onMouseEntered(){}onMouseExited(){}transition(_from,_to){}dispose(){}
}
