export class Controller{
 constructor(body,agent,property){this.body=body;this.navigationAgent=agent;this.property=property;this[property]=null;this.speed=300;this.acceleration=7;}
 physics(dt){}
 onTimer(){}
}
