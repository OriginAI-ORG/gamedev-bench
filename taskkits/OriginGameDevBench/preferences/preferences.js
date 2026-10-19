export const storageKey='webgame.userPreferences';
export class Preferences{
 constructor({music=0,sfx=1,inputType=0,remaps={}}={}){this.music=music;this.sfx=sfx;this.inputType=inputType;this.remaps=structuredClone(remaps);}
 static load(storage=localStorage){const saved=storage.getItem(storageKey);return new Preferences(saved?JSON.parse(saved):{});}
 save(storage=localStorage){storage.setItem(storageKey,JSON.stringify({music:this.music,sfx:this.sfx,inputType:this.inputType,remaps:this.remaps}));}
}
