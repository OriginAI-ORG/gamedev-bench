import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {writeJson} from '../runner/common.mjs';
import {event} from '../core/attempts.mjs';
import {createRevisionRecorder} from './revisions.mjs';
import {observableEvent,redact,TOOL_TYPES,isTransportRetry,completedGeneration} from './events.mjs';
import {permissionArgs,benchmarkShell,windowsNodeOptions,shellRuntimeArgs} from './permissions.mjs';

export async function codexSettings() {
  let binary=process.env.CODEX_BIN;
  if(!binary) {
    const found=spawnSync(process.platform==='win32'?'where.exe':'which',['codex'],{encoding:'utf8',windowsHide:true});
    binary=found.stdout?.trim().split(/\r?\n/).find(p=>process.platform!=='win32'||p.endsWith('.exe'));
  }
  if(!binary && process.platform==='win32') {
    const base=path.join(process.env.LOCALAPPDATA,'OpenAI','Codex','bin');
    const candidates=[];
    for(const entry of await fs.readdir(base,{withFileTypes:true})) {
      const file=path.join(base,entry.name,'codex.exe');
      if(entry.isDirectory())try{candidates.push({file,time:(await fs.stat(file)).mtimeMs});}catch{}
    }
    binary=candidates.sort((a,b)=>b.time-a.time)[0]?.file;
  }
  if(!binary)throw new Error('Codex CLI is unavailable. Set CODEX_BIN to its executable.');
  const version=spawnSync(binary,['--version'],{encoding:'utf8',windowsHide:true});
  const login=spawnSync(binary,['login','status'],{encoding:'utf8',windowsHide:true});
  if(version.status!==0||login.status!==0)throw new Error('Codex CLI must already be installed and authenticated on this host.');
  // Read selected nonsecret preferences; never copy personal config or auth into a task.
  const code='import os,pathlib,tomllib,json; p=pathlib.Path(os.environ.get("CODEX_HOME",str(pathlib.Path.home()/".codex")))/"config.toml"; d=tomllib.loads(p.read_text(encoding="utf-8")) if p.exists() else {}; print(json.dumps({"model":d.get("model"),"model_reasoning_effort":d.get("model_reasoning_effort"),"windows_sandbox":d.get("windows",{}).get("sandbox")}))';
  const probe=spawnSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['-c',code],{encoding:'utf8',windowsHide:true});
  if(probe.status!==0)throw new Error('Cannot read selected model preferences: '+redact(probe.stderr));
  const selected=JSON.parse(probe.stdout);
  return {binary,shell:benchmarkShell(),version:version.stdout.trim(),model:process.env.BENCHMARK_MODEL||selected.model,
    effort:process.env.BENCHMARK_REASONING_EFFORT||selected.model_reasoning_effort,
    windows_sandbox:selected.windows_sandbox,
    authentication:/ChatGPT/i.test(login.stdout+login.stderr)?'existing-local-chatgpt-login':'existing-local-login'};
}

function childEnvironment() {
  const allow=new Set(['PATH','PATHEXT','SYSTEMROOT','WINDIR','COMSPEC','TEMP','TMP','TMPDIR','USERPROFILE','HOME','HOMEDRIVE','HOMEPATH','APPDATA','LOCALAPPDATA','PROGRAMDATA','PROGRAMFILES','PROGRAMFILES(X86)','CODEX_HOME','LANG','LC_ALL','SSL_CERT_FILE','SSL_CERT_DIR']);
  return Object.fromEntries(Object.entries(process.env).filter(([key])=>allow.has(key.toUpperCase())));
}

