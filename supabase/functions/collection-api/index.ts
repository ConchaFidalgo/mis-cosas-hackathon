// Bundled with scripts/build-cloud.mjs before deploying in the Supabase editor.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Deno resolves URL imports on the server.
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.118.0';
import {collectionAssets,validateCloudState,validateCloudTransition,pruneDeletedPackageFiles,emptyCollection,sniffFile} from '../../../src/domain/cloud';
import type {AppState,Asset} from '../../../src/domain/types';
declare const Deno:{env:{get:(key:string)=>string|undefined};serve:(handler:(req:Request)=>Promise<Response>)=>void};
const bucket='mis-cosas-private';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const answer=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return answer({error:'Método no permitido.'},405);
 let committing=false;
 try{
  const url=Deno.env.get('SUPABASE_URL')!,publicKey=Deno.env.get('SUPABASE_ANON_KEY')!,serverKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authorization=req.headers.get('Authorization')??'';
  if(!authorization.startsWith('Bearer '))return answer({error:'Inicia sesión para continuar.'},401);
  const verifier=createClient(url,publicKey,{auth:{persistSession:false}});
  const {data:identity,error:authError}=await verifier.auth.getUser(authorization.slice(7));
  if(authError||!identity.user)return answer({error:'La sesión ha caducado. Vuelve a entrar.'},401);
  const owner=identity.user.id,db=createClient(url,serverKey,{auth:{persistSession:false}});
  async function cleanup(){
   await db.from('mc_files').update({status:'deleting'}).eq('owner_id',owner).eq('status','staged').lt('created_at',new Date(Date.now()-86400000).toISOString());
   const {data:rows,error}=await db.from('mc_files').select('id,path').eq('owner_id',owner).eq('status','deleting').limit(50);
   if(error)throw error;
   let pending=false;
   for(const f of rows??[]){const {error:removeError}=await db.storage.from(bucket).remove([f.path]);if(removeError){pending=true;continue;}const {error:metadataError}=await db.from('mc_files').delete().eq('owner_id',owner).eq('id',f.id);if(metadataError)pending=true;}
   const {count,error:countError}=await db.from('mc_files').select('id',{count:'exact',head:true}).eq('owner_id',owner).eq('status','deleting');
   return pending||!!count||!!countError;
  }
  if(req.headers.get('Content-Type')?.includes('multipart/form-data')){
   const form=await req.formData(),file=form.get('file'),kind=form.get('kind');
   if(form.get('expectedOwner')!==owner)return answer({error:'La sesión ha cambiado. Vuelve a abrir tu colección.'},403);
   if(!(file instanceof File)||!['photo','document'].includes(String(kind)))return answer({error:'Archivo incorrecto.'},400);
   if(!file.size||file.size>(kind==='photo'?10:15)*1024*1024)return answer({error:'El archivo supera el tamaño permitido.'},400);
   const mime=sniffFile(new Uint8Array(await file.slice(0,12).arrayBuffer()));
   if(!mime||mime!==file.type||kind==='photo'&&mime==='application/pdf')return answer({error:'El contenido no corresponde a un PDF o imagen admitidos.'},400);
   const id=String(form.get('id')??crypto.randomUUID());if(!/^[a-zA-Z0-9_-]{1,100}$/.test(id))return answer({error:'Identificador de archivo incorrecto.'},400);
   const extension=mime==='application/pdf'?'pdf':mime==='image/jpeg'?'jpg':mime==='image/png'?'png':'webp';
   const path=`${owner}/${id}/archivo.${extension}`,name=file.name.slice(0,180)||'Archivo';
   const {data:existing,error:existingError}=await db.from('mc_files').select('*').eq('owner_id',owner).eq('id',id).maybeSingle();if(existingError)throw existingError;
   if(existing){
    if(existing.status==='deleting'||existing.size!==file.size||existing.mime!==mime||existing.kind!==kind)return answer({error:'Vuelve a seleccionar este archivo; su subida anterior está pendiente de limpieza.'},400);
    const {data:objects,error:objectError}=await db.storage.from(bucket).list(`${owner}/${id}`,{limit:2});
    if(objectError||!objects?.some((o:{name:string})=>o.name===`archivo.${extension}`))return answer({error:'La subida anterior quedó incompleta. Vuelve a seleccionar el archivo.'},400);
    return answer({asset:{id,type:existing.kind,name:existing.name,url:'',storagePath:existing.path,size:existing.size}});
   }
   const {error:registrationError}=await db.from('mc_files').insert({owner_id:owner,id,path,kind,name,mime,size:file.size});if(registrationError)throw registrationError;
   const {error:uploadError}=await db.storage.from(bucket).upload(path,file,{contentType:mime,upsert:false});
   if(uploadError){await db.from('mc_files').update({status:'deleting'}).eq('owner_id',owner).eq('id',id);await cleanup();throw uploadError;}
   return answer({asset:{id,type:kind,name,url:'',storagePath:path,size:file.size}});
  }
  const body=await req.json();
  if(body.expectedOwner!==owner)return answer({error:'La sesión ha cambiado. Vuelve a abrir tu colección.'},403);
  if(body.action==='cleanup')return answer({cleanupPending:await cleanup()});
  if(body.action!=='save'||!Number.isSafeInteger(body.revision)||body.revision<0)return answer({error:'Operación no válida.'},400);
  const {data:previous,error:previousError}=await db.from('mc_collections').select('state,revision').eq('owner_id',owner).maybeSingle();if(previousError)throw previousError;
  if((previous?.revision??0)!==body.revision)return answer({error:'La colección cambió en otra pestaña o dispositivo. Recarga y revisa antes de guardar.'},409);
  const state=body.state as AppState;validateCloudState(state);pruneDeletedPackageFiles(previous?.state??emptyCollection(),state);validateCloudTransition(previous?.state??emptyCollection(),state);
  const ids=collectionAssets(state).map(a=>a.id),files=new Map<string,{id:string;kind:string;name:string;size:number;path:string}>();
  if(ids.length){const {data:rows,error}=await db.from('mc_files').select('id,kind,name,size,path').eq('owner_id',owner).in('id',ids).in('status',['staged','active']);if(error)throw error;for(const f of rows??[])files.set(f.id,f);}
  function canonical(a:Asset):Asset{const f=files.get(a.id);if(!f||f.kind!==a.type)throw new Error('Un archivo ya no está disponible o no pertenece a tu cuenta.');return {id:f.id,type:a.type,name:f.name,size:f.size,url:'',storagePath:f.path};}
  for(const i of state.items)i.assets=i.assets.map(canonical);
  for(const e of state.emails)e.assets=e.assets.map(canonical);
  committing=true;
  const {data:revision,error}=await db.rpc('mc_save_collection',{p_owner:owner,p_revision:body.revision,p_state:state,p_files:ids});
  if(error){if(error.code==='40001')return answer({error:'La colección cambió en otra pestaña o dispositivo. Recarga y revisa antes de guardar.'},409);return answer({error:'No se pudo confirmar el guardado. Recarga la colección antes de repetir.',unknownOutcome:true},503);}
  committing=false;
  let cleanupPending=true;try{cleanupPending=await cleanup();}catch{/* Retain paths for a later retry; never claim purge succeeded. */}
  return answer({revision,state,cleanupPending});
 }catch(error){if(committing)return answer({error:'No se pudo confirmar el guardado. Recarga la colección antes de repetir.',unknownOutcome:true},503);return answer({error:error instanceof Error?error.message:'No se pudo completar la operación. Tus cambios no se han confirmado.'},400);}
});
