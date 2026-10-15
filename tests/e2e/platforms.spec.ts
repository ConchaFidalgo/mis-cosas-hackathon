import { test, expect } from '@playwright/test';

test('Vinted y Wallapop se revisan y el paquete incluye solo los destinos elegidos',async({page})=>{
 await page.goto('/cosas/bicicleta');
 await page.getByRole('button',{name:'Vender',exact:true}).click();
 await page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true}).fill('55');
 await page.getByRole('button',{name:'Preparar anuncios',exact:true}).click();
 await expect(page.getByRole('checkbox',{name:'Vinted',exact:true})).toBeChecked();
 await expect(page.getByRole('checkbox',{name:'Wallapop',exact:true})).toBeChecked();
 await page.getByRole('checkbox',{name:'Vinted',exact:true}).uncheck();
 await page.getByRole('button',{name:'Wallapop',exact:true}).click();
 await page.getByRole('textbox',{name:'Título del anuncio',exact:true}).fill('Bicicleta revisada para Wallapop');
 await page.getByRole('button',{name:'Aprobar y ver email',exact:true}).click();
 await page.getByRole('button',{name:'Texto simple',exact:true}).click();
 const text=page.getByRole('textbox',{name:'Email en texto simple',exact:true});
 await expect(text).toContainText('Wallapop');await expect(text).toContainText('Bicicleta revisada para Wallapop');
 await expect(text).not.toContainText('Vinted');await expect(text).not.toContainText('eBay');await expect(text).not.toContainText('Facebook Marketplace');
 await page.getByRole('button',{name:'Simular envío del paquete',exact:true}).click();
 await expect(page.getByRole('button',{name:'Simulado, no enviado',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.reload();await page.getByRole('button',{name:'Vender',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Título del anuncio',exact:true})).toHaveValue('Bicicleta revisada para Wallapop');
});

test('una venta en Vinted mantiene una sola cifra de ingresos y recuerda retirar Wallapop',async({page})=>{
 await page.goto('/cosas/bicicleta');
 await page.getByRole('button',{name:'Ventas',exact:true}).click();
 for(const [platform,url] of [['vinted','https://www.vinted.es/items/123-demo'],['wallapop','https://es.wallapop.com/item/demo-123']]){
  await page.getByRole('button',{name:'Registrar enlace publicado',exact:true}).click();
  await page.getByRole('combobox',{name:'Plataforma',exact:true}).selectOption(platform);
  await page.getByLabel('Enlace HTTPS del anuncio *',{exact:true}).fill(url);
  await page.getByRole('textbox',{name:'Precio publicado (€) *',exact:true}).fill('30');
  await page.getByRole('button',{name:'Guardar',exact:true}).click();
 }
 await page.getByRole('button',{name:'Cerrar venta',exact:true}).click();
 await page.getByRole('textbox',{name:'Importe real de venta (€) *',exact:true}).fill('25');
 await page.getByRole('combobox',{name:'Plataforma de venta',exact:true}).selectOption('vinted');
 await page.getByRole('button',{name:'Confirmar venta',exact:true}).click();
 await page.goto('/inicio');
 await expect(page.getByRole('heading',{name:'Retirar anuncio · Bicicleta urbana',exact:true})).toBeVisible();
 await expect(page.getByText('Wallapop · pendiente de confirmación manual',{exact:true})).toBeVisible();
 await page.goto('/ventas');await expect(page.locator('.sales-total strong')).toHaveText('25,00 €');
});

test('los borradores anteriores de eBay se conservan y se exige preparar un destino nuevo',async({page})=>{
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();
 await page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true}).fill('42');
 await page.getByRole('button',{name:'Preparar anuncios',exact:true}).click();
 for(const platform of ['Vinted','Wallapop'])await page.getByRole('checkbox',{name:platform,exact:true}).uncheck();
 await page.getByRole('checkbox',{name:'eBay',exact:true}).check();
 await page.getByRole('button',{name:'eBay',exact:true}).click();
 await page.getByRole('textbox',{name:'Título del anuncio',exact:true}).fill('Título anterior de eBay');
 await page.getByRole('button',{name:'Aprobar y ver email',exact:true}).click();
 await page.getByRole('button',{name:'Cerrar',exact:true}).click();await page.reload();
 await page.getByRole('button',{name:'Vender',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Título del anuncio',exact:true})).toHaveValue('Título anterior de eBay');
 await page.getByRole('checkbox',{name:'Vinted',exact:true}).check();
 await page.getByRole('button',{name:'Aprobar y ver email',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Falta preparar');
 await page.getByRole('button',{name:'Volver a datos',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true})).toHaveValue('42');
 await page.getByRole('button',{name:'Preparar anuncios',exact:true}).click();
 await page.getByRole('button',{name:'Vinted',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Título del anuncio',exact:true})).toHaveValue('Bicicleta urbana');
});

test('revisar otra vez un anuncio conserva su versión aprobada anterior',async({page})=>{
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();
 await page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true}).fill('42');
 await page.getByRole('button',{name:'Preparar anuncios',exact:true}).click();
 await page.getByRole('checkbox',{name:'Wallapop',exact:true}).uncheck();
 await page.getByRole('textbox',{name:'Título del anuncio',exact:true}).fill('Versión inicial');
 await page.getByRole('button',{name:'Aprobar y ver email',exact:true}).click();
 await page.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.getByRole('button',{name:'Vender',exact:true}).click();
 await page.getByRole('textbox',{name:'Título del anuncio',exact:true}).fill('Versión revisada');
 await page.getByRole('button',{name:'Aprobar y ver email',exact:true}).click();
 const drafts=await page.evaluate(()=>new Promise<{title:string;version:number}[]>((resolve,reject)=>{
  const request=indexedDB.open('mis-cosas-demo-v1',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{
   const db=request.result,read=db.transaction('state').objectStore('state').get('collection');
   read.onsuccess=()=>{const item=read.result.items.find((i:{id:string})=>i.id==='bicicleta');resolve(item.drafts.filter((d:{platform:string})=>d.platform==='vinted').map((d:{title:string;version:number})=>({title:d.title,version:d.version})));db.close();};read.onerror=()=>reject(read.error);
  };
 }));
 expect(drafts).toEqual([{title:'Versión inicial',version:1},{title:'Versión revisada',version:2}]);
});
