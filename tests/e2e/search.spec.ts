import {test,expect} from '@playwright/test';
test('buscador general localiza brocas tras trasladar su caja al lavadero y permanece accesible en móvil',async({page})=>{
 await page.goto('/trastero');await page.getByRole('button',{name:'Crear objeto en trastero',exact:true}).click();
 await page.getByRole('textbox',{name:'Nombre *',exact:true}).fill('Caja buscador demo');await page.getByLabel('Categoría *',{exact:true}).selectOption('Herramientas');
 await page.getByRole('textbox',{name:'Contenido de la caja (si corresponde)',exact:true}).fill('Cinco brocas y batería');
 await page.getByRole('button',{name:'Guardar',exact:true}).click();await page.getByRole('button',{name:'Sacar del trastero',exact:true}).click();
 await page.getByRole('textbox',{name:'Nueva ubicación *',exact:true}).fill('Lavadero');await page.getByRole('button',{name:'Registrar salida',exact:true}).click();
 await page.getByRole('link',{name:'Buscar en toda la colección',exact:true}).click();await page.getByRole('textbox',{name:'Buscar en toda la colección',exact:true}).fill('brocas');
 const result=page.getByRole('article').filter({hasText:'Caja buscador demo'});await expect(result).toBeVisible();await expect(result.getByText('Lavadero',{exact:true})).toBeVisible();
 await page.screenshot({path:'.qa/busqueda-general-escritorio.png',fullPage:true});
 await page.getByRole('textbox',{name:'Buscar en toda la colección',exact:true}).fill('bateria');await expect(result).toBeVisible();
 await page.getByRole('textbox',{name:'Buscar en toda la colección',exact:true}).fill('zapatos inexistentes');await expect(page.getByRole('heading',{name:'No encontramos coincidencias'})).toBeVisible();
 await page.setViewportSize({width:390,height:844});await page.goto('/inicio');await page.getByRole('button',{name:'Más secciones',exact:true}).click();await page.getByRole('link',{name:'Buscar en toda la colección',exact:true}).click();
 await page.getByRole('textbox',{name:'Buscar en toda la colección',exact:true}).fill('brocas');await expect(page.getByText('Lavadero',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:'.qa/busqueda-general-movil.png',fullPage:true});
});
