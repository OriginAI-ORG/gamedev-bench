import{SceneNode,NavigationAgent,Timer}from './services.js';import{Controller}from './controller.js';
export function setup({actor,objects,config}){
 const navigation=actor.add(new SceneNode('Navigation')),agent=navigation.add(new NavigationAgent(actor)),timer=navigation.add(new Timer(.1)),controller=new Controller(actor,agent,config.property);
 controller[config.property]=objects.get(config.target);const listener=()=>controller.onTimer();timer.addEventListener('timeout',listener);
 return{navigation,agent,timer,controller,dispose(){timer.removeEventListener('timeout',listener);timer.enabled=false;}};
}
