import {test,expect,type Page} from '@playwright/test';

async function camera(page:Page){await page.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{
 const canvas=document.createElement('canvas');canvas.width=2560;canvas.height=1920;const ctx=canvas.getContext('2d')!;
 ctx.fillStyle='#fff';ctx.fillRect(0,0,2560,1920);ctx.fillStyle='#111';ctx.font='28px sans-serif';
 for(let y=50;y<1900;y+=40)ctx.fillText('GARANTÍA DE PRUEBA · Texto para revisar · 1234567890',40,y);
 const stream=canvas.captureStream(10);function frame(){if(stream.getTracks()[0].readyState==='ended')return;ctx.fillRect(0,0,1,1);requestAnimationFrame(frame);}frame();return stream;
};});}
async function review(page:Page,button:string){await page.getByRole('button',{name:button,exact:true}).click();await page.getByRole('button',{name:'Tomar foto',exact:true}).click();const image=page.getByAltText('Foto para revisar',{exact:true});await expect(image).toBeVisible();return image;}

test('cámara de objeto reduce antes de revisar y guarda esa misma imagen',async({page})=>{
 await camera(page);await page.goto('/cosas');await page.getByRole('button',{name:'Añadir objeto',exact:true}).click();await page.getByLabel('Nombre *',{exact:true}).fill('Foto optimizada');await page.getByLabel('Categoría *',{exact:true}).selectOption('Otros');
 const image=await review(page,'Hacer foto');await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(1600);
 await expect(page.getByText(/Foto optimizada ·/)).toBeVisible();const reviewed=await image.evaluate(async(img:HTMLImageElement)=>{const b=await(await fetch(img.src)).blob();return {size:b.size,data:await new Promise<string>(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.readAsDataURL(b);})};});expect(reviewed.size).toBeLessThanOrEqual(400*1024);
 await page.getByRole('button',{name:'Añadir al objeto',exact:true}).click();await page.getByRole('button',{name:'Guardar',exact:true}).click();await expect(page.getByRole('status')).toContainText('Objeto añadido');await page.reload();await expect(page.getByRole('img',{name:'Foto optimizada',exact:true})).toHaveAttribute('src',reviewed.data);
});
test('garantía conserva mayor resolución y ofrece revisar la letra en grande',async({page})=>{
 await camera(page);await page.goto('/garantias');await page.getByRole('button',{name:'Añadir garantía',exact:true}).first().click();const image=await review(page,'Fotografiar garantía o ticket');await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(2560);
 await expect(page.getByText(/Documento con más detalle ·/)).toBeVisible();await expect(page.getByRole('link',{name:'Ver foto en grande',exact:true})).toHaveAttribute('href',await image.getAttribute('src')??'');
});
