export function configureWorld({player,objects,minimap}){
 minimap.player=player;const bindings=[];
 for(const object of objects){object.minimapIcon=object.kind==='mob'?'mob':'alert';object.groups.add('minimap_objects');
  object.remove=()=>{if(!object.active)return;object.dispatchEvent(new CustomEvent('removed',{detail:object}));object.active=false;};
  const listener=event=>minimap.removeObject(event.detail);object.addEventListener('removed',listener);bindings.push([object,listener]);
 }
 return()=>{for(const[object,listener]of bindings)object.removeEventListener('removed',listener);};
}
