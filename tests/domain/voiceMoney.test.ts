import {it,expect} from 'vitest';
import {voiceMoney} from '../../src/domain/voiceMoney';
it('convierte importes dictados en español sin perder los céntimos',()=>{
 for(const [spoken,price] of [['noventa','90'],['90','90'],['noventa euros','90'],['diecinueve coma noventa','19,90'],['19,90 €','19,90'],['diecinueve euros con noventa céntimos','19,90'],['cero coma cinco','0,50'],['ciento veinte','120']])expect(voiceMoney(spoken)).toBe(price);
});
it('no inventa un precio ante un dictado vacío o ambiguo',()=>{
 for(const spoken of ['', '19 90','noventa o diecinueve','menos noventa','diecinueve coma novecientos','1.234,56'])expect(voiceMoney(spoken)).toBeNull();
});
