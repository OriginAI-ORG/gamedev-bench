import{Card}from './card.js';
export class Hand{
 constructor(element,environment){this.element=element;this.environment=environment;this.cards=[];this.connections=[];}
 addCard(title){const card=new Card(title,this.environment);this.element.append(card.element);card.homeParent=this.element;card.originalIndex=this.element.children.length-1;this.cards.push(card);const listener=event=>this.restore(event.detail);card.addEventListener('reparent-requested',listener);this.connections.push(()=>card.removeEventListener('reparent-requested',listener));card.ready();return card;}
 restore(card){if(!card.active)return;const others=[...this.element.children].filter(e=>e!==card.element),index=Math.max(0,Math.min(card.originalIndex,others.length));this.element.insertBefore(card.element,others[index]??null);card.element.style.position='relative';card.element.style.left='';card.element.style.top='';}
 dispose(){for(const remove of this.connections)remove();this.connections.length=0;for(const card of this.cards)card.machine.dispose();}
}
