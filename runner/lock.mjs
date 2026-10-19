import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

// Exclusive ownership prevents two local runners from overwriting a batch or
// the same QA evidence. A crash-stale lock requires checking its recorded PID.
export function acquireLock(file) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const owner={pid:process.pid,token:randomUUID(),created_at:new Date().toISOString()};
  let descriptor;
  try{descriptor=fs.openSync(file,'wx');}
  catch(error){if(error.code==='EEXIST')throw new Error('Runner lock exists: '+file+'. Check its recorded PID; remove a stale lock only after that process has stopped.');throw error;}
  try{fs.writeFileSync(descriptor,JSON.stringify(owner));}finally{fs.closeSync(descriptor);}
  let released=false;
  const release=()=>{
    if(released)return;released=true;
    try{const current=JSON.parse(fs.readFileSync(file,'utf8'));if(current.token===owner.token&&current.pid===owner.pid)fs.unlinkSync(file);}catch{}
    process.removeListener('exit',release);
  };
  process.once('exit',release);
  return release;
}
