export const evidence=[
 {id:'outage',name:'Power outage log',fact:'Municipal power was off from 19:30 until 21:00. The warehouse ceiling lights use municipal power only.',tile:12},
 {id:'fingerprint',name:'Safe fingerprint',fact:'A fresh print belonging to witness Elias Vale was recovered from the inside of the warehouse safe.',tile:13},
 {id:'ticket',name:'Ferry ticket',fact:'Defendant Mara Bell boarded the harbor ferry at 18:00. The ticket does not establish her whereabouts at 20:00.',tile:14},
 {id:'key',name:'Warehouse key and plan',fact:'The safe is six meters inside the warehouse. A person standing at the doorway cannot touch its interior.',tile:15}
];
export const testimony=[
 [
  {line:'I passed the warehouse on my way home that evening.',press:'I was close enough to read the number above the doorway.'},
  {line:'At 20:00, I saw Mara under the electric ceiling lights inside.',press:'I mean the ceiling lights on municipal power. It was not a lantern or an emergency lamp.'},
  {line:'The front door was locked when I left.',press:'The guard and I each carry a warehouse key.'}
 ],
 [
  {line:'I may have mistaken a lantern for the ceiling lights.',press:'My identification of Mara is less certain than I first claimed.'},
  {line:'I have never touched the inside of that safe.',press:'I was not wearing gloves. I had no legitimate reason to handle the safe.'},
  {line:'I only stood in the doorway; I never reached the safe.',press:'The plan places the safe six meters from the doorway.'}
 ]
];
export class Trial{
 constructor(scenario=''){this.screen='title';this.phase=0;this.index=0;this.credibility=3;this.selected=null;this.detail='';this.feedback='';this.reaction='calm';this.objections=0;this.penalties=0;this.history=[];if(['testimony','second-layer','near-mistrial'].includes(scenario)){this.screen='testimony';if(scenario==='second-layer'){this.phase=1;this.objections=1;}if(scenario==='near-mistrial')this.credibility=1;}}
 start(){if(this.screen==='title')this.screen='brief';}
 begin(){if(this.screen==='brief')this.screen='testimony';}
 move(delta){if(this.screen!=='testimony')return;this.index=(this.index+delta+testimony[this.phase].length)%testimony[this.phase].length;this.detail='';this.feedback='';this.reaction='calm';}
 press(){if(this.screen!=='testimony')return;this.detail=testimony[this.phase][this.index].press;this.feedback='The witness clarifies the account.';this.reaction='pressed';}
 select(id){if(this.screen==='testimony'&&evidence.some(e=>e.id===id))this.selected=id;}
 present(){if(this.screen!=='testimony'||!this.selected)return;const correct=(this.phase===0&&this.index===1&&this.selected==='outage')||(this.phase===1&&((this.index===1&&this.selected==='fingerprint')||(this.index===2&&this.selected==='key')));this.history.push({phase:this.phase,index:this.index,evidence:this.selected,correct});if(correct){this.objections++;this.reaction='objection';if(this.phase===0){this.phase=1;this.index=0;this.selected=null;this.detail='The claimed identification was impossible. The witness must now explain his access to the safe.';this.feedback='OBJECTION — the testimony changes';}else{this.screen='victory';this.feedback='NOT GUILTY';}}else{this.credibility=Math.max(0,this.credibility-1);this.penalties++;this.feedback='The exhibit does not contradict this statement. Credibility −1.';this.reaction='penalty';if(this.credibility===0)this.screen='mistrial';}}
}
