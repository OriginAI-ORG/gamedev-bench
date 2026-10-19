export class SellPortal{
 constructor(view,units,playerStats,unitPool){Object.assign(this,{view,playerStats,unitPool,currentUnit:null});this.bindings=new Map();this.disposed=false;this.enter=e=>this.onEnter(e.detail);this.exit=e=>this.onExit(e.detail);view.events.addEventListener('unit-enter',this.enter);view.events.addEventListener('unit-exit',this.exit);for(const unit of units)this.setupUnit(unit);this.clear();}
 setupUnit(unit){if(this.bindings.has(unit))return;const sell=()=>this.sellUnit(unit);unit.addEventListener('dropped',sell);unit.addEventListener('quick-sell',sell);this.bindings.set(unit,sell);}
 onEnter(unit){if(this.disposed||unit.sold)return;this.currentUnit=unit;this.view.setHighlighted(true);this.view.showGold(unit.stats.getGoldValue());}
 onExit(unit){if(this.currentUnit===unit)this.clear();}
 update(){if(this.currentUnit)this.view.faceUnit(this.currentUnit);}
 clear(){this.currentUnit=null;this.view.setHighlighted(false);this.view.showGold(null);}
 sellUnit(unit){if(this.disposed||unit.sold||this.currentUnit!==unit)return;unit.sold=true;this.playerStats.gold+=unit.stats.getGoldValue();this.unitPool.addUnit(unit.stats);unit.remove();this.clear();}
 dispose(){if(this.disposed)return;this.disposed=true;this.view.events.removeEventListener('unit-enter',this.enter);this.view.events.removeEventListener('unit-exit',this.exit);for(const[unit,sell]of this.bindings){unit.removeEventListener('dropped',sell);unit.removeEventListener('quick-sell',sell);}this.bindings.clear();this.clear();}
}
