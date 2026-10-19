import {testCube} from './component.js';import {createRenderer} from './renderer.js';
const $=id=>document.getElementById(id),canvas=$('scene'),renderer=createRenderer(canvas);let item,angle,light,hovered=false;
function draw(){renderer.draw(item.body,angle,light);$('status').textContent=item.body.highlight.visible?'Focused':'Unfocused';}
function updateFocus(){if(hovered||document.activeElement===canvas)item.interaction.gainFocus();else item.interaction.loseFocus();draw();}
function reset(){item=testCube.itemModel();angle=[.55,-.3];light=.8;hovered=false;canvas.blur();$('metadata').textContent=testCube.itemName;$('contact').textContent='No probe';draw();}
canvas.onpointermove=e=>{const b=canvas.getBoundingClientRect();hovered=renderer.hit(item.body,(e.clientX-b.x)*800/b.width,(e.clientY-b.y)*400/b.height,angle);updateFocus();};canvas.onpointerleave=()=>{hovered=false;updateFocus();};canvas.onfocus=updateFocus;canvas.onblur=updateFocus;
$('rotate').onclick=()=>{angle[0]+=.5;draw();};$('light').onclick=()=>{light=light===.8?.1:.8;draw();};$('probe').onclick=()=>{$('contact').textContent=renderer.hit(item.body,400,200,angle,Number($('category').value))?'Contact':'Filtered';};$('reset').onclick=reset;reset();
