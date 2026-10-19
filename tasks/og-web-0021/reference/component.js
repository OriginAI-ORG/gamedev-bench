export function installPoint(chest,Point,registry){
 const point=new Point('FlashlightPoint',{priority:Point.Priority.high});chest.add(point);registry.add(point);return point;
}
