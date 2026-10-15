import { test, expect } from '@playwright/test';
import { addDays, todayMadrid } from '../../src/domain/dates';

test('Me prestan guarda un objeto ajeno, amplía su fecha y lo devuelve con historial', async ({ page }) => {
 const today = todayMadrid();
 await page.goto('/inicio');
 await page.getByRole('navigation', { name: 'Principal', exact: true }).getByRole('link', { name: 'Me prestan', exact: true }).click();
 await page.getByRole('button', { name: 'Añadir préstamo', exact: true }).click();
 await page.getByRole('textbox', { name: 'Objeto *', exact: true }).fill('Proyector de Nora');
 await page.getByRole('textbox', { name: 'Quién me lo presta *', exact: true }).fill('Nora');
 await page.getByLabel('Fecha de recepción *', { exact: true }).fill(addDays(today, -5));
 await page.getByLabel('Devolución prevista', { exact: true }).fill(addDays(today, -1));
 await page.getByRole('textbox', { name: 'Accesorios', exact: true }).fill('Cable y funda');
 await page.getByRole('button', { name: 'Guardar', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Proyector de Nora', exact: true })).toBeVisible();
 await page.reload();
 await expect(page.getByText('Nora', { exact: true })).toBeVisible();
 await page.goto('/cosas');
 await expect(page.getByRole('heading', { name: 'Proyector de Nora', exact: true })).toHaveCount(0);
 await page.goto('/inicio');
 await page.getByRole('link').filter({ has: page.getByRole('heading', { name: 'Devolver Proyector de Nora', exact: true }) }).click();
 await page.getByRole('button', { name: 'Ampliar fecha', exact: true }).click();
 await page.getByLabel('Nueva fecha de devolución *', { exact: true }).fill(addDays(today, 2));
 await page.getByRole('button', { name: 'Guardar', exact: true }).click();
 await page.getByText('Historial · 2', { exact: true }).click();
 await expect(page.getByText(/Fecha de devolución ampliada/)).toBeVisible();
 await page.getByRole('button', { name: 'Marcar como devuelto', exact: true }).click();
 await page.getByRole('textbox', { name: 'Notas de devolución', exact: true }).fill('Cable y funda entregados');
 await page.getByRole('button', { name: 'Confirmar devolución', exact: true }).click();
 await page.getByRole('tab', { name: 'Devueltos', exact: true }).click();
 await expect(page.locator('.borrowed-note').filter({ hasText: 'Devolución' })).toContainText('Cable y funda entregados');
 await page.goto('/inicio');
 await expect(page.getByRole('heading', { name: 'Devolver Proyector de Nora', exact: true })).toHaveCount(0);
 await page.goto('/prestamos');
 await expect(page.getByRole('heading', { name: 'Prestado', exact: true })).toBeVisible();
 await expect(page.getByRole('heading', { name: 'Taladro inalámbrico', exact: true })).toBeVisible();
});

test('Me prestan permite revisar el dictado antes de aplicar y guardar', async ({ page }) => {
 await page.addInitScript(() => {
  class Recognition {
   lang = ''; continuous = false; interimResults = false;
   onresult: ((e: unknown) => void) | null = null; onerror = null; onend = null;
   start() { setTimeout(() => this.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: 'Libro de Elena' } }] }), 20); }
   stop() {} abort() {}
  }
  Object.assign(window, { SpeechRecognition: Recognition });
 });
 await page.goto('/me-prestan');
 await page.getByRole('button', { name: 'Añadir préstamo', exact: true }).click();
 await page.getByRole('button', { name: 'Dictar Objeto', exact: true }).click();
 await page.getByRole('button', { name: 'Empezar dictado', exact: true }).click();
 await expect(page.getByLabel('Propuesta para Objeto', { exact: true })).toHaveValue('Libro de Elena');
 await expect(page.getByRole('textbox', { name: 'Objeto *', exact: true })).toHaveValue('');
 await page.getByLabel('Propuesta para Objeto', { exact: true }).fill('Libro de jardinería');
 await page.getByRole('button', { name: 'Aplicar al campo', exact: true }).click();
 await page.getByRole('textbox', { name: 'Quién me lo presta *', exact: true }).fill('Elena');
 await page.getByRole('button', { name: 'Guardar', exact: true }).click();
 await page.getByRole('tab', { name: 'Sin fecha', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Libro de jardinería', exact: true })).toBeVisible();
});

