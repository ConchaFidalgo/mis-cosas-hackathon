import type {Item,BorrowedItem,Subscription} from './types';
import {activeLoan} from './rules';
export const searchText=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
export function itemWhere(item:Item):string{
 const loan=activeLoan(item);if(loan)return 'Prestado a '+loan.person;
 if(item.status==='donado'){const donation=[...item.donations].reverse().find(d=>d.delivered&&!d.cancelled);return donation?.person?'Donado a '+donation.person:'Donado · Fuera de tu colección';}
 if(item.status==='vendido')return 'Vendido · Fuera de tu colección';
 if(item.status==='reciclado')return 'Reciclado · Fuera de tu colección';
 return item.location||'Ubicación sin indicar';
}
export function searchCollection(items:Item[],borrowed:BorrowedItem[],query:string,subscriptions:Subscription[]=[]){
 const q=searchText(query);if(!q)return [];
 const own=items.map(i=>({id:i.id,name:i.name,where:itemWhere(i),status:(i.archived?'Archivado · ':'')+i.status,content:i.storageContents??'',photo:i.assets.find(a=>a.type==='photo')?.url,href:'/cosas/'+i.id,text:[i.name,i.category,i.brand,i.model,i.description,i.location,i.storageContents,i.storagePurpose,i.accessories,itemWhere(i)].join(' ')}));
 const others=borrowed.map(i=>({id:'borrowed-'+i.id,name:i.name,where:i.returned?'Devuelto a '+i.owner:'Me lo presta '+i.owner+' · Ubicación sin registrar',status:i.returned?'Devuelto':'Me prestan',content:i.accessories,photo:undefined,href:'/me-prestan',text:[i.name,i.owner,i.accessories,i.notes].join(' ')}));
 const files=items.flatMap(i=>i.assets.filter(a=>a.type==='document').map(a=>({id:'document-'+i.id+'-'+a.id,name:a.name,where:'Documento de '+i.name+' · '+itemWhere(i),status:'Documento'+(i.archived?' · Objeto archivado':''),content:'',photo:undefined,href:'/cosas/'+i.id,text:[a.name,i.name,'documento'].join(' ')})));
 const services=subscriptions.map(s=>({id:'subscription-'+s.id,name:s.service,where:s.company||'Compañía sin indicar',status:'Suscripción · '+s.status,content:s.notes??'',photo:undefined,href:'/suscripciones#subscription-'+s.id,text:[s.service,s.company,s.category,s.notes,'suscripción',s.status].join(' ')}));
 return [...own,...others,...files,...services].filter(i=>q.split(/\s+/).every(word=>searchText(i.text).includes(word)));
}