export async function runCodex(attempt,settings) {
  const {folder,workspace,record}=attempt,generated=path.join(folder,'generation');
  const disabled=['apps','plugins','remote_plugin','memories','chronicle','external_agent_memory_import',
    'browser_use','browser_use_external','browser_use_full_cdp_access','computer_use','multi_agent','multi_agent_v2',
    'enable_mcp_apps','image_generation','in_app_browser','standalone_web_search','hooks','plugin_hooks','workspace_dependencies'];
  const args=['--no-daemon','-a','never','exec','--json','--ephemeral','--ignore-user-config',
    '--skip-git-repo-check','-C',workspace,'--color','never',
    '-c','web_search="disabled"',...permissionArgs(workspace,settings.binary,settings.shell)];
  if(settings.model)args.push('-m',settings.model);
  if(settings.effort)args.push('-c','model_reasoning_effort='+JSON.stringify(settings.effort));
  args.push(...shellRuntimeArgs());
  if(process.platform==='win32'&&settings.windows_sandbox)args.push('-c','windows.sandbox='+JSON.stringify(settings.windows_sandbox));
  for(const feature of disabled)args.push('--disable',feature);
  args.push('-');
  const publicInstruction=await fs.readFile(path.join(workspace,'instruction.md'),'utf8');
  const shellInstruction=process.platform==='win32'
    ? `Windows shell contract: for EVERY shell tool call explicitly set shell to ${JSON.stringify(settings.shell)}, login to false, and workdir to ${JSON.stringify(workspace)}. Use cmd.exe syntax, not PowerShell. The default PowerShell cannot enter this strictly isolated workspace. NODE_OPTIONS is configured for sandbox-compatible script loading; keep it unchanged. Read/write UTF-8 files with Node fs (for example node -e "console.log(require('fs').readFileSync('instruction.md','utf8'))"). Use node bench.mjs test, observe, or submit directly. Temporary files belong in temp/; remove dotfiles from game/ before testing or submission.\n\n`
    : '';
  const prompt=`You are the model under test in a local game-development benchmark. Implement the task yourself in game/index.html and local assets in game/. Read instruction.md, task.json, and the public-test.mjs description. Stay inside this workspace: do not read parent directories, other attempts, references, private tests, personal configuration, or network resources. Do not spawn other agents or use remote control. Do not modify bench.mjs, public-test.mjs, instruction.md, task.json, requests/, or feedback/; the client writes requests and the host publishes feedback there.\n\nUse your normal local file and shell tools to develop the game. The host runs the browser on your behalf through these fixed task tools (PowerShell: node .\\bench.mjs test):\n- node bench.mjs test : public example, visible UI checks, errors, and screenshots. Start by testing the blank starter to see the feedback, implement the game, then test again and fix failures.\n- node bench.mjs observe : render the current game and return a screenshot; you may inspect the returned local image.\n- node bench.mjs submit : freeze your final game. You must call this when finished.\nTests run in a new browser each time. Use only these commands for browser execution; do not launch a browser directly. Public feedback is deliberately limited; implement every rule in instruction.md, not just the public example. Private acceptance happens only after your final submission and is never available for iteration.\n\nBudget: ${record.budget.wall_seconds} seconds, at most ${record.budget.max_tool_calls} observable tool calls. Use shell commands with this workspace as working directory. A test that reports ok:false is feedback for you to repair, not an infrastructure stop. End with a short description of the result. Do not report a test that you did not run.\n\nEncoding: read and write files as UTF-8 explicitly. On Windows use Get-Content -Encoding utf8 or Node fs.readFileSync(file, 'utf8'). The authoritative public task text follows (also stored in instruction.md):\n\n${publicInstruction}`;
  const effectivePrompt=shellInstruction+prompt.replace('(PowerShell: node .\\bench.mjs test)','(node bench.mjs test)').replace('On Windows use Get-Content -Encoding utf8 or Node fs.readFileSync(file, \'utf8\').','Use Node fs.readFileSync(file, \'utf8\').');
  await fs.writeFile(path.join(generated,'prompt.txt'),effectivePrompt);
  await writeJson(path.join(generated,'agent-config.json'),{adapter:'codex-cli',...settings,binary:path.basename(settings.binary),
    sandbox:'benchmark',network:false,approval:'never',ephemeral:true,ignored_user_config:true,disabled_features:disabled,
    ...(process.platform==='win32'?{shell_contract:'cmd.exe explicitly selected on every tool call',node_options:windowsNodeOptions}:{}),
    privacy:'Personal auth remains in its original location. Only selected model preferences are recorded.'});
  await event(folder,'agent.started',{adapter:'codex-cli',model:settings.model,effort:settings.effort});
  const started=Date.now(),trajectory=path.join(generated,'trajectory.jsonl');
  let queue=Promise.resolve(),buffer='',toolCalls=0,reason=null,usage=null,agentErrors=[],transportWarnings=[],turnCompleted=false,policyBlocked=false,executionUnavailable=false;
  const revisions=createRevisionRecorder(attempt);
  const counted=new Set();
  const child=spawn(settings.binary,args,{cwd:workspace,env:childEnvironment(),windowsHide:true,
    stdio:['pipe','pipe','pipe'],detached:process.platform!=='win32'});
  function stop(why) {
    if(reason)return;reason=why;
    if(!child.pid)return;
    if(process.platform==='win32')spawnSync('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
    else try{process.kill(-child.pid,'SIGTERM');}catch{}
  }
  const timer=setTimeout(()=>stop('wall-budget-exceeded'),record.budget.wall_seconds*1000);
  function enqueue(line) {
    queue=queue.then(async()=>{
      let raw;try{raw=JSON.parse(line);}catch{return;}
      const visible=observableEvent(raw);if(!visible)return;
      await fs.appendFile(trajectory,JSON.stringify({at:new Date().toISOString(),...visible})+'\n');
      const item=visible.item;
      if(item?.type==='command_execution'&&item.exit_code===-1&&/setup refresh had errors|Failed to create unified exec process/.test(item.aggregated_output||''))executionUnavailable=true;
      if(item && TOOL_TYPES.has(item.type) && !counted.has(item.id)) {
        counted.add(item.id);toolCalls++;
        console.log('Agent tool '+toolCalls+': '+item.type);
        if(toolCalls>record.budget.max_tool_calls)stop('tool-budget-exceeded');
      }
      if(visible.type==='item.completed' && TOOL_TYPES.has(item?.type)) {
        await revisions.capture(item.id);
        if(toolCalls>=record.budget.max_tool_calls)stop('tool-budget-exhausted');
      }
      if(visible.type==='turn.completed'){usage=visible.usage??null;turnCompleted=true;}
      if(visible.type==='turn.failed'||visible.type==='error'){
        const error=visible.error||visible.message||visible.type;
        if(visible.type==='error'&&isTransportRetry(error))transportWarnings.push(error);
        else agentErrors.push(error);
      }
      if(item?.type==='agent_message'&&visible.type==='item.completed')await fs.writeFile(path.join(generated,'last-message.txt'),item.text||'');
    }).catch(async error=>{agentErrors.push(String(error));stop('capture-error');});
  }
  child.stdout.setEncoding('utf8');child.stdout.on('data',chunk=>{buffer+=chunk;let newline;while((newline=buffer.indexOf('\n'))>=0){enqueue(buffer.slice(0,newline));buffer=buffer.slice(newline+1);}});
  child.stderr.setEncoding('utf8');
  child.stderr.on('data',chunk=>{
    if(chunk.includes('blocked by policy'))policyBlocked=true;
    queue=queue.then(()=>fs.appendFile(path.join(generated,'stderr.log'),redact(chunk)));
  });
  child.stdin.on('error',()=>{});child.stdin.end(effectivePrompt);
  const code=await new Promise(resolve=>{child.on('error',error=>{agentErrors.push(String(error));resolve(null);});child.on('close',resolve);});
  clearTimeout(timer);if(buffer.trim())enqueue(buffer);await queue;
  try{await revisions.capture('agent-exit');}catch(error){agentErrors.push(String(error));}
  const result={adapter:'codex-cli',model:settings.model,reasoning_effort:settings.effort,cli_version:settings.version,
    authentication:settings.authentication,exit_code:code,status:reason||(executionUnavailable?'execution-unavailable':policyBlocked?'policy-blocked':completedGeneration(code,turnCompleted,agentErrors)?'completed':'agent-error'),
    duration_ms:Date.now()-started,tool_calls:toolCalls,usage,cost:null,cost_note:'No price or subscription charge inferred from tokens.',
    errors:agentErrors,transport_warnings:transportWarnings,turn_completed:turnCompleted,trajectory:'generation/trajectory.jsonl',revisions:revisions.count()};
  await writeJson(path.join(generated,'result.json'),result);await event(folder,'agent.finished',result);return result;
}
