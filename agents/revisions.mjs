import path from 'node:path';
import {event,snapshotGame,SnapshotValidationError} from '../core/attempts.mjs';

// Intermediate edits need not yet be valid submissions. Record the gap without
// terminating development; public test/submit still enforce the full contract.
export function createRevisionRecorder({folder,workspace}) {
  let revision=0,previous=null;
  return {
    count:()=>revision,
    async capture(itemId) {
      const relative='generation/revisions/'+String(revision+1).padStart(3,'0');
      let digest;
      try{digest=await snapshotGame(workspace,path.join(folder,relative),{previous});}
      catch(error){
        if(!(error instanceof SnapshotValidationError))throw error;
        await event(folder,'workspace.revision-skipped',{after_item:itemId,reason:error.message});
        return false;
      }
      if(!digest)return false;
      previous=digest;revision++;
      await event(folder,'workspace.revision',{revision,after_item:itemId,sha256:digest,evidence:relative});
      return true;
    }
  };
}
