import {CLUBES_REGIONAIS_EXTRAS} from '../competicoes/estaduaisRapidos.js';
import {HISTORICO_LIGAS,totalLigaHistorica} from '../dados/ligasHistoricas.js';
import {simularSelecoesMundo,simularMundiaisMundo,simularCopinhaMundo} from '../simulacao/copasExternasMundo.js';
import {historicosEstaduaisDoClube} from '../dados/estaduaisHistoricos.js';
import {totalLibertadoresHistoricas} from '../dados/libertadoresHistorica.js';
import {totalSulAmericanaHistoricas} from '../dados/sulamericanaHistorica.js';
import {totalChampionsHistoricas} from '../dados/championsHistorica.js';
import {totalEuropaLeagueHistoricas} from '../dados/europaLeagueHistorica.js';
import {totalConferenceHistoricas} from '../dados/conferenceHistorica.js';
import {totalCopaBrasilHistoricas} from '../dados/copaBrasilHistorica.js';
import {simularEstaduaisMundo} from '../simulacao/estaduaisMundo.js';
import {clubesDoMundo} from '../simulacao/mundoVivo.js';
import {simularClassificacoesMundoTecnico} from '../treinador/classificacoesMundoTecnico.js';
import {anoRegistroTemporada,CLUBES,LIGAS,NACIONALIDADES,ESTADUAIS,PALMARES_HISTORICO,nomeDosTitulos,palmaresInicialDe} from '../dados/data.js';
import {clubesParaCopas,copaNacionalMundo,COPAS_NACIONAIS,calcularVagasRapidas,nomeVaga} from '../competicoes/regrasCopasRapidas.js';
import {ampliarParticipantesInternacionais} from '../competicoes/clubesInternacionais.js';
import {simularCampanhaCopa} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
const clubeCanonico=nome=>({'Atlético Madrid':'Atlético de Madrid','Bayer Leverkusen':'Leverkusen'}[nome]||nome);
const n=x=>Number.isFinite(x)?Math.max(0,x):0;
const chave=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function nomeCanonico(nome){if(!nome)return nome;nome=nome.replace(/^Campeão(?:\s+d[ao])?\s+/i,'');return ({copabrasil:'Copa do Brasil',copadobrasil:'Copa do Brasil',copadorei:'Copa del Rey',copadafranca:'Coupe de France',copadaturquia:'Türkiye Kupası',uefachampionsleague:'Champions League',ligadoscampeoes:'Champions League',copadoscampeoeseuropeus:'Champions League',copadosclubescampeoeseuropeus:'Champions League',europeancup:'Champions League',copalibertadores:'Libertadores',uefaeuropaleague:'Europa League',copadauefa:'Europa League',uefacup:'Europa League',ligaeuropa:'Europa League',uefaconferenceleague:'Conference League',uefaeuropaconferenceleague:'Conference League',ligaconferencia:'Conference League',copasulamericana:'Copa Sul-Americana',sulamericana:'Copa Sul-Americana',copasudamericana:'Copa Sul-Americana',sudamericana:'Copa Sul-Americana',conmebolsudamericana:'Copa Sul-Americana'})[chave(nome)]||nome;}
const idEdicao=(ano,nome)=>`${ano}|${chave(nomeCanonico(nome))}`;
const nacionais=new Set([...Object.values(COPAS_NACIONAIS),'Copa do Rei','Copa da França','Copa da Turquia']);
const regionais=new Set(Object.values(ESTADUAIS).map(x=>typeof x==='string'?x:x?.nome));
export const tipoTaca=nome=>regionais.has(nome)?'estadual':/Mundial|Intercontinental/i.test(nome)?'mundial':/Champions|Libertadores|Europa League|Conference|Sul-Americana|Concacaf/i.test(nome)?'continental':nacionais.has(nome)?'copa':'liga';
// O cadastro antigo misturava títulos continentais distintos. Não rotular UEFA como Champions.
const CONTINENTAIS={Sevilla:{'Europa League':7},'Athletico-PR':{'Copa Sul-Americana':2},Parma:{'Europa League':2},'Schalke 04':{'Europa League':1},'Atlético de Madrid':{'Europa League':3,'Champions League':0}};
export function acervoInicial(nome){
 nome=clubeCanonico(nome);
 const clube=CLUBES.find(x=>x.nome===nome),regional=CLUBES_REGIONAIS_EXTRAS.find(x=>x.nome===nome),estado=clube?.estado||regional?.estado;
 const estaduais=historicosEstaduaisDoClube(nome).map(h=>({nome:h.nome,tipo:'estadual',inicial:h.quantidade,anosHistoricos:[...h.anos],fontes:h.fontes,historicoConhecido:true}));
 // Ligas oficiais documentadas: preserva campeões mesmo fora do elenco jogável
 // e inclui títulos de divisões inferiores na vitrine dos clubes promovidos.
 const ligasDocumentadas=Object.values(HISTORICO_LIGAS).flatMap(reg=>{
  const anos=reg.edicoes.filter(e=>e.campeoes.some(c=>c.clube===nome)).map(e=>e.ano).sort((a,b)=>a-b);
  if(!anos.length)return [];
  return [{nome:reg.nome,tipo:'liga',inicial:anos.length,anosHistoricos:anos,
   fontes:[reg.fonte],historicoConhecido:true,historicoParcial:reg.cobertura!=='completa'}];
 });
 if(!estaduais.length&&estado)estaduais.push({nome:ESTADUAIS[estado],tipo:'estadual',inicial:0,anosHistoricos:[],historicoConhecido:true});
 if(!clube){
  const total=totalLibertadoresHistoricas(nome);
  const libertadores=total?[{nome:'Libertadores',tipo:'continental',inicial:total,historicoConhecido:true}]:[];
  const sulamericana=totalSulAmericanaHistoricas(nome);
  const copaSulamericana=sulamericana?[{nome:'Copa Sul-Americana',tipo:'continental',inicial:sulamericana,historicoConhecido:true}]:[];
  const champions=totalChampionsHistoricas(nome);
  const campeoesEuropa=champions?[{nome:'Champions League',tipo:'continental',inicial:champions,historicoConhecido:true}]:[];
  const europa=totalEuropaLeagueHistoricas(nome);
  const campeoesUEFA=europa?[{nome:'Europa League',tipo:'continental',inicial:europa,historicoConhecido:true}]:[];
  const conference=totalConferenceHistoricas(nome);
  const campeoesConference=conference?[{nome:'Conference League',tipo:'continental',inicial:conference,historicoConhecido:true}]:[];
  const brasil=totalCopaBrasilHistoricas(nome);
  const copaBrasil=brasil?[{nome:'Copa do Brasil',tipo:'copa',inicial:brasil,historicoConhecido:true}]:[];
  return {tacas:[...libertadores,...copaSulamericana,...campeoesEuropa,...campeoesUEFA,...campeoesConference,...copaBrasil,...ligasDocumentadas,...estaduais],conhecido:!!ligasDocumentadas.length||!!estaduais.length||total>0||sulamericana>0||champions>0||europa>0||conference>0||brasil>0};
 }
 const p=palmaresInicialDe(clube),nomes=nomeDosTitulos(clube.liga),itens=[];
 const temCadastroOficial=!!(PALMARES_HISTORICO[nome]||PALMARES_HISTORICO[{'Atlético de Madrid':'Atlético Madrid',Leverkusen:'Bayer Leverkusen'}[nome]]);
 for(const tipo of ['liga','copa','mundial'])if(nomes[tipo]){
  const ligaDoc=tipo==='liga'?ligasDocumentadas.find(t=>t.nome===nomes.liga):null;
  // O número cadastrado manualmente é do campeonato nacional completo;
  // para clubes sem esse registro, nunca exibir estimativas de força
  // como se fossem títulos reais: usar somente as edições comprovadas.
  const inicial=tipo==='copa'&&nomes[tipo]==='Copa do Brasil'
   ?totalCopaBrasilHistoricas(nome):tipo==='liga'&&ligaDoc&&!temCadastroOficial
   ?ligaDoc.inicial:tipo==='liga'&&!temCadastroOficial?0:n(p[tipo]);
  itens.push({nome:nomes[tipo],tipo,inicial,
   ...(ligaDoc?{anosHistoricos:ligaDoc.anosHistoricos,fontes:ligaDoc.fontes,
    historicoParcial:ligaDoc.historicoParcial,historicoConhecido:true}:{})});
 }
 for(const ligaDoc of ligasDocumentadas)
  if(!itens.some(t=>t.nome===ligaDoc.nome))itens.push(ligaDoc);
 const continentais={...(CONTINENTAIS[nome]||{[nomes.continental||'Títulos continentais']:n(p.continental)})};
 // A contagem da Libertadores é a oficial até 2025, não a estimativa
 // de força de um clube nem apenas os títulos brasileiros cadastrados.
 if(['brasileirao','serieB','serieC','serieD','argentina','sulamericano'].includes(clube.liga)){
  if(!CONTINENTAIS[nome])delete continentais[nomes.continental||'Títulos continentais'];
  if(!CONTINENTAIS[nome]||totalLibertadoresHistoricas(nome)>0)continentais.Libertadores=totalLibertadoresHistoricas(nome);
 }
 // O palmarés da Sul-Americana é independente da Libertadores e do total
 // continental genérico. Aplica-se inclusive a times sem títulos da Libertadores.
 const sulamericana=totalSulAmericanaHistoricas(nome);
 if(sulamericana||Object.hasOwn(continentais,'Copa Sul-Americana'))
   continentais['Copa Sul-Americana']=sulamericana;
 // Inclui o torneio desde 1956 e substitui totais antigos (ex.: PSG=1)
 // apenas para a Champions; demais continentais têm registro separado.
 const champions=totalChampionsHistoricas(nome);
 if(champions||nomes.continental==='Champions League'||Object.hasOwn(continentais,'Champions League'))
   continentais['Champions League']=champions;
 // A Copa UEFA/Europa League é outro torneio, não se soma na Champions.
 const europa=totalEuropaLeagueHistoricas(nome);
 if(europa||Object.hasOwn(continentais,'Europa League'))
   continentais['Europa League']=europa;
 // Conference independente das outras duas competições UEFA.
 const conference=totalConferenceHistoricas(nome);
 if(conference||Object.hasOwn(continentais,'Conference League'))
   continentais['Conference League']=conference;
 for(const [nome,quantidade]of Object.entries(continentais))itens.push({nome,tipo:'continental',inicial:quantidade});
 itens.push(...estaduais);
 // Clubes promovidos ao catálogo jogável não perdem o reconhecimento dos
 // estaduais históricos: quando são suas únicas taças, mostre-as em primeiro lugar.
 if(estaduais.some(t=>t.inicial>0)&&!itens.some(t=>t.tipo!=='estadual'&&t.inicial>0))
  itens.splice(0,itens.length,...estaduais,...itens.filter(t=>t.tipo!=='estadual'));
 for(const t of itens)if(t.tipo!=='estadual')t.historicoConhecido=!!(PALMARES_HISTORICO[nome]||CONTINENTAIS[nome]||totalLibertadoresHistoricas(nome)>0||totalSulAmericanaHistoricas(nome)>0||totalChampionsHistoricas(nome)>0||totalEuropaLeagueHistoricas(nome)>0||totalConferenceHistoricas(nome)>0||totalCopaBrasilHistoricas(nome)>0||PALMARES_HISTORICO[{'Atlético de Madrid':'Atlético Madrid',Leverkusen:'Bayer Leverkusen'}[nome]]);
 return {tacas:itens,conhecido:!!(ligasDocumentadas.length||estaduais.some(t=>t.inicial>0)||PALMARES_HISTORICO[nome]||totalLibertadoresHistoricas(nome)>0||totalSulAmericanaHistoricas(nome)>0||totalChampionsHistoricas(nome)>0||totalEuropaLeagueHistoricas(nome)>0||totalConferenceHistoricas(nome)>0||totalCopaBrasilHistoricas(nome)>0||PALMARES_HISTORICO[{"Atlético de Madrid":"Atlético Madrid",Leverkusen:"Bayer Leverkusen"}[nome]])};
}
function inserir(mapa,e){if(e?.clube&&e?.nome&&Number.isFinite(e.ano)&&!e.pendente)mapa.set(idEdicao(e.ano,e.nome),{ano:e.ano,nome:nomeCanonico(e.nome),clube:clubeCanonico(e.clube),tipo:e.tipo||tipoTaca(e.nome),...(e.voce?{voce:true}:{})});}
// No rápido antigo, campeaoLiga era o NOME do vencedor; no completo, é booleano.
export function vencedorLigaRegistrado(a,treinador=false){
 if(a?.interrompida)return null;
 const vencedor=typeof a?.vencedorLiga==='string'?a.vencedorLiga:typeof a?.campeaoLiga==='string'?a.campeaoLiga:null;
 if(vencedor)return clubeCanonico(vencedor);
 const clube=typeof a?.clube==='string'?a.clube:a?.clube?.nome;
 if(a?.campeaoLiga===true&&!(Number.isFinite(a.posLiga)&&a.posLiga!==1))return clubeCanonico(clube);
 if(treinador&&a?.posicao===1)return clubeCanonico(clube);
 return null;
}
export function conquistouLiga(a){const clube=typeof a?.clube==='string'?a.clube:a?.clube?.nome;return !!clube&&vencedorLigaRegistrado(a)===clubeCanonico(clube);}
export function normalizarCampeaoLiga(a){
 if(!a||typeof a.campeaoLiga!=='string')return a;
 const vencedor=vencedorLigaRegistrado(a),clube=clubeCanonico(typeof a.clube==='string'?a.clube:a.clube?.nome);
 const corrigido={...a,vencedorLiga:vencedor,campeaoLiga:!!vencedor&&vencedor===clube};
 if(!corrigido.campeaoLiga&&a.feitosHistoricos){const nome=nomeCanonico(a.ligaNome||LIGAS[a.ligaId||a.liga]?.nome);corrigido.feitosHistoricos=a.feitosHistoricos.filter(f=>nomeCanonico(f.nome)!==nome||f.clube&&clubeCanonico(f.clube)!==clube);}
 return corrigido;
}
function eventosTemporada(c,a,treinador=false){
 a={...a,ano:anoRegistroTemporada(c,a)??undefined};
 const out=[],clube=a.clube||c.clube?.nome||c.clubeNome,nomes=nomeDosTitulos(a.ligaId||a.liga||CLUBES.find(x=>x.nome===clube)?.liga);
 if(a.tipoEquipe==='selecao')return out;
 for(const t of a.torneios||[])if(t.campeao&&!t.finalPendente)out.push({ano:a.ano,nome:t.nome,tipo:t.tipo,clube:t.campeao,voce:t.campeao===clube});
 for(const t of a.titulos||[])if(typeof t==='object'&&!['bolaOuro','botaOuro','copaMundo','continentalSelecao','premio'].includes(t.tipo))out.push({ano:a.ano,nome:t.nome,tipo:t.tipo,clube,voce:true});
 for(const valor of [...(a.titulosConquistados||[]),...(a.titulosLista||[])]){const limpo=nomeCanonico(valor),nome=limpo==='Copa Nacional'?nomes.copa:limpo;if(!/Copa do Mundo|Eurocopa|Copa América|Bola de Ouro|Bota de Ouro/i.test(nome))out.push({ano:a.ano,nome,clube,voce:true});}
 const vencedor=vencedorLigaRegistrado(a,treinador);if(vencedor)out.push({ano:a.ano,nome:a.ligaNome||LIGAS[a.ligaId||a.liga]?.nome||nomes.liga,clube:vencedor,tipo:'liga',voce:clubeCanonico(clube)===vencedor});
 for(const [campo,tipo]of [['copaNacional','copa'],['continental','continental'],['mundial','mundial'],['estadual','estadual']])if(a[campo]?.titulo)out.push({ano:a.ano,nome:a[campo].nome||nomes[tipo]||(tipo==='estadual'?ESTADUAIS[CLUBES.find(cl=>cl.nome===clube)?.estado]:null),clube,tipo,voce:true});
 for(const [liga,t]of Object.entries(a.classificacoesMundo||{})){const campeao=t.edicaoSerieC?.campeao||t.classificacao?.[0]?.nome;if(campeao)out.push({ano:a.ano,nome:LIGAS[liga]?.nome||liga,tipo:'liga',clube:campeao,voce:campeao===clube});}
 return out;
}
export function eventosConhecidos(c,temporadas=c.temporadas||[]){
 const mapa=new Map();for(const e of c.historiaFutebol?.titulos||[])inserir(mapa,e);
 for(const a of temporadas)for(const e of eventosTemporada(c,a))inserir(mapa,e);
 for(const a of Array.isArray(c.tecnico?.temporadas)?c.tecnico.temporadas:[])for(const e of eventosTemporada(c,a,true))inserir(mapa,e);
 for(const t of c.lista||[])if(t.clube&&t.clube!=='Individual'&&CLUBES.some(x=>x.nome===clubeCanonico(t.clube)))inserir(mapa,t);
 return [...mapa.values()].sort((a,b)=>a.ano-b.ano||a.nome.localeCompare(b.nome));
}
/** Repara apenas a interpretação ambígua da liga, preservando as demais conquistas e estatísticas. */
export function corrigirCampeoesLiga(c){
 if(!Array.isArray(c?.temporadas)||!c.temporadas.some(t=>typeof t.campeaoLiga==='string'))return c;
 const novo={...c,temporadas:c.temporadas.map(normalizarCampeaoLiga)};
 if(c.historiaFutebol?.titulos)novo.historiaFutebol={...c.historiaFutebol,titulos:eventosConhecidos(novo)};
 return novo;
}
export function simularMundo(c,a,{preservarTorneios=false}={}){
 const clubes=clubesDoMundo(c,clubesParaCopas(c.tecnico?.ligasMundo||c.ligas)),vagas=(c.vagasInternacionaisAno===a.ano?c.vagasInternacionaisClubes:null)||(Array.isArray(c.tecnico?.temporadas)?c.tecnico.temporadas.find(t=>t.ano===a.ano-1)?.vagasInternacionaisProxima:null)||calcularVagasRapidas({ano:a.ano-1,ligasMundo:c.tecnico?.ligasMundo||c.ligas,seed:'mundo'}),out=[];
 const conhecidos=new Map((a.torneios||[]).map(t=>[nomeCanonico(t.nome),t]));
 const preservar=(nome)=>preservarTorneios&&((a.competicoesPreservadas||[]).some(n=>nomeCanonico(n)===nomeCanonico(nome))||conhecidos.has(nomeCanonico(nome))||[a.copaNacional,a.continental,a.mundial].some(t=>t?.nome&&nomeCanonico(t.nome)===nomeCanonico(nome)));
 for(const [liga,nome]of Object.entries(COPAS_NACIONAIS)){
  const pool=clubes.filter(x=>x.pais===clubes.find(c=>c.liga===liga)?.pais);if(pool.length<2)continue;
  const rng=geradorTecnico(`mundo|${a.ano}|${liga}|tabela-anterior`),tabela=a.classificacoesMundo?.[liga]?.classificacao||(a.ligaId===liga&&a.tabelaLiga?.length?a.tabelaLiga.map(nome=>({nome})):null);
  const campeao=tabela?.[0]?.nome||clubes.filter(x=>x.liga===liga).map(x=>({...x,pontos:x.forca+(rng()+rng()-1)*8})).sort((x,y)=>y.pontos-x.pontos)[0]?.nome;
  if(campeao)out.push({ano:a.ano,nome:LIGAS[liga]?.nome||liga,tipo:'liga',clube:campeao});
  if(preservar(nome))continue;
  const camp=simularCampanhaCopa({nome,tipo:'copa',usuario:pool[0].nome,forcaUsuario:pool[0].forca,clubes:pool,ano:a.ano,formato:'mata',seed:`${c.codigo}|${a.ano}|mundo|${nome}`});
  a.torneiosMundo.push(camp);
  out.push({ano:a.ano,nome,tipo:'copa',clube:camp.campeao});
 }
 for(const comp of ['champions','europa','conference','libertadores','sulamericana','asia','concacaf']){
  const pool=clubes.filter(x=>vagas[x.nome]?.competicao===comp&&(!preservarTorneios||x.nome!==a.clube));pool.splice(0,pool.length,...ampliarParticipantesInternacionais(pool,comp,a.ano,clubes));if(pool.length<2)continue;
  const nome=nomeVaga(comp);if(preservar(nome))continue;const camp=simularCampanhaCopa({nome,tipo:'continental',usuario:pool[0].nome,forcaUsuario:pool[0].forca,clubes:pool,ano:a.ano,formato:['champions','europa','conference'].includes(comp)?'liga':'grupos',seed:`${c.codigo}|${a.ano}|historia|${nome}`});
  a.torneiosMundo.push(camp);
  out.push({ano:a.ano,nome,tipo:'continental',clube:camp.campeao});
 }
 for(const t of [...simularEstaduaisMundo(c,a),...simularSelecoesMundo(c,a),...simularMundiaisMundo(c,a,clubes),...simularCopinhaMundo(c,a,clubes)]){a.torneiosMundo.push(t);out.push({ano:a.ano,nome:t.nome,tipo:t.tipo,clube:t.campeao});}
 return out;
}
/** Um registro por edição; os campeões efetivos prevalecem sobre o restante do mundo. */
export function registrarAnoHistoria(c,a,{modo='rapido'}={}){
 if(!Number.isFinite(a?.ano)||c.historiaFutebol?.anos?.includes(a.ano))return;
 const mapa=new Map(eventosConhecidos(c).map(e=>[idEdicao(e.ano,e.nome),e]));
 const anteriores=[...mapa.values()];
 if(modo==='rapido'){
  if(!a.classificacoesMundo)a.classificacoesMundo=simularClassificacoesMundoTecnico({clubes:clubesDoMundo(c).filter(x=>x.liga==='serieC'||!LIGAS[x.liga]?.naoJogavel),ligasMundo:c.tecnico?.ligasMundo||c.ligas,ano:a.ano,rng:geradorTecnico(`${c.codigo}|${a.ano}|ligas-arquivo`)});
  a.torneiosMundo=[];
  for(const e of simularMundo(c,a))inserir(mapa,e);
 }
 else for(const t of c.campeoesDaTemporada||[])inserir(mapa,{ano:a.ano,nome:t.nome||nomeDosTitulos(t.liga||CLUBES.find(x=>x.nome===t.clube)?.liga)[t.tipo],...t});
 for(const e of anteriores)inserir(mapa,e);
 for(const e of eventosTemporada(c,a))inserir(mapa,e);
 const novos=[...mapa.values()].filter(e=>e.ano===a.ano&&e.voce&&acervoInicial(e.clube).tacas.some(t=>chave(t.nome)===chave(e.nome)&&t.historicoConhecido&&t.inicial===0)&&!anteriores.some(t=>t.clube===e.clube&&chave(t.nome)===chave(e.nome)&&t.ano<e.ano));
 a.feitosHistoricos=novos.map(e=>({id:`primeiro|${e.clube}|${chave(e.nome)}`,titulo:`A primeira ${e.nome} do ${e.clube}`,texto:`Você participou do primeiro título desta competição no acervo do clube.`,ano:a.ano,clube:e.clube,nome:e.nome}));
 c.historiaFutebol={...(c.historiaFutebol||{}),versao:1,desde:c.historiaFutebol?.desde??a.ano,anos:[...(c.historiaFutebol?.anos||[]),a.ano],titulos:[...mapa.values()]};
}
export function galeriaClube(c,nome,temporadas){
 nome=clubeCanonico(nome);
 const inicial=acervoInicial(nome),eventos=eventosConhecidos(c,temporadas).filter(x=>x.clube===nome),mapa=new Map(inicial.tacas.map(t=>[chave(t.nome),{...t,anos:[],suas:[]} ]));
 for(const e of eventos){const k=chave(e.nome);if(!mapa.has(k))mapa.set(k,{nome:e.nome,tipo:e.tipo,inicial:0,anos:[],suas:[]});const t=mapa.get(k);t.anos.push(e.ano);if(e.voce)t.suas.push(e.ano);}
 // Saves do modo completo já têm totais absolutos: não somar esses totais outra vez.
 const legado=c.estadoClubes?.[nome]?.palmares,nomes=nomeDosTitulos(CLUBES.find(x=>x.nome===nome)?.liga);
 for(const tipo of ['liga','copa','continental','mundial','estadual'])if(legado){
  const base=n(palmaresInicialDe(CLUBES.find(x=>x.nome===nome)||{})[tipo]);
  const delta=tipo==='estadual'&&!c.estadoClubes[nome].historicoEstadualVersao?n(legado[tipo]):n(legado[tipo])-base;
  const registrados=[...mapa.values()].filter(t=>t.tipo===tipo).reduce((s,t)=>s+t.anos.length,0);
  if(delta>registrados){const nomeTaca=nomes[tipo]||(tipo==='estadual'?ESTADUAIS[CLUBES.find(cl=>cl.nome===nome)?.estado]:tipo),k=chave(nomeTaca),t=mapa.get(k)||{nome:nomeTaca,tipo,inicial:0,anos:[],suas:[]};t.legado=delta-registrados;mapa.set(k,t);}
 }
 const tacas=[...mapa.values()].map(t=>({...t,total:t.inicial+t.anos.length+(t.legado||0)}));
 return {nome,conhecido:inicial.conhecido,tacas,total:tacas.reduce((s,t)=>s+t.total,0),eventos:eventsOrdenados(eventos),primeiros:tacas.filter(t=>t.historicoConhecido&&t.inicial===0&&t.anos.length&&!t.legado).map(t=>({...t,ano:Math.min(...t.anos)}))};
}
const eventsOrdenados=e=>[...e].sort((a,b)=>b.ano-a.ano);

