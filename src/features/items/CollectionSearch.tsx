import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Search,MapPin,Package} from 'lucide-react';
import {useStore} from '../../app/Store';
import {searchCollection} from '../../domain/search';
import './search.css';
export function CollectionSearch(){
 const {state}=useStore(),[query,setQuery]=useState('');
 const results=searchCollection(state.items,state.borrowed,query,state.subscriptions);
 return <><header><p className="muted">Encuéntrame</p><h1>Encuentra lo que necesitas</h1><p>Busca objetos, documentos y suscripciones.</p></header>
 <div className="collection-search"><Search size={21}/><input autoFocus aria-label="Buscar objetos, documentos y suscripciones" placeholder="Ejemplo: brocas, factura o música" value={query} onChange={e=>setQuery(e.target.value)}/></div>
 <p role="status" aria-live="polite">{query.trim()?`${results.length} ${results.length===1?'resultado':'resultados'}`:'Escribe para buscar en todas las ubicaciones, incluidos objetos archivados, prestados y donados.'}</p>
 <div className="search-results">{results.map(i=><article className="search-result" key={i.id}><Link className="search-photo" to={i.href}>{i.photo?<img src={i.photo} alt={i.name}/>:<Package size={32}/>}</Link><div><Link to={i.href}><h2>{i.name}</h2></Link><p className="search-where"><MapPin size={18}/><strong>{i.where}</strong></p><small>{i.status}</small>{i.content?<p><strong>Contenido:</strong> {i.content}</p>:null}<Link className="text-button" to={i.href}>Ver ficha</Link></div></article>)}</div>
 {query.trim()&&!results.length?<div className="empty"><Package size={40}/><h2>No encontramos coincidencias</h2><p>Prueba otro nombre o una palabra del contenido.</p></div>:null}
 <p className="muted">La ubicación es la última que has registrado. Los documentos se buscan por su nombre de archivo; no se lee el interior de fotos o PDF.</p></>;
}
