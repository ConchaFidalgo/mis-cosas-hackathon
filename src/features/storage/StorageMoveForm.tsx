import {useState} from 'react';
import type {Item} from '../../domain/types';
import {isInStorage,moveStorage} from '../../domain/storage';
import {todayMadrid} from '../../domain/dates';
import {useStore} from '../../app/Store';
import {ActionForm} from '../../components/ActionForm';
export function StorageMoveForm({item,onClose}:{item:Item;onClose:()=>void}){
 const {update,toast}=useStore();
 const [original]=useState(()=>({id:item.id,location:item.location,inside:isInStorage(item)}));
 return <ActionForm title={original.inside?'Sacar objeto del trastero':'Meter objeto en el trastero'} submit={original.inside?'Registrar salida':'Registrar entrada'} onClose={onClose}
 fields={[...(original.inside?[{key:'destination',label:'Nueva ubicación',required:true}]:[]),{key:'date',label:original.inside?'Fecha de salida':'Fecha de almacenaje',type:'date',value:todayMadrid(),required:true}]}
 note="Se actualiza su ubicación y se conserva el historial. Puede seguir en venta o disponible para donar mientras está en el trastero."
 onSubmit={async v=>{await update(s=>{const n=s.items.findIndex(i=>i.id===original.id);if(n<0)throw new Error('El objeto ya no existe.');s.items[n]=moveStorage(s.items[n],original.inside?'out':'in',v.destination??'',v.date,original.location);});toast(original.inside?'Salida registrada. La ficha se conserva.':'Entrada registrada en el trastero.');}}/>;
}
