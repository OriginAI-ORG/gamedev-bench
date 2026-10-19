export const defaults={move_forward:{code:'KeyW',key:'w'},move_backward:{code:'KeyS',key:'s'},turn_left:{code:'KeyA',key:'a'},turn_right:{code:'KeyD',key:'d'},weapon_fire:{code:'Space',key:' '}};
export class InputMap{
 constructor(){this.reset();}reset(){this.events=structuredClone(defaults);}set(action,event){this.events[action]={code:event.code,key:event.key};}get(action){return this.events[action];}matches(action,event){return this.events[action]?.code===event.code;}
}
export class Services extends EventTarget{
 constructor(){super();this.inputs=new InputMap();this.audio=new AudioContext();this.music=this.audio.createGain();this.sfx=this.audio.createGain();this.music.connect(this.audio.destination);this.sfx.connect(this.audio.destination);this.values={music:0,sfx:1,inputType:0};}
 setVolume(bus,value){this.values[bus]=value;this[bus].gain.value=value<.05?0:value;}
 setInputType(index){this.values.inputType=index;this.dispatchEvent(new CustomEvent('input-scheme-changed',{detail:index}));}
 async tone(bus){await this.audio.resume();const oscillator=this.audio.createOscillator(),gain=this.audio.createGain();oscillator.frequency.value=bus==='music'?330:660;gain.gain.value=.12;oscillator.connect(gain);gain.connect(this[bus]);oscillator.start();oscillator.stop(this.audio.currentTime+.15);}
}
