import {DamageController,Player} from './controller.js';import {mountDamageHud} from './hud.js';const $=id=>document.getElementById(id),player=new Player();let dispose,controller,pan=0;
function damage(){player.takeDamage();$('actor').classList.add('hit');setTimeout(()=>$('actor').classList.remove('hit'),140);}
function reset(){dispose?.();controller=new DamageController();dispose=mountDamageHud(controller,player,$('hud-host'));pan=0;$('world').style.transform='translateX(0px)';$('actor').classList.remove('hit');}
$('actor').onclick=damage;$('external').onclick=damage;$('pan').onclick=()=>{pan+=40;$('world').style.transform=`translateX(${pan}px)`;};$('reset').onclick=reset;reset();
