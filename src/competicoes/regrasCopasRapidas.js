import {classificacaoInternacionalSul} from './clubesInternacionais.js';
import {simularCampanhaCopa} from '../treinador/copasEscolha.js';
import {CLUBES} from '../dados/data.js';
import {vagasInternacionais,primeiraLiga,TORNEIOS_INTERNACIONAIS} from './vagasInternacionais.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
export const PAIS_LIGA_COPAS={brasileirao:'Brasil',serieB:'Brasil',argentina:'Argentina',sulamericano:'América do Sul',inglaterra:'Inglaterra',espanha:'Espanha',italia:'Itália',alemanha:'Alemanha',franca:'França',portugal:'Portugal',holanda:'Países Baixos',turquia:'Turquia',arabia:'Arábia Saudita',mls:'Estados Unidos'};
export const COPAS_NACIONAIS={brasileirao:'Copa do Brasil',argentina:'Copa Argentina',inglaterra:'FA Cup',espanha:'Copa del Rey',italia:'Coppa Italia',alemanha:'DFB-Pokal',franca:'Coupe de France',portugal:'Taça de Portugal',holanda:'KNVB Beker',turquia:'Türkiye Kupası',arabia:"King's Cup",mls:'MLS Cup'};
export const idContinental=nome=>/AFC|Asiática|asiatica/i.test(nome||'')?'asia':/CONCACAF|Concacaf/i.test(nome||'')?'concacaf':/sul.?americana/i.test(nome||'')?'sulamericana':/libertadores/i.test(nome||'')?'libertadores':/conference/i.test(nome||'')?'conference':/europa league/i.test(nome||'')?'europa':/champions league/i.test(nome||'')&&!/AFC|asi/i.test(nome)?'champions':null;
export const clubesParaCopas=ligas=>CLUBES.map(c=>({...c,liga:ligas?.[c.nome]||c.liga,pais:PAIS_LIGA_COPAS[primeiraLiga(ligas?.[c.nome]||c.liga)]||c.liga,elenco:c.forca}));
const copaCanonica=nome=>({'Copa do Rei':'Copa del Rey','Copa da França':'Coupe de France','Copa da Turquia':'Türkiye Kupası'}[nome]||nome);
const copasMundoCache=new Map();
export function copaNacionalMundo(nome,pais,clubes,ano){
 const chave=`${ano}|${pais}`;if(copasMundoCache.has(chave))return copasMundoCache.get(chave);
 const pool=clubes.filter(c=>c.pais===pais),eu=pool[0];if(!eu||pool.length<2)return null;
 const camp=simularCampanhaCopa({nome,tipo:'copa',usuario:eu.nome,forcaUsuario:eu.forca,ano,clubes:pool,formato:'mata',seed:`mundo|${chave}|${nome}`});
 const resultado={nome,campeao:camp.campeao,vice:camp.vice};copasMundoCache.set(chave,resultado);return resultado;
}
function viceDe(t){if(t?.vice)return t.vice;const j=t?.fases?.at(-1)?.jogos?.find(j=>!j.bye&&j.vencedor&&[j.casa,j.fora].includes(t.campeao));return j?(j.casa===t.campeao?j.fora:j.casa):null;}
/** Snapshot by club and year. Qualification survives a change of employee or manager. */
export function calcularVagasRapidas({ano,classificacoesMundo={},torneios=[],ligasMundo={},seed='mundo',extrasPorLiga={}}){
 const clubes=clubesParaCopas(ligasMundo),resultado={};
 for(const liga of [...new Set(clubes.map(c=>c.liga))].filter(l=>l===primeiraLiga(l))){
  const rng=geradorTecnico(`${seed}|${ano}|${liga}|tabela-anterior`),reais=classificacoesMundo[liga]?.classificacao;
  const tabela=reais?.length?reais:clubes.filter(c=>c.liga===liga).map(c=>({...c,nota:c.forca+(rng()+rng()-1)*8})).sort((a,b)=>b.nota-a.nota);
  const pais=PAIS_LIGA_COPAS[liga],nacional=torneios.find(t=>copaCanonica(t.nome)===COPAS_NACIONAIS[liga]||(liga==='mls'&&t.nome==='US Open Cup'))||(COPAS_NACIONAIS[liga]?copaNacionalMundo(COPAS_NACIONAIS[liga],pais,clubes,ano):null);
  const doPais=nome=>clubes.find(c=>c.nome===nome)?.pais===pais;
  const continentais=torneios.filter(t=>['champions','libertadores','sulamericana'].includes(idContinental(t.nome))&&doPais(t.campeao)).map(t=>t.campeao);
  const campeaoEuropa=torneios.find(t=>idContinental(t.nome)==='europa'&&doPais(t.campeao))?.campeao;
  const campeaoConference=torneios.find(t=>idContinental(t.nome)==='conference'&&doPais(t.campeao))?.campeao;
  Object.assign(resultado,vagasInternacionais({liga,tabela,ano,campeaoCopa:nacional?.campeao,viceCopa:viceDe(nacional),campeoesContinentais:continentais,campeaoEuropa,campeaoConference,vagasExtrasChampions:extrasPorLiga[liga]||0}));
 }
 // As oito federações vizinhas têm classificação própria, sem liga doméstica jogável.
 for(const c of clubes.filter(c=>c.liga==='sulamericano'))delete resultado[c.nome];
 Object.assign(resultado,classificacaoInternacionalSul(ano,clubes));
 return resultado;
}
export function classificacoesHistoricas(a,ligasMundo={}){
 const mundo={...(a?.classificacoesMundo||{})};if(!a?.clube)return mundo;
 const liga=a.ligaId||a.liga||CLUBES.find(c=>c.nome===a.clube)?.liga;
 let tabela=a.classificacao?.length?a.classificacao:(a.tabelaLiga||[]).map(nome=>({nome}));
 const pos=a.posLiga||a.posicao;
 if(!tabela.length&&Number.isInteger(pos)&&pos>0){tabela=clubesParaCopas(ligasMundo).filter(c=>c.liga===liga&&c.nome!==a.clube).sort((x,y)=>y.forca-x.forca).map(c=>({nome:c.nome}));tabela.splice(Math.min(pos-1,tabela.length),0,{nome:a.clube});}
 if(liga&&tabela.length&&!mundo[liga]?.classificacao?.length)mundo[liga]={classificacao:tabela};return mundo;
}
export function vagaTecnico(t){if(!(t.temporadas||[]).length&&t.vagasInicioAno===t.ano)return t.vagasInicio?.[t.clube]||null;const anterior=[...(t.temporadas||[])].reverse().find(a=>a.ano===t.ano-1);const vagas=anterior?.vagasInternacionaisProxima||calcularVagasRapidas({ano:t.ano-1,classificacoesMundo:classificacoesHistoricas(anterior,t.ligasMundo),torneios:anterior?.torneios,ligasMundo:t.ligasMundo,seed:'treinador'});return vagas[t.clube]||null;}
export function vagaJogador(c,clube){
 const registrada=c.vagasInternacionaisClubes?.[clube.nome];if(registrada?.ano===c.ano)return registrada;
 if(c.vagasInternacionaisAno===c.ano)return null;
 const anteriores=(c.temporadas||[]).filter(t=>t.ano===c.ano-1&&t.clube===clube.nome),ultima=anteriores.at(-1);
 if(ultima){const torneios=[...(ultima.copaNac?[{nome:ultima.copaNac.nome,campeao:ultima.copaNac.fase==='Campeão'?ultima.clube:ultima.copaNac.campeao,vice:ultima.copaNac.fase==='Vice-campeão'?ultima.clube:ultima.copaNac.vice}]:[]),...(ultima.titulos||[]).filter(x=>x.tipo==='continental').map(x=>({nome:x.nome,campeao:ultima.clube}))];
  return calcularVagasRapidas({ano:c.ano-1,classificacoesMundo:classificacoesHistoricas(ultima,c.ligas),torneios,ligasMundo:c.ligas})[clube.nome]||null;
 }
 return calcularVagasRapidas({ano:c.ano-1,ligasMundo:c.ligas})[clube.nome]||null;
}
export const nomeVaga=tipo=>TORNEIOS_INTERNACIONAIS[tipo]||tipo;
export function regiaoDaLiga(liga){const b=primeiraLiga(liga);return ['brasileirao','argentina','sulamericano'].includes(b)?'sul':['inglaterra','espanha','italia','alemanha','franca','portugal','holanda','turquia'].includes(b)?'europa':b;}
