import {test,expect} from '@playwright/test';
test('noventa se propone como 90 y solo se aplica después de revisión',async({page})=>{
 await page.addInitScript(()=>{class Recognition{lang='';continuous=false;interimResults=false;onresult:((e:unknown)=>void)|null=null;onerror=null;onend:(()=>void)|null=null;start(){setTimeout(()=>{this.onresult?.({results:[{isFinal:true,0:{transcript:'noventa'}}]});this.onend?.();},30);}stop(){this.onend?.();}abort(){}}Object.assign(window,{SpeechRecognition:Recognition});});
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();await page.getByRole('button',{name:'Dictar Precio solicitado (€)',exact:true}).click();await page.getByRole('button',{name:'Empezar dictado',exact:true}).click();
 await expect(page.getByLabel('Propuesta para Precio solicitado (€)',{exact:true})).toHaveValue('90');await expect(page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true})).toHaveValue('');
 await page.getByRole('button',{name:'Aplicar al campo',exact:true}).click();await expect(page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true})).toHaveValue('90');
});
test('un dictado sin palabras explica el problema y permite reintentar',async({page})=>{
 await page.addInitScript(()=>{class Recognition{lang='';continuous=false;interimResults=false;onresult=null;onerror=null;onend:(()=>void)|null=null;start(){setTimeout(()=>this.onend?.(),20);}stop(){}abort(){}}Object.assign(window,{SpeechRecognition:Recognition});});
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();await page.getByRole('button',{name:'Dictar Precio solicitado (€)',exact:true}).click();await page.getByRole('button',{name:'Empezar dictado',exact:true}).click();await expect(page.getByRole('alert')).toContainText('No se ha reconocido');await expect(page.getByRole('button',{name:'Dictar Precio solicitado (€)',exact:true})).toBeVisible();
});
test('diecinueve coma noventa se convierte en 19,90',async({page})=>{
 await page.addInitScript(()=>{class Recognition{lang='';continuous=false;interimResults=false;onresult:((e:unknown)=>void)|null=null;onerror=null;onend:(()=>void)|null=null;start(){setTimeout(()=>{this.onresult?.({results:[{isFinal:true,0:{transcript:'diecinueve coma noventa'}}]});this.onend?.();},30);}stop(){this.onend?.();}abort(){}}Object.assign(window,{SpeechRecognition:Recognition});});
 await page.goto('/cosas/bicicleta');await page.getByRole('button',{name:'Vender',exact:true}).click();await page.getByRole('button',{name:'Dictar Precio solicitado (€)',exact:true}).click();await page.getByRole('button',{name:'Empezar dictado',exact:true}).click();
 await expect(page.getByLabel('Propuesta para Precio solicitado (€)',{exact:true})).toHaveValue('19,90');await expect(page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true})).toHaveValue('');
 await page.getByRole('button',{name:'Aplicar al campo',exact:true}).click();await expect(page.getByRole('textbox',{name:'Precio solicitado (€) *',exact:true})).toHaveValue('19,90');
});
