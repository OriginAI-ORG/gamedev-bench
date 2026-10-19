export function createMenus(host,{MenuHandler,material,game,actions}){const root=document.createElement('div');root.id='menus';host.append(root);return new MenuHandler(root,game,actions);}
