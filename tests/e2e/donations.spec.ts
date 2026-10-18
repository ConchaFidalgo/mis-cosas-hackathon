import {test,expect} from '@playwright/test';
test('donación múltiple, entrega parcial y búsqueda conservan el historial',async({page})=>{
 await page.goto('/donaciones');await page.getByRole('button',{name:'Nueva donación',exact:true}).click();
 await page.getByLabel('Cafetera espresso',{exact:true}).check();await page.getByLabel('Consola',{exact:true}).check();
 await page.getByRole('textbox',{name:'Persona o entidad *',exact:true}).fill('Biblioteca de prueba');await page.getByRole('button',{name:'Guardar acuerdo',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Biblioteca de prueba'})).toBeVisible();await expect(page.getByText('2 objetos · Recogida pendiente',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Registrar entrega',exact:true}).click();await page.getByLabel('Consola',{exact:true}).uncheck();await page.getByRole('button',{name:'Confirmar entrega',exact:true}).click();
 await expect(page.getByRole('link',{name:'Consola',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Cafetera espresso',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Entregadas',exact:true}).click();await expect(page.getByRole('link',{name:'Cafetera espresso',exact:true})).toBeVisible();await page.reload();await page.getByRole('button',{name:'Entregadas',exact:true}).click();await expect(page.getByText('Biblioteca de prueba',{exact:true})).toBeVisible();
 await page.screenshot({path:'.qa/donaciones-escritorio.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await expect(page.getByRole('heading',{name:'Donaciones',exact:true})).toBeVisible();await page.screenshot({path:'.qa/donaciones-movil.png',fullPage:true});
 await page.goto('/cosas');await page.getByRole('textbox',{name:'Buscar tus cosas'}).fill('Biblioteca de prueba');await expect(page.getByText(/Donado a Biblioteca de prueba el/)).toBeVisible();
});
