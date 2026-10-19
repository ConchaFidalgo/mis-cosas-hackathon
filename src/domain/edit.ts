import type { Item } from './types';
import { applyItemCommand } from './rules';
export function mergeItemEdit(latest:Item,edited:Item,date:string,original?:Item):Item{
 const i=structuredClone(latest);
 const keys=['name','category','location','description','brand','model','condition','defects','accessories','purchased','purchasePrice','seller','storagePurpose','storageContents','storedOn'] as const;
 for(const key of keys){if(original&&edited[key]===original[key])continue;if(original&&latest[key]!==original[key]&&latest[key]!==edited[key])throw new Error('Este campo cambió en otro dispositivo. Recarga y revisa antes de guardar.');Object.assign(i,{[key]:edited[key]});}
 const assetKey=(v:Item)=>JSON.stringify(v.assets.map(a=>({id:a.id,name:a.name,type:a.type,size:a.size,storagePath:a.storagePath})));
 if(!original||assetKey(edited)!==assetKey(original)){if(original&&assetKey(latest)!==assetKey(original)&&assetKey(latest)!==assetKey(edited))throw new Error('Los archivos cambiaron en otro dispositivo. Recarga y revisa antes de guardar.');i.assets=structuredClone(edited.assets);}
 if(edited.events[0]&&!i.events.some(e=>e.id===edited.events[0].id))i.events.unshift(edited.events[0]);
 if((!original||edited.status!==original.status)&&edited.status!==latest.status){if(original&&latest.status!==original.status)throw new Error('La situación cambió mientras editabas. Revisa la ficha antes de guardar.');if(edited.status==='disponible para donar')return applyItemCommand(i,{type:'donateAvailable'},date);if(['en uso','guardado','en venta'].includes(edited.status)&&!['vendido','donado','reciclado','reservado','donación acordada'].includes(latest.status))i.status=edited.status;else throw new Error('La situación cambió mientras editabas. Revisa la ficha antes de guardar.');}
 return i;
}
