import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Check, Package, Plus } from 'lucide-react';
import { useStore } from '../../app/Store';
import { ActionForm } from '../../components/ActionForm';
import type { FormField } from '../../components/ActionForm';
import type { BorrowedCommand, BorrowedInput, BorrowedItem } from '../../domain/types';
import { changeBorrowed, createBorrowed } from '../../domain/borrowed';
import { dateLabel, daysBetween, todayMadrid } from '../../domain/dates';
import './borrowed.css';

type Editor = { type:'new' } | { type:'edit'|'extend'|'return'; entry:BorrowedItem };
const filters=['Pendientes','Atrasados','Sin fecha','Devueltos'] as const;
type Filter=typeof filters[number];

function fields(entry?:BorrowedItem):FormField[]{
 return [
  {key:'name',label:'Objeto',value:entry?.name,required:true},
  {key:'owner',label:'Quién me lo presta',value:entry?.owner,required:true},
  {key:'received',label:'Fecha de recepción',type:'date',value:entry?.received??todayMadrid(),required:true},
  {key:'due',label:'Devolución prevista',type:'date',value:entry?.due},
  {key:'condition',label:'Estado al recibirlo',value:entry?.condition,multiline:true},
  {key:'accessories',label:'Accesorios',value:entry?.accessories},
  {key:'notes',label:'Notas',value:entry?.notes,multiline:true},
 ];
}
function input(values:Record<string,string>):BorrowedInput{
 return {name:values.name,owner:values.owner,received:values.received,due:values.due,condition:values.condition,accessories:values.accessories,notes:values.notes};
}

