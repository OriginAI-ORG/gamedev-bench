export class CardStateMachine{
 constructor(states,initialState){this.name='CardStateMachine';this.children=states;this.initialState=initialState;this.currentState=null;this.states=new Map();this.connections=[];}
 init(card){for(const child of this.children){this.states.set(child.state,child);child.card=card;const listener=event=>this.transition(event.detail.from,event.detail.to);child.addEventListener('transition-requested',listener);this.connections.push(()=>child.removeEventListener('transition-requested',listener));}if(this.initialState){this.initialState.enter();this.currentState=this.initialState;}}
 onInput(event){this.currentState?.onInput(event);}onGuiInput(event){this.currentState?.onGuiInput(event);}onMouseEntered(){this.currentState?.onMouseEntered();}onMouseExited(){this.currentState?.onMouseExited();}
 transition(from,to){if(from!==this.currentState)return;const next=this.states.get(to);if(!next)return;this.currentState?.exit();next.enter();this.currentState=next;}
 dispose(){for(const remove of this.connections)remove();this.connections.length=0;}
}
