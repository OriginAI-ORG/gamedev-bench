export const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
export async function buildUI(root,config,resources){
 root.replaceChildren();root.style.width=config.size[0]+'px';root.style.height=config.size[1]+'px';
 const texture=value=>resources[value]?.src??value,load=async value=>{const image=new Image();image.src=texture(value);await image.decode();return image;};
 const margin=config.margin??0;
 if(config.frame){const frame=document.createElement('canvas');frame.id='Frame';frame.width=config.size[0]-2*margin;frame.height=config.size[1]-2*margin;frame.style.left=frame.style.top=margin+'px';root.append(frame);const img=await load(config.frame.texture),[left,top,right,bottom]=config.frame.patch,ctx=frame.getContext('2d');ctx.imageSmoothingEnabled=false;
  const xs=[0,left,img.width-right,img.width],ys=[0,top,img.height-bottom,img.height],dx=[0,left,frame.width-right,frame.width],dy=[0,top,frame.height-bottom,frame.height];
  // A zero-width middle slice samples the seam instead of leaving a hole.
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){const sw=xs[x+1]-xs[x],sh=ys[y+1]-ys[y];ctx.drawImage(img,Math.min(xs[x],img.width-1),Math.min(ys[y],img.height-1),Math.max(1,sw),Math.max(1,sh),dx[x],dy[y],dx[x+1]-dx[x],dy[y+1]-dy[y]);}
 }
 if(config.content){const content=document.createElement('div');content.id='Content';content.style.inset=margin+'px';content.style.padding=config.content.margin+'px';root.append(content);const spec=config.content.grid;
  if(spec){const grid=document.createElement('div');grid.id='Grid';content.append(grid);const image=await load(spec.texture);grid.style.backgroundImage=`url("${image.src}")`;grid.style.backgroundRepeat=spec.mode==='tile'?'repeat':'no-repeat';grid.style.backgroundSize=spec.mode==='tile'?'auto':'100% 100%';
   for(const data of spec.markers??[]){const marker=await load(data.texture);marker.id=data.name;marker.className='marker';marker.hidden=!data.visible;marker.style.left=(data.center?grid.clientWidth/2:0)+'px';marker.style.top=(data.center?grid.clientHeight/2:0)+'px';grid.append(marker);}
  }
 }
 return root;
}
