import {createMenus}from './component.js';export function setup(host,services){return{menus:createMenus(host,services),player:null,camera:null};}
