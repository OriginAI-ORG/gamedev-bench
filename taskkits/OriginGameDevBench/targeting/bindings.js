export function bind(unit,config){if(config.mode!=='setter')unit.targetFinder.actor=unit;if(config.mode==='explicit')unit.targetFinder.detector=unit.detectRange;}
export function applyStats(unit,config){if(config.mode==='actor')unit.detectRange.actor=unit;else unit.detectRange.stats=unit.stats;if(config.mode==='setter')unit.targetFinder.actor=unit;}
