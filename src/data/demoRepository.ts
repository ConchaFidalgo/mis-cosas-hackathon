import { openDB } from 'idb';
import type { AppState } from '../domain/types';
import { fixtures } from '../demo/fixtures';
const database=openDB('mis-cosas-demo-v1',1,{upgrade(db){db.createObjectStore('state');}});
export async function loadDemo():Promise<AppState>{
 const saved=await (await database).get('state','collection');
 if(saved&&saved.schemaVersion!==1)throw new Error('Estos datos necesitan una versión compatible de la aplicación.');
 const state:AppState=saved??fixtures();
 state.borrowed??=[];
 return state;
}
export async function saveDemo(state:AppState){await (await database).put('state',state,'collection');}
export async function mutateDemo(fn:(state:AppState)=>void):Promise<AppState>{
 const db=await database,transaction=db.transaction('state','readwrite');
 try{const existing=await transaction.store.get('collection');const next:AppState=structuredClone(existing??fixtures());if(next.schemaVersion!==1)throw new Error('Versión de datos no compatible.');next.borrowed??=[];fn(next);await transaction.store.put(next,'collection');await transaction.done;return next;}catch(error){transaction.abort();await transaction.done.catch(()=>{});throw error;}
}

