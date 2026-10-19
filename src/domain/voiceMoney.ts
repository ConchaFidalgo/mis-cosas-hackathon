import {parseMoney} from './dates';
const small=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciseis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidos','veintitres','veinticuatro','veinticinco','veintiseis','veintisiete','veintiocho','veintinueve'];
const tens=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
function integer(s:string):number|null{
 if(/^\d+$/.test(s))return Number(s);
 const simple=small.indexOf(s);if(simple>=0)return simple;if(s==='un'||s==='una')return 1;
 for(let n=3;n<=9;n++){if(s===tens[n])return n*10;if(s.startsWith(tens[n]+' y ')){const rest=small.indexOf(s.slice(tens[n].length+3));if(rest>0&&rest<10)return n*10+rest;}}
 const hundreds:Record<string,number>={cien:100,ciento:100,doscientos:200,trescientos:300,cuatrocientos:400,quinientos:500,seiscientos:600,setecientos:700,ochocientos:800,novecientos:900};
 const [first,...rest]=s.split(' ');if(hundreds[first]){if(!rest.length)return hundreds[first];const tail=integer(rest.join(' '));if(tail!==null&&tail>0&&tail<100)return hundreds[first]+tail;}
 return null;
}
/** Conservative: ambiguous transcripts are left for review, never guessed. */
export function voiceMoney(raw:string):string|null{
 const s=raw.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/[€]/g,' euros ').replace(/\s+/g,' ').replace(/[.!]$/,'').trim();
 const numeric=s.replace(/ euros?$/,'');if(/^\d+([,.]\d{1,2})?$/.test(numeric)){try{parseMoney(numeric);return numeric.replace('.',',');}catch{return null;}}
 const parts=s.replace(/ euros? con /,' coma ').replace(/ euros? y /,' coma ').replace(/ centimos?$/,'').replace(/ euros?$/,'').split(/ coma | punto /);
 if(parts.length>2)return null;const whole=integer(parts[0]);if(whole===null||!Number.isSafeInteger(whole))return null;
 if(parts.length===1)return String(whole);let decimals:number|null;if(/^\d{1,2}$/.test(parts[1]))decimals=Number(parts[1].padEnd(2,'0'));else{decimals=integer(parts[1]);if(decimals!==null&&decimals<10&&!/centimos?/.test(s))decimals*=10;}
 if(decimals===null||decimals>99)return null;return whole+','+String(decimals).padStart(2,'0');
}
