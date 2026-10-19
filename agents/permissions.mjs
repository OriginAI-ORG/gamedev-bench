import path from 'node:path';
import os from 'node:os';

export function benchmarkShell(){
  if(process.platform!=='win32')return null;
  return path.join(process.env.SYSTEMROOT||'C:\\Windows','System32','cmd.exe');
}

// Avoid Node canonicalizing denied ancestors just to load a permitted entry
// script. Native filesystem enforcement still protects every actual file read.
export const windowsNodeOptions='--preserve-symlinks --preserve-symlinks-main';
export function shellRuntimeArgs(){
  return process.platform==='win32'?['-c','shell_environment_policy.set.NODE_OPTIONS='+JSON.stringify(windowsNodeOptions),'-c','allow_login_shell=false']:[];
}

export function benchmarkPermissions(workspace,binary,shell=null){
  return {filesystem:{
    ':root':'deny',':minimal':'read',':tmpdir':'deny',':slash_tmp':'deny',
    [path.dirname(process.execPath)]:'read',[path.dirname(binary)]:'read',
    ...(shell?{[path.dirname(shell)]:'read'}:{}),
    [process.env.CODEX_HOME||path.join(os.homedir(),'.codex')]:'deny',
    [workspace]:'read',[path.join(workspace,'game')]:'write',
    [path.join(workspace,'requests')]:'write',[path.join(workspace,'temp')]:'write'
  },network:{enabled:false}};
}

function toml(value){
  if(value&&typeof value==='object')return '{'+Object.entries(value).map(([k,v])=>JSON.stringify(k)+'='+toml(v)).join(',')+'}';
  return JSON.stringify(value);
}

export function permissionArgs(workspace,binary,shell=null){
  return ['-c','permissions.benchmark='+toml(benchmarkPermissions(workspace,binary,shell)),'-c','default_permissions="benchmark"'];
}
