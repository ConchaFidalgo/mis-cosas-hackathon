import { describe,it,expect } from 'vitest';
import { mergeItemEdit } from '../../src/domain/edit';
import type { Item } from '../../src/domain/types';
const item=():Item=>({id:'one',name:'Bici',category:'Deporte',status:'en venta',location:'Garaje',description:'',brand:'',model:'',condition:'Usado',defects:'',accessories:'',archived:false,assets:[],warranties:[],loans:[],donations:[],drafts:[],publications:[{id:'p',platform:'ebay',url:'https://example.com',status:'publicada',price:4000,date:'2026-10-14',offers:[]}],events:[]});
describe('edición de ficha',()=>{it('pasar a donación genera tarea para anuncios activos',()=>{const a=item(),edited=structuredClone(a);edited.status='disponible para donar';expect(mergeItemEdit(a,edited,'2026-10-14').publications[0].removalPending).toBe(true);});it('editar datos no pierde préstamos registrados en otra pestaña',()=>{const a=item(),edited=structuredClone(a);a.loans.push({id:'l',person:'Alex',given:'2026-10-14',accessories:'',previousDates:[]});edited.name='Nombre corregido';expect(mergeItemEdit(a,edited,'2026-10-14').loans).toHaveLength(1);});});

