import{loadScene}from './components.js';export const definition=await(await fetch('scene.json')).json(),scene=await loadScene(definition);
