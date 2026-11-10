import {CLUBES} from '../dados/data.js';
import {criarCampanhaCopa,simularCampanhaCopa,chancesCopa,chancePenaltis} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
export const NOME_MUNDIAL_ANUAL='Copa Intercontinental FIFA';
export const CLUBES_MUNDIAIS_EXTRAS=[{nome:'Al Ahly',forca:76},{nome:'Wydad Casablanca',forca:72},{nome:'Espérance de Tunis',forca:70},{nome:'Mamelodi Sundowns',forca:73},{nome:'Auckland City',forca:53}];
export const eCampeaoPrincipal=c=>c?.campeao===c?.usuario&&/Libertadores|Champions League|Champions Asiática|Concacaf/i.test(c.nome)&&!/Europa|Conference|Sul-Americana/i.test(c.nome);
function campeaoRegional(ligas,ano,seed){const pool=CLUBES.filter(c=>ligas.includes(c.liga)).sort((a,b)=>b.forca-a.forca).slice(0,16),eu=pool[0];return simularCampanhaCopa({nome:'Campeão continental',usuario:eu.nome,forcaUsuario:eu.forca,clubes:pool,ano,formato:'mata',seed}).campeao;}
export function criarMundialAnual(c){
 const europeu=/Champions League/i.test(c.nome)&&!/AFC/i.test(c.nome),lib=/Libertadores/i.test(c.nome),seed=`${c.seed}|intercontinental`,rng=geradorTecnico(seed);
 const nomeEuropa=europeu?c.usuario:campeaoRegional(['inglaterra','espanha','italia','alemanha','franca','portugal'],c.ano,seed+'uefa');
 const nomeSul=lib?c.usuario:campeaoRegional(['brasileirao','argentina','sulamericano'],c.ano,seed+'conmebol');
 const de=nome=>CLUBES.find(x=>x.nome===nome),asia=CLUBES.filter(x=>x.liga==='arabia').sort((a,b)=>b.forca-a.forca)[Math.floor(rng()*3)],concacaf=CLUBES.filter(x=>x.liga==='mls').sort((a,b)=>b.forca-a.forca)[Math.floor(rng()*3)];
 const africa=CLUBES_MUNDIAIS_EXTRAS.find(x=>x.nome==='Al Ahly'),oceania=CLUBES_MUNDIAIS_EXTRAS.find(x=>x.nome==='Auckland City');
 const pool=[de(nomeEuropa),de(nomeSul),asia,concacaf,africa,oceania].filter(Boolean);
 if(!pool.some(x=>x.nome===c.usuario))pool.push({nome:c.usuario,forca:c.forcaUsuario});
 // Regional champions take their real entry path; UEFA enters directly in the final.
 const decidir=(a,b)=>{const p=chancesCopa(a.forca,b.forca,'controlar'),d=rng();return d<p.vitoria?a:d<p.vitoria+p.empate?(rng()<chancePenaltis(a.forca,b.forca)?a:b):b;};
 const vencedorAfricaAsia=decidir(asia,decidir(africa,oceania)),vencedorAmericas=decidir(de(nomeSul),concacaf),rival=decidir(vencedorAmericas,vencedorAfricaAsia);
 const roteiro=europeu?[rival.nome]:lib?[concacaf.nome,vencedorAfricaAsia.nome,nomeEuropa]:/Concacaf/i.test(c.nome)?[nomeSul,vencedorAfricaAsia.nome,nomeEuropa]:[decidir(africa,oceania).nome,vencedorAmericas.nome,nomeEuropa];
 const camp=criarCampanhaCopa({nome:NOME_MUNDIAL_ANUAL,tipo:'mundial',usuario:c.usuario,forcaUsuario:c.forcaUsuario,clubes:pool,ano:c.ano,formato:'mata',seed});
 camp.roteiroMundial=roteiro;camp.participantes=6;camp.tamanho=2**roteiro.length;camp.adversario=pool.find(x=>x.nome===roteiro[0]);camp.quadroMata=[[c.usuario,roteiro[0]]];camp.sobreviventes=null;return camp;
}
export function criarMundial32({usuario,forcaUsuario,ano,historico=[],seed}){
 if((ano-2025)%4!==0)return null;
 const vaga=historico.some(x=>x.clube===usuario&&x.ano>=ano-4&&x.ano<ano&&(/Libertadores|Champions League|Champions Asiática|Concacaf/i.test(x.nome||'')||x.titulosConquistados?.some(n=>/Libertadores|Champions League|Champions Asiática|Concacaf/i.test(n))));
 if(!vaga)return null;
 const europa=CLUBES.filter(x=>['inglaterra','espanha','italia','alemanha','franca','portugal','holanda'].includes(x.liga)).sort((a,b)=>b.forca-a.forca).slice(0,12),sul=CLUBES.filter(x=>['brasileirao','argentina','sulamericano'].includes(x.liga)).sort((a,b)=>b.forca-a.forca).slice(0,6),asia=CLUBES.filter(x=>x.liga==='arabia').sort((a,b)=>b.forca-a.forca).slice(0,4),norte=CLUBES.filter(x=>x.liga==='mls').sort((a,b)=>b.forca-a.forca).slice(0,4);
 const extras=[...CLUBES_MUNDIAIS_EXTRAS,{nome:'Inter Miami',forca:76}];
 const pool=[...new Map([...europa,...sul,...asia,...norte,...extras].filter(x=>x.nome!==usuario).map(x=>[x.nome,x])).values()].slice(0,31);
 for(const x of CLUBES.filter(x=>!pool.some(p=>p.nome===x.nome)&&x.nome!==usuario).sort((a,b)=>b.forca-a.forca)){if(pool.length>=31)break;pool.push(x);}
 pool.unshift({nome:usuario,forca:forcaUsuario});
 const camp=criarCampanhaCopa({nome:'Mundial de Clubes FIFA',tipo:'mundial',usuario,forcaUsuario,clubes:pool,ano,formato:'grupos',seed:`${seed}|mundial32|${ano}`});
 camp.formato='mundial32';camp.totalRodadas=3;camp.calendario=camp.calendario.slice(0,3);camp.manual=[0,1,2];return camp;
}
