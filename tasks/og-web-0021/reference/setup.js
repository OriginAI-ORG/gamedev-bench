import {FlashlightPoint} from './supplied-point.js';import {installPoint} from './component.js';
export function setup(root,registry,context){installPoint(context.chest,FlashlightPoint,registry);}
