import {Item} from './item.js';
export class Inventory{
 constructor(grid,slots,{random=Math.random,icon='item.svg'}={}){this.grid=grid;this.slots=[...slots];this.items=[];this.random=random;this.icon=icon;}
 addItemResource(){const slot=this.slots.find(s=>s.slotItemResource===null);if(!slot)return null;const item=new Item(this.icon,1+Math.floor(this.random()*20));this.items.push(item);slot.setItem(item);return item;}
 clearAllInventoryItems(){this.items.length=0;for(const slot of this.slots)slot.setDataEmpty();}
}
