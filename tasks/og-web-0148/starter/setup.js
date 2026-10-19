import{SceneNode,NavigationAgent,Timer}from './services.js';import{Controller}from './controller.js';import{bindTarget}from './binding.js';
export function setup({actor,objects,config}){
 const navigation=actor.add(new SceneNode('Navigation')),agent=navigation.add(new NavigationAgent(actor)),timer=navigation.add(new Timer(.1)),controller=new Controller(actor,agent,config.property);
 bindTarget(controller,objects,config);const listener=()=>controller.onTimer();timer.addEventListener('timeout',listener);
 return{navigation,agent,timer,controller,dispose(){timer.removeEventListener('timeout',listener);timer.enabled=false;}};
}
