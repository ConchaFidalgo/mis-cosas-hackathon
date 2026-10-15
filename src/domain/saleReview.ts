import type {Item} from './types';
import {dateValid,money,uid} from './dates';
import {platformName} from './platforms';
export interface PriceReview{price:number;date:string;note:string;}
export function reviewPublicationPrice(item:Item,publicationId:string,review:PriceReview,today:string,expected:{price:number;reviews:number}):Item{
 const next=structuredClone(item),publication=next.publications.find(p=>p.id===publicationId);
 if(!publication)throw new Error('El anuncio ya no existe.');
 if(next.sale||['vendido','donado','reciclado','donación acordada'].includes(next.status)||!['publicada','pausada','reservada'].includes(publication.status))throw new Error('Este anuncio ya no admite una revisión de precio.');
 if(publication.price!==expected.price||(publication.priceHistory?.length??0)!==expected.reviews)throw new Error('El precio cambió en otra pestaña. Recarga y revisa el anuncio antes de guardar.');
 if(!Number.isSafeInteger(review.price)||review.price<=0)throw new Error('Escribe un precio mayor que cero.');
 const lastPriceReview=publication.priceHistory?.at(-1)?.date;
 if(!dateValid(review.date)||review.date>today||review.date<publication.date||lastPriceReview&&review.date<lastPriceReview)throw new Error('La revisión debe tener una fecha válida desde la publicación y última revisión de precio hasta hoy.');
 const previous=publication.price;
 publication.price=review.price;
 (publication.priceHistory??=[]).push({previous,price:review.price,date:review.date,note:review.note.trim()});
 next.events.unshift({id:uid(),date:review.date,title:'Precio revisado · '+platformName(publication.platform)+' · '+money(previous)+' → '+money(review.price),origin:'precio manual'});
 return next;
}
