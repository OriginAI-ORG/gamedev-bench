// Explicit campaign content. These records are runtime game data, not a task generator.
export const PEOPLE={irena:{name:'Irena Vale',nation:'Rusk',face:4,purpose:'visit',story:'My daughter is waiting across the river.'},daro:{name:'Daro Kest',nation:'Aster',face:5,purpose:'work',story:'The foundry shift starts at dawn.'},orin:{name:'Orin Moss',nation:'Belen',face:6,purpose:'visit',story:'I have not seen my brother in twelve years.'},elsa:{name:'Elsa Renn',nation:'Rusk',face:7,purpose:'medical',story:'The clinic needs these medicines.'},marek:{name:'Marek Holt',nation:'Aster',face:8,purpose:'work',story:'A guard knows which doors can be opened.'},lena:{name:'Lena Sable',nation:'Belen',face:9,purpose:'visit',story:'We are looking for somewhere warm.'},sera:{name:'Sera Venn',nation:'Belen',face:10,purpose:'work',story:'Some letters should never reach the ministry.'},tomas:{name:'Tomas Rill',nation:'Aster',face:11,purpose:'work',story:'My train leaves before nightfall.'}};
export const RULES=[
 'Passport required. Its name must match the traveler; names on all presented documents must agree.',
 'Passport photograph must match the traveler at the window.',
 'Passport expiry must be today or later.',
 'Entry/work permit required. Check its expiry.',
 'Permit number must be nonempty; passport ID and stated purpose must match the passport and traveler.',
 'Vaccination card required: matching passport ID, C17 vaccine, expiry today or later.',
 'Entry ticket required. Its date must be today and its serial must be nonempty.',
 'Customs declaration required. Declared and measured baggage weights may differ by at most 2 kg.',
 'Search baggage. Weapons are prohibited; books,food and medicine are permitted.',
 'Rusk nationals are denied unless traveling for medical care with a physician seal on their permit.'
];
export const ROSTERS=[
 [['daro','name'],['irena','ok'],['orin','ok'],['elsa','ok'],['marek','ok'],['lena','ok'],['sera','ok'],['tomas','ok']],
 [['orin','photo'],['irena','ok'],['daro','ok'],['marek','ok'],['lena','name'],['sera','ok'],['elsa','ok'],['tomas','ok']],
 [['irena','expired'],['daro','today'],['sera','ok'],['orin','photo'],['marek','ok'],['lena','ok'],['elsa','ok'],['tomas','name']],
 [['marek','permit-missing'],['elsa','permit-expired'],['irena','ok'],['daro','ok'],['orin','expired'],['sera','ok'],['lena','ok'],['tomas','ok']],
 [['sera','permit-id'],['tomas','purpose'],['irena','ok'],['marek','ok'],['elsa','ok'],['daro','permit-number'],['orin','ok'],['lena','name']],
 [['elsa','vax-missing'],['irena','vax-type'],['daro','ok'],['sera','vax-id'],['marek','ok'],['orin','vax-expired'],['lena','ok'],['tomas','ok']],
 [['irena','ticket-date'],['sera','ok'],['marek','ticket-number'],['elsa','ok'],['daro','permit-id'],['tomas','ok'],['orin','ticket-missing'],['lena','ok']],
 [['marek','weight'],['irena','ok'],['sera','customs-missing'],['elsa','ok'],['tomas','weight-boundary'],['daro','ok'],['lena','vax-type'],['orin','ok']],
 [['sera','weapon'],['marek','ok'],['irena','ok'],['elsa','medicine'],['daro','weight'],['lena','ok'],['tomas','photo'],['orin','ok']],
 [['irena','ok'],['elsa','ok'],['marek','weapon'],['sera','ok'],['daro','today'],['lena','ticket-date'],['orin','ok'],['tomas','ok']]
];
export const EVENTS=[
 {person:'marek',title:'A quiet arrangement',text:'Marek offers 12 credits to stop asking questions about his colleagues.',a:{label:'Accept the bribe',gold:12,corruption:1},b:{label:'Refuse',loyalty:1}},
 {person:'irena',title:'Across the river',text:'Irena asks for 8 credits to buy medicine for her daughter.',a:{label:'Help the family · 8',cost:8,resistance:1},b:{label:'Keep the money',loyalty:1}},
 {person:'sera',title:'A letter without a seal',text:'Sera asks you to hide a message describing the prison transports.',a:{label:'Hide the letter',resistance:1},b:{label:'Report the courier',gold:6,loyalty:2}},
 {person:'marek',title:'The ledger',text:'You find evidence that Marek is selling confiscated goods.',a:{label:'Report corruption',loyalty:2,corruption:-1},b:{label:'Take a share · +15',gold:15,corruption:1}},
 {person:'irena',title:'An empty pantry',text:'Irena returns. The refugee shelter has run out of food.',a:{label:'Donate · 10',cost:10,resistance:1},b:{label:'Turn away',loyalty:1}},
 {person:'sera',title:'A dark signal',text:'Sera needs 10 credits to disable a transport beacon.',a:{label:'Fund the sabotage · 10',cost:10,resistance:2},b:{label:'Notify the ministry',loyalty:2}},
 {person:'marek',title:'One last favor',text:'Marek offers 20 credits to erase a colleague from his report.',a:{label:'Take the money',gold:20,corruption:1},b:{label:'Refuse',loyalty:1}},
 {person:'irena',title:'A route through the marsh',text:'Irena can secure family travel papers for 15 credits. A final train ticket will cost 120.',a:{label:'Buy escape papers · 15',cost:15,resistance:1,escapePass:true},b:{label:'Remain at the post',loyalty:1}},
 {person:'sera',title:'The signal rises',text:'Sera asks whether the checkpoint will stand aside when the prisoners arrive.',a:{label:'Support the resistance',resistance:2},b:{label:'Report the plan',loyalty:2}},
 {person:'marek',title:'The last train',text:'The border closes tonight. Keep your post,join the uprising,or use your papers to take your family away.',a:{label:'Board the train · 120',cost:120,escape:true},b:{label:'Stay and face tomorrow'}}
];
