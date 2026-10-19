export class StatsUI{
 constructor(host){this.element=document.createElement('div');this.element.id='stats';this.element.className='stats-theme';this.element.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;gap:4px;min-width:90px;min-height:16px';
 for(const [name,gap]of[['block',0],['health',2]]){const group=document.createElement('div');group.id=name;group.style.cssText=`display:flex;align-items:center;gap:${gap}px`;const image=document.createElement('img');image.id=name+'-image';image.src=name==='health'?'heart.svg':'block.svg';image.alt=name;image.style.cssText='width:16px;height:16px;object-fit:contain';const label=document.createElement('span');label.id=name+'-label';label.textContent='0';label.style.cssText='display:flex;align-items:center;justify-content:center;text-align:center;min-width:12px;height:16px';group.append(image,label);this.element.append(group);this[name]={group,label};}host.append(this.element);}
 updateStats(stats){for(const name of['block','health']){this[name].label.textContent=stats[name];this[name].group.hidden=stats[name]===0;}}
 dispose(){this.element.remove();}
}
