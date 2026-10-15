import type { Item, Warranty, ItemCommand, DateOnly, Subscription, SaleInput, Alert, Draft } from './types';
import { addDays, daysBetween, dateValid, money, uid } from './dates';
import { salesPlatforms, platformName } from './platforms';
export { platformName } from './platforms';
export function warrantyStatus(w:Warranty,today:DateOnly):string {
  if(w.start&&!dateValid(w.start)||w.end&&!dateValid(w.end))throw new Error('Revisa las fechas de la garantía.');
  if(w.start&&w.end&&w.end<w.start)throw new Error('El vencimiento no puede ser anterior al inicio.');
  if(!w.confirmed||!w.end)return 'sin fecha confirmada';
  if(w.start&&today<w.start)return 'pendiente de inicio';
  const d=daysBetween(today,w.end);
  return d<0?'vencida':d===0?'vence hoy':d<=30?'próxima a vencer':'vigente';
}
export function nextRenewal(anchor:DateOnly,period:'monthly'|'yearly',after:DateOnly):DateOnly {
  if(!dateValid(anchor)||!dateValid(after))throw new Error('Revisa la fecha de renovación.');
  const [y,m,d]=anchor.split('-').map(Number);
  for(let n=0;n<12000;n++){
    const next=new Date(Date.UTC(y,m-1+n*(period==='yearly'?12:1),1));
    const last=new Date(Date.UTC(next.getUTCFullYear(),next.getUTCMonth()+1,0)).getUTCDate();
    next.setUTCDate(Math.min(d,last));
    const value=next.toISOString().slice(0,10);
    if(value>after)return value;
  }
  throw new Error('No se pudo calcular la renovación.');
}
export const activeLoan=(i:Item)=>i.loans.find(l=>!l.returned);
export function validateItem(i:Item):void {
  if(!i.name.trim()||!i.category.trim())throw new Error('Añade nombre y categoría.');
  if(i.assets.filter(a=>a.type==='photo').length>8)throw new Error('Puedes guardar hasta 8 fotos por objeto.');
  for(const a of i.assets)if(a.size>(a.type==='photo'?10:15)*1024*1024)throw new Error('El archivo supera el tamaño permitido.');
}
export function addEvent(i:Item,title:string,origin:string,date:string){i.events.unshift({id:uid(),date,title,origin});}
export function applyItemCommand(input:Item,c:ItemCommand,date:DateOnly):Item {
  const i=structuredClone(input),loan=activeLoan(i),unavailable=['vendido','donado','reciclado'].includes(i.status);
  switch(c.type){
    case 'lend':
      if(loan)throw new Error('Este objeto ya está prestado.');
      if(unavailable||['reservado','donación acordada'].includes(i.status))throw new Error('Resuelve su situación antes de prestar.');
      if(i.publications.some(p=>['publicada','reservada'].includes(p.status)))throw new Error('Confirma la pausa o retirada de sus anuncios antes de prestar.');
      if(!c.person.trim())throw new Error('Añade la persona o alias.');
      if(c.due&&(!dateValid(c.due)||c.due<date))throw new Error('La devolución debe ser posterior o igual a la entrega.');
      i.loans.push({id:uid(),person:c.person.trim(),given:date,due:c.due,accessories:c.accessories??i.accessories,previousDates:[],reviewDate:c.reviewDate});
      addEvent(i,'Prestado a '+c.person,'préstamo',date);break;
    case 'extend':
      if(!loan)throw new Error('No hay préstamo activo.');
      if(!dateValid(c.due)||c.due<date)throw new Error('Elige una fecha válida desde hoy.');
      if(loan.due)loan.previousDates.push(loan.due);loan.due=c.due;addEvent(i,'Devolución ampliada a '+c.due,'préstamo',date);break;
    case 'return':
      if(!loan)throw new Error('No hay préstamo activo.');
      loan.returned=date;loan.returnNotes=c.accessories;addEvent(i,'Devolución registrada'+(c.accessories?' · '+c.accessories:''),'préstamo',date);break;
    case 'donateAvailable':
    case 'donateAgree':
      if(loan||unavailable||['reservado','donación acordada'].includes(i.status))throw new Error('Resuelve el préstamo o la reserva antes de acordar una donación.');
      i.status=c.type==='donateAvailable'?'disponible para donar':'donación acordada';
      i.publications.forEach(p=>{if(['publicada','reservada','pausada'].includes(p.status))p.removalPending=true;});
      if(c.type==='donateAgree')i.donations.push({id:uid(),person:c.person,due:c.due,conditions:c.conditions??'',text:i.donationDraft?.text??buildDonationText(i,c.conditions??''),photoIds:c.photoIds??i.donationDraft?.photoIds??i.assets.filter(a=>a.type==='photo').map(a=>a.id)});
      addEvent(i,c.type==='donateAgree'?'Donación acordada'+(c.person?' con '+c.person:''):'Disponible para donar','donación',date);break;
    case 'donateDeliver': {
      if(loan||unavailable||i.status!=='donación acordada')throw new Error('Hace falta un acuerdo de donación activo.');
      const d=i.donations.find(d=>!d.delivered&&!d.cancelled);if(!d)throw new Error('No hay acuerdo activo.');
      d.delivered=date;i.status='donado';addEvent(i,'Entrega de donación confirmada','donación',date);break;
    }
    case 'donateCancel': {
      const d=i.donations.find(d=>!d.delivered&&!d.cancelled);if(!d)throw new Error('No hay acuerdo activo.');
      d.cancelled=true;i.status='disponible para donar';addEvent(i,'Acuerdo de donación cancelado','donación',date);break;
    }
    case 'reserve':
      if(loan||unavailable||['reservado','donación acordada'].includes(i.status))throw new Error('El objeto no se puede reservar ahora.');
      i.status='reservado';addEvent(i,'Reserva registrada','venta',date);break;
    case 'unreserve':
      if(i.status!=='reservado')throw new Error('No hay reserva.');
      i.status='en venta';addEvent(i,'Reserva cancelada','venta',date);break;
    case 'sell':
      if(loan)throw new Error('Registra la devolución antes de vender.');
      if(unavailable||i.sale||i.status==='donación acordada')throw new Error('Este objeto no puede venderse de nuevo.');
      if(!Number.isInteger(c.amount)||c.amount<=0)throw new Error('Revisa el importe real de venta.');
      i.sale={amount:c.amount,platform:c.platform,date};i.status='vendido';
      i.publications.forEach(p=>{if(p.platform===c.platform&&p.status==='publicada')p.status='vendida';else if(['publicada','pausada','reservada'].includes(p.status))p.removalPending=true;});
      addEvent(i,'Venta cerrada · '+money(c.amount),'venta',date);break;
    case 'deleteWarranty': {
      const w=i.warranties.find(w=>w.id===c.id);if(!w)throw new Error('La garantía ya no existe.');
      if(c.deleteDocuments){i.assets=i.assets.filter(a=>!(w.documentIds??[]).includes(a.id));i.warranties.forEach(other=>{if(other.id!==w.id)other.documentIds=other.documentIds?.filter(id=>!(w.documentIds??[]).includes(id));});}
      i.warranties=i.warranties.filter(w=>w.id!==c.id);addEvent(i,'Garantía eliminada · documentos '+(c.deleteDocuments?'seleccionados eliminados':'conservados'),'limpieza',date);break;
    }
    case 'deleteAsset':
      if(i.drafts.some(d=>d.photoIds.includes(c.id)))throw new Error('Esta foto está en un borrador. Actualiza o elimina el borrador antes de quitarla.');
      i.assets=i.assets.filter(a=>a.id!==c.id);i.warranties.forEach(w=>w.documentIds=w.documentIds?.filter(id=>id!==c.id));
      addEvent(i,'Archivo eliminado','limpieza',date);break;
    case 'archive':i.archived=c.value;addEvent(i,c.value?'Objeto archivado':'Objeto recuperado','archivo',date);break;
    case 'care':if(!c.note.trim())throw new Error('Añade una nota.');addEvent(i,c.note,'cuidado',date);break;
  }
  return i;
}
export function buildDonationText(i:Item,conditions:string){return [i.name,i.description,'Estado: '+i.condition,i.defects?'Defectos: '+i.defects:'',i.accessories?'Accesorios: '+i.accessories:'',conditions?'Recogida: '+conditions:''].filter(Boolean).join('\n\n');}
export function prepareListings(i:Item,s:SaleInput):Draft[]{
  if(!Number.isInteger(s.price)||s.price<=0)throw new Error('Indica un precio de venta válido.');
  if(s.photoIds.some(id=>!i.assets.some(a=>a.id===id&&a.type==='photo')))throw new Error('Una foto seleccionada ya no existe.');
  const description=[i.description,i.brand?'Marca: '+i.brand:'',i.model?'Modelo: '+i.model:'','Estado: '+i.condition,i.defects?'Defectos: '+i.defects:'',i.accessories?'Accesorios: '+i.accessories:'','Precio: '+money(s.price)+(s.negotiable?' · Negociable':''),s.delivery,s.locality?'Localidad: '+s.locality:''].filter(Boolean).join('\n\n');
  return salesPlatforms.map(({id:platform})=>({id:uid(),platform,title:i.name,description,price:s.price,photoIds:[...s.photoIds],version:Math.max(0,...i.drafts.filter(d=>d.platform===platform).map(d=>d.version))+1,approved:false}));
}
export function subscriptionSummary(subs:Subscription[]){
  let monthly=0,incomplete=0;
  for(const s of subs){if(!['activa','cancelación solicitada','prueba gratuita'].includes(s.status))continue;if(s.cost===undefined){incomplete++;continue;}if(s.status==='prueba gratuita'||s.status==='cancelación solicitada'&&s.phaseBeforeCancellation==='prueba gratuita')continue;monthly+=s.period==='yearly'?s.cost/12:s.cost;}
  return {monthly:Math.round(monthly),annual:Math.round(monthly*12),incomplete};
}
export function deriveAlerts(items:Item[],subs:Subscription[],today:DateOnly):Alert[]{
  const alerts:Alert[]=[];
  for(const i of items){
    for(const w of i.warranties)if(w.confirmed&&w.end&&['próxima a vencer','vence hoy'].includes(warrantyStatus(w,today)))alerts.push({id:'w:'+w.id+':'+w.end,title:i.name+' · Garantía',description:'Vencimiento '+w.end,date:w.end,href:'/cosas/'+i.id,kind:'warranty'});
    for(const l of i.loans.filter(l=>!l.returned)){const date=l.due??l.reviewDate;if(date&&daysBetween(today,date)<=2)alerts.push({id:'l:'+l.id+':'+date,title:i.name+' · '+l.person,description:l.due?(date<today?'Devolución atrasada':'Devolución prevista'):'Revisar préstamo sin fecha acordada',date,href:'/cosas/'+i.id,kind:'loan'});}
    for(const p of i.publications.filter(p=>p.removalPending))alerts.push({id:'p:'+p.id,title:'Retirar anuncio · '+i.name,description:platformName(p.platform)+' · pendiente de confirmación manual',date:today,href:'/cosas/'+i.id,kind:'sale'});
  }
  for(const s of subs){
    if(['cancelada','finalizada'].includes(s.status))continue;
    const dates:Record<string,string[]>={};
    const add=(date:string|undefined,reason:string)=>{if(date&&daysBetween(today,date)<=7)(dates[date]??=[]).push(reason);};
    if(s.status==='prueba gratuita'||s.status==='cancelación solicitada'&&s.phaseBeforeCancellation==='prueba gratuita')add(s.trialEnd,'Fin de prueba gratuita');add(s.cancelBy,'Límite de cancelación');
    if(s.renewal){const d=s.renewal<today?nextRenewal(s.renewal,s.period,addDays(today,-1)):s.renewal;add(d,'Renovación prevista');}
    for(const [date,reasons]of Object.entries(dates))alerts.push({id:'s:'+s.id+':'+date,title:s.service,description:reasons.join(' · '),date,href:'/suscripciones',kind:'subscription'});
  }
  return alerts.sort((a,b)=>a.date.localeCompare(b.date));
}

