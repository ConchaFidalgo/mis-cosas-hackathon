import { useEffect, useRef, useState } from 'react';
import {voiceMoney} from '../../domain/voiceMoney';
import { dateValid } from '../../domain/dates';
import { Mic, Square, Check, X } from 'lucide-react';
interface RecognitionResult{isFinal:boolean;0:{transcript:string};}
interface RecognitionEvent{resultIndex:number;results:{length:number;[index:number]:RecognitionResult};}
interface Recognition{lang:string;continuous:boolean;interimResults:boolean;onresult:((event:RecognitionEvent)=>void)|null;onerror:((event:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void;abort:()=>void;}
interface RecognitionConstructor{new():Recognition;}
type VoiceWindow=Window&{SpeechRecognition?:RecognitionConstructor;webkitSpeechRecognition?:RecognitionConstructor;};
export function DictationField({label,value,onChange,type='text',required=false,multiline=false,placeholder='',voice=true}:{label:string;value:string;onChange:(value:string)=>void;type?:string;required?:boolean;multiline?:boolean;placeholder?:string;voice?:boolean}){
 const [stage,setStage]=useState<'idle'|'notice'|'listening'|'review'>('idle'),[proposal,setProposal]=useState(''),[previous,setPrevious]=useState(''),[error,setError]=useState('');
 const recognition=useRef<Recognition|null>(null),generation=useRef(0),spoken=useRef('');
 const isMoney=label.includes('€');
 useEffect(()=>()=>{generation.current++;recognition.current?.abort();},[]);
 function cancel(){generation.current++;recognition.current?.abort();recognition.current=null;setStage('idle');setProposal('');setError('');}
 function start(){
  const w=window as VoiceWindow,Ctor=w.SpeechRecognition??w.webkitSpeechRecognition;
  if(!Ctor){setError('Este navegador no ofrece dictado. Puedes seguir escribiendo.');setStage('idle');return;}
  const token=++generation.current;recognition.current?.abort();const r=new Ctor();recognition.current=r;r.lang='es-ES';r.continuous=isMoney;r.interimResults=true;spoken.current='';setPrevious(value);setProposal('');setError('');setStage('listening');
  r.onresult=e=>{if(token!==generation.current)return;const text=Array.from({length:e.results.length},(_,i)=>e.results[i][0].transcript).join(' ').trim();spoken.current=text;setProposal(text);if(!isMoney&&e.results[e.results.length-1].isFinal)setStage('review');};
  r.onerror=e=>{if(token!==generation.current)return;generation.current++;setError(e.error==='not-allowed'?'No se ha permitido el micrófono. El formulario se conserva.':'El dictado no ha funcionado. Puedes volver a intentarlo o escribir.');setStage('idle');};
  r.onend=()=>{if(token!==generation.current)return;if(!spoken.current.trim()){setError('No se ha reconocido ninguna palabra. Pulsa el micrófono para reintentar; espera a ver el texto antes de detener.');setStage('idle');return;}setProposal(isMoney?(voiceMoney(spoken.current)??spoken.current):spoken.current);setStage('review');};
  try{r.start();}catch{setError('No se pudo iniciar el micrófono. Puedes seguir escribiendo.');setStage('idle');}
 }
 const id=label.toLowerCase().replaceAll(' ','-');
 return <div className="field"><label htmlFor={id}>{label}{required?<span className="required"> *</span>:null}</label>
 <div className="field-control">{multiline?<textarea id={id} value={value} required={required} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>:<input id={id} type={type} value={value} required={required} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>}
 {voice&&stage==='idle'?<button type="button" className="mic-button" title={'Dictar '+label} aria-label={'Dictar '+label} onClick={()=>{setError('');setStage('notice');}}><Mic size={17}/></button>:null}</div>
 {stage==='notice'?<div className="voice-review"><p>El servicio de voz de tu navegador puede procesar el audio fuera del dispositivo. Mis Cosas no guarda audio. Utiliza datos ficticios en esta demo.</p><div className="button-row"><button type="button" className="button small" onClick={start}><Mic size={15}/> Empezar dictado</button><button type="button" className="text-button" onClick={cancel}>Cancelar</button></div></div>:null}
 {stage==='listening'?<div className="voice-review" role="status"><p className="listening"><span/> Escuchando en español…</p><p>{proposal||'Habla para proponer un cambio en este campo.'}</p>{isMoney?<p>Di «noventa euros» o «diecinueve coma noventa». Cuando aparezca el texto, pulsa Detener para revisarlo.</p>:null}<div className="button-row"><button type="button" className="button small" onClick={()=>recognition.current?.stop()}><Square size={14}/> Detener</button><button type="button" className="text-button" onClick={cancel}>Cancelar</button></div></div>:null}
 {stage==='review'?<div className="voice-review"><p><strong>Revisa el dictado</strong></p><p className="muted">Anterior: {previous||'Vacío'}</p>{isMoney?<p className="muted">He oído: {spoken.current}. Revisa el importe antes de aplicarlo.</p>:null}<textarea aria-label={'Propuesta para '+label} value={proposal} onChange={e=>setProposal(e.target.value)}/>{['date','number'].includes(type)?<p className="muted">Escribe la fecha exacta (AAAA-MM-DD) o el importe numérico antes de aplicar.</p>:null}<div className="button-row"><button type="button" className="button small" disabled={!proposal.trim()} onClick={()=>{if(type==='date'&&!dateValid(proposal)){setError('Aclara la fecha exacta antes de aplicar.');return;}let applied=proposal;if(isMoney){const normalized=voiceMoney(proposal);if(normalized===null){setError('No se entiende el importe. Revisa el texto o vuelve a dictar, por ejemplo: noventa euros o diecinueve coma noventa.');return;}applied=normalized;}onChange(applied);cancel();}}><Check size={15}/> Aplicar al campo</button><button type="button" className="text-button" onClick={cancel}><X size={15}/> Descartar</button>{isMoney?<button type="button" className="text-button" onClick={start}>Volver a dictar</button>:null}</div><p className="muted">El cambio se guardará cuando pulses Guardar.</p></div>:null}
 {error?<p className="field-error" role="alert">{error}</p>:null}</div>;
}

