export class SoundBus{
 constructor(){this.context=new AudioContext();this.sfx=this.context.createGain();this.master=this.context.createGain();this.analyser=this.context.createAnalyser();this.sfx.connect(this.master);this.master.connect(this.analyser);this.analyser.connect(this.context.destination);this.buffers=new Map();}
 async load(src){if(!this.buffers.has(src))this.buffers.set(src,await this.context.decodeAudioData(await(await fetch(src)).arrayBuffer()));return this.buffers.get(src);}
 createAudioPlayer(src,bus){return{src,bus,play:async()=>{await this.context.resume();const buffer=await this.load(src),source=this.context.createBufferSource();source.buffer=buffer;source.connect(bus==='SFX'?this.sfx:this.master);await new Promise(resolve=>{source.onended=resolve;source.start();});}};}
}
export const sound=new SoundBus();
