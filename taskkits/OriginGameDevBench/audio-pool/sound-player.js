import{AudioVoice}from './engine.js';
export class SoundPlayer{
 constructor(children=[],VoiceType=AudioVoice){this.children=children;this.VoiceType=VoiceType;this.name='';this.processAlways=false;}
 play(audio,single=false){if(audio===null||audio===undefined)return;if(single)this.stop();const voice=this.children.find(v=>v instanceof this.VoiceType&&!v.playing);if(voice){voice.stream=audio;voice.play();}return voice;}
 stop(){for(const voice of this.children)if(voice instanceof this.VoiceType)voice.stop();}
}
