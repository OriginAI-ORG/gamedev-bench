export const storageKey='webgame.userPreferences';
export class Preferences{
 constructor(){this.music=0;this.sfx=1;this.inputType=0;this.remaps={};}
 static load(_storage=localStorage){return new Preferences();}
 save(_storage=localStorage){}
}
