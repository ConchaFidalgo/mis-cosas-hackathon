import {test,expect} from '@playwright/test';
test('el acceso se solicita explícitamente y conserva la demo sin enviar correo real',async({page})=>{
 let requests=0;await page.route('**/auth/v1/otp**',async route=>{requests++;await route.fulfill({status:200,contentType:'application/json',body:'{}'});});
 await page.goto('/ajustes');await expect(page.getByRole('heading',{name:'Ajustes',exact:true})).toBeVisible();const login=page.getByRole('button',{name:'Recibir enlace para entrar',exact:true});
 if(!await login.count()){test.skip(true,'Cuenta privada desactivada en esta configuración de demo.');return;}
 expect(requests).toBe(0);await page.getByLabel('Tu correo',{exact:true}).fill('grabacion@example.invalid');await login.click();await expect(page.getByRole('status')).toContainText('Revisa tu correo');expect(requests).toBe(1);await expect(page.getByText('Guardado local disponible',{exact:true})).toBeVisible();
});
