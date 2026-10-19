// Supplied game service. Projectiles report gameplay events through this service.
export class QuestService extends EventTarget {
  constructor(){super();this.reset();}
  reset(){this.quests=new Map([['Shoot Em Up',new Map([['kill_step',0]])],['Supply Run',new Map([['collect_step',0]])]]);this.seen=new Set();}
  progressQuest(name,step,eventId){
    const steps=this.quests.get(name);
    if(!steps?.has(step))throw new Error('Unknown quest step');
    const key=name+'/'+step+'/'+eventId;
    if(this.seen.has(key))return;
    this.seen.add(key);steps.set(step,steps.get(step)+1);
    this.dispatchEvent(new CustomEvent('progress',{detail:{name,step,value:steps.get(step)}}));
  }
  value(name,step){return this.quests.get(name)?.get(step)??0;}
}
