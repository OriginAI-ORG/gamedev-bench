export class Mixer extends EventTarget{
 constructor(){super();this.context=new AudioContext();this.buses=new Map();this.output=this.context.createAnalyser();this.output.fftSize=1024;this.output.connect(this.context.destination);this.addBus('Master');this.buffers=new Map();this.unlocked=false;}
 addBus(name){if(this.buses.has(name))return this.buses.get(name);const gain=this.context.createGain(),meter=this.context.createAnalyser();meter.fftSize=1024;gain.connect(meter);meter.connect(name==='Master'?this.output:this.buses.get('Master').gain);const bus={name,gain,meter,muted:false};this.buses.set(name,bus);return bus;}
 setMuted(name,muted){const bus=this.buses.get(name);bus.muted=muted;bus.gain.gain.value=muted?0:1;}
 async unlock(){await this.context.resume();if(!this.unlocked){this.unlocked=true;this.dispatchEvent(new Event('unlocked'));}}
 async load(src){if(!this.buffers.has(src))this.buffers.set(src,this.context.decodeAudioData(await(await fetch(src)).arrayBuffer()));return await this.buffers.get(src);}
 energy(analyser=this.output){const a=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((n,v)=>n+v*v,0)/a.length);}
 diagnostic(duration=.6,frequency=440){const buffer=this.context.createBuffer(1,Math.ceil(this.context.sampleRate*duration),this.context.sampleRate),a=buffer.getChannelData(0);for(let i=0;i<a.length;i++){const t=i/this.context.sampleRate,envelope=Math.min(1,t/.01,(duration-t)/.02);a[i]=.15*envelope*Math.sin(2*Math.PI*frequency*t);}return buffer;}
}
export class AudioVoice extends EventTarget{
 constructor(mixer,bus='Master'){super();Object.assign(this,{mixer,bus,stream:null,src:null,autoplay:false,playing:false,source:null,startedAt:0});}
 play(audio=this.stream){if(!audio)return;this.stop();this.stream=audio;const source=this.mixer.context.createBufferSource();source.buffer=audio;source.connect(this.mixer.buses.get(this.bus).gain);this.source=source;this.playing=true;this.startedAt=this.mixer.context.currentTime;source.onended=()=>{if(this.source!==source)return;source.disconnect();this.source=null;this.playing=false;this.dispatchEvent(new Event('ended'));};source.start();}
 stop(){if(this.source){const source=this.source;this.source=null;source.onended=null;source.stop();source.disconnect();}this.playing=false;}
}
