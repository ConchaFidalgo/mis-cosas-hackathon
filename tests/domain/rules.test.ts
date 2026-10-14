import { describe, it, expect } from 'vitest';
import { warrantyStatus, nextRenewal, validateItem, applyItemCommand, prepareListings, deriveAlerts, subscriptionSummary } from '../../src/domain/rules';
import type { Item } from '../../src/domain/types';

describe('regresiones de revisión',()=>{
 it('una cancelación solicitada conserva el coste cero de una prueba',()=>expect(subscriptionSummary([{id:'trial',service:'Demo',company:'Demo',status:'cancelación solicitada',phaseBeforeCancellation:'prueba gratuita',trialEnd:'2026-10-20',cost:499,period:'monthly',events:[]}])).toMatchObject({monthly:0}));
 it('mantiene aviso de fin de prueba con cancelación aún solicitada',()=>{const alerts=deriveAlerts([],[{id:'trial',service:'Demo',company:'Demo',status:'cancelación solicitada',phaseBeforeCancellation:'prueba gratuita',trialEnd:'2026-10-20',cost:499,period:'monthly',events:[]}],'2026-10-14');expect(alerts).toHaveLength(1);expect(alerts[0].description).toContain('prueba');});
});

const item = (): Item => ({id:'one',name:'Taladro',category:'Herramientas',status:'en uso',location:'Garaje',description:'',brand:'',model:'',condition:'Usado',defects:'Falta una broca',accessories:'Cargador',archived:false,assets:[],warranties:[],loans:[],donations:[],drafts:[],publications:[],events:[]});
describe('garantías',()=>{
it('vence hoy hasta final del día Madrid',()=>expect(warrantyStatus({id:'w',provider:'Tienda',start:'2025-01-01',end:'2026-10-14',confirmed:true},'2026-10-14')).toBe('vence hoy'));
it('no inventa vigencia sin fecha confirmada',()=>expect(warrantyStatus({id:'w',provider:'',end:'2027-01-01',confirmed:false},'2026-10-14')).toBe('sin fecha confirmada'));
it('rechaza vencimiento anterior al inicio',()=>expect(()=>warrantyStatus({id:'w',provider:'',start:'2026-10-15',end:'2026-10-14',confirmed:true},'2026-10-14')).toThrow());
});
describe('objetos y transiciones',()=>{
it('exige nombre y categoría',()=>expect(()=>validateItem({...item(),name:''})).toThrow());
it('solo permite un préstamo activo',()=>{const v=applyItemCommand(item(),{type:'lend',person:'Alex',due:'2026-10-20'},'2026-10-14');expect(()=>applyItemCommand(v,{type:'lend',person:'Ana'},'2026-10-14')).toThrow();});
it('bloquea cierre mientras prestado',()=>{const v=applyItemCommand(item(),{type:'lend',person:'Alex'},'2026-10-14');expect(()=>applyItemCommand(v,{type:'sell',amount:4000,platform:'ebay'},'2026-10-14')).toThrow();});
it('devuelve con incidencia sin mantener prestado',()=>{const v=applyItemCommand(item(),{type:'lend',person:'Alex'},'2026-10-14');const back=applyItemCommand(v,{type:'return',accessories:'Falta cargador'},'2026-10-15');expect(back.loans[0].returned).toBe('2026-10-15');});
it('acuerdo no equivale a entrega y donación no suma ingresos',()=>{const v=applyItemCommand(item(),{type:'donateAgree',person:'Asociación ficticia',due:'2026-10-20'},'2026-10-14');expect(v.status).toBe('donación acordada');const done=applyItemCommand(v,{type:'donateDeliver'},'2026-10-20');expect(done.status).toBe('donado');expect(done.sale).toBeUndefined();expect(()=>applyItemCommand(done,{type:'donateDeliver'},'2026-10-20')).toThrow();});
it('quitar garantía conserva archivos y ficha',()=>{const v=item();v.assets=[{id:'a',name:'Factura ficticia',type:'document',url:'/demo.pdf',size:1}];v.warranties=[{id:'w',provider:'',confirmed:true,end:'2026-10-14',documentIds:['a']}];const clean=applyItemCommand(v,{type:'deleteWarranty',id:'w',deleteDocuments:false},'2026-10-14');expect(clean.assets).toHaveLength(1);expect(clean.warranties).toHaveLength(0);expect(clean.id).toBe('one');});
it('impide eliminar foto usada en borrador',()=>{const v=item();v.assets=[{id:'p',name:'Foto',type:'photo',url:'/photo.jpg',size:1}];v.drafts=prepareListings(v,{price:4000,photoIds:['p'],delivery:'Recogida',negotiable:false});expect(()=>applyItemCommand(v,{type:'deleteAsset',id:'p'},'2026-10-14')).toThrow();});
it('conserva defectos y precio en ambas variantes independientes',()=>{const drafts=prepareListings(item(),{price:4000,photoIds:[],delivery:'Recogida',negotiable:false});expect(drafts).toHaveLength(2);for(const d of drafts){expect(d.description).toContain('Falta una broca');expect(d.price).toBe(4000);}drafts[0].description='Cambio';expect(drafts[1].description).toContain('Falta una broca');});
it('cuenta una sola venta y solicita retirar otra publicación',()=>{const v=item();v.publications=[{id:'p1',platform:'ebay',url:'https://example.com/a',status:'publicada',price:5000,date:'2026-10-14',offers:[]},{id:'p2',platform:'facebook',url:'https://example.com/b',status:'publicada',price:5000,date:'2026-10-14',offers:[]}];const sold=applyItemCommand(v,{type:'sell',amount:4000,platform:'ebay'},'2026-10-15');expect(sold.publications[1].removalPending).toBe(true);expect(()=>applyItemCommand(sold,{type:'sell',amount:4000,platform:'facebook'},'2026-10-15')).toThrow();});
});
describe('suscripciones y avisos',()=>{
it('mantiene ancla 31 después de febrero',()=>{expect(nextRenewal('2026-01-31','monthly','2026-01-31')).toBe('2026-02-28');expect(nextRenewal('2026-01-31','monthly','2026-02-28')).toBe('2026-03-31');});
it('ajusta año bisiesto',()=>expect(nextRenewal('2024-02-29','yearly','2024-02-29')).toBe('2025-02-28'));
it('no inventa resumen si falta precio',()=>expect(subscriptionSummary([{id:'s',service:'Demo',company:'Demo',status:'activa',period:'monthly',events:[]}])).toMatchObject({incomplete:1,monthly:0}));
it('deduplica avisos coincidentes de prueba y cancelación',()=>{const alerts=deriveAlerts([], [{id:'s',service:'Demo',company:'Demo',status:'prueba gratuita',period:'monthly',trialEnd:'2026-10-21',cancelBy:'2026-10-21',firstCharge:'2026-10-25',events:[]}],'2026-10-14');expect(alerts).toHaveLength(1);expect(alerts[0].description).toContain('cancelación');});
it('eliminar garantía invalida su aviso',()=>{const v=item();v.warranties=[{id:'w',provider:'',confirmed:true,end:'2026-10-21'}];expect(deriveAlerts([v],[],'2026-10-14')).toHaveLength(1);const clean=applyItemCommand(v,{type:'deleteWarranty',id:'w'},'2026-10-14');expect(deriveAlerts([clean],[],'2026-10-14')).toHaveLength(0);});
});

