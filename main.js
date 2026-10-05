const {app,BrowserWindow,ipcMain,session,shell,dialog}=require('electron');
const path=require('path'),fs=require('fs');
const Store=require('electron-store'); const store=new Store();
const API='https://pmukofficial.com/desktop_recorder_api.php';
let win;
function create(){win=new BrowserWindow({width:1100,height:780,minWidth:900,minHeight:650,backgroundColor:'#f7f5fb',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});win.loadFile('index.html');}
app.whenReady().then(()=>{session.defaultSession.setPermissionRequestHandler((wc,p,cb)=>cb(['media','display-capture'].includes(p)));create();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
ipcMain.handle('cfg:get',()=>({api:API,token:store.get('token',''),user:store.get('user',null)}));
ipcMain.handle('auth:save',(e,v)=>{store.set('token',v.token);store.set('user',v.user);return true});
ipcMain.handle('auth:clear',()=>{store.delete('token');store.delete('user');return true});
function spool(){const d=path.join(app.getPath('userData'),'recordings');fs.mkdirSync(d,{recursive:true});return d}
function allList(){try{return fs.readdirSync(spool()).filter(x=>x.endsWith('.json')).map(x=>{try{return JSON.parse(fs.readFileSync(path.join(spool(),x),'utf8'))}catch{return null}}).filter(Boolean).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)))}catch{return[]}}
function metaPath(id){return path.join(spool(),id+'.json')}
function saveMeta(m){fs.writeFileSync(metaPath(m.id),JSON.stringify(m,null,2));return m}
ipcMain.handle('record:save',async(e,{bytes,mime,lead,duration,answered,result,notes})=>{const id=Date.now()+'-'+Math.random().toString(16).slice(2);const ext=mime.includes('ogg')?'ogg':'webm';const audio=path.join(spool(),id+'.'+ext);fs.writeFileSync(audio,Buffer.from(bytes));return saveMeta({id,audio,mime,lead,duration,answered,result,notes,created_at:new Date().toISOString(),status:'pending',uploaded_at:null,call_id:null,last_error:null})});
ipcMain.handle('record:list',()=>allList());
ipcMain.handle('record:pending',()=>allList().filter(m=>(m.status||'pending')!=='uploaded'));
ipcMain.handle('record:read',(e,id)=>{const m=JSON.parse(fs.readFileSync(metaPath(id)));return {...m,bytes:[...fs.readFileSync(m.audio)]}});
ipcMain.handle('record:markUploaded',(e,{id,call_id})=>{const m=JSON.parse(fs.readFileSync(metaPath(id)));m.status='uploaded';m.uploaded_at=new Date().toISOString();m.call_id=call_id||null;m.last_error=null;return saveMeta(m)});
ipcMain.handle('record:markFailed',(e,{id,error})=>{const m=JSON.parse(fs.readFileSync(metaPath(id)));m.status='failed';m.last_error=String(error||'Upload failed');return saveMeta(m)});
ipcMain.handle('record:openFolder',(e,id)=>{const m=JSON.parse(fs.readFileSync(metaPath(id)));shell.showItemInFolder(m.audio);return true});
ipcMain.handle('record:saveAs',async(e,id)=>{const m=JSON.parse(fs.readFileSync(metaPath(id)));const ext=path.extname(m.audio)||'.webm';const safe=(m.lead?.full_name||'PMUK Recording').replace(/[<>:"/\\|?*]/g,'_');const out=await dialog.showSaveDialog(win,{title:'Save recording as',defaultPath:safe+' - '+new Date(m.created_at).toISOString().slice(0,19).replace(/[T:]/g,'-')+ext,filters:[{name:'Audio recording',extensions:[ext.slice(1)]}]});if(out.canceled||!out.filePath)return false;fs.copyFileSync(m.audio,out.filePath);return true});
ipcMain.handle('record:path',()=>spool());