// Referências datadas; não presumem atualização automática de recordes reais.
export const REFERENCIAS_INDIVIDUAIS=[
 {id:'ucl-gols',nome:'Artilheiro histórico da Champions',atleta:'Cristiano Ronaldo',valor:140,metrica:'gols',competicao:'Champions League',data:'2024-06',fonte:'https://www.uefa.com/uefachampionsleague/history/rankings/players/goals/'},
 {id:'ucl-jogos',nome:'Mais jogos na Champions',atleta:'Cristiano Ronaldo',valor:183,metrica:'jogos',competicao:'Champions League',data:'2024-06',fonte:'https://www.uefa.com/uefachampionsleague/history/rankings/players/appearances/'},
 {id:'bra-gols',nome:'Artilheiro histórico do Brasil',atleta:'Neymar',valor:79,metrica:'gols',nac:'BRA',data:'2023-10',fonte:'https://www.cbf.com.br/'},
 {id:'ale-gols',nome:'Artilheiro histórico da Alemanha',atleta:'Miroslav Klose',valor:71,metrica:'gols',nac:'ALE',data:'2014-07',fonte:'https://www.dfb.de/'},
 {id:'ita-gols',nome:'Artilheiro histórico da Itália',atleta:'Luigi Riva',valor:35,metrica:'gols',nac:'ITA',data:'2024-06',fonte:'https://www.figc.it/'},
 {id:'esp-gols',nome:'Artilheiro histórico da Espanha',atleta:'David Villa',valor:59,metrica:'gols',nac:'ESP',data:'2024-06',fonte:'https://rfef.es/'},
 {id:'hol-gols',nome:'Artilheiro histórico dos Países Baixos',atleta:'Robin van Persie',valor:50,metrica:'gols',nac:'HOL',data:'2024-06',fonte:'https://www.knvb.com/'},
 {id:'bra-jogos',nome:'Mais jogos pelo Brasil',atleta:'Cafu',valor:142,metrica:'jogos',nac:'BRA',data:'2024-06',fonte:'https://www.fifa.com/'},
];
const campos=['jogos','gols','assist','cleanSheets','defesas'];
export function estatisticasHistoricas(c,temporadas=c.temporadas||[]){
 const comps=new Map(),clubes=new Map(),anos=new Set();let incompleto=false;
 const somar=(mapa,nome,r)=>{if(!nome)return;const t=mapa.get(nome)||{nome,jogos:0,gols:0,assist:0,cleanSheets:0,defesas:0,temDefesas:false};for(const k of campos)t[k]+=n(r[k]);if(Number.isFinite(r.defesas))t.temDefesas=true;mapa.set(nome,t);};
 for(const t of temporadas){const id=`${t.ano??t.idade}|${t.clube}`;if(anos.has(id))continue;anos.add(id);somar(clubes,t.clube,t);if(!t.porCompeticao?.length||(Number.isFinite(t.jogos)&&t.porCompeticao.reduce((s,r)=>s+n(r.jogos),0)<t.jogos))incompleto=true;for(const r of t.porCompeticao||[])somar(comps,nomeCanonico(r.nome),r);}
 const selecao={nome:NACIONALIDADES.find(x=>x.id===(c.nac||c.nacionalidade))?.label||c.nac||'Seleção',...Object.fromEntries(campos.map(k=>[k,n(c.selecao?.[k])])),temDefesas:Number.isFinite(c.selecao?.defesas)};
 const referencias=REFERENCIAS_INDIVIDUAIS.filter(r=>!r.nac||r.nac===(c.nac||c.nacionalidade)).map(r=>{const atual=r.nac?selecao[r.metrica]:comps.get(r.competicao)?.[r.metrica]||0;return {...r,atual,estado:atual>r.valor?'Superou na simulação':atual===r.valor?'Igualou na simulação':'Em busca'};});
 return {competicoes:[...comps.values()],clubes:[...clubes.values()],selecao,referencias,incompleto};
}
/** Distribuição da estatística simulada anual, conservando os totais do atleta. */
export function registrarEstatisticasCompeticoes(c,card){
 if(card.porCompeticao?.length)return;
 const campeonatos=card.torneios||[],linhas=[{nome:card.ligaNome||LIGAS[card.ligaId]?.nome||'Liga nacional',peso:Math.max(0,(card.tabelaLiga?.length||20)*2-2)},...campeonatos.map(t=>({nome:t.nome,peso:t.jogosUsuario?.length||0}))].filter(t=>t.peso>0);
 const totalPesos=linhas.reduce((s,t)=>s+t.peso,0);if(card.jogos>totalPesos)linhas.push({nome:'Outras partidas do clube',peso:card.jogos-totalPesos});
 const repartir=(total,pesos)=>{const soma=pesos.reduce((a,b)=>a+b,0);if(!soma)return pesos.map(()=>0);const bruto=pesos.map(p=>n(total)*p/soma),r=bruto.map(Math.floor),resto=Math.round(n(total))-r.reduce((a,b)=>a+b,0);bruto.map((x,i)=>({i,fracao:x-r[i]})).sort((a,b)=>b.fracao-a.fracao).slice(0,resto).forEach(x=>r[x.i]++);return r;};
 const jogos=repartir(card.jogos,linhas.map(t=>t.peso)),gols=repartir(card.gols,jogos),assist=repartir(card.assist,jogos),defesas=repartir(card.defesas,jogos),cs=repartir(card.cleanSheets,jogos);
 // Os números do atleta não podem ultrapassar os gols do seu clube naquela copa.
 for(let i=1;i<linhas.length;i++){const torneio=campeonatos.find(t=>t.nome===linhas[i].nome);if(!torneio?.jogosUsuario?.length)continue;const gp=torneio.jogosUsuario.reduce((s,j)=>s+n(j.casa===card.clube?j.golsCasa:j.golsFora),0);const excesso=Math.max(0,gols[i]-gp);gols[i]-=excesso;gols[0]+=excesso;const excessoA=Math.max(0,assist[i]-Math.max(0,gp-gols[i]));assist[i]-=excessoA;assist[0]+=excessoA;}
 card.porCompeticao=linhas.map((t,i)=>({nome:t.nome,jogos:jogos[i],gols:gols[i],assist:assist[i],...(Number.isFinite(card.defesas)?{defesas:defesas[i]}:{}),...(Number.isFinite(card.cleanSheets)?{cleanSheets:Math.min(jogos[i],cs[i])}:{}),origem:'distribuicao-simulada'}));
 // Defesas de lances efetivamente resolvidos; não estimar todos os chutes de uma partida.
 if(c.posicao==='GOL')card.defesasDecisivas=(card.momentos||[]).filter(m=>m.acertou&&(m.mini==='defesa'||m.decisaoJogo?.acao==='defender')).length;
}

