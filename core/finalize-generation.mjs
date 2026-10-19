import {updateAttempt,event,SnapshotValidationError} from './attempts.mjs';

export const infrastructureGeneration=status=>['execution-unavailable','policy-blocked','agent-error','capture-error'].includes(status);

export async function finalizeGeneration(attempt,development,generation) {
  const {folder}=attempt;
  // Persist usage and the original reason before stopping/finalizing the draft.
  await updateAttempt(folder,{generation});
  await development.stop();
  const modelSubmitted=!!development.submission();
  await updateAttempt(folder,{model_submitted:modelSubmitted});
  try{await development.freezeDraft('agent-ended-without-submit');}
  catch(error){
    if(!(error instanceof SnapshotValidationError))throw error;
    const infrastructure=infrastructureGeneration(generation.status);
    const record=await updateAttempt(folder,{state:infrastructure?'interrupted':'finished',
      outcome:infrastructure?'infrastructure-error':'unsuccessful',submission_error:error.message,
      acceptance:{run_id:null,status:'invalid-submission',functional_pass:false,passed_checks:0,total_checks:0},
      finished_at:new Date().toISOString()});
    await event(folder,'submission.rejected',{message:error.message,generation_status:generation.status});
    return {record,modelSubmitted,ready:false};
  }
  await updateAttempt(folder,{state:'submitted'});
  await event(folder,'submission.frozen',{model_submitted:modelSubmitted});
  return {modelSubmitted,ready:true};
}
