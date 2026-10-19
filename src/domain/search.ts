import type {Item,BorrowedItem} from './types';
import {activeLoan} from './rules';
export const searchText=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
export function itemWhere(item:Item):string{
 const loan=activeLoan(item);if(loan)return 'Prestado a '+loan.person;
 if(item.status==='donado'){const donation=[...item.donations].reverse().find(d=>d.delivered&&!d.cancelled);return donation?.person?'Donado a '+donation.person:'Donado · Fuera de tu colección';}
 if(item.status==='vendido')return 'Vendido · Fuera de tu colección';
 if(item.status==='reciclado')return 'Reciclado · Fuera de tu colección';
 return item.location||'Ubicación sin indicar';
}
export function searchCollection(items:Item[],borrowed:BorrowedItem[],query:string){
 const q=searchText(query);if(!q)return [];
 const own=items.map(i=>({id:i.id,name:i.name,where:itemWhere(i),status:(i.archived?'Archivado · ':'')+i.status,content:i.storageContents??'',photo:i.assets.find(a=>a.type==='photo')?.url,href:'/cosas/'+i.id,text:[i.name,i.category,i.brand,i.model,i.description,i.location,i.storageContents,i.storagePurpose,i.accessories,itemWhere(i)].join(' ')}));
 const others=borrowed.map(i=>({id:'borrowed-'+i.id,name:i.name,where:i.returned?'Devuelto a '+i.owner:'Me lo presta '+i.owner+' · Ubicación sin registrar',status:i.returned?'Devuelto':'Me prestan',content:i.accessories,photo:undefined,href:'/me-prestan',text:[i.name,i.owner,i.accessories,i.notes].join(' ')}));
 return [...own,...others].filter(i=>q.split(/\s+/).every(word=>searchText(i.text).includes(word)));
}