export function registrarAtletasObservados(c,card){
 const h=c.historiaFutebol;if(!h||h.atletasAno===card.ano)return;
 const atletas={...(h.atletas||{})};
 const somar=(id,p)=>{const r=atletas[id]||{id,nome:p.nome,nac:p.nac,clube:p.clubeNome||card.clube,jogos:0,gols:0,assist:0,defesasDecisivas:0,defesas:0};atletas[id]={...r,nome:p.nome,nac:p.nac,clube:p.clubeNome||r.clube,jogos:r.jogos+n(p.jogos),gols:r.gols+n(p.gols),assist:r.assist+n(p.assist),defesasDecisivas:r.defesasDecisivas+n(p.defesasDecisivas),defesas:(r.defesas||0)+n(p.defesas),voce:!!p.voce};};
 for(const p of c.mundo?.jogadores||[])if(!p.aposentado){const linha={...p,ano:card.ano};simularDefesas({...p,codigo:`${c.codigo}|${p.id}`},linha);somar(String(p.id),linha);}
 somar('voce',{nome:c.nome,nac:c.nac,clubeNome:card.clube,...card,voce:true});h.atletas=atletas;h.atletasAno=card.ano;
}
export function lideresObservados(c,{nac,metrica='gols'}={}){return Object.values(c.historiaFutebol?.atletas||{}).filter(p=>(!nac||p.nac===nac)&&n(p[metrica])>0).sort((a,b)=>n(b[metrica])-n(a[metrica])||a.nome.localeCompare(b.nome)).slice(0,10);}

