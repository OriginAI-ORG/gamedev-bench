import{TankBase,WeaponBase,PickupBase}from './base.js';
export class Tank extends TankBase{collectPickup(_points){}}
export class Pickup extends PickupBase{}
export class Weapon extends WeaponBase{}
export class HUD{
 constructor(root,config){this.name='UI';this.config=config;}
 setScore(_value){}
 setReload(_value){}
}
