import { createContext, use, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Item, ItemCommand } from '../domain/types';
import { loadDemo, mutateDemo } from '../data/demoRepository';
import { applyItemCommand } from '../domain/rules';
import { todayMadrid } from '../domain/dates';
import { mergeItemEdit } from '../domain/edit';
type Store={state:AppState;update:(fn:(state:AppState)=>void)=>Promise<void>;command:(id:string,c:ItemCommand)=>Promise<void>;saveItem:(item:Item)=>Promise<void>;toast:(text:string)=>void};
const Context=createContext<Store|null>(null);
export function useStore(){const c=use(Context);if(!c)throw new Error('No hay colección cargada.');return c;}
export function StoreProvider({children}:{children:ReactNode}){
 const [state,setState]=useState<AppState|null>(null),[error,setError]=useState(''),[message,setMessage]=useState('');
 const current=useRef<AppState|null>(null),queue=useRef(Promise.resolve());
 useEffect(()=>{let live=true;loadDemo().then(s=>{if(live){current.current=s;setState(s);}}).catch(()=>{if(live)setError('No se pudo abrir la colección. Comprueba que tu navegador permite guardar datos.');});return ()=>{live=false;};},[]);
 useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),5000);return ()=>clearTimeout(t);},[message]);
 function update(fn:(state:AppState)=>void){
  const job=queue.current.then(async()=>{if(!current.current)throw new Error('Espera a que se cargue la colección.');const next=await mutateDemo(fn);current.current=next;setState(next);});
  queue.current=job.catch(()=>{});return job;
 }
 if(error)return <main className="boot"><h1>No pudimos abrir tu colección</h1><p>{error}</p><button onClick={()=>location.reload()}>Volver a intentar</button></main>;
 if(!state)return <main className="boot" aria-busy="true"><img src="/favicon.svg" width="56" alt=""/><h1>Abriendo tu colección…</h1></main>;
 return <Context value={{state,update,command:(id,c)=>update(s=>{const n=s.items.findIndex(i=>i.id===id);if(n<0)throw new Error('El objeto ya no existe.');s.items[n]=applyItemCommand(s.items[n],c,todayMadrid());}),saveItem:item=>update(s=>{const n=s.items.findIndex(i=>i.id===item.id);if(n<0)s.items.unshift(item);else s.items[n]=mergeItemEdit(s.items[n],item,todayMadrid());}),toast:setMessage}}>
 {children}{message?<div className="toast" role="status">{message}</div>:null}</Context>;
}

