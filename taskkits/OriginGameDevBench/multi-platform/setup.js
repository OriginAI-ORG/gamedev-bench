import*as services from './components.js';import{configurePlatform}from './component.js';export function makePlatform(){const p=services.createScene();configurePlatform(p,services);return p;}
