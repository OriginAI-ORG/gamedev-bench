const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export function validateBatchResume(state,{model,effort,tasks,taskVersions,harness,diagnostic=false}) {
  if(state.model!==model||state.effort!==effort||!same(state.tasks,tasks))throw new Error('Resume model, effort or task selection does not match');
  if(!same(state.task_versions,taskVersions))throw new Error('Tasks or shared verifiers changed since this batch; create a new batch instead of reusing earlier scores.');
  const changed=!same(state.harness_sha256,harness);
  if(changed&&!diagnostic)throw new Error('Harness changed since this batch; create a new batch, or explicitly use --diagnostic-continuation for non-release evidence.');
  if(changed||state.diagnostic===true||diagnostic){
    state.diagnostic=true;
    state.formal_eligible=false;
    state.classification='diagnostic-continuation';
    state.diagnostic_note='Results span runtime revisions or were explicitly designated diagnostic. Retained for inspection only; cannot be exported as the formal current-version baseline.';
  }
  return state;
}

export function pendingBatchTasks(state) {
  return state.tasks.filter(task=>!state.attempts.some(a=>a.task===task&&a.state==='finished'));
}
