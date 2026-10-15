import {it,expect} from 'vitest';
import {reviewPublicationPrice} from '../../src/domain/saleReview';
import {blankItem} from '../../src/demo/fixtures';
import type {Item} from '../../src/domain/types';
const item=():Item=>({...blankItem(),name:'Bicicleta',status:'en venta',publications:[{id:'w',platform:'wallapop',url:'https://example.com/anuncio',status:'publicada',price:7000,date:'2026-10-01',offers:[]}]});
it('conserva precio anterior, fecha y nota al revisar un anuncio',()=>{
 const before=item(),after=reviewPublicationPrice(before,'w',{price:5500,date:'2026-10-15',note:'Ya lo he cambiado en Wallapop'},'2026-10-15',{price:7000,reviews:0});
 expect(before.publications[0].price).toBe(7000);
 expect(after.publications[0]).toMatchObject({price:5500,date:'2026-10-01',priceHistory:[{previous:7000,price:5500,date:'2026-10-15',note:'Ya lo he cambiado en Wallapop'}]});
 expect(after.events[0].title).toContain('Wallapop');
});
it('rechaza importes y fechas inválidas sin modificar el anuncio',()=>{
 for(const review of [{price:0,date:'2026-10-15',note:''},{price:5000,date:'2026-02-30',note:''},{price:5000,date:'2026-10-16',note:''},{price:5000,date:'2026-09-30',note:''}])expect(()=>reviewPublicationPrice(item(),'w',review,'2026-10-15',{price:7000,reviews:0})).toThrow();
});
it('una venta cerrada o anuncio retirado no admite revisión de precio',()=>{
 const sold=item();sold.status='vendido';expect(()=>reviewPublicationPrice(sold,'w',{price:4000,date:'2026-10-15',note:''},'2026-10-15',{price:7000,reviews:0})).toThrow();
 const withdrawn=item();withdrawn.publications[0].status='retirada';expect(()=>reviewPublicationPrice(withdrawn,'w',{price:4000,date:'2026-10-15',note:''},'2026-10-15',{price:7000,reviews:0})).toThrow();
});
it('una revisión abierta no restaura el precio cambiado por otra pestaña',()=>{
 const latest=reviewPublicationPrice(item(),'w',{price:5500,date:'2026-10-15',note:''},'2026-10-15',{price:7000,reviews:0});
 expect(()=>reviewPublicationPrice(latest,'w',{price:7000,date:'2026-10-15',note:'Solo una nota'},'2026-10-15',{price:7000,reviews:0})).toThrow('otra pestaña');
});
it('programar una próxima acción no sustituye la revisión real de precio',()=>{
 const before=item();before.publications[0].lastReviewed='2026-10-15';
 const after=reviewPublicationPrice(before,'w',{price:5500,date:'2026-10-14',note:''},'2026-10-15',{price:7000,reviews:0});
 expect(after.publications[0].lastReviewed).toBe('2026-10-15');
 expect(after.publications[0].priceHistory?.at(-1)?.date).toBe('2026-10-14');
});
