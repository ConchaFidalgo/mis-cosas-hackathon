export type DateOnly = string;
export type ItemStatus = 'en uso' | 'guardado' | 'en venta' | 'reservado' | 'disponible para donar' | 'donación acordada' | 'vendido' | 'donado' | 'reciclado';
export type Platform = 'ebay' | 'facebook';
export interface Asset { id: string; name: string; type: 'photo' | 'document'; url: string; size: number; blob?: Blob; }
export interface Warranty { id: string; provider: string; coverage?: string; start?: DateOnly; end?: DateOnly; confirmed: boolean; contact?: string; notes?: string; documentIds?: string[]; }
export interface ItemEvent { id: string; date: string; title: string; origin: string; }
export interface Loan { id: string; person: string; given: DateOnly; due?: DateOnly; returned?: DateOnly; accessories: string; returnNotes?: string; previousDates: DateOnly[]; reviewDate?: DateOnly; }
export interface Donation { id: string; person: string; due?: DateOnly; delivered?: DateOnly; cancelled?: boolean; conditions: string; text: string; photoIds: string[]; }
export interface Draft { id: string; platform: Platform; title: string; description: string; price: number; photoIds: string[]; version: number; approved: boolean; }
export interface Publication { id: string; platform: Platform; url: string; status: 'publicada' | 'pausada' | 'reservada' | 'retirada' | 'vendida'; price: number; date: DateOnly; removalPending?: boolean; nextAction?:string; actionDate?:DateOnly; lastReviewed?:DateOnly; offers: {id:string;amount:number;date:DateOnly;note:string}[]; }
export interface Item { id: string; name: string; category: string; status: ItemStatus; location: string; description: string; brand: string; model: string; condition: string; defects: string; accessories: string; archived: boolean; purchased?: DateOnly; purchasePrice?: number; seller?: string; assets: Asset[]; warranties: Warranty[]; loans: Loan[]; donations: Donation[]; drafts: Draft[]; publications: Publication[]; events: ItemEvent[]; donationDraft?:{text:string;conditions:string;photoIds:string[]}; sale?: {amount:number;platform:Platform;date:DateOnly}; }
export interface Subscription { id:string; service:string; company:string; category?:string; status:'prueba gratuita'|'activa'|'cancelación solicitada'|'cancelada'|'finalizada'; phaseBeforeCancellation?:'prueba gratuita'|'activa'; cost?:number; period:'monthly'|'yearly'; start?:DateOnly; trialEnd?:DateOnly; firstCharge?:DateOnly; renewal?:DateOnly; cancelBy?:DateOnly; promoPrice?:number; effectiveEnd?:DateOnly; url?:string; notes?:string; events:ItemEvent[]; }
export interface Alert { id:string; title:string; description:string; date:DateOnly; href:string; kind:'warranty'|'loan'|'subscription'|'sale'; }
export interface AlertResolution { id:string; completed?:boolean; postponed?:DateOnly; }
export interface EmailJob { id:string; operationId:string; itemId:string; date:string; status:'simulated'; kind?:'sale'|'donation'; donationText?:string; donationConditions?:string; drafts:Draft[]; assets:Asset[]; }
export interface AppState { schemaVersion:1; items:Item[]; subscriptions:Subscription[]; resolutions:AlertResolution[]; emails:EmailJob[]; }
export type ItemCommand =
| {type:'lend';person:string;due?:DateOnly;accessories?:string;reviewDate?:DateOnly}
| {type:'extend';due:DateOnly}
| {type:'return';accessories:string}
| {type:'donateAgree';person:string;due?:DateOnly;conditions?:string;photoIds?:string[]}
| {type:'donateDeliver'} | {type:'donateCancel'} | {type:'donateAvailable'}
| {type:'sell';amount:number;platform:Platform} | {type:'reserve'} | {type:'unreserve'}
| {type:'deleteWarranty';id:string;deleteDocuments?:boolean}
| {type:'deleteAsset';id:string} | {type:'archive';value:boolean}
| {type:'care';note:string};
export interface SaleInput { price:number; photoIds:string[]; delivery:string; negotiable:boolean; locality?:string; }

