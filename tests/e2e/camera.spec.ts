import {test,expect,type Page} from '@playwright/test';

test.use({launchOptions:{args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']}});
async function openForm(page:Page){await page.goto('/cosas');await page.getByRole('button',{name:'Añadir objeto',exact:true}).click();}
// Only the external camera API is doubled: video playback, JPEG capture, FileReader and persistence stay real.
async function observeCamera(page:Page,delay=0){await page.addInitScript(delayMs=>{Object.assign(window,{cameraStreams:[]});navigator.mediaDevices.getUserMedia=async constraints=>{if(constraints?.audio)throw new Error('No debe pedir audio');const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const context=canvas.getContext('2d')!;const stream=canvas.captureStream(15);function paint(){if(stream.getVideoTracks()[0].readyState==='ended')return;context.fillStyle='#617361';context.fillRect(0,0,640,480);requestAnimationFrame(paint);}paint();(window as unknown as {cameraStreams:MediaStream[]}).cameraStreams.push(stream);if(delayMs)await new Promise(resolve=>setTimeout(resolve,delayMs));return stream;};},delay);}
async function tracksEnded(page:Page){await expect.poll(()=>page.evaluate(()=>(window as unknown as {cameraStreams:MediaStream[]}).cameraStreams.flatMap(s=>s.getTracks()).every(t=>t.readyState==='ended'))).toBe(true);}

test('captura revisada se añade solo al confirmar y persiste al guardar',async({page})=>{
 await observeCamera(page);await page.addInitScript(()=>{const read=FileReader.prototype.readAsDataURL;FileReader.prototype.readAsDataURL=function(blob){setTimeout(()=>read.call(this,blob),600);};});await openForm(page);await page.getByLabel('Nombre *',{exact:true}).fill('Objeto con cámara');await page.getByLabel('Categoría *',{exact:true}).selectOption('Otros');
 await page.getByRole('button',{name:'Hacer foto',exact:true}).click();await expect(page.getByRole('button',{name:'Tomar foto',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Tomar foto',exact:true}).click();await expect(page.getByRole('img',{name:'Foto para revisar',exact:true})).toBeVisible();await expect(page.locator('.photo-editor img')).toHaveCount(0);await tracksEnded(page);
 await page.getByRole('button',{name:'Repetir foto',exact:true}).click();await page.getByRole('button',{name:'Tomar foto',exact:true}).click();
 await page.getByRole('button',{name:'Añadir al objeto',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar',exact:true})).toBeDisabled();await expect(page.locator('.photo-editor img')).toHaveCount(1);await expect(page.getByRole('button',{name:'Guardar',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Guardar',exact:true}).click();await page.reload();await expect(page.getByRole('img',{name:'Objeto con cámara',exact:true})).toBeVisible();
});

test('cancelar cámara descarta foto y libera el vídeo',async({page})=>{
 await observeCamera(page);await openForm(page);await page.getByRole('button',{name:'Hacer foto',exact:true}).click();await expect(page.getByRole('button',{name:'Tomar foto',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Tomar foto',exact:true}).click();await expect(page.getByRole('img',{name:'Foto para revisar',exact:true})).toBeVisible();await page.getByRole('button',{name:'Cancelar cámara',exact:true}).click();await tracksEnded(page);await expect(page.locator('.photo-editor img')).toHaveCount(0);
 await page.getByRole('button',{name:'Hacer foto',exact:true}).click();await expect(page.getByRole('button',{name:'Tomar foto',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Cerrar',exact:true}).click();await tracksEnded(page);
});

test('permiso denegado conserva el formulario y la selección de archivos',async({page})=>{
 await page.addInitScript(()=>{navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('denied','NotAllowedError'));});await openForm(page);await page.getByLabel('Nombre *',{exact:true}).fill('Conservado');await page.getByRole('button',{name:'Hacer foto',exact:true}).click();await expect(page.getByRole('alert')).toContainText('permitido');await page.getByRole('button',{name:'Cancelar cámara',exact:true}).click();await expect(page.getByLabel('Nombre *',{exact:true})).toHaveValue('Conservado');await expect(page.locator('input[type=file][multiple]').first()).toBeEnabled();
});

test('cancelar una solicitud pendiente detiene su resultado tardío',async({page})=>{
 await observeCamera(page,700);await openForm(page);await page.getByRole('button',{name:'Hacer foto',exact:true}).click();await page.getByRole('button',{name:'Cancelar cámara',exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as unknown as {cameraStreams:MediaStream[]}).cameraStreams.length)).toBeGreaterThan(0);await tracksEnded(page);await expect(page.getByRole('button',{name:'Tomar foto',exact:true})).toHaveCount(0);
});

