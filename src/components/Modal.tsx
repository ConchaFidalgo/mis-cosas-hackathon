import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return ()=>dialog?.close();},[]);
 return <dialog ref={ref} className={'modal'+(wide?' wide':'')} aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();onClose();}}>
 <header className="modal-head"><h2 id="dialog-title">{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={22}/></button></header>{children}</dialog>;
}

