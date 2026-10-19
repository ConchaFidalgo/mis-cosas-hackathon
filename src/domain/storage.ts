import type {Item} from './types';
import {dateValid,todayMadrid} from './dates';
import {activeLoan,addEvent} from './rules';
export const isInStorage=(item:Item)=>item.location.trim().toLocaleLowerCase('es')==='trastero';
export function moveStorage(item:Item,direction:'in'|'out',destination:string,date:string,expectedLocation:string):Item{
 if(!dateValid(date)||date>todayMadrid())throw new Error('Revisa la fecha del movimiento: no puede ser futura.');
 if(item.location!==expectedLocation)throw new Error('La ubicación cambió. Revisa el objeto antes de moverlo.');
 if(item.archived||activeLoan(item)||['vendido','donado','reciclado'].includes(item.status))throw new Error('Resuelve su situación antes de trasladarlo.');
 if(direction==='in'&&isInStorage(item)||direction==='out'&&!isInStorage(item))throw new Error('El objeto ya no está en la ubicación esperada.');
 const target=direction==='in'?'Trastero':destination.trim();if(!target||direction==='out'&&target.toLocaleLowerCase('es')==='trastero')throw new Error('Indica dónde vas a dejar el objeto al sacarlo.');
 const next=structuredClone(item),from=next.location||'Sin ubicación';next.location=target;if(direction==='in')next.storedOn=date;if(direction==='in'&&next.status==='en uso')next.status='guardado';
 addEvent(next,(direction==='in'?'Entrada en trastero':'Salida de trastero')+' · '+from+' → '+target,'trastero',date);return next;
}
