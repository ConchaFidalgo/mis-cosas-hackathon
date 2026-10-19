import { useState } from 'react';
import { NavLink, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { Home as HomeIcon, Archive, Tag, Users, CalendarDays, Settings, ShieldCheck, ArrowDownLeft, Heart, Menu, X } from 'lucide-react';
import {StoragePage} from '../features/storage/Storage';
import { Catalog } from '../features/items/Catalog';
import { ItemDetail } from '../features/items/ItemDetail';
import { WarrantiesPage } from '../features/warranties/Warranties';
import { SubscriptionsPage } from '../features/subscriptions/Subscriptions';
import {DonationsPage} from '../features/donations/Donations';
import { SalesPage } from '../features/sales/Sales';
import { LoansPage } from '../features/loans/Loans';
import { BorrowedPage } from '../features/loans/Borrowed';
import { Home } from '../features/reminders/Home';
import { SettingsPage } from '../features/settings/Settings';
import {useSession} from './Session';
const navigation=[{to:'/inicio',label:'Inicio',icon:HomeIcon},{to:'/cosas',label:'Mis cosas',icon:Archive},{to:'/trastero',label:'Trastero',icon:Archive},{to:'/garantias',label:'Garantías',icon:ShieldCheck},{to:'/ventas',label:'Ventas',icon:Tag},{to:'/donaciones',label:'Donaciones',icon:Heart},{to:'/prestamos',label:'Prestado',icon:Users},{to:'/me-prestan',label:'Me prestan',icon:ArrowDownLeft},{to:'/suscripciones',label:'Suscripciones',icon:CalendarDays}];
export function App(){
 const {session}=useSession();
 const [menu,setMenu]=useState(false),location=useLocation();
 return <><a className="skip-link" href="#main">Saltar al contenido</a><header className="mobile-header"><Link to="/cosas" className="brand"><img src="/favicon.svg" alt="" width="32"/>mis cosas</Link><button className="icon-button" aria-label={menu?'Cerrar navegación':'Abrir navegación'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header><div className="mobile-demo-note" role="note">{session?'Cuenta privada · Guardado en Supabase':'Demo · Datos ficticios'}</div><aside className={'sidebar'+(menu?' open':'')}><Link to="/cosas" className="brand"><img src="/favicon.svg" alt="" width="38"/>mis cosas</Link><nav aria-label="Principal">{navigation.map(n=><NavLink to={n.to} key={n.to} className={({isActive})=>isActive?'nav-link active':'nav-link'} onClick={()=>setMenu(false)}><n.icon size={21} strokeWidth={1.65}/><span>{n.label}</span></NavLink>)}</nav><div className="sidebar-footer"><NavLink to="/ajustes" className={({isActive})=>isActive?'nav-link active':'nav-link'} onClick={()=>setMenu(false)}><Settings size={21} strokeWidth={1.65}/> Ajustes</NavLink><p>{session?'Cuenta privada':'Modo demo · Datos ficticios'}</p></div></aside><main id="main" className="main-content" key={location.pathname}><Routes><Route path="/" element={<Navigate to="/cosas" replace/>}/><Route path="/cosas" element={<Catalog/>}/><Route path="/trastero" element={<StoragePage/>}/><Route path="/cosas/:id" element={<ItemDetail/>}/><Route path="/inicio" element={<Home/>}/><Route path="/garantias" element={<WarrantiesPage/>}/><Route path="/ventas" element={<SalesPage/>}/><Route path="/donaciones" element={<DonationsPage/>}/><Route path="/prestamos" element={<LoansPage/>}/><Route path="/me-prestan" element={<BorrowedPage/>}/><Route path="/suscripciones" element={<SubscriptionsPage/>}/><Route path="/ajustes" element={<SettingsPage/>}/><Route path="*" element={<div className="empty"><h1>No encontramos esta página</h1><Link to="/cosas" className="button">Volver a Mis cosas</Link></div>}/></Routes></main><nav className="mobile-bottom" aria-label="Navegación móvil">{navigation.filter(n=>['/inicio','/cosas','/garantias','/prestamos'].includes(n.to)).map(n=><NavLink key={n.to} to={n.to}><n.icon size={21}/><span>{n.label}</span></NavLink>)}<button aria-label="Más secciones" onClick={()=>setMenu(!menu)}><Menu size={21}/><span>Más</span></button></nav></>;
}

