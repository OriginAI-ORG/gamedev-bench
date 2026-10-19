export class PlayerInteractionHandler extends EventTarget{
 constructor({area,input,player,itemTypes,ItemClass}){super();Object.assign(this,{area,input,player,itemTypes,ItemClass,nearbyBodies:[]});}
 onBodyEntered(body){}onBodyExited(body){}pickupNearestItem(){return null;}dispose(){}
}
