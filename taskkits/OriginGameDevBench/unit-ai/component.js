export function attachAI(actor,Controller){
 const label=document.createElement('span');label.id='debug-label';label.textContent='IDLE';label.style.cssText='position:absolute;left:-65px;top:-47px;width:130px;height:18px;text-align:center';actor.append(label);
 return new Controller({actor,debugLabel:label});
}
