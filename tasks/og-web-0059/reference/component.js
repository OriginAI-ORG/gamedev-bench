import{SoundPlayer}from './sound-player.js';export{SoundPlayer};
export function createMusicPlayer({mixer,AudioVoice}){const player=new SoundPlayer(Array.from({length:4},()=>new AudioVoice(mixer,'Music')),AudioVoice);player.name='MusicPlayer';player.processAlways=true;return player;}
