export class GridController{
 constructor(player){this.player=player;this.ray=player.ray;this.animationSpeed=2;this.moving=false;}
 handleInput(event){if(this.moving||!event.pressed)return;return this.move(event.direction);}
 async move(direction){if(this.moving)return false;const p=this.player,vector=p.inputs[direction];if(!vector)return false;this.ray.targetPosition=vector.map(v=>v*p.tileSize);this.ray.forceUpdate();if(this.ray.isColliding())return false;const to=p.position.map((v,i)=>v+vector[i]*p.tileSize),tween=p.createTween({to,duration:1/this.animationSpeed,transition:'sine'});p.animator.play(direction);this.moving=true;await tween.finished;this.moving=false;return true;}
}
