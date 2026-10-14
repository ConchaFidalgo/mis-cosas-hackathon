import type { Draft } from './types';
export function latestDrafts(drafts:Draft[]):Draft[]{return (['ebay','facebook'] as const).flatMap(p=>{const matches=drafts.filter(d=>d.platform===p);const latest=matches.reduce<Draft|undefined>((a,b)=>!a||b.version>=a.version?b:a,undefined);return latest?[structuredClone(latest)]:[];});}
