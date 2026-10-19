import {test,expect} from '@playwright/test';
test('caja con foto y contenido, salida y nueva entrada conservan ubicación e historial',async({page})=>{
 await page.goto('/trastero');await page.getByRole('button',{name:'Crear objeto en trastero',exact:true}).click();
 await page.getByRole('textbox',{name:'Nombre *',exact:true}).fill('Caja de cables demo');await page.getByLabel('Categoría *',{exact:true}).selectOption('Hogar');
 await page.getByRole('textbox',{name:'Descripción',exact:true}).fill('Caja azul pequeña');await page.getByRole('textbox',{name:'Para qué sirve',exact:true}).fill('Conectar equipos');await page.getByRole('textbox',{name:'Contenido de la caja (si corresponde)',exact:true}).fill('Cargadores, adaptador HDMI y cables USB');
 await expect(page.getByRole('button',{name:'Hacer foto',exact:true})).toBeVisible();await page.locator('input[type=file][accept="image/jpeg,image/png,image/webp"]').setInputFiles('public/demo/consola.webp');
 await page.getByRole('button',{name:'Guardar',exact:true}).click();await expect(page.getByRole('heading',{name:'Caja de cables demo',exact:true})).toBeVisible();await expect(page.getByText('Almacenado:',{exact:false})).toBeVisible();
 await page.getByRole('textbox',{name:'Buscar en trastero',exact:true}).fill('HDMI');await expect(page.getByRole('heading',{name:'Caja de cables demo',exact:true})).toBeVisible();await page.getByRole('textbox',{name:'Buscar en trastero',exact:true}).fill('');
 await page.screenshot({path:'.qa/trastero-escritorio.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.qa/trastero-movil.png',fullPage:true});
 await page.getByRole('button',{name:'Sacar del trastero',exact:true}).click();await page.getByRole('textbox',{name:'Nueva ubicación *',exact:true}).fill('Despacho');await page.getByRole('button',{name:'Registrar salida',exact:true}).click();await expect(page.getByRole('heading',{name:'Todavía no hay objetos en el trastero',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Movimientos',exact:true}).click();await expect(page.getByText('Salida de trastero · Trastero → Despacho',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Meter objeto',exact:true}).click();await page.getByRole('combobox',{name:'Objeto',exact:true}).selectOption({label:'Caja de cables demo · Despacho'});await page.getByRole('button',{name:'Registrar entrada',exact:true}).click();await page.reload();await expect(page.getByRole('heading',{name:'Caja de cables demo',exact:true})).toBeVisible();
});
