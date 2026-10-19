import {it,expect} from 'vitest';
import {blankItem} from '../../src/demo/fixtures';
import {moveStorage,isInStorage} from '../../src/domain/storage';
it('entrada y salida conservan la ficha y registran origen y destino',()=>{
 const original={...blankItem(),name:'Caja',category:'Hogar',location:'Salón'};
 const inside=moveStorage(original,'in','', '2026-10-19','Salón');expect(isInStorage(inside)).toBe(true);expect(inside.status).toBe('guardado');expect(original.location).toBe('Salón');
 const outside=moveStorage(inside,'out','Dormitorio','2026-10-19','Trastero');expect(outside.location).toBe('Dormitorio');expect(outside.events).toHaveLength(2);expect(outside.events[1].title).toContain('Salón');expect(outside.events[0].title).toContain('Dormitorio');
});
it('rechaza movimientos ambiguos, obsoletos o de objetos prestados o cerrados',()=>{
 const item={...blankItem(),location:'Salón'};
 expect(()=>moveStorage(item,'out','Cocina','2026-10-19','Salón')).toThrow();expect(()=>moveStorage(item,'in','','2026-10-19','Cocina')).toThrow();
 expect(()=>moveStorage({...item,status:'donado'},'in','','2026-10-19','Salón')).toThrow();
 expect(()=>moveStorage({...item,loans:[{id:'l',person:'Ana',given:'2026-10-18',accessories:'',previousDates:[]}]},'in','','2026-10-19','Salón')).toThrow();
 expect(()=>moveStorage({...item,location:'Trastero'},'out','','2026-10-19','Trastero')).toThrow();
});
