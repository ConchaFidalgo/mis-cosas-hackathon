import type {SupabaseClient} from '@supabase/supabase-js';
import type {AppState,Asset} from '../domain/types';
import {collectionAssets,emptyCollection,validateCloudState} from '../domain/cloud';
const bucket='mis-cosas-private';
type Snapshot={state:AppState;revision:number;cleanupPending?:boolean;filesUnavailable?:boolean};
export class SupabaseRepository {
 private uploaded=new Map<string,Asset>();
 private uncertain=false;
 constructor(private client:SupabaseClient,private owner:string){}
 async load():Promise<Snapshot>{
  const {data,error}=await this.client.from('mc_collections').select('state,revision').eq('owner_id',this.owner).maybeSingle();if(error)throw new Error('No se pudo cargar tu colección. Comprueba la conexión.');
  return {state:await this.hydrate(data?.state??emptyCollection()),revision:data?.revision??0};
 }
 private async invoke(body:FormData|Record<string,unknown>):Promise<Snapshot&{asset?:Asset}>{
  const {data:identity}=await this.client.auth.getSession(),session=identity.session;
  if(!session||session.user.id!==this.owner)throw new Error('La sesión ha cambiado. Vuelve a abrir tu colección antes de guardar.');
  if(body instanceof FormData)body.set('expectedOwner',this.owner);else body={...body,expectedOwner:this.owner};
  const {data,error}=await this.client.functions.invoke('collection-api',{body,headers:{Authorization:'Bearer '+session.access_token}});
  if(error){if(!(body instanceof FormData)&&body.action==='save'&&(!error.context||error.context.status>=500))this.uncertain=true;let message='No se pudo confirmar el guardado. Recarga la colección para comprobarlo antes de repetir.';try{const json=await error.context?.json();if(json?.unknownOutcome)this.uncertain=true;if(typeof json?.error==='string')message=json.error;}catch{/* A network failure may have no JSON response. */}throw new Error(message);}
  if(data?.error)throw new Error(data.error);return data;
 }
 private async prepare(state:AppState){
  for(const asset of collectionAssets(state)){
   if(asset.storagePath)continue;
   if(!this.uploaded.has(asset.id)){
    // Only local data URLs and bundled demo fixtures are imported. Never fetch user URLs.
    if(!asset.url.startsWith('data:')&&!asset.url.startsWith('/demo/'))throw new Error('Vuelve a seleccionar el archivo desde tu dispositivo.');
    const response=await fetch(asset.url);if(!response.ok)throw new Error('No se pudo leer '+asset.name);
    const blob=await response.blob(),body=new FormData();body.set('id',asset.id);body.set('kind',asset.type);body.set('file',new File([blob],asset.name,{type:blob.type}));
    const result=await this.invoke(body);if(!result.asset)throw new Error('No se confirmó la subida del archivo.');this.uploaded.set(asset.id,result.asset);
   }
  }
  const canonical=(a:Asset)=>{const file=a.storagePath?a:this.uploaded.get(a.id);if(!file)throw new Error('Archivo no disponible.');return {id:file.id,name:file.name,type:file.type,size:file.size,storagePath:file.storagePath,url:''};};
  for(const i of state.items)i.assets=i.assets.map(canonical);for(const e of state.emails)e.assets=e.assets.map(canonical);
 }
 private async hydrate(source:AppState):Promise<AppState>{
  const state=structuredClone(source),files=collectionAssets(state).filter(a=>a.storagePath);
  if(files.length){const {data,error}=await this.client.storage.from(bucket).createSignedUrls(files.map(a=>a.storagePath!),300);if(error)throw new Error('No se pudieron abrir tus archivos privados.');const urls=new Map(data?.filter(r=>!r.error&&r.signedUrl).map(r=>[r.path,r.signedUrl]));const resolve=(a:Asset)=>({...a,url:a.storagePath?urls.get(a.storagePath)??'':a.url});for(const i of state.items)i.assets=i.assets.map(resolve);for(const e of state.emails)e.assets=e.assets.map(resolve);}
  return state;
 }
 async mutate(fn:(state:AppState)=>void):Promise<Snapshot>{
  if(this.uncertain)throw new Error('El guardado anterior no pudo confirmarse. Recarga la colección antes de repetir para evitar duplicados.');
  const snapshot=await this.load(),next=structuredClone(snapshot.state);fn(next);validateCloudState(next);
  const previews=new Map(collectionAssets(next).map(a=>[a.id,a.url]));await this.prepare(next);
  const saved=await this.invoke({action:'save',revision:snapshot.revision,state:next});
  // Once committed, a failed link refresh must never present the save as failed.
  try{return {...saved,state:await this.hydrate(saved.state)};}catch{const preview=(a:Asset)=>({...a,url:previews.get(a.id)??''});for(const i of saved.state.items)i.assets=i.assets.map(preview);for(const e of saved.state.emails)e.assets=e.assets.map(preview);return {...saved,filesUnavailable:true};}
 }
 async cleanup():Promise<boolean>{const result=await this.invoke({action:'cleanup'});return !!result.cleanupPending;}
}
