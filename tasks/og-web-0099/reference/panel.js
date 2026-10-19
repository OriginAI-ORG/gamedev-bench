export const Type=Object.freeze({WIN:0,LOSE:1});
export class BattleOverPanel{
  constructor(host,events,game,config){
    this.events=events;this.game=game;this.alive=true;
    const panel=document.createElement('section');panel.id='battle-panel';panel.hidden=true;panel.style.cssText=`position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,${config.alpha})`;
    const content=document.createElement('div');content.id='battle-content';content.style.cssText=`display:flex;flex-direction:column;justify-content:center;min-width:${config.offset*2}px;min-height:${config.offset*2}px;gap:8px`;
    const label=document.createElement('div');label.id='result-label';label.textContent=config.text;label.style.cssText=`display:grid;place-items:center;text-align:center;font-size:${config.font}px;min-height:${config.font*1.25}px`;
    const makeButton=(id,text)=>{const button=document.createElement('button');button.id=id;button.textContent=text;button.style.cssText=`min-width:${config.minimum[0]}px;min-height:${config.minimum[1]}px;margin:0;align-self:${config.align==='fill'?'stretch':config.align==='start'?'flex-start':'center'}`;return button;};
    const next=makeButton('continue',config.labels[0]),restart=makeButton('restart',config.labels[1]);
    next.onclick=()=>{if(!this.alive||panel.hidden)return;panel.hidden=true;game.finish();};
    restart.onclick=()=>{if(!this.alive||panel.hidden)return;panel.hidden=true;game.restart();};
    content.append(label,next,restart);panel.append(content);host.append(panel);Object.assign(this,{panel,label,next,restart});
    this.onResult=event=>this.showScreen(event.detail.text,event.detail.type);events.addEventListener('battle-over',this.onResult);
  }
  showScreen(text,type){if(!this.alive)return;this.label.textContent=text;this.next.hidden=type!==Type.WIN;this.restart.hidden=type!==Type.LOSE;this.panel.hidden=false;this.game.pause();}
  dispose(){if(!this.alive)return;this.alive=false;this.events.removeEventListener('battle-over',this.onResult);this.panel.remove();}
}
