const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('pmuk',{
 cfg:()=>ipcRenderer.invoke('cfg:get'),saveAuth:v=>ipcRenderer.invoke('auth:save',v),clearAuth:()=>ipcRenderer.invoke('auth:clear'),
 saveRecording:v=>ipcRenderer.invoke('record:save',v),list:()=>ipcRenderer.invoke('record:list'),pending:()=>ipcRenderer.invoke('record:pending'),read:id=>ipcRenderer.invoke('record:read',id),
 markUploaded:(id,call_id)=>ipcRenderer.invoke('record:markUploaded',{id,call_id}),markFailed:(id,error)=>ipcRenderer.invoke('record:markFailed',{id,error}),
 openFolder:id=>ipcRenderer.invoke('record:openFolder',id),saveAs:id=>ipcRenderer.invoke('record:saveAs',id),recordingPath:()=>ipcRenderer.invoke('record:path'),
 onDeepLink:cb=>ipcRenderer.on('deep-link',(e,url)=>cb(url))
});
