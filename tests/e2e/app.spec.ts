import { test, expect } from '@playwright/test';

test('móvil mantiene etiqueta demo y filtro de categorías',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/cosas');await expect(page.getByText('Demo · Datos ficticios',{exact:true})).toBeVisible();await expect(page.getByRole('combobox',{name:'Filtrar por categoría',exact:true})).toBeVisible();await page.getByRole('combobox',{name:'Filtrar por categoría',exact:true}).selectOption('Tecnología');await expect(page.getByRole('heading',{name:'Consola',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Cafetera espresso',exact:true})).not.toBeVisible();
});


test('dictado de fecha imposible se mantiene pendiente de revisión',async({page})=>{
 await page.addInitScript(()=>{class Recognition{lang='';continuous=false;interimResults=false;onresult:((e:unknown)=>void)|null=null;onerror=null;onend=null;start(){setTimeout(()=>this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript:'2026-02-30'}}]}),20);}stop(){}abort(){}}Object.assign(window,{SpeechRecognition:Recognition});});
 await page.goto('/garantias');await page.getByRole('button',{name:'Añadir garantía',exact:true}).click();await page.getByRole('button',{name:'Dictar Vencimiento',exact:true}).click();await page.getByRole('button',{name:'Empezar dictado',exact:true}).click();await page.getByRole('button',{name:'Aplicar al campo',exact:true}).click();await expect(page.getByLabel('Propuesta para Vencimiento',{exact:true})).toHaveValue('2026-02-30');await expect(page.getByRole('alert')).toContainText('fecha');
});


test('anuncios: paquete usa solo fotos elegidas y ofrece ZIP y texto simple',async({page})=>{
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();await page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true}).fill('45');await page.getByRole('button',{name:'Preparar anuncios',exact:true}).click();await page.getByRole('button',{name:'Aprobar y ver email',exact:true}).click();await page.getByRole('button',{name:'Texto simple',exact:true}).click();await expect(page.getByRole('textbox',{name:'Email en texto simple',exact:true})).toContainText('45,00');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar fotos ZIP',exact:true}).click();expect((await download).suggestedFilename()).toBe('mis-cosas-fotos.zip');
});


test('donación: texto editable y paquete sin precio ni facturas',async({page})=>{
 await page.goto('/cosas/lampara');await page.getByRole('button',{name:'Donación',exact:true}).click();await page.getByRole('button',{name:'Preparar texto y fotos',exact:true}).click();await page.getByRole('textbox',{name:'Texto de donación',exact:true}).fill('Lámpara para donar. Tiene una marca en la base.');await page.getByRole('button',{name:'Guardar y ver paquete',exact:true}).click();await expect(page.getByText('Lámpara para donar. Tiene una marca en la base.',{exact:true}).last()).toBeVisible();await expect(page.getByText(/Precio:/)).not.toBeVisible();await page.getByRole('button',{name:'Simular envío de donación',exact:true}).click();await expect(page.getByText('Simulado, no enviado',{exact:true}).last()).toBeVisible();
});
test('dos pestañas crean objetos sin perder la otra creación',async({page,context})=>{
 await page.goto('/cosas');const second=await context.newPage();await second.goto('/cosas');
 for(const [p,name]of [[page,'Objeto uno'],[second,'Objeto dos']] as const){await p.getByRole('button',{name:'Añadir objeto',exact:true}).click();await p.getByRole('textbox',{name:'Nombre *',exact:true}).fill(name);await p.getByRole('combobox',{name:'Categoría *',exact:true}).selectOption('Otros');}
 await Promise.all([page.getByRole('button',{name:'Guardar',exact:true}).click(),second.getByRole('button',{name:'Guardar',exact:true}).click()]);await expect(page.getByRole('status')).toContainText('Objeto añadido');await expect(second.getByRole('status')).toContainText('Objeto añadido');await page.reload();await expect(page.getByRole('heading',{name:'Objeto uno',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Objeto dos',exact:true})).toBeVisible();
});


test('dictado de eBay no se aplica a Facebook al cambiar de pestaña',async({page})=>{
 await page.addInitScript(()=>{class Recognition{lang='';continuous=false;interimResults=false;onresult:((e:unknown)=>void)|null=null;onerror=null;onend=null;start(){setTimeout(()=>this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript:'Texto destinado a eBay'}}]}),500);}stop(){}abort(){}}Object.assign(window,{SpeechRecognition:Recognition});});
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();await page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true}).fill('40');await page.getByRole('button',{name:'Preparar anuncios',exact:true}).click();await page.getByRole('button',{name:'eBay',exact:true}).click();await page.getByRole('button',{name:'Dictar Título del anuncio',exact:true}).click();await page.getByRole('button',{name:'Empezar dictado',exact:true}).click();await page.getByRole('button',{name:'Facebook Marketplace',exact:true}).click();await expect(page.getByRole('textbox',{name:'Título del anuncio',exact:true})).toHaveValue('Bicicleta urbana');await page.waitForTimeout(800);await expect(page.getByText('Revisa el dictado',{exact:true})).not.toBeVisible();
});
test('guardar espera la lectura de fotos',async({page})=>{
 await page.addInitScript(()=>{const read=FileReader.prototype.readAsDataURL;FileReader.prototype.readAsDataURL=function(blob){setTimeout(()=>read.call(this,blob),800);};});
 await page.goto('/cosas');await page.getByRole('button',{name:'Añadir objeto',exact:true}).click();await page.getByRole('textbox',{name:'Nombre *',exact:true}).fill('Foto de prueba');await page.getByRole('combobox',{name:'Categoría *',exact:true}).selectOption('Hogar');await page.locator('input[type=file]').first().setInputFiles('public/demo/cafetera.webp');await expect(page.getByRole('button',{name:'Guardar',exact:true})).toBeDisabled();
});

