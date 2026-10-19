export class Inventory{
 constructor(grid,slots,{random=Math.random,icon='item.svg'}={}){this.grid=grid;this.slots=[...slots];this.items=[];this.random=random;this.icon=icon;}
 addItemResource(){return null;}
 clearAllInventoryItems(){}
}
