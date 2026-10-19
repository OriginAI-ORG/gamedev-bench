export function mountHud(host,config,actions){
  host.textContent='Complete view.js to display the flight instruments.';
  return{
    render(state){/* TODO: render the requested HUD and overlay. */},
    setMinimum(value){/* TODO: preserve the anchored edge as the panel grows. */},
    dispose(){host.replaceChildren();}
  };
}
