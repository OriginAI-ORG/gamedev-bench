const dialog=document.querySelector('#dialog');
document.querySelector('#open-dialog').onclick=()=>{dialog.hidden=false;};
document.querySelector('#close-dialog').onclick=()=>{dialog.hidden=true;};
document.querySelector('#reset').onclick=()=>{dialog.hidden=true;};
