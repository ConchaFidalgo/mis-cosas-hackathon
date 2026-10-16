import {it,expect} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
import {SupabaseRepository} from '../../src/data/supabaseRepository';
import {emptyCollection} from '../../src/domain/cloud';
import {blankItem} from '../../src/demo/fixtures';
it('no escribe datos de A si la sesión cambia a B durante la carga',async()=>{
 let account='A',writes=0;const state=emptyCollection();state.items=[{...blankItem(),name:'Solo A',category:'Otros'}];
 const fake={auth:{getSession:async()=>({data:{session:{user:{id:account},access_token:'token-'+account}}})},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>{account='B';return {data:{state,revision:0},error:null};}})})}),functions:{invoke:async()=>{writes++;return {data:{state,revision:1},error:null};}}} as unknown as SupabaseClient;
 await expect(new SupabaseRepository(fake,'A').mutate(s=>{s.items[0].name='Editado A';})).rejects.toThrow(/sesión/);expect(writes).toBe(0);
});
it('un fallo de enlaces tras el commit no se presenta como guardado fallido',async()=>{
 const state=emptyCollection();state.items=[{...blankItem(),name:'Objeto A',category:'Otros',assets:[{id:'f',name:'Foto',type:'photo',size:20,url:'',storagePath:'A/f/file.jpg'}]}];let links=0;
 const fake={auth:{getSession:async()=>({data:{session:{user:{id:'A'},access_token:'token-A'}}})},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{state,revision:0},error:null})})})}),storage:{from:()=>({createSignedUrls:async()=>++links===1?{data:[{path:'A/f/file.jpg',signedUrl:'https://example.invalid/preview'}],error:null}:{error:new Error('offline')}})},functions:{invoke:async(_name:unknown,options:{body:{state:unknown}})=>({data:{state:options.body.state,revision:1},error:null})}} as unknown as SupabaseClient;
 const saved=await new SupabaseRepository(fake,'A').mutate(s=>{s.items[0].name='Guardado';});expect(saved.state.items[0].name).toBe('Guardado');expect(saved.state.items[0].assets[0].url).toBe('https://example.invalid/preview');
});
it.each(['network','ambiguous'])('no repite un guardado desconocido (%s) sin recargar',async(mode)=>{
 let writes=0;const fake={auth:{getSession:async()=>({data:{session:{user:{id:'A'},access_token:'token-A'}}})},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null,error:null})})})}),functions:{invoke:async()=>{writes++;return {data:null,error:mode==='network'?new Error('network lost'):{context:{status:400,json:async()=>({unknownOutcome:true,error:'Resultado desconocido. Recarga.'})}}};}}} as unknown as SupabaseClient;
 const repository=new SupabaseRepository(fake,'A');await expect(repository.mutate(()=>{})).rejects.toThrow();await expect(repository.mutate(()=>{})).rejects.toThrow();expect(writes).toBe(1);
});
