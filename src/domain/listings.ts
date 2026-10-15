import type { Draft } from './types';
import { salesPlatforms } from './platforms';
import { uid } from './dates';
export function latestDrafts(drafts:Draft[]):Draft[]{return salesPlatforms.flatMap(({id:p})=>{const matches=drafts.filter(d=>d.platform===p);const latest=matches.reduce<Draft|undefined>((a,b)=>!a||b.version>=a.version?b:a,undefined);return latest?[structuredClone(latest)]:[];});}

export function approveDrafts(existing:Draft[],selected:Draft[]):{history:Draft[];approved:Draft[]}{
 const history=structuredClone(existing);
 const approved=selected.map(d=>{
  const saved=history.find(s=>s.id===d.id);
  const latest=latestDrafts(history).find(s=>s.platform===d.platform);
  if(saved&&latest?.id!==saved.id||!saved&&d.version!==(latest?.version??0)+1)throw new Error('El anuncio cambió en otra pestaña. Recarga y revisa la última versión.');
  const same=saved&&saved.title===d.title&&saved.description===d.description&&saved.price===d.price&&JSON.stringify(saved.photoIds)===JSON.stringify(d.photoIds);
  if(same){
   saved.approved=true;return structuredClone(saved);
  }
  const next:Draft={...structuredClone(d),id:uid(),version:Math.max(0,...history.filter(s=>s.platform===d.platform).map(s=>s.version))+1,approved:true};
  history.push(next);return structuredClone(next);
 });
 return {history,approved};
}