/** Novo atributo de temporada do goleiro, simulado uma vez e persistido. */
export function simularDefesas(c,card){
 if(c.posicao!=='GOL'||Number.isFinite(card.defesas))return;
 const rng=geradorTecnico(`${c.codigo||c.nome}|${card.ano??card.idade??c.ano??c.idade}|${card.clube||card.nome||'selecao'}|defesas`),nivel=c.attrs?.defesa??card.ovr??c.ovr??70;
 card.defesas=Array.from({length:Math.floor(n(card.jogos))},()=>Math.max(0,Math.floor(1+rng()*6+(nivel-70)/20))).reduce((a,b)=>a+b,0);
 card.origemDefesas='simulacao-temporada';
}

export function novosMarcosIndividuais(antes,c,card){
 const velhas=estatisticasHistoricas(antes),novas=estatisticasHistoricas(c,[...(c.temporadas||[]),card]);
 return novas.referencias.flatMap(r=>{const anterior=velhas.referencias.find(v=>v.id===r.id)?.atual||0;const superou=r.atual>r.valor&&anterior<=r.valor,igualou=r.atual===r.valor&&anterior<r.valor;if(!superou&&!igualou)return [];return [{id:`${r.id}|${superou?'superou':'igualou'}`,ano:card.ano,titulo:`${superou?'Superou':'Igualou'} ${r.atleta}: ${r.atual} ${r.metrica==='jogos'?'jogos':'gols'}`,texto:`${r.nome}. Marca de referência: ${r.valor} (${r.data}). Feito alcançado nesta simulação.`}];});
}