export function BorrowedPage(){
 const {state,update,toast}=useStore(),[filter,setFilter]=useState<Filter>('Pendientes'),[editor,setEditor]=useState<Editor|null>(null),today=todayMadrid();
 const pending=state.borrowed.filter(e=>!e.returned),late=pending.filter(e=>e.due&&e.due<today);
 const rows=state.borrowed.filter(e=>filter==='Devueltos'?!!e.returned:filter==='Atrasados'?!e.returned&&!!e.due&&e.due<today:filter==='Sin fecha'?!e.returned&&!e.due:!e.returned);
 async function command(id:string,action:BorrowedCommand){
  await update(s=>{const index=s.borrowed.findIndex(e=>e.id===id);if(index<0)throw new Error('No se encuentra este préstamo.');s.borrowed[index]=changeBorrowed(s.borrowed[index],action,todayMadrid());});
 }
 return <>
  <header className="page-header"><div><div className="breadcrumb">Cosas que van y vuelven</div><h1>Me prestan</h1><p>Recuerda de quién es cada cosa y cuándo devolverla.</p></div><button className="button" onClick={()=>setEditor({type:'new'})}><Plus size={18}/> Añadir préstamo</button></header>
  <section className="borrowed-intro" aria-label="Resumen de objetos que me prestan">
   <div className="borrowed-intro-icon"><ArrowDownLeft size={34} strokeWidth={1.3}/></div>
   <div><h2>En tus manos, por un tiempo.</h2><p>Guarda la fecha acordada y los detalles que conviene recordar.</p></div>
   <div className="borrowed-count"><strong>{pending.length}</strong><span>por devolver{late.length?' · '+late.length+(late.length===1?' atrasado':' atrasados'):''}</span></div>
  </section>
  <div className="tabs" role="tablist" aria-label="Filtrar objetos que me prestan">{filters.map(f=><button key={f} role="tab" aria-selected={filter===f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f}</button>)}</div>
  <div className="borrowed-grid">{rows.map(entry=>{
   const overdue=!entry.returned&&!!entry.due&&entry.due<today;
   return <article className="borrowed-card" key={entry.id} id={entry.id}>
    <header><span className="borrowed-object-icon"><Package size={25} strokeWidth={1.4}/></span><span className={'status '+(entry.returned?'green':overdue?'red':'blue')}>{entry.returned?'Devuelto':overdue?'Atrasado':'En mis manos'}</span></header>
    <h2>{entry.name}</h2><p className="borrowed-owner">Me lo presta <strong>{entry.owner}</strong></p>
    <dl className="borrowed-dates"><div><dt>Recibido</dt><dd>{dateLabel(entry.received)}</dd></div><div><dt>{entry.returned?'Devuelto el':'Devolución prevista'}</dt><dd>{entry.returned||entry.due?dateLabel(entry.returned??entry.due):'Sin fecha acordada'}</dd></div></dl>
    {overdue?<p className="borrowed-late">{daysBetween(entry.due!,today)} {daysBetween(entry.due!,today)===1?'día':'días'} de retraso</p>:null}
    {entry.condition?<p className="borrowed-note"><strong>Estado al recibirlo</strong>{entry.condition}</p>:null}
    {entry.accessories?<p className="borrowed-note"><strong>Accesorios</strong>{entry.accessories}</p>:null}
    {entry.notes?<p className="borrowed-note"><strong>Notas</strong>{entry.notes}</p>:null}
    {entry.returnNotes?<p className="borrowed-note"><strong>Devolución</strong>{entry.returnNotes}</p>:null}
    {!entry.returned?<div className="borrowed-actions"><button className="button secondary small" onClick={()=>setEditor({type:'return',entry})}><Check size={16}/> Marcar como devuelto</button><button className="text-button" onClick={()=>setEditor({type:'extend',entry})}><CalendarDays size={15}/> Ampliar fecha</button><button className="text-button" onClick={()=>setEditor({type:'edit',entry})}>Editar</button></div>:null}
    <details className="borrowed-history"><summary>Historial · {entry.events.length}</summary>{entry.events.map(event=><div key={event.id}><small>{dateLabel(event.date)}</small><p>{event.title}</p></div>)}</details>
   </article>;
  })}</div>
  {!rows.length?<div className="empty"><ArrowDownLeft size={44} strokeWidth={1.2}/><h2>{filter==='Pendientes'?'Lo que te prestan, a mano.':'No hay objetos en esta vista'}</h2><p>{filter==='Pendientes'?'Anota ese libro, esa herramienta o cualquier cosa que tengas que devolver.':'Los préstamos aparecerán aquí cuando corresponda.'}</p>{filter==='Pendientes'?<button className="button secondary" onClick={()=>setEditor({type:'new'})}>Registrar el primero <ArrowUpRight size={17}/></button>:null}</div>:null}
  {editor?<ActionForm key={editor.type+('entry' in editor?editor.entry.id:'')} title={editor.type==='new'?'Añadir préstamo':editor.type==='edit'?'Editar préstamo':editor.type==='extend'?'Ampliar fecha':'Devolver '+editor.entry.name} onClose={()=>setEditor(null)}
   note={editor.type==='return'?'Confirma cuando hayas entregado el objeto a '+editor.entry.owner+'. Se guardará la fecha de hoy y se retirarán sus avisos.':editor.type==='extend'?'Guarda la nueva fecha que hayas acordado con su dueño. La anterior quedará en el historial.':'Puedes usar un nombre o alias. La fecha de devolución es opcional. El micrófono propone texto para que lo revises antes de guardar.'}
   submit={editor.type==='return'?'Confirmar devolución':'Guardar'}
   fields={editor.type==='new'?fields():editor.type==='edit'?fields(editor.entry):editor.type==='extend'?[{key:'due',label:'Nueva fecha de devolución',type:'date',value:editor.entry.due,required:true}]:[{key:'notes',label:'Notas de devolución',multiline:true}]}
   onSubmit={async values=>{
    if(editor.type==='new')await update(s=>{s.borrowed.unshift(createBorrowed(input(values),todayMadrid()));});
    else if(editor.type==='edit')await command(editor.entry.id,{type:'edit',input:input(values),previous:editor.entry});
    else if(editor.type==='extend')await command(editor.entry.id,{type:'extend',due:values.due});
    else await command(editor.entry.id,{type:'return',notes:values.notes});
    toast(editor.type==='return'?'Devolución guardada':editor.type==='extend'?'Nueva fecha guardada':'Préstamo guardado');
   }}/>:null}
 </>;
}
