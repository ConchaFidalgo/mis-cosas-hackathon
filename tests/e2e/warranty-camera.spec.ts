import {test,expect,type Page} from '@playwright/test';

async function openWarranty(page:Page){
 await page.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{const c=document.createElement('canvas');c.width=640;c.height=480;const s=c.captureStream(15);function paint(){if(s.getTracks()[0].readyState==='ended')return;c.getContext('2d')!.fillRect(0,0,640,480);requestAnimationFrame(paint);}paint();return s;};});
 await page.goto('/garantias');await page.getByRole('button',{name:'Añadir garantía',exact:true}).first().click();await page.getByLabel('Proveedor',{exact:true}).fill('Garantía fotografiada');
}
async function capture(page:Page){await page.getByRole('button',{name:'Fotografiar garantía o ticket',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Tomar foto',exact:true}).click();await expect(page.getByAltText('Foto para revisar',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Añadir a la garantía',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar',exact:true})).toBeEnabled();}

test('la foto revisada se guarda como documento asociado y persiste',async({page})=>{
 await openWarranty(page);await capture(page);await expect(page.getByRole('checkbox',{name:/foto-.*jpg/})).toBeChecked();await page.getByRole('button',{name:'Guardar',exact:true}).click();await page.reload();const card=page.locator('.warranty-card').filter({has:page.getByRole('heading',{name:'Garantía fotografiada',exact:true})});await expect(card.getByRole('link',{name:/foto-.*jpg/})).toBeVisible();
 await card.getByRole('button',{name:'Editar garantía',exact:true}).click();await expect(page.getByRole('checkbox',{name:/foto-.*jpg/})).toBeChecked();
});
test('cancelar el formulario descarta la foto sin crear archivos',async({page})=>{
 await openWarranty(page);await capture(page);await page.getByRole('button',{name:'Cancelar',exact:true}).click();await page.getByRole('button',{name:'Añadir garantía',exact:true}).first().click();await expect(page.getByRole('checkbox',{name:/foto-.*jpg/})).toHaveCount(0);
});
