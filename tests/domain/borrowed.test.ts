import { describe, expect, it } from 'vitest';
import { createBorrowed, changeBorrowed, borrowedAlerts } from '../../src/domain/borrowed';

const input = { name: ' Proyector ', owner: ' Nora ', received: '2026-10-10', due: '2026-10-16', condition: 'Funciona', accessories: 'Cable', notes: '' };
const today = '2026-10-15';

describe('objetos que me prestan', () => {
 it('registra el dueño y el historial sin convertirlo en un objeto propio', () => {
  const entry = createBorrowed(input, today);
  expect(entry).toMatchObject({ name: 'Proyector', owner: 'Nora', received: '2026-10-10', due: '2026-10-16' });
  expect(entry.events[0].title).toContain('Nora');
  expect(entry).not.toHaveProperty('sale');
 });
 it('rechaza dueño vacío, fecha imposible, recepción futura y devolución anterior a recepción', () => {
  for (const values of [{ ...input, owner: ' ' }, { ...input, received: '2026-02-30' }, { ...input, received: '2026-10-20' }, { ...input, due: '2026-10-09' }]) {
   expect(() => createBorrowed(values, today)).toThrow();
  }
 });
 it('ampliar conserva la fecha anterior en el historial e invalida el aviso previo', () => {
  const entry = createBorrowed(input, today);
  const next = changeBorrowed(entry, { type: 'extend', due: '2026-10-17' }, today);
  expect(entry.due).toBe('2026-10-16');
  expect(next.due).toBe('2026-10-17');
  expect(next.events.at(-1)?.title).toContain('16 de octubre');
  expect(borrowedAlerts([next], today)[0].id).not.toBe(borrowedAlerts([entry], today)[0].id);
  expect(() => changeBorrowed(entry, { type: 'extend', due: '2026-10-14' }, today)).toThrow();
 });
 it('la devolución guarda notas y elimina avisos sin borrar historial', () => {
  const entry = createBorrowed(input, today);
  const returned = changeBorrowed(entry, { type: 'return', notes: 'Entregado con cable' }, today);
  expect(returned).toMatchObject({ returned: today, returnNotes: 'Entregado con cable' });
  expect(returned.events).toHaveLength(2);
  expect(borrowedAlerts([returned], today)).toEqual([]);
  expect(() => changeBorrowed(returned, { type: 'return', notes: '' }, today)).toThrow();
  expect(() => changeBorrowed(returned, { type: 'extend', due: '2026-10-19' }, today)).toThrow();
  expect(() => changeBorrowed(returned, { type: 'edit', input, previous: entry }, today)).toThrow();
 });
 it('avisa dos días antes y mantiene atrasados; sin fecha no inventa vencimiento', () => {
  const entry = createBorrowed(input, today);
  expect(borrowedAlerts([entry], '2026-10-13')).toEqual([]);
  expect(borrowedAlerts([entry], '2026-10-14')).toHaveLength(1);
  expect(borrowedAlerts([entry], '2026-10-20')[0]).toMatchObject({ title: 'Devolver Proyector', date: '2026-10-16', href: '/me-prestan#'+entry.id });
  expect(borrowedAlerts([{ ...entry, due: undefined }], today)).toEqual([]);
 });
 it('editar conserva el historial y registra cambios de fecha', () => {
  const entry = createBorrowed(input, today);
  const next = changeBorrowed(entry, { type: 'edit', input: { ...input, name: 'Proyector HD', due: '' }, previous: entry }, today);
  expect(next).toMatchObject({ id: entry.id, name: 'Proyector HD', due: undefined });
  expect(next.events).toHaveLength(2);
  expect(next.events.at(-1)?.title).toContain('Sin fecha acordada');
 });
 it('editar notas desde otra pestaña conserva una ampliación posterior del plazo', () => {
  const entry=createBorrowed(input,today);
  const extended=changeBorrowed(entry,{type:'extend',due:'2026-10-20'},today);
  const edited=changeBorrowed(extended,{type:'edit',input:{...input,notes:'Guardar la funda'},previous:entry},today);
  expect(edited.due).toBe('2026-10-20');
  expect(edited.notes).toBe('Guardar la funda');
  expect(edited.events).toHaveLength(3);
 });
 it('avisa si otra pestaña cambió el mismo campo que se está editando', () => {
  const entry=createBorrowed(input,today);
  const extended=changeBorrowed(entry,{type:'extend',due:'2026-10-20'},today);
  expect(()=>changeBorrowed(extended,{type:'edit',input:{...input,due:'2026-10-18'},previous:entry},today)).toThrow('otra pestaña');
 });
 it('completar el preaviso no silencia el vencimiento ni el aviso de retraso', () => {
  const entry=createBorrowed(input,today);
  const before=borrowedAlerts([entry],'2026-10-14')[0];
  const due=borrowedAlerts([entry],'2026-10-16')[0];
  const late=borrowedAlerts([entry],'2026-10-17')[0];
  expect(new Set([before.id,due.id,late.id]).size).toBe(3);
 });
});
