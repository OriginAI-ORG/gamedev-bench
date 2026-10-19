import {SpatialNode} from './spatial.js';
export const Priority=Object.freeze({low:0,medium:1,high:2});
export class FlashlightPoint extends SpatialNode{
 constructor(name,{position=[0,0,0],priority=Priority.low}={}){super(name,{position});this.priority=priority;this.hasBeenTargeted=false;}
 resetTargetState(){this.hasBeenTargeted=false;}
}
export function createPoints(root,registry){
 const points=[new FlashlightPoint('PillarPoint',{position:[8.36166,1.81915,-12.0301],priority:Priority.medium}),new FlashlightPoint('GatePoint',{position:[-16.6577,2.41884,-39.9426],priority:Priority.low}),new FlashlightPoint('EnemyPoint',{position:[23.0185,2.63927,-86.6948],priority:Priority.high})];
 for(const p of points){root.add(p);registry.add(p);}return points;
}
