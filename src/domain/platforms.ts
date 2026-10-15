export const salesPlatforms=[
 {id:'vinted',name:'Vinted'},
 {id:'wallapop',name:'Wallapop'},
 {id:'ebay',name:'eBay'},
 {id:'facebook',name:'Facebook Marketplace'},
] as const;
export type Platform=typeof salesPlatforms[number]['id'];
export const platformName=(id:string)=>salesPlatforms.find(p=>p.id===id)?.name??'Plataforma no reconocida';
