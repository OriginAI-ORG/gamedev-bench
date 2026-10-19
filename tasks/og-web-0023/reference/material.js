export class TransitionMaterial{
 constructor(){this.strength=0;this.overlay=null;}
 attach(overlay){this.overlay=overlay;this.setStrength(this.strength);}
 setStrength(value){this.strength=Math.max(0,Math.min(3,value));if(!this.overlay)return;const k=this.strength/3;this.overlay.style.opacity=String(Math.min(1,this.strength));this.overlay.style.background=`radial-gradient(ellipse at center,rgba(20,36,48,${k}) ${Math.max(0,81.5-181.5*k)}%,rgba(0,0,0,${k}) 100%)`;}
}
