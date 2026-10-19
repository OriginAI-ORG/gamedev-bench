export class Slot{
 constructor(element){this.element=element;this.slotItemResource=null;this.setDataEmpty();}
 setItem(item){this.slotItemResource=item;this.element.replaceChildren();const image=document.createElement('img');image.src=item.texture;image.alt='Inventory item';const label=document.createElement('span');label.className='quantity';label.textContent=item.quantity;this.element.append(image,label);}
 setDataEmpty(){this.slotItemResource=null;this.element.innerHTML='<span class="empty">Empty</span><span class="quantity"></span>';}
}
