import{State}from './services.js';
export class CardBaseState extends State{constructor(){super(0,'CardBaseState');}}
export class CardClickedState extends State{constructor(){super(1,'CardClickedState');}}
export class CardDraggingState extends State{constructor(){super(2,'CardDraggingState');}}
export class CardReleasedState extends State{constructor(){super(3,'CardReleasedState');}}
