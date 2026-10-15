import { describe, it, expect } from 'vitest';
import { latestDrafts,approveDrafts } from '../../src/domain/listings';
import type { Draft } from '../../src/domain/types';
import type { Platform } from '../../src/domain/types';
import { prepareListings, platformName } from '../../src/domain/rules';
import { blankItem } from '../../src/demo/fixtures';
const d=(id:string,version:number,platform:Platform='ebay'):Draft=>({id,version,platform,title:'Título '+id,description:'Texto '+id,price:version*1000,photoIds:[],approved:true});
describe('paquete de versiones',()=>{it('solo lleva la versión más reciente por plataforma',()=>{const result=latestDrafts([d('old',1),d('new',2),d('fb',1,'facebook')]);expect(result.map(d=>d.id)).toEqual(['new','fb']);});});

it('conserva la última versión de las cuatro plataformas y prioriza Vinted y Wallapop',()=>{
 const result=latestDrafts([d('ebay',1),d('v-old',1,'vinted'),d('fb',1,'facebook'),d('v-new',2,'vinted'),d('w',1,'wallapop')]);
 expect(result.map(d=>d.id)).toEqual(['v-new','w','ebay','fb']);
});
it('prepara cuatro anuncios con sus nombres correctos y conserva los defectos',()=>{
 const item={...blankItem(),name:'Chaqueta',category:'Ropa',defects:'Falta un botón',drafts:[d('v-old',2,'vinted')]};
 const drafts=prepareListings(item,{price:1500,photoIds:[],delivery:'Recogida acordada',negotiable:false});
 expect(drafts.map(d=>platformName(d.platform))).toEqual(['Vinted','Wallapop','eBay','Facebook Marketplace']);
 expect(drafts[0]).toMatchObject({version:3,price:1500,approved:false});
 expect(drafts.every(d=>d.description.includes('Falta un botón'))).toBe(true);
});
it('una edición obsoleta no puede ocultar un defecto añadido en otra pestaña',()=>{
 const before=d('v1',1,'vinted'),latest={...d('v2',2,'vinted'),description:'Tiene una grieta'};
 expect(()=>approveDrafts([before,latest],[{...before,title:'Título cambiado'}])).toThrow('otra pestaña');
});

