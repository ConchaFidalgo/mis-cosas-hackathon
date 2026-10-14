export const uid=()=>crypto.randomUUID();
export function todayMadrid(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function dateValid(s:string){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;}
export function addDays(s:string,n:number){const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function daysBetween(a:string,b:string){return Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);}
export function dateLabel(s?:string){if(!s)return 'Sin fecha confirmada';return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Madrid'}).format(new Date(s.slice(0,10)+'T12:00:00Z'));}
export function money(cents:number){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(cents/100);}
export function parseMoney(value:string){const clean=value.trim().replace(',','.');if(!/^\d+(\.\d{1,2})?$/.test(clean))throw new Error('Escribe un importe con hasta dos decimales.');const n=Math.round(Number(clean)*100);if(!Number.isSafeInteger(n))throw new Error('El importe es demasiado grande.');return n;}

