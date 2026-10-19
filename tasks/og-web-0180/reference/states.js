import{State}from './services.js';import{moveToDragLayer}from './placement.js';
export class CardBaseState extends State{
 constructor(){super(0,'CardBaseState');}
 enter(){const c=this.card;c.stateLabel.textContent='Base';c.dispatchEvent(new CustomEvent('reparent-requested',{detail:c}));c.dropPointDetector.monitoring=false;c.pivot=[0,0];c.updateDetector();}
 onGuiInput(event){if(event.type==='pointerdown'&&event.button===0){this.card.pivot=event.position.map((v,i)=>v-this.card.globalPosition[i]);this.request(1);}}
}
export class CardClickedState extends State{
 constructor(){super(1,'CardClickedState');}
 enter(){const c=this.card;c.stateLabel.textContent='Clicked';c.originalIndex=[...c.element.parentElement.children].indexOf(c.element);c.dropPointDetector.monitoring=true;c.updateDetector();}
 onInput(event){if(event.type==='pointermove')this.request(2);}
}
export class CardDraggingState extends State{
 constructor(){super(2,'CardDraggingState');this.startedAt=0;}
 enter(){this.card.stateLabel.textContent='Dragging';moveToDragLayer(this.card);this.startedAt=this.card.clock.now();}
 onInput(event){const c=this.card;if(event.type==='pointermove'){c.globalPosition=event.position.map((v,i)=>v-c.pivot[i]);c.updateDetector();}if(event.type==='pointerdown'&&event.button===2)this.request(0);else if(event.type==='pointerup'&&event.button===0&&c.clock.now()-this.startedAt>=c.config.threshold*1000)this.request(3);}
}
export class CardReleasedState extends State{
 constructor(){super(3,'CardReleasedState');this.played=false;}
 enter(){this.card.stateLabel.textContent='Released';this.played=this.card.targets.length>0;if(this.played)this.card.play();}
 onInput(_event){if(!this.played)this.request(0);}
}
