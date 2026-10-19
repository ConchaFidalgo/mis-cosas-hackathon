import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Search, ShieldCheck, Package, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../app/Store';
import { activeLoan, warrantyStatus } from '../../domain/rules';
import { dateLabel, todayMadrid } from '../../domain/dates';
import { ItemForm, categories } from './ItemForm';
export function Catalog(){
 const {state}=useStore(),[query,setQuery]=useState(''),[filter,setFilter]=useState('Todos'),[category,setCategory]=useState(''),[adding,setAdding]=useState(false);
 const items=state.items.filter(i=>{
  if(filter==='Archivados'?!i.archived:!query&&i.archived)return false;
  if(category&&i.category!==category)return false;
  if(query&&![i.name,i.brand,i.model,i.location,i.storagePurpose??'',i.storageContents??'',...i.donations.map(d=>d.person)].join(' ').toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')))return false;
  if(filter==='En uso')return i.status==='en uso'&&!activeLoan(i);
  if(filter==='Guardados')return i.status==='guardado'&&!activeLoan(i);
  if(filter==='Prestados')return !!activeLoan(i);
  if(filter==='Para vender')return ['en venta','reservado'].includes(i.status);
  if(filter==='Donados')return i.status==='donado';
  if(filter==='Para donar')return ['disponible para donar','donación acordada'].includes(i.status);
  return true;
 });
 const warranty=state.items.flatMap(item=>item.warranties.map(w=>({item,w}))).find(({w})=>['próxima a vencer','vence hoy','vigente'].includes(warrantyStatus(w,todayMadrid())));
 return <><header className="catalog-head"><div className="breadcrumb">Mi colección <ArrowUpRight size={14}/></div>{warranty?<Link to="/garantias" className="warranty-shortcut"><span><ShieldCheck size={22}/></span><div><strong>{warranty.item.name==='Cafetera espresso'?'Tu cafetera sigue protegida':warranty.item.name+' · Garantía'}</strong><small>Garantía hasta el {dateLabel(warranty.w.end)}</small></div></Link>:null}<h1>Mis cosas</h1><p>Un lugar para todo lo que forma parte de tu vida.</p><small className="collection-count">{items.length} {items.length===1?'objeto':'objetos'}</small><div className="catalog-actions"><div className="search"><Search size={19}/><input aria-label="Buscar tus cosas" placeholder="Buscar tus cosas" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="button" onClick={()=>setAdding(true)}><Plus size={20}/> Añadir objeto</button></div></header>
 <div className="catalog-toolbar"><div className="tabs" role="tablist" aria-label="Filtrar objetos">{['Todos','En uso','Guardados','Prestados','Para vender','Para donar','Donados','Archivados'].map(t=><button role="tab" aria-selected={filter===t} key={t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}</button>)}</div><select className="category-filter" aria-label="Filtrar por categoría" value={category} onChange={e=>setCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
 <div className="catalog-grid">{items.map((i,index)=>{const loan=activeLoan(i),status=loan?'Prestado':i.status==='disponible para donar'?'Para donar':i.status==='en venta'?'En venta':i.status[0].toUpperCase()+i.status.slice(1),photo=i.assets.find(a=>a.type==='photo');return <article className="object-card" key={i.id} style={{animationDelay:index*45+'ms'}}><Link className="object-image" to={'/cosas/'+i.id}>{photo?<img src={photo.url} alt={i.name} loading={index<3?'eager':'lazy'} width="1200" height="900"/>:<div className="no-photo"><Package size={52}/></div>}<span className="image-open"><ArrowUpRight size={20}/></span></Link><div className="card-title"><Link to={'/cosas/'+i.id}><h2>{i.name}</h2></Link><Link className="card-more" to={'/cosas/'+i.id} aria-label={'Abrir ficha de '+i.name}><span>•••</span></Link></div><div className="card-meta"><span className="card-location"><MapPin size={15}/>{loan?'Prestado a '+loan.person:i.location||'Sin ubicación'}</span><span className={'status '+(loan?'blue':['en venta','disponible para donar'].includes(i.status)?'yellow':i.status==='en uso'?'green':'')}>{status}</span></div>{i.donations.some(d=>d.delivered)?<p className="muted">{i.donations.filter(d=>d.delivered).map(d=>'Donado'+(d.person?' a '+d.person:'')+' el '+dateLabel(d.delivered)).join(' · ')}</p>:null}</article>;})}</div>{!items.length?<div className="empty"><Package size={42}/><h2>{filter==='Archivados'?'No hay objetos archivados':'No encontramos objetos aquí'}</h2><p>{query?'Prueba otro nombre, marca, modelo o ubicación.':'Puedes añadir un objeto o cambiar los filtros.'}</p><button className="button secondary" onClick={()=>{setQuery('');setFilter('Todos');setCategory('');}}>Ver todos</button></div>:null}<footer className="collection-footer">Tus cosas pueden tener otra vida.</footer>{adding?<ItemForm onClose={()=>setAdding(false)}/>:null}</>;
}

