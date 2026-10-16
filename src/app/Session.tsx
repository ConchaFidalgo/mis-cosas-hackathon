import {createContext,use,useEffect,useState} from 'react';
import type {ReactNode} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '../data/supabaseClient';
const Context=createContext<{session:Session|null;ready:boolean;configured:boolean}>({session:null,ready:false,configured:false});
export const useSession=()=>use(Context);
export function SessionProvider({children}:{children:ReactNode}){
 const [session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(!supabase);
 useEffect(()=>{if(!supabase)return;let live=true,changed=false;const {data}=supabase.auth.onAuthStateChange((_event,next)=>{changed=true;if(live){setSession(next);setReady(true);}});void supabase.auth.getSession().then(({data})=>{if(live&&!changed){setSession(data.session);setReady(true);}});return()=>{live=false;data.subscription.unsubscribe();};},[]);
 return <Context value={{session,ready,configured:!!supabase}}>{children}</Context>;
}
