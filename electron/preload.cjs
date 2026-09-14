const { contextBridge, ipcRenderer } = require('electron');
const channels = new Set(['settings:get','settings:set','profile:public','auth:token','auth:start','auth:code','auth:logout','auth:developer-panel','library:page','player:prepare','player:cancel','tools:version','tools:update','cache:clear']);
contextBridge.exposeInMainWorld('mixdesk', {
  call: async (channel, data) => {
    if (!channels.has(channel)) throw new Error('FORBIDDEN');
    const result = await ipcRenderer.invoke(channel, data);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  onProgress: callback => { const listener = (_event, value) => callback(value); ipcRenderer.on('progress', listener); return () => ipcRenderer.removeListener('progress', listener); }
});
