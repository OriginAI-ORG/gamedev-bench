export class DamageController{
 constructor(){this.totalDamage=0;this.label=null;this.onPlayerTakenDamage=event=>{this.totalDamage+=event.detail.amount;if(this.label)this.label.textContent='Total Damage: '+this.totalDamage;};}
}
export class Player extends EventTarget{takeDamage(){this.dispatchEvent(new CustomEvent('taken-damage',{detail:{amount:20}}));}}
