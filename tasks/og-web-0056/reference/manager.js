import{Mixer,AudioVoice}from './engine.js';export class AudioManager{
 constructor(mixer){this.mixer=mixer;this.children=Array.from({length:8},()=>new AudioVoice(mixer));this.available=[...this.children];this.queue=[];this.decoded=new Map();for(const voice of this.children)voice.addEventListener('ended',()=>this.available.push(voice));}
 async prepare(paths){await Promise.all(paths.map(async path=>this.decoded.set(path,await this.mixer.load(path))));}
 play(path){this.queue.push(path);void this.mixer.unlock();}
 tick(){if(this.mixer.context.state!=='running'||!this.queue.length||!this.available.length)return;const path=this.queue[0],buffer=this.decoded.get(path);if(!buffer)return;this.queue.shift();const voice=this.available.shift();voice.src=path;voice.play(buffer);}
 stop(){for(const voice of this.children)voice.stop();this.available.splice(0,this.available.length,...this.children);this.queue.length=0;}
}
export const mixer=new Mixer(),manager=new AudioManager(mixer);export async function listFiles(directory){return await(await fetch(directory.replace(/\/$/,'')+'/files.json')).json();}
