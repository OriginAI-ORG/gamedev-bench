export const definition={size:[3,3],layer:16,mask:44,texture:{src:'atlas.svg',region:[12,8,3,3]},visibility:[3,3]};
export function wireContacts(projectile,world){
  const onSensor=()=>world.removeProjectile(projectile),onBody=()=>world.removeProjectile(projectile);
  projectile.addEventListener('sensorcontact',onSensor);
  projectile.addEventListener('bodycontact',onBody);
  return()=>{projectile.removeEventListener('sensorcontact',onSensor);projectile.removeEventListener('bodycontact',onBody);};
}
