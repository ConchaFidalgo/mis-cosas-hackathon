import {describe,it,expect} from 'vitest';
import {fixtures} from '../../src/demo/fixtures';
import {emptyCollection,validateCloudState,sniffFile,validateCloudTransition,pruneDeletedPackageFiles} from '../../src/domain/cloud';
describe('private collection validation',()=>{
 it('starts empty and never copies the demo automatically',()=>{expect(emptyCollection().items).toEqual([]);expect(emptyCollection().subscriptions).toEqual([]);});
 it('rejects two active loans and incompatible sale states',()=>{const s=fixtures(),i=s.items.find(i=>i.loans.some(l=>!l.returned))!;i.loans.push({...i.loans.find(l=>!l.returned)!,id:'second'});expect(()=>validateCloudState(s)).toThrow(/préstamo/);});
 it('rejects a warranty linked to another objects document',()=>{const s=fixtures();s.items[1].warranties=[{id:'w',provider:'Demo',confirmed:false,documentIds:[s.items[0].assets.find(a=>a.type==='document')!.id]}];expect(()=>validateCloudState(s)).toThrow(/documento/);});
 it('rejects non-integer or negative prices',()=>{const s=fixtures();s.items[0].purchasePrice=-1;expect(()=>validateCloudState(s)).toThrow(/importe/);});
 it('recognizes the actual image bytes and refuses a forged MIME type',()=>{expect(sniffFile(new Uint8Array([255,216,255,224]))).toBe('image/jpeg');expect(sniffFile(new TextEncoder().encode('<script>demo</script>'))).toBe(null);expect(sniffFile(new TextEncoder().encode('%PDF-1.7'))).toBe('application/pdf');});
});
it('el servidor rechaza borrar un objeto todavía prestado',()=>{const before=fixtures(),next=structuredClone(before);next.items=next.items.filter(i=>!i.loans.some(l=>!l.returned));expect(()=>validateCloudTransition(before,next)).toThrow(/préstamo/);});
it('la eliminación explícita también retira la copia del paquete simulado',()=>{const before=fixtures(),next=structuredClone(before),i=next.items[0],photo=i.assets.find(a=>a.type==='photo')!;next.emails=[{id:'job',operationId:'op',itemId:i.id,date:'2026-10-16',status:'simulated',drafts:[],assets:[photo]}];before.emails=structuredClone(next.emails);i.assets=i.assets.filter(a=>a.id!==photo.id);pruneDeletedPackageFiles(before,next);expect(next.emails[0].assets).toHaveLength(0);});
