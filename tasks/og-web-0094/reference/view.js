export function mountHud(host,c,actions){
  const style=document.createElement('style');
  style.textContent=`#hud{position:absolute;color:#111;background:rgb(153,153,153);font:14px system-ui;pointer-events:none}#hud .labels{display:flex;justify-content:space-between;padding:7px;gap:8px}#instrument{position:absolute;width:64px;height:18px}#power-meter{display:block;width:64px;height:18px}#power-indicator{position:absolute;top:0;width:6px;height:18px}#gameover{position:absolute;inset:0;display:grid;place-items:center}#gameover-card{background:#172432;color:white;min-width:180px;min-height:80px;padding:20px;text-align:center}#gameover h2{margin:0 0 15px}#gameover .buttons{display:flex;justify-content:center}#hud.status{inset:20px 20px auto;background:transparent;color:white}#hud.status .labels{padding:0}#hud.status #score{margin-left:auto;text-align:right}#gameover.detailed{inset:60px 70px 100px;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(90deg,#1d2342,#835f7c);text-align:center}#gameover.detailed #gameover-card{background:transparent}`;
  host.append(style);
  const hud=document.createElement('div');hud.id='hud';
  hud.innerHTML='<div class="labels"><span id="life"></span><span id="score"></span></div>';
  host.append(hud);
  const standard=c.mode==='instrument',vertical=['left','right'].includes(c.edge);
  if(standard){
    if(vertical){Object.assign(hud.style,{top:'0',bottom:'0',[c.edge]:'0'});hud.querySelector('.labels').style.flexDirection='column';}
    else Object.assign(hud.style,{left:'0',right:'0',[c.edge]:'0'});
    const instrument=document.createElement('div');instrument.id='instrument';instrument.innerHTML='<img id="power-meter" src="meter.svg" alt="Fuel scale"><img id="power-indicator" src="indicator.svg" alt="Fuel pointer">';
    if(vertical)Object.assign(instrument.style,{top:'50%',transform:'translateY(-50%)',[c.edge]:'0'});
    else Object.assign(instrument.style,{left:'50%',transform:'translateX(-50%)',[c.edge]:'0'});
    hud.append(instrument);
  }else hud.className='status';
  let overlay=null;
  if(c.mode!=='status'){
    overlay=document.createElement('div');overlay.id='gameover';overlay.hidden=true;
    overlay.innerHTML='<div id="gameover-card"><h2 id="gameover-title"></h2></div>';
    if(c.mode==='detailed'){
      overlay.className='detailed';overlay.firstChild.insertAdjacentHTML('beforeend','<p id="final-score"></p><p id="high-score"></p><div class="buttons"><button id="menu">Menu</button><button id="restart">Restart</button></div>');
      overlay.querySelector('#menu').onclick=actions.menu;overlay.querySelector('#restart').onclick=actions.restart;
    }
    host.append(overlay);
  }
  return{
    render(s){
      hud.querySelector('#life').textContent=c.lifeLabel+': '+s.life;hud.querySelector('#score').textContent=c.scoreLabel+': '+s.score;
      if(standard)hud.querySelector('#power-indicator').style.left=(3+52*s.fuel/100)+'px';
      if(overlay){overlay.hidden=s.phase!=='gameover';overlay.querySelector('#gameover-title').textContent=c.over;
        if(c.mode==='detailed'){overlay.querySelector('#final-score').textContent='your score is '+s.score;overlay.querySelector('#high-score').textContent='your high score is '+s.highScore;}}
    },
    setMinimum(value){if(standard)hud.style[vertical?'minWidth':'minHeight']=value+'px';},
    dispose(){host.replaceChildren();}
  };
}
