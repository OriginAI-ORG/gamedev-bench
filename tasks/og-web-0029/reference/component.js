export class EnemySpawnPoint{
 constructor(marker,{enemyFactory,autoSetTarget=false,targetToSet=null}){Object.assign(this,{marker,enemyFactory,autoSetTarget,targetToSet});}
 spawnInitiated(body){const enemy=this.enemyFactory();this.marker.parent.add(enemy);enemy.transform=structuredClone(this.marker.transform);enemy.placeOnMesh();if(this.autoSetTarget)enemy.setNodeTarget(this.targetToSet);return enemy;}
}
export class TriggerVolume{constructor(trigger){this.trigger=trigger;}onBodyEntered(body){this.trigger.remove();}}
export function connectWave(trigger,markers,player,enemyFactory){const points=markers.map(marker=>new EnemySpawnPoint(marker,{enemyFactory,autoSetTarget:true,targetToSet:player})),volume=new TriggerVolume(trigger),listeners=points.map(point=>event=>{if(!trigger.removed)point.spawnInitiated(event.detail);});listeners.forEach(fn=>trigger.addEventListener('body-entered',fn));const cleanup=event=>{volume.onBodyEntered(event.detail);dispose();};trigger.addEventListener('body-entered',cleanup);function dispose(){listeners.forEach(fn=>trigger.removeEventListener('body-entered',fn));trigger.removeEventListener('body-entered',cleanup);}return{points,volume,dispose};}
