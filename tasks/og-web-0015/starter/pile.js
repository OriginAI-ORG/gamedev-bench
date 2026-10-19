export class CardPile extends EventTarget{
 constructor(cards=[],random=Math.random){super();this.cards=[...cards];this.random=random;}
 empty(){return false;}
 drawCard(){return null;}
 addCard(card){}
 shuffle(){}
 clear(){}
 toString(){return '';}
}
