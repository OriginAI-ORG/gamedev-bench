export function createTrapTop(root,bottom){const top=bottom.clone();top.name='TrapTop';top.position=[0,-32];top.child('Sprite').rotation=270;root.add(top);return top;}
