import type { AppState, Item, Subscription } from '../domain/types';
import { addDays, todayMadrid, uid } from '../domain/dates';
export function blankItem():Item{return {id:uid(),name:'',category:'',status:'en uso',location:'',description:'',brand:'',model:'',condition:'Usado',defects:'',accessories:'',archived:false,assets:[],warranties:[],loans:[],donations:[],drafts:[],publications:[],events:[]};}
export function fixtures():AppState{
 const today=todayMadrid();
 const specs=[
 ['cafetera','Cafetera espresso','Electrodomésticos','Cocina','en uso','Cafetera doméstica de demostración.','', 'Filtro y portafiltro'],
 ['bicicleta','Bicicleta urbana','Deporte','Garaje','en venta','Bicicleta urbana de demostración.','Marcas de uso en el cuadro.',''],
 ['abrigo','Abrigo de entretiempo','Ropa','Armario','guardado','Abrigo de demostración. Largo: 105 cm, pecho: 52 cm, medidas aportadas.','',''],
 ['taladro','Taladro inalámbrico','Herramientas','Garaje','en uso','Taladro de demostración.','Falta una broca.','Cargador y maletín'],
 ['consola','Consola','Tecnología','Salón','guardado','Consola de demostración.','El mando presenta desgaste en un botón.','Un mando'],
 ['lampara','Lámpara de mesa','Hogar','Estudio','disponible para donar','Lámpara decorativa de demostración.','Pequeña marca en la base.','']
 ];
 const items:Item[]=specs.map(([id,name,category,location,status,description,defects,accessories])=>({...blankItem(),id,name,category,location,status:status as Item['status'],description,defects,accessories,assets:[{id:id+'-photo',name:'Foto de demostración',type:'photo' as const,url:'/demo/'+id+'.webp',size:100000}],events:[{id:uid(),date:today,title:'Objeto añadido a la colección',origin:'demo'}]}));
 items[0].warranties=[{id:'w-coffee',provider:'Tienda ficticia',coverage:'Cobertura declarada de demostración',start:addDays(today,-343),end:addDays(today,23),confirmed:true,documentIds:['receipt-demo']}];
 items[0].assets.push({id:'receipt-demo',name:'Factura ficticia · Demo',type:'document',url:'/demo/factura-demo.pdf',size:2500});
 items[3].loans=[{id:'loan-drill',person:'Alex',given:addDays(today,-5),due:addDays(today,2),accessories:'Cargador y maletín',previousDates:[]}];
 items[2].loans=[{id:'loan-coat',person:'Luz',given:addDays(today,-12),due:addDays(today,-2),accessories:'',previousDates:[]}];
 items[1].loans=[{id:'loan-bike',person:'Sol',given:addDays(today,-20),due:addDays(today,-10),returned:addDays(today,-11),accessories:'',previousDates:[]}];
 const subscriptions:Subscription[]=[
 {id:'sub-cloud',service:'Nube personal',company:'Nubia · Ficticia',status:'prueba gratuita',cost:499,period:'monthly',trialEnd:addDays(today,6),firstCharge:addDays(today,9),cancelBy:addDays(today,4),promoPrice:799,events:[]},
 {id:'sub-music',service:'Música en casa',company:'Melodía · Ficticia',status:'activa',cost:1099,period:'monthly',renewal:addDays(today,20),events:[]},
 {id:'sub-reading',service:'Club de lectura',company:'Página · Ficticia',status:'activa',cost:6000,period:'yearly',renewal:addDays(today,7),events:[]}
 ];
 return {schemaVersion:1,items,subscriptions,resolutions:[],emails:[]};
}

