export class State{
 constructor(actor){this.actor=actor;}
 enter(){}
 exit(){}
 process(delta){}
 physicsProcess(delta){}
}
export class FiniteStateMachine extends EventTarget{
 constructor(){super();this.state=null;}
 changeState(next){if(this.state)this.state.exit();next.enter();this.state=next;this.dispatchEvent(new CustomEvent('state-changed',{detail:next}));}
}
