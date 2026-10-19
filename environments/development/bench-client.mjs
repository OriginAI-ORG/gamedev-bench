// Public development interface. Requests are files; no network or unrestricted host shell.
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

const action=process.argv[2];
if(!['test','observe','submit'].includes(action)) throw new Error('Usage: node bench.mjs test|observe|submit');
const workspace=process.cwd(),requestId=randomUUID();
const inbox=path.join(workspace,'requests'),outbox=path.join(workspace,'feedback');
await fs.mkdir(inbox,{recursive:true});
const temp=path.join(inbox,requestId+'.tmp'),request=path.join(inbox,requestId+'.json');
await fs.writeFile(temp,JSON.stringify({id:requestId,action}));
await fs.rename(temp,request);
const deadline=Date.now()+60000;
while(Date.now()<deadline) {
  try {
    const feedback=JSON.parse(await fs.readFile(path.join(outbox,requestId,'result.json'),'utf8'));
    console.log(JSON.stringify(feedback,null,2));
    process.exitCode=feedback.ok?0:1;
    break;
  } catch(error) { if(error.code!=='ENOENT') throw error; }
  await new Promise(resolve=>setTimeout(resolve,100));
}
if(process.exitCode===undefined) {
  // Success also explicitly sets exitCode=0 above.
  console.error('Development service did not respond within 60 seconds.');
  process.exitCode=2;
}
