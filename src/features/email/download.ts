import JSZip from 'jszip';
import type { Asset } from '../../domain/types';
export async function downloadPhotos(assets:Asset[]){
 const photos=assets.filter(a=>a.type==='photo');if(!photos.length)throw new Error('No has seleccionado fotografías.');
 const zip=new JSZip();
 for(const [index,a] of photos.entries()){
  const response=await fetch(a.url);if(!response.ok)throw new Error('No se pudo descargar una fotografía.');
  const blob=await response.blob(),extension=blob.type.includes('jpeg')?'jpg':blob.type.includes('png')?'png':'webp';
  const name=a.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  zip.file(String(index+1).padStart(2,'0')+'-'+name+(name.match(/\.(jpg|jpeg|png|webp)$/i)?'':'.'+extension),blob);
 }
 const blob=await zip.generateAsync({type:'blob'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='mis-cosas-fotos.zip';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}

