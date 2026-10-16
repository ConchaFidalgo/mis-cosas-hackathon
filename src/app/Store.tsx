import { createContext, use, useEffect, useRef, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Item, ItemCommand } from '../domain/types';
import { loadDemo, mutateDemo } from '../data/demoRepository';
import { applyItemCommand } from '../domain/rules';
import { todayMadrid } from '../domain/dates';
import { mergeItemEdit } from '../domain/edit';
import {pruneDeletedPackageFiles} from '../domain/cloud';
import {useSession} from './Session';
import {supabase} from '../data/supabaseClient';
import {SupabaseRepository} from '../data/supabaseRepository';
type Store={state:AppState;update:(fn:(state:AppState)=>void)=>Promise<void>;command:(id:string,c:ItemCommand)=>Promise<void>;saveItem:(item:Item,original?:Item)=>Promise<void>;toast:(text:string)=>void};
const Context=createContext<Store|null>(null);
export function useStore(){const c=use(Context);if(!c)throw new Error('No hay colección cargada.');return c;}
export function StoreProvider({children}:{children:ReactNode}){
 const {session,ready}=useSession(),owner=session?.user.id;
 const repository=useMemo(()=>owner&&supabase?new SupabaseRepository(supabase,owner):null,[owner]);
 const generation=useRef(0),activity=useRef(0);
 const [cleanupPending,setCleanupPending]=useState(false);
 const [state,setState]=useState<AppState|null>(null),[error,setError]=useState(''),[message,setMessage]=useState('');
 const current=useRef<AppState|null>(null),queue=useRef(Promise.resolve());
 useEffect(()=>{if(!ready)return;const token=++generation.current;let live=true;current.current=null;queue.current=Promise.resolve();setState(null);setError('');setMessage('');setCleanupPending(false);
 const load=async()=>repository?(await repository.load()).state:await loadDemo();
 void load().then(s=>{if(live&&token===generation.current){current.current=s;setState(s);}}).catch(()=>{if(live)setError('No se pudo abrir la colección. Comprueba la conexión y vuelve a intentarlo.');});
 // Temporary file URLs expire. Refresh them while the account is open.
 const timer=repository?setInterval(()=>{const stamp=activity.current;if(current.current)void queue.current.then(load).then(s=>{if(live&&token===generation.current&&stamp===activity.current){current.current=s;setState(s);}}).catch(()=>{});},240000):undefined;
 return()=>{live=false;generation.current++;if(timer)clearInterval(timer);};},[repository,ready]);
 useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),5000);return ()=>clearTimeout(t);},[message]);
 function update(fn:(state:AppState)=>void){
  const apply=(s:AppState)=>{const before=structuredClone(s);fn(s);pruneDeletedPackageFiles(before,s);};activity.current++;const token=generation.current;const job=queue.current.then(async()=>{if(token!==generation.current)throw new Error('La sesión ha cambiado.');if(!current.current)throw new Error('Espera a que se cargue la colección.');const result=repository?await repository.mutate(apply):null;const next=result?.state??await mutateDemo(apply);if(token!==generation.current)return;current.current=next;setState(next);if(result){setCleanupPending(!!result.cleanupPending);if(result.filesUnavailable)setMessage('Cambios guardados. No se pudieron renovar las imágenes; recarga para verlas.');}});
  queue.current=job.catch(()=>{});return job;
 }
 if(error)return <main className="boot"><h1>No pudimos abrir tu colección</h1><p>{error}</p><button onClick={()=>location.reload()}>Volver a intentar</button></main>;
 if(!state)return <main className="boot" aria-busy="true"><img src="/favicon.svg" width="56" alt=""/><h1>Abriendo tu colección…</h1></main>;
 return <Context value={{state,update,command:(id,c)=>update(s=>{const n=s.items.findIndex(i=>i.id===id);if(n<0)throw new Error('El objeto ya no existe.');s.items[n]=applyItemCommand(s.items[n],c,todayMadrid());}),saveItem:(item,original)=>update(s=>{const n=s.items.findIndex(i=>i.id===item.id);if(n<0){if(original)throw new Error('El objeto fue eliminado en otra pestaña o dispositivo. No se ha vuelto a crear.');s.items.unshift(item);}else s.items[n]=mergeItemEdit(s.items[n],item,todayMadrid(),original);}),toast:setMessage}}>
 {cleanupPending?<div className="notice" role="status">Cambios guardados. Quedan archivos pendientes de eliminación. <button className="text-button" onClick={async()=>{if(repository)try{setCleanupPending(await repository.cleanup());}catch{setMessage('No se pudo completar la limpieza. Puedes reintentar más tarde.');}}}>Reintentar limpieza</button></div>:null}{children}{message?<div className="toast" role="status">{message}</div>:null}</Context>;
}

