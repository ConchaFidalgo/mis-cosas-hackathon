import type { Alert, BorrowedCommand, BorrowedInput, BorrowedItem } from './types';
import { dateLabel, dateValid, daysBetween, uid } from './dates';

function cleanInput(input:BorrowedInput, today:string):BorrowedInput {
 const values:BorrowedInput={name:input.name.trim(),owner:input.owner.trim(),received:input.received,due:input.due||undefined,condition:input.condition,accessories:input.accessories,notes:input.notes};
 if(!values.name||!values.owner)throw new Error('Escribe el objeto y quién te lo presta.');
 if(!dateValid(values.received)||values.received>today)throw new Error('La recepción debe ser una fecha válida de hoy o anterior.');
 if(values.due&&(!dateValid(values.due)||values.due<values.received))throw new Error('La devolución debe ser una fecha válida igual o posterior a la recepción.');
 return values;
}
const dueLabel=(date?:string)=>date?dateLabel(date):'Sin fecha acordada';
export function createBorrowed(input:BorrowedInput, today:string):BorrowedItem {
 const values=cleanInput(input,today);
 return {...values,id:uid(),events:[{id:uid(),date:today,title:'Recibido de '+values.owner+' · '+dateLabel(values.received),origin:'manual'}]};
}

export function changeBorrowed(entry:BorrowedItem, command:BorrowedCommand, today:string):BorrowedItem {
 if(entry.returned)throw new Error('Este objeto ya está devuelto. El historial se conserva.');
 let next:BorrowedItem={...entry},title='';
 if(command.type==='edit'){
  const values=cleanInput(command.input,today),previous=cleanInput(command.previous,today),patch:Partial<BorrowedInput>={};
  for(const key of Object.keys(values) as (keyof BorrowedInput)[]){
   if(values[key]===previous[key])continue;
   if(entry[key]!==previous[key]&&entry[key]!==values[key])throw new Error('Este campo cambió en otra pestaña. Recarga la página y revisa el préstamo antes de guardar.');
   Object.assign(patch,{[key]:values[key]});
  }
  next={...entry,...cleanInput({...entry,...patch},today)};
  title=entry.due===next.due?'Datos del préstamo actualizados':'Fecha de devolución cambiada: '+dueLabel(entry.due)+' → '+dueLabel(next.due);
 }else if(command.type==='extend'){
  if(!dateValid(command.due)||command.due<today||command.due<entry.received||(entry.due&&command.due<=entry.due))throw new Error('Elige una fecha posterior a la acordada, de hoy en adelante.');
  next.due=command.due;
  title='Fecha de devolución ampliada: '+dueLabel(entry.due)+' → '+dueLabel(command.due);
 }else{
  next.returned=today;next.returnNotes=command.notes.trim();
  title='Devuelto a '+entry.owner+(next.returnNotes?' · '+next.returnNotes:'');
 }
 next.events=[...entry.events,{id:uid(),date:today,title,origin:'manual'}];
 return next;
}
export function borrowedAlerts(entries:BorrowedItem[], today:string):Alert[] {
 return entries.filter(e=>!e.returned&&e.due&&daysBetween(today,e.due)<=2).map(e=>({
  id:'borrowed:'+e.id+':'+e.due+':'+(today<e.due!?'before':today===e.due?'today':'overdue'),title:'Devolver '+e.name,description:'Te lo presta '+e.owner+'. '+(e.due!<today?'La devolución está atrasada.':'Comprueba la fecha acordada.'),date:e.due!,href:'/me-prestan#'+e.id,kind:'loan'
 }));
}
