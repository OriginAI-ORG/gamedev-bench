import{Card}from './card.js';
export class Hand{
 constructor(element,environment){this.element=element;this.environment=environment;this.cards=[];}
 addCard(title){const card=new Card(title,this.environment);this.element.append(card.element);card.homeParent=this.element;card.originalIndex=this.element.children.length-1;this.cards.push(card);card.ready();return card;}
 restore(_card){}
 dispose(){for(const card of this.cards)card.machine.dispose();}
}