test('colección: crear, editar y recuperar tras recarga',async({page})=>{
 await page.goto('/cosas');await expect(page.getByRole('heading',{name:'Mis cosas',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Añadir objeto',exact:true}).click();await page.getByRole('textbox',{name:'Nombre *',exact:true}).fill('Libro de prueba');await page.getByRole('combobox',{name:'Categoría *',exact:true}).selectOption('Libros');await page.getByRole('button',{name:'Guardar',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Libro de prueba',exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Libro de prueba',exact:true})).toBeVisible();
 await page.getByRole('heading',{name:'Libro de prueba',exact:true}).click();await page.getByRole('button',{name:'Editar objeto',exact:true}).click();await page.getByLabel('Ubicación',{exact:true}).fill('Biblioteca');await page.getByRole('button',{name:'Guardar',exact:true}).click();await expect(page.getByText('Biblioteca',{exact:true}).first()).toBeVisible();
});
test('garantías: borrar conserva factura',async({page})=>{
 await page.goto('/garantias');await expect(page.getByRole('heading',{name:'Garantías',exact:true})).toBeVisible();await page.getByRole('button',{name:'Eliminar garantía',exact:true}).click();await page.getByRole('button',{name:'Confirmar',exact:true}).click();await page.goto('/cosas/cafetera');await expect(page.getByRole('link',{name:/Factura ficticia/})).toBeVisible();
});
test('dictado propone texto y cancelarlo conserva el campo',async({page})=>{
 await page.addInitScript(()=>{class Recognition{lang='';continuous=false;interimResults=false;onresult:((e:unknown)=>void)|null=null;onerror=null;onend:(()=>void)|null=null;start(){setTimeout(()=>this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript:'Nombre dictado'}}]}),50);}stop(){this.onend?.();}abort(){}}Object.assign(window,{SpeechRecognition:Recognition});});
 await page.goto('/cosas');await page.getByRole('button',{name:'Añadir objeto',exact:true}).click();await page.getByRole('textbox',{name:'Nombre *',exact:true}).fill('Nombre anterior');
 await page.getByRole('button',{name:'Dictar Nombre',exact:true}).click();await page.getByRole('button',{name:'Empezar dictado',exact:true}).click();await expect(page.getByLabel('Propuesta para Nombre')).toHaveValue('Nombre dictado');await expect(page.getByRole('textbox',{name:'Nombre *',exact:true}).first()).toHaveValue('Nombre anterior');await page.getByRole('button',{name:'Descartar',exact:true}).click();await expect(page.getByRole('textbox',{name:'Nombre *',exact:true}).first()).toHaveValue('Nombre anterior');
});
test('préstamo: devolución recupera disponibilidad',async({page})=>{
 await page.goto('/cosas/taladro');await expect(page.getByText('Lo tiene Alex',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Devolver',exact:true}).click();await page.getByRole('button',{name:'Confirmar devolución',exact:true}).click();await expect(page.getByText('Lo tiene Alex',{exact:true})).not.toBeVisible();
});
test('móvil: sin desbordamiento y garantías accesibles',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/cosas');await expect(page.getByRole('heading',{name:'Mis cosas',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();await page.getByRole('navigation',{name:'Navegación móvil'}).getByRole('link',{name:'Garantías',exact:true}).click();await expect(page.getByRole('heading',{name:'Garantías',exact:true})).toBeVisible();
});

