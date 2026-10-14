import { describe, it, expect } from 'vitest';
import { latestDrafts } from '../../src/domain/listings';
import type { Draft } from '../../src/domain/types';
const d=(id:string,version:number,platform:'ebay'|'facebook'='ebay'):Draft=>({id,version,platform,title:'Título '+id,description:'Texto '+id,price:version*1000,photoIds:[],approved:true});
describe('paquete de versiones',()=>{it('solo lleva la versión más reciente por plataforma',()=>{const result=latestDrafts([d('old',1),d('new',2),d('fb',1,'facebook')]);expect(result.map(d=>d.id)).toEqual(['new','fb']);});});

