import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,Tag,CalendarDays,Clock3} from 'lucide-react';
import {useStore} from '../../app/Store';
import {salesPlatforms,platformName} from '../../domain/platforms';
import {dateLabel,dateValid,daysBetween,money,parseMoney,todayMadrid} from '../../domain/dates';
import {reviewPublicationPrice} from '../../domain/saleReview';
import {ActionForm} from '../../components/ActionForm';

export function SalesSummary(){
 const {state,update,toast}=useStore(),[review,setReview]=useState<{itemId:string;publicationId:string;price:number;reviews:number}|null>(null),today=todayMadrid();
 const items=state.items.filter(i=>i.drafts.length||i.publications.length||i.sale||['en venta','reservado'].includes(i.status));
 const total=state.items.reduce((sum,i)=>sum+(i.sale?.amount??0),0);
 const reviewItem=review?state.items.find(i=>i.id===review.itemId):undefined,reviewPublication=reviewItem?.publications.find(p=>p.id===review?.publicationId);
 return <>
  <header className="page-header"><div><div className="breadcrumb">Una segunda vida</div><h1>Ventas</h1><p>Tus anuncios, sus precios y el tiempo que llevan publicados.</p></div><div className="sales-total"><small>Ingresos de ventas cerradas</small><strong>{money(total)}</strong></div></header>
  <div className="sales-platforms" aria-label="Plataformas disponibles">{salesPlatforms.map(p=><span className="status" key={p.id}>{p.name}</span>)}</div>
  <p className="muted">Los datos se registran manualmente. La integración para publicar automáticamente en eBay está pendiente de desarrollar y configurar.</p>
  <div className="sale-items">{items.map(item=><section className="sale-item" key={item.id}>
   <header className="sale-item-header"><Link to={'/cosas/'+item.id+'?vista=ventas'} className="sale-item-link">{item.assets.find(a=>a.type==='photo')?<img src={item.assets.find(a=>a.type==='photo')!.url} alt=""/>:<Tag size={28}/>}<div><h2>{item.name}</h2><p>{item.drafts.length} versiones preparadas · {item.publications.length} publicaciones registradas</p></div><ArrowUpRight size={19}/></Link><span className="status">{item.status}</span></header>
   {item.publications.map(p=>{
    const valid=dateValid(p.date),age=valid?daysBetween(p.date,today):undefined,lastPriceReview=p.priceHistory?.at(-1)?.date;
    return <article className="sale-publication" key={p.id} aria-label={'Anuncio en '+platformName(p.platform)+' de '+item.name}>
     <div className="sale-publication-head"><h3>{platformName(p.platform)}</h3><span className={'status '+(p.status==='publicada'?'green':'')}>{p.status}</span></div>
     <dl className="sale-facts"><div className="sale-price"><dt>Precio publicado</dt><dd>{money(p.price)}</dd></div><div><dt><CalendarDays size={15}/> Publicado el</dt><dd>{valid?<time dateTime={p.date}>{dateLabel(p.date)}</time>:'Fecha por confirmar'}</dd></div><div><dt><Clock3 size={15}/> Antigüedad</dt><dd>{age===undefined||age<0?'Revisar fecha':age===0?'Publicado hoy':age+' '+(age===1?'día':'días')}</dd></div></dl>
     {lastPriceReview?<p className="sale-last-review">Última revisión: {dateLabel(lastPriceReview)}</p>:<p className="sale-last-review">Sin revisión de precio registrada</p>}
     {p.nextAction?<p className="sale-followup">Próxima acción: {p.nextAction}{p.actionDate?' · '+dateLabel(p.actionDate):''}</p>:null}
     {p.removalPending?<p className="notice small-note">Pendiente de retirar este anuncio en {platformName(p.platform)}. Mis Cosas no lo ha retirado.</p>:null}
     <div className="button-row"><a className="text-button" href={p.url} target="_blank" rel="noreferrer">Abrir anuncio <ArrowUpRight size={15}/></a>{!item.sale&&['publicada','pausada','reservada'].includes(p.status)&&!['vendido','donado','reciclado','donación acordada'].includes(item.status)?<button className="button secondary small" onClick={()=>setReview({itemId:item.id,publicationId:p.id,price:p.price,reviews:p.priceHistory?.length??0})}>Revisar precio</button>:null}</div>
     {p.priceHistory?.length?<details className="sale-price-history"><summary>Historial de precios</summary>{[...p.priceHistory].reverse().map((h,index)=><div key={index}><time dateTime={h.date}>{dateLabel(h.date)}</time><strong>{money(h.previous)} → {money(h.price)}</strong>{h.note?<p>{h.note}</p>:null}</div>)}</details>:null}
    </article>;
   })}
   {!item.publications.length?<div className="sale-unpublished"><Tag size={24}/><div><h3>Sin publicaciones registradas</h3><p>Precio por registrar</p><p>«En venta» indica tu intención de vender. Añade plataforma, fecha, precio y enlace cuando publiques el anuncio.</p><Link className="button secondary small" to={'/cosas/'+item.id+'?vista=ventas'}>Registrar publicación <ArrowUpRight size={16}/></Link></div></div>:null}
  </section>)}</div>
  {!items.length?<div className="empty"><Tag size={40}/><h2>Da otra vida a lo que ya no usas</h2><p>Elige un objeto de tu colección y prepara su venta.</p><Link className="button" to="/cosas">Elegir objeto</Link></div>:null}
  {review&&reviewItem&&reviewPublication?<ActionForm key={review.publicationId} title={'Revisar precio · '+platformName(reviewPublication.platform)} onClose={()=>setReview(null)} submit="Guardar revisión" note="Anota el precio que ya has confirmado en la plataforma. Mis Cosas guarda esta revisión y su historial; no cambia el anuncio externo. También puedes mantener el precio actual."
   fields={[{key:'price',label:'Precio publicado ahora (€)',value:String(reviewPublication.price/100),required:true},{key:'date',label:'Fecha de revisión',type:'date',value:today,required:true},{key:'note',label:'Nota de revisión',multiline:true}]}
   onSubmit={async values=>{await update(s=>{const index=s.items.findIndex(i=>i.id===review.itemId);if(index<0)throw new Error('El objeto ya no existe.');s.items[index]=reviewPublicationPrice(s.items[index],review.publicationId,{price:parseMoney(values.price),date:values.date,note:values.note},todayMadrid(),{price:review.price,reviews:review.reviews});});toast('Revisión de precio guardada');}}/>:null}
 </>;
}
