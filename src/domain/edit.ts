import type { Item } from './types';
import { applyItemCommand } from './rules';
export function mergeItemEdit(latest:Item,edited:Item,date:string):Item{
 const i=structuredClone(latest);
 const keys=['name','category','location','description','brand','model','condition','defects','accessories','purchased','purchasePrice','seller'] as const;
 for(const key of keys)Object.assign(i,{[key]:edited[key]});
 i.assets=structuredClone(edited.assets);
 if(edited.events[0]&&!i.events.some(e=>e.id===edited.events[0].id))i.events.unshift(edited.events[0]);
 if(edited.status!==latest.status){if(edited.status==='disponible para donar')return applyItemCommand(i,{type:'donateAvailable'},date);if(['en uso','guardado','en venta'].includes(edited.status)&&!['vendido','donado','reciclado','reservado','donación acordada'].includes(latest.status))i.status=edited.status;else throw new Error('La situación cambió mientras editabas. Revisa la ficha antes de guardar.');}
 return i;
}
