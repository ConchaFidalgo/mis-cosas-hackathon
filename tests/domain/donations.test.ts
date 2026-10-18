import {it,expect} from 'vitest';
import {blankItem} from '../../src/demo/fixtures';
import {agreeDonationGroup,deliverDonationSelection} from '../../src/domain/donations';
const items=()=>['a','b'].map(id=>({...blankItem(),id,name:id,category:'Libros'}));
it('agrupa objetos sin entregarlos y permite una entrega parcial conservando sus fichas',()=>{
 const original=items();const agreed=agreeDonationGroup(original,['a','b'],{person:'Biblioteca',conditions:'Recogida',due:'2026-10-20'},'2026-10-18','grupo');
 expect(original[0].donations).toHaveLength(0);expect(agreed.every(i=>i.status==='donación acordada')).toBe(true);
 expect(agreed.map(i=>i.donations[0].id)).toEqual(['grupo','grupo']);
 const delivered=deliverDonationSelection(agreed,['a'],'2026-10-18');
 expect(delivered[0].status).toBe('donado');expect(delivered[0].donations[0].person).toBe('Biblioteca');expect(delivered[1].status).toBe('donación acordada');
});
it('rechaza selección vacía, fechas inválidas y objetos no disponibles sin cambios parciales',()=>{
 const source=items();source[1].status='vendido';
 expect(()=>agreeDonationGroup(source,['a','b'],{person:'Prueba',conditions:''},'2026-10-18','g')).toThrow();expect(source[0].donations).toHaveLength(0);
 expect(()=>agreeDonationGroup(items(),[],{person:'Prueba',conditions:''},'2026-10-18','g')).toThrow();
 expect(()=>agreeDonationGroup(items(),['a'],{person:'Prueba',conditions:'',due:'incorrecta'},'2026-10-18','g')).toThrow();
});
