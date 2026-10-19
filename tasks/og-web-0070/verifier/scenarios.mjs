import {trapVerifier} from '../../../taskkits/OriginGameDevBench/trap/verify.mjs';
export const {scenarios,runScenario}=trapVerifier({markers:[['SpawnTop',[24,-15],0],['SpawnBot',[24,15],1]],spritePosition:[20,0],tolerance:2});
