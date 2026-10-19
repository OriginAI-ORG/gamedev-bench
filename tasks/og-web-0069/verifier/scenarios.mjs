import {trapVerifier} from '../../../taskkits/OriginGameDevBench/trap/verify.mjs';
export const {scenarios,runScenario}=trapVerifier({markers:[['SpawnTop',[4,-15],0],['SpawnBot',[4,15],1]],tolerance:2});
