export class Trait{
 constructor(name,icon,requirements){this.name=name;this.icon=icon;this.requirements=[...requirements];}
 countUnique(units){return new Set(units.filter(unit=>unit.stats.traits.includes(this)).map(unit=>unit.stats.name)).size;}
 isActive(count){return count>=this.requirements[0];}
 formatLevels(count){const reached=this.requirements.filter(n=>count>=n).length-1;return this.requirements.flatMap((n,i)=>[...(i?[{text:'/'}]:[]),{text:String(n),...(i===reached?{color:'#fafa82'}:{})}]);}
}
export const elf=new Trait('elf','elf.svg',[2,4,6]);
export const mage=new Trait('Mage Guild','mage.svg',[1,3,5]);
