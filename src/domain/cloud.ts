import type {AppState,Asset} from './types';
import {validateItem,warrantyStatus} from './rules';
import {dateValid,todayMadrid} from './dates';
import {salesPlatforms} from './platforms';
export function emptyCollection():AppState {return {schemaVersion:1,items:[],borrowed:[],subscriptions:[],resolutions:[],emails:[]};}
export function validateCloudTransition(before:AppState,next:AppState){
 for(const old of before.items){const item=next.items.find(i=>i.id===old.id),active=old.loans.find(l=>!l.returned);
  if(!item){if(active)throw new Error('Registra la devolución del préstamo antes de eliminar el objeto.');continue;}
  if(old.sale&&JSON.stringify(old.sale)!==JSON.stringify(item.sale))throw new Error('No se puede reescribir una venta cerrada.');
  if(['vendido','donado','reciclado'].includes(old.status)&&item.status!==old.status)throw new Error('El objeto ya está cerrado.');
  if(active){const loan=item.loans.find(l=>l.id===active.id);if(!loan||loan.person!==active.person||loan.given!==active.given)throw new Error('Conserva el préstamo y registra su devolución.');if(item.status!==old.status)throw new Error('Registra la devolución del préstamo antes de cambiar su situación.');}
  for(const previous of old.loans.filter(l=>l.returned)){if(JSON.stringify(previous)!==JSON.stringify(item.loans.find(l=>l.id===previous.id)))throw new Error('El historial de préstamos devueltos se conserva.');}
  for(const previous of old.events){if(JSON.stringify(previous)!==JSON.stringify(item.events.find(e=>e.id===previous.id)))throw new Error('El historial del objeto se conserva.');}
 }
}
export function pruneDeletedPackageFiles(before:AppState,next:AppState){
 const current=new Set(next.items.flatMap(i=>i.assets.map(a=>a.id))),removed=new Set(before.items.flatMap(i=>i.assets.map(a=>a.id)).filter(id=>!current.has(id)));
 for(const job of next.emails){const deleted=job.assets.filter(a=>removed.has(a.id));if(deleted.length){job.assets=job.assets.filter(a=>!removed.has(a.id));job.removedAssetIds=[...new Set([...(job.removedAssetIds??[]),...deleted.map(a=>a.id)])];}}
}
function amount(n:unknown){if(n!==undefined&&(!Number.isSafeInteger(n)||Number(n)<0))throw new Error('Revisa el importe.');}
function date(s?:string){if(s&&!dateValid(s))throw new Error('Revisa la fecha.');}
function unique(rows:{id:string}[]){if(new Set(rows.map(r=>r.id)).size!==rows.length||rows.some(r=>typeof r.id!=='string'||!r.id||r.id.length>200))throw new Error('Identificadores duplicados o incorrectos.');}
export function collectionAssets(state:AppState):Asset[]{const files=new Map<string,Asset>();for(const a of [...state.items.flatMap(i=>i.assets),...state.emails.flatMap(e=>e.assets)])files.set(a.id,a);return [...files.values()];}
export function validateCloudState(state:AppState):void {
 if(state?.schemaVersion!==1||['items','borrowed','subscriptions','resolutions','emails'].some(k=>!Array.isArray(state[k as keyof AppState])))throw new Error('Colección no compatible.');
 if(state.items.length>2000||state.borrowed.length>2000||state.subscriptions.length>2000)throw new Error('La colección supera el límite de esta versión.');
 unique(state.items);unique(state.borrowed);unique(state.subscriptions);unique(state.emails);
 const ownAssets=new Set<string>();
 for(const i of state.items){
  validateItem(i);unique(i.assets);unique(i.loans);unique(i.warranties);unique(i.drafts);unique(i.publications);unique(i.donations);amount(i.purchasePrice);date(i.purchased);
  if(!['en uso','guardado','en venta','reservado','disponible para donar','donación acordada','vendido','donado','reciclado'].includes(i.status))throw new Error('Estado del objeto incorrecto.');
  const active=i.loans.filter(l=>!l.returned);if(active.length>1)throw new Error('Solo puede haber un préstamo activo.');
  if(active.length&&['vendido','donado','reciclado','reservado','donación acordada'].includes(i.status))throw new Error('Resuelve el préstamo antes de cambiar la disponibilidad.');
  if(active.length&&i.publications.some(p=>['publicada','reservada'].includes(p.status)))throw new Error('Pausa los anuncios antes de prestar el objeto.');
  for(const a of i.assets){if(ownAssets.has(a.id))throw new Error('Un archivo no puede pertenecer a dos objetos.');ownAssets.add(a.id);if(!['photo','document'].includes(a.type)||!Number.isSafeInteger(a.size)||a.size<=0)throw new Error('Archivo incorrecto.');}
  for(const w of i.warranties){warrantyStatus(w,todayMadrid());if(w.documentIds?.some(id=>!i.assets.some(a=>a.id===id&&a.type==='document')))throw new Error('La garantía referencia un documento que no pertenece al objeto.');}
  for(const l of i.loans){date(l.given);date(l.due);date(l.returned);if(!l.person.trim()||l.due&&l.due<l.given||l.returned&&l.returned<l.given)throw new Error('Revisa las fechas y la persona del préstamo.');}
  for(const p of i.publications){amount(p.price);date(p.date);if(!salesPlatforms.some(s=>s.id===p.platform))throw new Error('Plataforma no válida.');for(const o of p.offers){amount(o.amount);date(o.date);}for(const r of p.priceHistory??[]){amount(r.previous);amount(r.price);date(r.date);}}
  if(i.sale){amount(i.sale.amount);date(i.sale.date);if(i.status!=='vendido')throw new Error('La venta requiere un objeto vendido.');}
  if(i.donations.filter(d=>d.delivered).length>1)throw new Error('Solo puede haber una entrega de donación.');
 }
 for(const b of state.borrowed){date(b.received);date(b.due);date(b.returned);if(!b.name.trim()||!b.owner.trim()||b.due&&b.due<b.received)throw new Error('Revisa el objeto que te prestan.');}
 for(const s of state.subscriptions){if(!s.service.trim()||!['monthly','yearly'].includes(s.period))throw new Error('Revisa la suscripción.');amount(s.cost);amount(s.promoPrice);for(const key of ['start','trialEnd','firstCharge','renewal','cancelBy','effectiveEnd'] as const)date(s[key]);}
 for(const e of state.emails){if(e.status!=='simulated'||e.assets.some(a=>a.type!=='photo'))throw new Error('El paquete solo admite fotos seleccionadas y envío simulado.');}
}
export function sniffFile(bytes:Uint8Array):string|null {
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 if([137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b))return 'image/png';
 const head=new TextDecoder().decode(bytes.slice(0,12));
 if(head.startsWith('RIFF')&&head.slice(8,12)==='WEBP')return 'image/webp';
 if(head.startsWith('%PDF-'))return 'application/pdf';return null;
}
