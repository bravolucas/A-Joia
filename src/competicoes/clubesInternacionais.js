import {CLUBES_EUROPEUS_EXTRAS} from './clubesEuropeusExtras.js';

/** Adversários reais, sem vagas de carreira/mercado. Forças são estimativas do jogo. */
const sul = [
 ['Bolívia', [['Bolívar',74,'#60b8eb'],['The Strongest',71,'#f2c531'],['Always Ready',67,'#d72435'],['Jorge Wilstermann',64,'#c12735'],['Blooming',62,'#75bce9'],['Oriente Petrolero',62,'#16845a'],['Nacional Potosí',65,'#d42938'],['Aurora',61,'#69b7e5']]],
 ['Peru', [['Universitario de Deportes',71,'#f3dfb4'],['Alianza Lima',70,'#21375f'],['Sporting Cristal',70,'#68bce5'],['Melgar',67,'#c91b2c'],['Cienciano',64,'#bd2631'],['Cusco FC',64,'#bb8c32'],['Sport Huancayo',61,'#b82533'],['Deportivo Garcilaso',61,'#7bb8de']]],
 ['Venezuela', [['Deportivo Táchira',65,'#e6bd35'],['Caracas',64,'#c92937'],['Carabobo',63,'#9e2637'],['Deportivo La Guaira',63,'#ef872e'],['Monagas',62,'#2966a2'],['Metropolitanos',61,'#715097'],['Zamora',60,'#eeeeee'],['Universidad Central de Venezuela',63,'#69b4df']]],
 ['Uruguai', [['Defensor Sporting',66,'#734391'],['Danubio',64,'#eeeeee'],['Liverpool de Montevidéu',65,'#265e96'],['Montevideo Wanderers',63,'#eeeeee'],['Racing de Montevidéu',62,'#369a63'],['Cerro Largo',62,'#3f8ec9']]],
 ['Paraguai', [['Libertad',72,'#eeeeee'],['Guaraní',67,'#e6bb2f'],['Nacional de Asunción',65,'#eeeeee'],['Sportivo Luqueño',64,'#e8bd37'],['Sportivo Ameliano',62,'#2f5ca1'],['Guairena',60,'#73b5dc']]],
 ['Equador', [['Emelec',69,'#236cc0'],['El Nacional',66,'#ca2c39'],['Aucas',66,'#e6bd36'],['Universidad Católica de Quito',67,'#78b9df'],['Deportivo Cuenca',63,'#c22d39'],['Mushuc Runa',63,'#985b31']]],
 ['Chile', [['Palestino',67,'#278251'],['Unión Española',65,'#c62b35'],['Huachipato',66,'#285d9c'],['Cobresal',64,'#ed8e33'],['Audax Italiano',63,'#2f8a52'],['Everton de Viña del Mar',64,'#e7c33d'],['Coquimbo Unido',66,'#e1b938'],['Cobreloa',62,'#ec8333']]],
 ['Colômbia', [['América de Cali',69,'#cf2938'],['Deportivo Cali',66,'#258556'],['Once Caldas',65,'#eeeeee'],['Independiente Medellín',69,'#c82a3a'],['Independiente Santa Fe',69,'#d12e3d'],['Deportes Tolima',70,'#8c293d'],['Deportivo Pereira',64,'#e4bc34'],['Atlético Bucaramanga',65,'#dabb38']]],
];
export const CLUBES_SULAMERICANOS_EXTRAS=sul.flatMap(([pais,times])=>times.map(([nome,forca,cor])=>({nome,forca,elenco:forca,cor,pais,liga:'sulamericano-extra',extra:true,naoJogavel:true,regiao:'sul'})));
const paisSul={
 'Peñarol':'Uruguai','Nacional de Montevidéu':'Uruguai','Atlético Nacional':'Colômbia','Millonarios':'Colômbia','Junior de Barranquilla':'Colômbia','Colo-Colo':'Chile','Universidad de Chile':'Chile','Universidad Católica':'Chile','Olimpia':'Paraguai','Cerro Porteño':'Paraguai','LDU de Quito':'Equador','Independiente del Valle':'Equador','Barcelona de Guayaquil':'Equador',
};
const hash=s=>[...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);
const ruido=(ano,nome)=>((hash(`${ano}|${nome}|classificacao-internacional`)%100001)/100000-.5)*14;
const unicos=times=>[...new Map(times.map(c=>[c.nome,c])).values()];
const ordemAno=(times,ano)=>[...times].sort((a,b)=>(b.forca+ruido(ano,b.nome))-(a.forca+ruido(ano,a.nome))||a.nome.localeCompare(b.nome));

// Edições variam sem sortear de novo ao recarregar. Um clube só disputa um continental.
export function classificacaoInternacionalSul(ano=2026,catalogo=[]){
 const clubes=unicos([...catalogo.filter(c=>paisSul[c.nome]).map(c=>({...c,pais:paisSul[c.nome]})),...CLUBES_SULAMERICANOS_EXTRAS]);
 return Object.fromEntries([...new Set(clubes.map(c=>c.pais))].flatMap(pais=>ordemAno(clubes.filter(c=>c.pais===pais),ano).slice(0,8).map((c,i)=>[c.nome,{competicao:i<4?'libertadores':'sulamericana',entrada:i<2||i>=4?'principal':'pre',motivo:`Classificação simulada em ${pais}`,ano:ano+1}])));
}
export function extrasInternacionais(competicao,ano=2026,catalogo=[]){
 if(['libertadores','sulamericana'].includes(competicao)){
  const vagas=classificacaoInternacionalSul(ano-1,catalogo);
  return CLUBES_SULAMERICANOS_EXTRAS.filter(c=>vagas[c.nome]?.competicao===competicao);
 }
 if(!['champions','europa','conference'].includes(competicao))return [];
 const times=CLUBES_EUROPEUS_EXTRAS;
 return [...new Set(times.map(c=>c.pais))].flatMap(pais=>ordemAno(times.filter(c=>c.pais===pais),ano-1).slice(0,3).map((c,i)=>({...c,competicaoInternacional:['champions','europa','conference'][i],naoJogavel:true}))).filter(c=>c.competicaoInternacional===competicao);
}
export function ampliarParticipantesInternacionais(pool,competicao,ano=2026,catalogo=[]){
 const nomes=new Set(pool.map(c=>c.nome));
 return [...pool,...extrasInternacionais(competicao,ano,catalogo).filter(c=>!nomes.has(c.nome))];
}
export function clubeInternacional(nome){return [...CLUBES_SULAMERICANOS_EXTRAS,...CLUBES_EUROPEUS_EXTRAS].find(c=>c.nome===nome)||null;}
