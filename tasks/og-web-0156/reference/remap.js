import{RemapBase}from './remap-base.js';
export class RemapButton extends RemapBase{completed(event){this.dispatchEvent(new CustomEvent('remapped',{detail:{action:this.action,event}}));}}
