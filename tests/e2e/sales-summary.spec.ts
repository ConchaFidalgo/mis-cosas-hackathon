import {test,expect} from '@playwright/test';
import {addDays,dateLabel,todayMadrid} from '../../src/domain/dates';

test('Ventas distingue un objeto pendiente de publicar sin inventar precio',async({page})=>{
 await page.goto('/ventas');
 await expect(page.getByText('Sin publicaciones registradas',{exact:true})).toBeVisible();
 await expect(page.getByText('Precio por registrar',{exact:true})).toBeVisible();
});

test('Ventas muestra plataforma, precio y antigüedad y conserva una revisión manual',async({page})=>{
 const date=addDays(todayMadrid(),-15);
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Ventas',exact:true}).click();
 await page.getByRole('button',{name:'Registrar enlace publicado',exact:true}).click();
 await page.getByRole('combobox',{name:'Plataforma',exact:true}).selectOption('wallapop');
 await page.getByLabel('Enlace HTTPS del anuncio *',{exact:true}).fill('https://es.wallapop.com/item/demo-123');
 await page.getByRole('textbox',{name:'Precio publicado (€) *',exact:true}).fill('70');
 await page.getByLabel('Fecha de publicación *',{exact:true}).fill(date);
 await page.getByRole('button',{name:'Guardar',exact:true}).click();await page.goto('/ventas');
 const listing=page.getByRole('article',{name:'Anuncio en Wallapop de Bicicleta urbana',exact:true});
 await expect(listing).toContainText('70,00');await expect(listing).toContainText(dateLabel(date));await expect(listing).toContainText('15 días');
 await listing.getByRole('button',{name:'Revisar precio',exact:true}).click();
 await page.getByRole('textbox',{name:'Precio publicado ahora (€) *',exact:true}).fill('55');
 await page.getByRole('textbox',{name:'Nota de revisión',exact:true}).fill('He bajado el anuncio en Wallapop');
 await page.getByRole('button',{name:'Guardar revisión',exact:true}).click();
 await expect(listing).toContainText('55,00');await expect(listing).toContainText('Última revisión');
 await listing.getByText('Historial de precios',{exact:true}).click();
 await expect(listing).toContainText('70,00');await expect(listing).toContainText('He bajado el anuncio en Wallapop');
 await page.reload();await expect(listing).toContainText('55,00');
});

test('las seis fotografías demo cargan al recorrer la colección',async({page})=>{
 await page.goto('/cosas');
 for(const name of ['Cafetera espresso','Bicicleta urbana','Abrigo de entretiempo','Taladro inalámbrico','Consola','Lámpara de mesa']){
  const image=page.getByRole('img',{name,exact:true});await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }
});
