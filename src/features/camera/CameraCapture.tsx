import {useEffect,useRef,useState} from 'react';
import {Camera,Check,RotateCcw} from 'lucide-react';
import './camera.css';

export function CameraCapture({onAdd,onClose,addLabel='Añadir al objeto',label='Cámara del objeto',documentMode=false}:{onAdd:(file:File)=>void;onClose:()=>void;addLabel?:string;label?:string;documentMode?:boolean}){
 const panel=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null),generation=useRef(0);
 const [attempt,setAttempt]=useState(0),[stage,setStage]=useState<'starting'|'live'|'processing'|'review'|'error'>('starting'),[error,setError]=useState(''),[photo,setPhoto]=useState<File|null>(null),[preview,setPreview]=useState('');
 function stop(){stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;if(video.current)video.current.srcObject=null;}
 useEffect(()=>{
  const token=++generation.current;panel.current?.scrollIntoView({block:'nearest'});
  async function start(){
   try{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
    const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:documentMode?3200:1920},height:{ideal:documentMode?2400:1440}},audio:false});
    if(token!==generation.current){next.getTracks().forEach(track=>track.stop());return;}
    stream.current=next;
    if(video.current){video.current.muted=true;video.current.autoplay=true;video.current.srcObject=next;await video.current.play();}
   }catch(e){
    if(token!==generation.current)return;
    stop();setError(e instanceof DOMException&&['NotAllowedError','SecurityError'].includes(e.name)?'No se ha permitido la cámara. Puedes añadir fotos desde tus archivos.':e instanceof Error&&e.message==='unsupported'?'Este navegador no ofrece cámara. Puedes añadir fotos desde tus archivos.':'No se pudo abrir la cámara. Comprueba que esté disponible o añade fotos desde tus archivos.');setStage('error');
   }
  }
  void start();return()=>{generation.current++;stop();};
 },[attempt,documentMode]);
 useEffect(()=>{if(!photo)return;const url=URL.createObjectURL(photo);setPreview(url);return()=>URL.revokeObjectURL(url);},[photo]);
 function capture(){
  const element=video.current;if(!element?.videoWidth||!element.videoHeight)return;
  const token=generation.current,canvas=document.createElement('canvas'),scale=Math.min(1,(documentMode?2800:1600)/Math.max(element.videoWidth,element.videoHeight));canvas.width=Math.max(1,Math.round(element.videoWidth*scale));canvas.height=Math.max(1,Math.round(element.videoHeight*scale));
  const context=canvas.getContext('2d');if(!context){setError('No se pudo preparar la foto. Puedes repetir o añadirla desde tus archivos.');return;}
  context.drawImage(element,0,0,canvas.width,canvas.height);stop();setStage('processing');
  function encode(quality:number){canvas.toBlob(blob=>{
   if(token!==generation.current)return;
   if(!blob){setError('No se pudo preparar la foto. Puedes volver a intentarlo.');setStage('error');return;}
   // A soft size target: keep a quality floor instead of sacrificing legibility.
   if(!documentMode&&blob.size>400*1024&&quality>0.68){encode(Math.max(0.68,quality-0.07));return;}
   setPhoto(new File([blob],`foto-${Date.now()}.jpg`,{type:'image/jpeg'}));setStage('review');
  },'image/jpeg',quality);}
  encode(documentMode?0.94:0.82);
 }
 function repeat(){setPhoto(null);setPreview('');setError('');setStage('starting');setAttempt(n=>n+1);}
 return <section ref={panel} className="camera-capture" aria-label={label}>
 <h3>{stage==='review'?'Revisa la foto':'Hacer foto'}</h3>
 <p className="muted">La foto se guardará cuando confirmes el formulario.</p>
 {stage==='starting'||stage==='live'?<video ref={video} muted playsInline aria-label="Vista previa de la cámara" onLoadedData={()=>setStage('live')}/>:null}
 {stage==='starting'?<p role="status">Abriendo cámara…</p>:null}{stage==='processing'?<p role="status">Preparando foto…</p>:null}
 {stage==='review'&&preview?<img src={preview} alt="Foto para revisar"/>:null}
 {stage==='review'&&photo&&preview?<><p className="muted">{documentMode?'Documento con más detalle':'Foto optimizada'} · {Math.max(1,Math.round(photo.size/1024))} KB. {documentMode?'Comprueba que se lean bien las letras pequeñas.':'El peso depende de la imagen.'}</p><a className="text-button" href={preview} target="_blank" rel="noreferrer">Ver foto en grande</a></>:null}
 {error?<p className="error" role="alert">{error}</p>:null}
 <div className="button-row">
 {stage==='starting'||stage==='live'?<button type="button" className="button small" disabled={stage!=='live'} onClick={capture}><Camera size={17}/>Tomar foto</button>:null}
 {stage==='review'?<button type="button" className="button small" onClick={()=>{if(photo){generation.current++;stop();onAdd(photo);}}}><Check size={17}/>{addLabel}</button>:null}
 {stage==='review'||stage==='error'?<button type="button" className="button secondary small" onClick={repeat}><RotateCcw size={17}/>Repetir foto</button>:null}
 <button type="button" className="text-button" onClick={()=>{generation.current++;stop();onClose();}}>Cancelar cámara</button>
 </div></section>;
}

