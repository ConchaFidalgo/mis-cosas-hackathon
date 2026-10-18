import type {Item} from './types';
import {applyItemCommand} from './rules';
import {dateValid} from './dates';
function selection(items:Item[],ids:string[]){if(!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!items.some(i=>i.id===id)))throw new Error('Selecciona objetos disponibles.');}
export function agreeDonationGroup(items:Item[],ids:string[],input:{person:string;conditions:string;due?:string},today:string,groupId:string):Item[]{
 selection(items,ids);if(!input.person.trim())throw new Error('Indica la persona o entidad.');if(input.due&&(!dateValid(input.due)||input.due<today))throw new Error('Elige una fecha desde hoy.');
 return items.map(i=>{if(!ids.includes(i.id))return i;const next=applyItemCommand(i,{type:'donateAgree',...input,person:input.person.trim()},today);next.donations.at(-1)!.id=groupId;return next;});
}
export function deliverDonationSelection(items:Item[],ids:string[],today:string):Item[]{selection(items,ids);return items.map(i=>ids.includes(i.id)?applyItemCommand(i,{type:'donateDeliver'},today):i);}
