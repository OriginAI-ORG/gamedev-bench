export function bindAnimations({lower,upper}){
 const changed=e=>{if(upper.current!=='attack')upper.play(e.detail);};
 const finished=e=>{if(e.detail==='attack'){upper.play(lower.current);upper.seek(lower.position);}};
 lower.addEventListener('animation-changed',changed);upper.addEventListener('animation-finished',finished);
 return()=>{lower.removeEventListener('animation-changed',changed);upper.removeEventListener('animation-finished',finished);};
}
