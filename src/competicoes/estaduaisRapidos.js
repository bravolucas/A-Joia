import {CLUBES,ESTADUAIS} from '../dados/data.js';
const regionais={SE:['Sergipe','Itabaiana','Lagarto','Falcon'],SP:['Ituano','São Bernardo','Água Santa','Inter de Limeira'],RJ:['Volta Redonda','Madureira','Boavista-RJ','Portuguesa-RJ'],MG:['América-MG','Athletic Club','Tombense','Pouso Alegre'],RS:['Caxias','Brasil de Pelotas','São José-RS','Ypiranga-RS'],PR:['Londrina','Maringá','Operário-PR','Cianorte'],BA:['Juazeirense','Jacuipense','Atlético de Alagoinhas','Bahia de Feira'],CE:['Ferroviário','Iguatu','Maracanã','Floresta'],PE:['Santa Cruz','Retrô','Central','Petrolina'],SC:['Brusque','Marcílio Dias','Hercílio Luz','Barra-SC'],GO:['Aparecidense','Anápolis','Goiânia','Goianésia'],PA:['Tuna Luso','Águia de Marabá','Castanhal','Cametá'],AM:['Nacional-AM','Manaus','Princesa do Solimões','Manauara'],AL:['CSA','ASA','CSE','Murici']};
export const CLUBES_REGIONAIS_EXTRAS=Object.entries(regionais).flatMap(([estado,nomes])=>nomes.map(nome=>({nome,estado,regional:true})));
export function participantesEstadual(clube){
 if(!clube?.estado||!ESTADUAIS[clube.estado])return null;
 const locais=CLUBES.filter(x=>x.estado===clube.estado).map(x=>({...x,elenco:x.forca})),nomes=new Set(locais.map(x=>x.nome));
 const extras=(regionais[clube.estado]||[]).filter(nome=>!nomes.has(nome)).map((nome,i)=>({nome,estado:clube.estado,forca:51+i,elenco:51+i,regional:true}));
 return {nome:ESTADUAIS[clube.estado],estado:clube.estado,clubes:[...locais,...extras],formato:'Estadual rápido: classificação resumida e mata-mata regional; regulamento adaptado, sem misturar estados.'};
}
