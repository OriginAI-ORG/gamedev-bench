// Keep observable work, never private reasoning events or credential values.
export function redact(text) {
  return String(text).replace(/\b(?:sk|sess)-[A-Za-z0-9_-]{16,}\b/g,'[REDACTED]')
    .replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi,'$1[REDACTED]');
}
export const TOOL_TYPES=new Set(['command_execution','file_change','mcp_tool_call','web_search','image_view','image_generation']);
export const isTransportRetry=error=>typeof error==='string'&&/^Reconnecting\.\.\. \d+\/\d+/.test(error);
export function completedGeneration(exitCode,turnCompleted,errors){return exitCode===0&&turnCompleted&&errors.length===0;}
export function observableEvent(value) {
  if(value.type?.includes('reasoning') || value.item?.type==='reasoning') return null;
  const result={type:value.type};
  if(value.thread_id)result.thread_id=value.thread_id;
  if(value.usage)result.usage=value.usage;
  if(value.error)result.error=value.error;
  if(value.message)result.message=value.message;
  if(value.item) {
    const item=value.item;
    if(!TOOL_TYPES.has(item.type) && !['agent_message','error','todo_list'].includes(item.type))return null;
    result.item=Object.fromEntries(Object.entries(item).filter(([key])=>!['reasoning','encrypted_content','reasoning_content'].includes(key)));
  }
  return JSON.parse(redact(JSON.stringify(result)));
}
