import {spawnSync} from 'node:child_process';
import process from 'node:process';
const env={...process.env,VITE_PRIVATE_ACCOUNT:'false',VITE_SUPABASE_URL:'',VITE_SUPABASE_PUBLISHABLE_KEY:''};
for(const args of [['node_modules/typescript/bin/tsc','-b'],['node_modules/vite/bin/vite.js','build','--configLoader','native']]){
 const result=spawnSync(process.execPath,args,{env,stdio:'inherit',windowsHide:true});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);
}
