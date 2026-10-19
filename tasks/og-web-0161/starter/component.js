import{SceneNode}from './services.js';
export class DetectRange extends SceneNode{constructor(baseRangeSize){super('DetectRange');this.baseRangeSize=baseRangeSize;this.colShape=null;}ready(){}dispose(){}}
export class TargetFinder extends SceneNode{constructor(scene){super('TargetFinder');this.scene=scene;this.actor=null;this.target=null;this.targetsInRange=[];}ready(){}findTarget(){return null;}hasTargetInRange(){return false;}dispose(){}}
export function assemble(unit,scene,config){return unit;}
