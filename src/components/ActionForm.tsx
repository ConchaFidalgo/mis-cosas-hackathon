import { useState } from 'react';
import { Modal } from './Modal';
import { DictationField } from '../features/voice/DictationField';
export interface FormField{key:string;label:string;value?:string;type?:string;required?:boolean;multiline?:boolean;options?:{value:string;label:string}[];}
export function ActionForm({title,fields,onSubmit,onClose,submit='Guardar',note}:{title:string;fields:FormField[];onSubmit:(values:Record<string,string>)=>Promise<void>|void;onClose:()=>void;submit?:string;note?:string}){
 const [values,setValues]=useState<Record<string,string>>(()=>Object.fromEntries(fields.map(f=>[f.key,f.value??'']))),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);try{await onSubmit(values);onClose();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <Modal title={title} onClose={onClose}><form className="form" onSubmit={save}>{note?<p className="muted">{note}</p>:null}{fields.map(f=>f.options?<div className="field" key={f.key}><label htmlFor={f.key}>{f.label}</label><select id={f.key} value={values[f.key]} required={f.required} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))}>{f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>:<DictationField key={f.key} label={f.label} value={values[f.key]} type={f.type} required={f.required} multiline={f.multiline} onChange={value=>setValues(v=>({...v,[f.key]:value}))}/>)}{error?<p className="error" role="alert">{error}</p>:null}<footer className="modal-footer"><button type="button" className="button secondary" onClick={onClose}>Cancelar</button><button className="button" disabled={busy}>{busy?'Guardando…':submit}</button></footer></form></Modal>;
}
export function ConfirmDialog({title,description,onConfirm,onClose,children}:{title:string;description:string;onConfirm:()=>Promise<void>;onClose:()=>void;children?:React.ReactNode}){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 return <Modal title={title} onClose={onClose}><div className="form"><p>{description}</p>{children}{error?<p className="error" role="alert">{error}</p>:null}<footer className="modal-footer"><button className="button secondary" onClick={onClose}>Cancelar</button><button className="button danger" disabled={busy} onClick={async()=>{setBusy(true);try{await onConfirm();onClose();}catch(e){setError((e as Error).message);setBusy(false);}}}>{busy?'Guardando…':'Confirmar'}</button></footer></div></Modal>;
}

