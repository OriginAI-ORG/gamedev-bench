import {SpatialNode} from './spatial.js';
export const Priority=Object.freeze({low:0,medium:1,high:2});
export class FlashlightPoint extends SpatialNode{
 constructor(name,options={}){super(name,options);}
 resetTargetState(){/* TODO */}
}
export function createPoints(root,registry){return [];}
