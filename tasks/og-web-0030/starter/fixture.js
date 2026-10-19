import {TraitUI} from './view.js';import {elf,mage} from './trait.js';const $=id=>document.getElementById(id);let units=[],ui;
function render(){$('units').replaceChildren();units.forEach((unit,index)=>{const b=document.createElement('button');b.className='unit';b.textContent=unit.stats.name;b.onclick=()=>{units.splice(index,1);render();};$('units').append(b);});ui.update(units);}
function add(name){units.push({stats:{name,traits:name==='Orc'?[]:name==='Mage'?[mage]:[elf]}});render();}
for(const name of ['Archer','Marksman','Orc'])$('add-'+name).onclick=()=>add(name);$('add-unit').onclick=()=>add($('unit-choice').value);$('trait-choice').onchange=()=>{ui.traitData=$('trait-choice').value==='elf'?elf:mage;render();};
function reset(){units=[];ui?.dispose();ui=new TraitUI($('trait-host'));ui.traitData=elf;$('trait-choice').value='elf';render();}$('reset').onclick=reset;reset();
