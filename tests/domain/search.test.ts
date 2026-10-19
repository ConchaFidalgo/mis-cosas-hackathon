import {describe,it,expect} from 'vitest';
import {blankItem} from '../../src/demo/fixtures';
import {searchCollection} from '../../src/domain/search';
describe('búsqueda general',()=>{
 it('encuentra contenido fuera del trastero, ignora tildes y conserva ubicación de archivados',()=>{
  const box={...blankItem(),name:'Caja de herramientas',location:'Lavadero',storageContents:'Cinco brocas y batería',archived:true};
  const results=searchCollection([box],[],'bateria');
  expect(results).toHaveLength(1);expect(results[0].where).toBe('Lavadero');expect(results[0].status).toContain('Archivado');
  expect(searchCollection([box],[],'zapatos')).toEqual([]);
 });
 it('distingue quién tiene el objeto de su ubicación habitual y del destinatario de una donación',()=>{
  const drill={...blankItem(),name:'Taladro',location:'Lavadero',loans:[{id:'l',person:'Luz',given:'2026-10-19',accessories:'',previousDates:[]}]};
  expect(searchCollection([drill],[],'Luz')[0].where).toBe('Prestado a Luz');
  const given={...blankItem(),name:'Libro',status:'donado' as const,location:'Salón',donations:[{id:'d',person:'Biblioteca',delivered:'2026-10-19',conditions:'',text:'',photoIds:[]}]};
  expect(searchCollection([given],[],'libro')[0].where).toBe('Donado a Biblioteca');
 });
});
