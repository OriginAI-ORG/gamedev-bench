import {trapVerifier} from '../../../taskkits/OriginGameDevBench/trap/verify.mjs';
export const {scenarios,runScenario}=trapVerifier({markers:[['SpawnLeft',[-15,4],0],['SpawnRight',[15,4],1]],spriteRotation:90,tolerance:2});