test('colecciones anteriores conservan objetos y admiten Me prestan en móvil', async ({ page }) => {
 await page.goto('/cosas');
 await page.getByRole('button', { name: 'Añadir objeto', exact: true }).click();
 await page.getByRole('textbox', { name: 'Nombre *', exact: true }).fill('Objeto anterior');
 await page.getByRole('combobox', { name: 'Categoría *', exact: true }).selectOption('Otros');
 await page.getByRole('button', { name: 'Guardar', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Objeto anterior', exact: true })).toBeVisible();
 await page.evaluate(async () => {
  await new Promise<void>((resolve, reject) => {
   const request = indexedDB.open('mis-cosas-demo-v1', 1);
   request.onerror = () => reject(request.error);
   request.onsuccess = () => {
    const db = request.result, transaction = db.transaction('state', 'readwrite'), store = transaction.objectStore('state'), get = store.get('collection');
    get.onsuccess = () => { const saved = get.result; delete saved.borrowed; store.put(saved, 'collection'); };
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
   };
  });
 });
 await page.setViewportSize({ width: 390, height: 844 });
 await page.reload();
 await page.getByRole('button', { name: 'Más secciones', exact: true }).click();
 await page.getByRole('navigation', { name: 'Principal', exact: true }).getByRole('link', { name: 'Me prestan', exact: true }).click();
 await page.getByRole('button', { name: 'Añadir préstamo', exact: true }).click();
 await page.getByRole('textbox', { name: 'Objeto *', exact: true }).fill('Escalera');
 await page.getByRole('textbox', { name: 'Quién me lo presta *', exact: true }).fill('Teo');
 await page.getByLabel('Fecha de recepción *', { exact: true }).fill(addDays(todayMadrid(),-5));
 await page.getByLabel('Devolución prevista', { exact: true }).fill(addDays(todayMadrid(),-1));
 await page.getByRole('button', { name: 'Guardar', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Escalera', exact: true })).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
 const summaryBounds=await page.getByRole('heading',{name:'En tus manos, por un tiempo.',exact:true}).boundingBox();
 expect(summaryBounds?.height).toBeLessThan(130);
 await page.goto('/cosas');
 await expect(page.getByRole('heading', { name: 'Objeto anterior', exact: true })).toBeVisible();
});

test('editar notas en una pestaña conserva la fecha ampliada desde otra', async ({ page, context }) => {
 const today=todayMadrid();
 await page.goto('/me-prestan');
 await page.getByRole('button',{name:'Añadir préstamo',exact:true}).click();
 await page.getByRole('textbox',{name:'Objeto *',exact:true}).fill('Cámara de prueba');
 await page.getByRole('textbox',{name:'Quién me lo presta *',exact:true}).fill('Nora');
 await page.getByLabel('Devolución prevista',{exact:true}).fill(addDays(today,2));
 await page.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Editar',exact:true}).click();
 const second=await context.newPage();
 await second.goto('/me-prestan');
 await second.getByRole('button',{name:'Ampliar fecha',exact:true}).click();
 await second.getByLabel('Nueva fecha de devolución *',{exact:true}).fill(addDays(today,8));
 await second.getByRole('button',{name:'Guardar',exact:true}).click();
 await expect(second.getByRole('status')).toContainText('Nueva fecha guardada');
 await page.getByRole('textbox',{name:'Notas',exact:true}).fill('Guardar en su funda');
 await page.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.reload();
 await expect(page.getByText('Guardar en su funda',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Editar',exact:true}).click();
 await expect(page.getByLabel('Devolución prevista',{exact:true})).toHaveValue(addDays(today,8));
});
