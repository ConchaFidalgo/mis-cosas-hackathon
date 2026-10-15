import {spawn} from 'node:child_process';
import {mkdirSync,openSync,closeSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {log} from 'node:console';
import {setTimeout as delay} from 'node:timers/promises';

const root=dirname(dirname(fileURLToPath(import.meta.url))),url='http://127.0.0.1:5173';
async function available(){
 try{
  const response=await globalThis.fetch(url,{signal:globalThis.AbortSignal.timeout(1500)}),html=await response.text();
  if(!response.ok||!html.includes('<title>Mis Cosas'))throw new Error('El puerto 5173 lo está usando otra aplicación. No se ha detenido ningún proceso.');
  return true;
 }catch(error){if(error instanceof TypeError||error.name==='TimeoutError')return false;throw error;}
}
if(!await available()){
 const logs=join(root,'.qa');mkdirSync(logs,{recursive:true});
 const output=openSync(join(logs,'demo-server.log'),'a');
 const child=spawn(process.execPath,[join(root,'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--strictPort','--configLoader','native'],{cwd:root,detached:true,windowsHide:true,stdio:['ignore',output,output]});
 child.unref();closeSync(output);writeFileSync(join(logs,'demo-server.pid'),String(child.pid));
 let ready=false;
 for(let attempt=0;attempt<20&&!ready;attempt++){await delay(250);ready=await available();}
 if(!ready)throw new Error('El servidor no ha respondido. Revisa .qa/demo-server.log.');
}
log('Mis Cosas está disponible en '+url+'/cosas. El servidor local sigue activo al cerrar este comando.');
