import {SpatialNode} from './spatial.js';
export class FlashlightPoint extends SpatialNode{
 static Priority=Object.freeze({none:0,low:1,medium:2,high:3});
 constructor(name,options={}){super(name,options);this.priority=options.priority??FlashlightPoint.Priority.none;this.hasBeenTargeted=false;}
 resetTargetState(){this.hasBeenTargeted=false;}
}
