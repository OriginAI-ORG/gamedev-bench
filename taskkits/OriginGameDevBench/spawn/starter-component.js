export class EnemySpawnPoint{constructor(marker,options){Object.assign(this,{marker,...options});}spawnInitiated(body){return null;}}
export class TriggerVolume{constructor(trigger){this.trigger=trigger;}onBodyEntered(body){}}
export function connectWave(trigger,markers,player,enemyFactory){return{points:[],volume:new TriggerVolume(trigger),dispose(){}};}
