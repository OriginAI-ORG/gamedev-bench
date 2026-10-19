import {Card} from './card.js';
export class CardPile extends EventTarget{
 constructor(cards=[],random=Math.random){super();if(!cards.every(c=>c instanceof Card))throw new TypeError('Cards required');this.cards=[...cards];this.random=random;}
 empty(){return this.cards.length===0;}
 changed(){this.dispatchEvent(new CustomEvent('size-changed',{detail:{count:this.cards.length}}));}
 drawCard(){if(this.empty())return null;const card=this.cards.shift();this.changed();return card;}
 addCard(card){if(!(card instanceof Card))throw new TypeError('Card required');this.cards.push(card);this.changed();}
 shuffle(){for(let i=this.cards.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.cards[i],this.cards[j]]=[this.cards[j],this.cards[i]];}}
 clear(){this.cards.length=0;this.changed();}
 toString(){return this.cards.map((c,i)=>`${i+1}: ${c.id}`).join('\n');}
}
