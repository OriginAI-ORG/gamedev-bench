export const Type=Object.freeze({WIN:0,LOSE:1});
export class BattleOverPanel{
  constructor(host,events,game,config){this.host=host;this.events=events;this.game=game;this.config=config;}
  showScreen(text,type){/* TODO: render the result, choose its action and pause gameplay. */}
  dispose(){/* TODO: detach this component and its event subscription. */}
}
