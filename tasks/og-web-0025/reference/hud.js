export function mountDamageHud(controller,player,host){
 const label=document.createElement('div');label.id='damage-label';label.textContent='Total Damage: 0';host.append(label);controller.label=label;
 player.addEventListener('taken-damage',controller.onPlayerTakenDamage);
 return()=>{player.removeEventListener('taken-damage',controller.onPlayerTakenDamage);label.remove();if(controller.label===label)controller.label=null;};
}
