export class State{
 constructor(actor){/* TODO: retain the actor reference. */}
 enter(){}
 exit(){}
 process(delta){}
 physicsProcess(delta){}
}
export class FiniteStateMachine extends EventTarget{
 constructor(){super();this.state=null;}
 changeState(next){/* TODO: lifecycle, active state and event. */}
}
