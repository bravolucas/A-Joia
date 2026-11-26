import LZString from 'lz-string';
import {CLUBES_REGIONAIS_EXTRAS} from '../competicoes/estaduaisRapidos.js';
import {jogosDaCampanha} from '../competicoes/jogosCampanha.js';
import {registrarPartidasDetalhadasUsuario} from './historicoConfrontos.js';
import {combinarConquistas,conquistasDoCadastroMundo,conquistasDaTemporadaUsuario} from './historicoConquistas.js';
import { CLUBES, LIGAS } from '../dados/data.js';
import { avaliarClubeNoMundo } from './forcaEquipe.js';
import { EIXOS_REPUTACAO_CLUBE, evoluirReputacoesClube } from './reputacoesClube.js';
import { geradorTecnico } from '../treinador/momentosTecnico.js';
import {avaliarTecnicoClube,manchetesDoAno,registrarMercadoDoAno,preencherVagasTecnicos,novoTecnico} from './tecnicosMundo.js';
import {premiosDaTemporada} from './premiosLiga.js';
import {registrarSelecoesDoAno} from './selecoesAtletas.js';
const limitar=(n,a,b)=>Math.max(a,Math.min(b,n));
const red=n=>Math.round(n*10)/10||0;
/** Snapshot serializável: o cadastro nunca é modificado e os mundos de saves distintos não se misturam. */
export function forcasDoMundo(c={}, clubes=CLUBES) {
  const porClube=new Map();for(const j of c.mundo?.jogadores||[]){if(j.aposentado)continue;if(!porClube.has(j.clubeNome))porClube.set(j.clubeNome,[]);porClube.get(j.clubeNome).push(j);}
  return Object.fromEntries(clubes.map(cl=>[cl.nome,avaliarClubeNoMundo(c,cl,{elenco:porClube.get(cl.nome)||[]}).forca]));
}
export function clubesDoMundo(c={},clubes=CLUBES) {
  const ligas=c.tecnico?.ligasMundo||c.ligas||{},porClube=new Map();
  for(const p of c.mundo?.jogadores||[]){if(!porClube.has(p.clubeNome))porClube.set(p.clubeNome,[]);porClube.get(p.clubeNome).push(p);}
  return clubes.map(cl=>{const a=avaliarClubeNoMundo(c,cl,{elenco:porClube.get(cl.nome)||[]});return {...cl,forca:a.forca,elenco:a.forca,ataque:a.ataque,defesa:a.defesa,liga:ligas[cl.nome]||cl.liga};});
}
/** Índice da rodada montado uma vez: evita procurar cada clube em todas as ligas. */
function indexarCampanhas(a){
  const porClube=new Map();
  for(const [liga,t] of Object.entries(a.classificacoesMundo||{})){
    const linhas=t.classificacao||[];
    for(let i=0;i<linhas.length;i++){
      const linha=linhas[i];
      // A primeira classificação prevalece, como na antiga busca sequencial.
      if(linha&&!porClube.has(linha.nome))porClube.set(linha.nome,{liga,posicao:linha.posicao||i+1,total:linhas.length,pontos:linha.pontos});
    }
  }
  return porClube;
}
function campanhaClube(a,nome,porClube){
  if(porClube.has(nome))return porClube.get(nome);
  if((typeof a.clube==='string'?a.clube:a.clube?.nome)===nome)return {liga:a.ligaId||a.liga,posicao:a.posLiga||a.posicao,total:a.totalLiga||a.classificacao?.length||a.tabelaLiga?.length||20,pontos:a.pontos};
  return null;
}
const jogosTorneio=jogosDaCampanha;
/** Grava somente o ano que acaba de ocorrer. Retomar ou consultar não sorteia outra temporada. */
export function registrarMundoVivo(c,a,{antesMundo}={}){
  if(!Number.isFinite(a?.ano))return;
  const anterior=c.universo||c.tecnico?.universo||{versao:1,desde:a.ano,clubes:{},atletas:{},edicoes:[],anos:[]};
  if(anterior.anos?.includes(a.ano))return;
  let u={...anterior,versao:1,clubes:{...anterior.clubes},atletas:{...anterior.atletas},edicoes:[...(anterior.edicoes||[])],anos:[...(anterior.anos||[]),a.ano]};
  const clubesRegistrados=[...CLUBES,...CLUBES_REGIONAIS_EXTRAS];
  // Só são considerados formados os atletas efetivamente marcados como base:
  // não inferir formação a partir do clube de nascimento ou do nome.
  const formadosPorClube=new Map(),elencosPorClube=new Map();
  for (const jogador of c.mundo?.jogadores || []) {
    // avaliarClubeNoMundo usava .filter() sobre TODOS os jogadores em cada
    // clube. Montar os plantéis uma vez evita clubes × atletas varreduras.
    if(jogador&&!jogador.aposentado&&jogador.clubeNome){
      if(!elencosPorClube.has(jogador.clubeNome))elencosPorClube.set(jogador.clubeNome,[]);
      elencosPorClube.get(jogador.clubeNome).push(jogador);
    }
    if (!jogador?.daBase || !jogador.clubeOrigem ||
        !((jogador.carreira?.temporadas || 0) > 0)) continue;
    formadosPorClube.set(jogador.clubeOrigem,
      (formadosPorClube.get(jogador.clubeOrigem) || 0) + 1);
  }
  const forcasAntes=forcasDoMundo({...c,universo:anterior,mundo:antesMundo||c.mundo},clubesRegistrados);
  const campanhas=indexarCampanhas(a);
  const titulosPorClube=new Map();
  for(const titulo of c.historiaFutebol?.titulos||[]){
    if(titulo.ano!==a.ano)continue;
    if(!titulosPorClube.has(titulo.clube))titulosPorClube.set(titulo.clube,[]);
    titulosPorClube.get(titulo.clube).push(titulo);
  }
  const movimentosPorClube=new Map();
  for(const movimento of a.movimentosMundo||[]){
    if(!movimentosPorClube.has(movimento.clube))movimentosPorClube.set(movimento.clube,movimento);
  }
  const subiram=new Set(a.subiram||[]),cairam=new Set(a.cairam||[]);
  // Técnicos da IA: o clube do usuário (jogador ou treinador) não troca de comando por aqui.
  const tecnicos={...(anterior.tecnicos||{})},trocas=[],vagas=[],demitidos=[],desempenhos=new Map(),semente=c.codigo||c.nome||'carreira';
  // Artilheiro de cada clube na temporada (linha do tempo do clube).
  const artilheiros=new Map(),antesPorId=new Map((antesMundo?.jogadores||[]).map(p=>[String(p.id),p]));
  for(const p of c.mundo?.jogadores||[]){
    const clube=antesPorId.get(String(p.id))?.clubeNome||p.clubeTemporada||p.clubeNome;
    if(!clube||!(p.gols>0))continue;
    const atual=artilheiros.get(clube);if(!atual||p.gols>atual.gols)artilheiros.set(clube,{nome:p.nome,id:p.id,gols:p.gols});
  }
  const clubeDoAno=typeof a.clube==='string'?a.clube:a.clube?.nome;
  if(clubeDoAno&&a.gols>0&&!c.tecnico&&!(artilheiros.get(clubeDoAno)?.gols>=a.gols))artilheiros.set(clubeDoAno,{nome:c.nome||'Você',id:'voce',gols:a.gols});
  const clubeUsuario=c.tecnico?.clube||(typeof a.clube==='string'?a.clube:a.clube?.nome);
  for(const cl of clubesRegistrados){
    const p=u.clubes[cl.nome]||{mercado:0,estrutura:0,fase:0,reputacao:cl.forca,financas:50,historico:[]};
    const campanha=campanhaClube(a,cl.nome,campanhas),titulosClube=titulosPorClube.get(cl.nome)||[],tacas=titulosClube.map(t=>t.nome);
    const rng=geradorTecnico(`${c.codigo||'carreira'}|${a.ano}|${cl.nome}|gestao-mundo`);
    const esperado=limitar(1-(cl.forca-40)/65,.08,.85);
    const desempenho=campanha?limitar(esperado-campanha.posicao/Math.max(1,campanha.total),-.8,.8):0;
    const movimento=movimentosPorClube.get(cl.nome)?.tipo||(subiram.has(cl.nome)?'acesso':cairam.has(cl.nome)?'rebaixamento':null);
    const receita=limitar(desempenho*8+Math.min(3,tacas.length)*2+(movimento==='acesso'?4:movimento==='rebaixamento'?-6:0),-10,10);
    const financas=limitar(p.financas*.85+50*.15+receita,5,95);
    // Acertos e erros de gestão existem também fora do clube do usuário. Não inventam transferências nominais.
    const ajusteMercado=(rng()+rng()-1)*1.8+(financas-50)*.012;
    const mercado=limitar(p.mercado*.92+ajusteMercado,-12,12);
    const estrutura=limitar(p.estrutura+receita*.025,-3,3);
    let fase=limitar(desempenho*2,-1.5,1.5);
    // Clube com campanha sem técnico registrado (primeira temporada do arquivo): contrata um agora.
    if(campanha&&cl.nome!==clubeUsuario&&!tecnicos[cl.nome])tecnicos[cl.nome]=novoTecnico(cl,a.ano-1,semente);
    const tecnicoDoAno=cl.nome===clubeUsuario&&c.tecnico?c.nome:tecnicos[cl.nome]?.nome||null;
    if(campanha&&cl.nome!==clubeUsuario){
      desempenhos.set(cl.nome,desempenho);
      // Títulos do ano entram no currículo do técnico antes da avaliação.
      if(tecnicos[cl.nome]&&tacas.length)tecnicos[cl.nome]={...tecnicos[cl.nome],titulos:[...(tecnicos[cl.nome].titulos||[]),...tacas.map(nome=>({nome,ano:a.ano,clube:cl.nome}))]};
      const r=avaliarTecnicoClube(tecnicos[cl.nome],{clube:cl,ano:a.ano,desempenho,movimento,semente});
      // Técnico novo: o vestiário reage e a fase ruim é parcialmente recuperada.
      if(r.demitido){demitidos.push(r.demitido);vagas.push(cl.nome);trocas.push({clube:cl.nome,sai:r.demitido.nome});fase=limitar(fase+0.8,-1.5,1.5);}
      else tecnicos[cl.nome]=r.tecnico;
    }
    const motivos=[...(movimento?[movimento==='acesso'?'Acesso de divisão':'Rebaixamento']:[]),...(tacas.length?[`${tacas.length} título${tacas.length>1?'s':''} na temporada`]:[]),ajusteMercado>.45?'Planejamento do elenco fortaleceu o clube':ajusteMercado<-.45?'Planejamento do elenco deixou perdas':'Elenco passou por ajustes pontuais'];
    const antes=forcasAntes[cl.nome];
    // Indicadores adicionais não substituem os atributos legados de força,
    // reputação e orçamento até existir calibração do mercado e testes próprios.
    const reputacoes=evoluirReputacoesClube(p,{
      campanha,titulos:titulosClube,movimento,financas,estrutura,
      atletasFormados:formadosPorClube.get(cl.nome)||0
    });
    const perfil={...p,mercado:red(mercado),estrutura:red(estrutura),fase:red(fase),financas:red(financas),reputacao:red(limitar(p.reputacao+receita*.2,20,99)),reputacoes};
    const depois=avaliarClubeNoMundo({...c,universo:{clubes:{[cl.nome]:perfil}}},cl,{elenco:elencosPorClube.get(cl.nome)||[]}).forca;
    u.clubes[cl.nome]={...perfil,historico:[...p.historico,{ano:a.ano,...campanha,titulos:tacas,forcaAntes:antes,forca:depois,financas:perfil.financas,motivos,
      ...(tecnicoDoAno?{tecnico:tecnicoDoAno}:{}),...(artilheiros.get(cl.nome)?{artilheiro:artilheiros.get(cl.nome)}:{}),
      // Snapshot compacto por ordem dos 8 eixos; não inventar histórico legado.
      reputacoesEixos:EIXOS_REPUTACAO_CLUBE.map(eixo=>reputacoes[eixo]),
      ...(movimento?{movimento}:{})}]};
  }
  const antigos=new Map((antesMundo?.jogadores||[]).map(p=>[String(p.id),p]));
  for(const p of c.mundo?.jogadores||[]){
    const velho=antigos.get(String(p.id)),clube=velho?.clubeNome||p.clubeTemporada||p.clubeNome;
    // Um aposentado já registrado não ganha mais uma temporada de estatísticas.
    if(p.aposentado&&(!velho||velho.aposentado))continue;
    const id=String(p.id),anteriorAtleta=u.atletas[id];
    const linha={ano:a.ano,clube,liga:velho?.liga||p.liga,jogos:p.jogos||0,gols:p.gols||0,assist:p.assist||0,...(p.posicao==='GOL'?{defesas:p.defesas||0,cleanSheets:p.cleanSheets||0}:{}),...(p.porCompeticao?{porCompeticao:p.porCompeticao}:{}),titulos:(p.titulosConquistados||[]).filter(r=>Array.isArray(r)&&r[1]===a.ano&&r[4]===clube).map(r=>r[3]),...(clube!==p.clubeNome?{destino:p.clubeNome}:{}),...(p.aposentado?{aposentou:true}:{})};
    u.atletas[id]={id,nome:p.nome,posicao:p.posicao,nac:p.nac,clube:p.clubeNome,aposentado:!!p.aposentado,
      historico:[...(anteriorAtleta?.historico||[]),compactarLinhaAtleta(linha)],
      conquistas:combinarConquistas(anteriorAtleta?.conquistas,conquistasDoCadastroMundo(p))};
  }
  const eu={ano:a.ano,clube:typeof a.clube==='string'?a.clube:a.clube?.nome,jogos:a.jogos||0,gols:a.gols||0,assist:a.assist||0,...(Number.isFinite(a.defesas)?{defesas:a.defesas}:{}),...(Number.isFinite(a.cleanSheets)?{cleanSheets:a.cleanSheets}:{}),porCompeticao:a.porCompeticao||[],titulos:(a.titulos||[]).filter(t=>typeof t==='object').map(t=>t.nome)};
  if(!c.tecnico||c.tecnico.fase!=='resultado')u.atletas.voce={
    id:'voce',nome:c.nome,posicao:c.posicao,nac:c.nac||c.nacionalidade,voce:true,clube:eu.clube,
    historico:[...(u.atletas.voce?.historico||[]),compactarLinhaAtleta(eu)],
    conquistas:combinarConquistas(u.atletas.voce?.conquistas,conquistasDaTemporadaUsuario(a))
  };
  // Edições completas existentes são arquivadas; dados antigos ausentes continuam ausentes.
  for(const [liga,t]of Object.entries(a.classificacoesMundo||{})){
    // A liga do treinador grava a tabela sem seus placares no calendario global.
    // Recupere apenas os resultados realmente disputados, nunca sorteie novamente.
    const jogosTreinador=c.tecnico&&a.liga===liga?(a.confrontos||[])
      .filter(j=>!j.folga&&j.nome&&Number.isFinite(j.golsPro)&&Number.isFinite(j.golsContra))
      .map((j,i)=>({casa:j.casa?a.clube:j.nome,fora:j.casa?j.nome:a.clube,
        golsCasa:j.casa?j.golsPro:j.golsContra,golsFora:j.casa?j.golsContra:j.golsPro,
        rodada:j.rodada??i+1})):[];
    const jogosUnicos=new Map();
    // Incluir tanto a rodada do técnico quanto todos os duelos da IA,
    // preservando um resultado por par de clubes e rodada.
    const partidasPlayoffs = (t.playoffs?.confrontos || []).flatMap(confronto =>
      (confronto.jogos || []).map((jogo, indice) => ({
        ...jogo, rodada: 39 + indice, fase: `playoff-${confronto.chave}-${jogo.fase}`
      })));
    const edicaoC=t.edicaoSerieC;
    const inicioQuadrangular=edicaoC?.regulamento?.rodadas??0;
    const jogosQuadrangulares=(edicaoC?.quadrangulares||[]).flatMap(grupo=>
      (grupo.jogos||[]).map(j=>({...j,rodada:inicioQuadrangular+j.rodada,
        fase:`quadrangular-${grupo.nome}`})));
    const jogosFinalC=(edicaoC?.final?.jogos||[]).map((j,i)=>({
      ...j,rodada:inicioQuadrangular+7+i,fase:`final-serie-c-${j.fase}`
    }));
    for(const jogo of [...(t.jogos||[]),...(a.liga===liga?a.partidasLiga||[]:[]),...jogosTreinador,
      ...partidasPlayoffs,...jogosQuadrangulares,...jogosFinalC]){
      if(!jogo?.casa||!jogo?.fora||!Number.isFinite(jogo.golsCasa)||!Number.isFinite(jogo.golsFora))continue;
      const chave=[jogo.rodada??jogo.fase??'',jogo.casa,jogo.fora].join('|');
      if(!jogosUnicos.has(chave))jogosUnicos.set(chave,jogo);
    }
    u.edicoes.push({ano:a.ano,nome:LIGAS[liga]?.nome||liga,tipo:'liga',
      classificacao:t.classificacao,jogos:compactarJogos([...jogosUnicos.values()], {arquivarSumulas:true}),
      // Uma edição pendente (ex.: Série C ainda sem tabela) não tem campeão:
      // omitir a propriedade evita gerar `campeao: undefined` no save, que é
      // descartado na serialização JSON e quebra a idempotência da carreira.
      ...((edicaoC?.campeao||t.classificacao?.[0]?.nome)
        ? {campeao:edicaoC?.campeao||t.classificacao?.[0]?.nome} : {}),
      ...(t.playoffs ? { playoffs:t.playoffs } : {}),
      ...(edicaoC ? { serieC:{
        regulamento:edicaoC.regulamento, promovidos:edicaoC.promovidos,
        rebaixados:edicaoC.rebaixados, final:edicaoC.final,
        quadrangulares:edicaoC.quadrangulares?.map(grupo=>({
          nome:grupo.nome,classificacao:grupo.classificacao,
        })),
      }} : {})});
  }
  if(!a.classificacoesMundo?.[a.ligaId||a.liga]&&(a.classificacao?.length||a.tabelaLiga?.length))u.edicoes.push({ano:a.ano,nome:a.ligaNome||LIGAS[a.ligaId||a.liga]?.nome||a.liga,tipo:'liga',classificacao:a.classificacao||a.tabelaLiga.map((nome,i)=>({nome,posicao:i+1})),jogos:compactarJogos(a.jogosLiga||[]),campeao:a.vencedorLiga||a.classificacao?.[0]?.nome||a.tabelaLiga?.[0]});
  for(const t of [...(a.torneiosMundo||[]),...(a.torneios||[])])if(t.campeao&&!t.finalPendente)u.edicoes.push({ano:a.ano,nome:t.nome,tipo:t.tipo,campeao:t.campeao,vice:t.vice,classificacao:t.classificacao||[],grupos:(t.grupos||[]).map(g=>({grupo:g.grupo,classificacao:g.classificacao||[]})),jogos:compactarJogos(jogosTorneio(t))});
  u.edicoes=[...new Map(u.edicoes.map(e=>[`${e.ano}|${e.nome}`,e])).values()];
  // Registrar depois de arquivar os placares: assim o Modo Rápido usa somente
  // partidas finalizadas, com distribuição fixa e identificada por competição.
  u=registrarPartidasDetalhadasUsuario(u,a);
  // Mercado de técnicos: livres e técnicos em alta preenchem as vagas abertas.
  const mercadoTecnicos=preencherVagasTecnicos({tecnicos,livres:[...(anterior.tecnicosLivres||[]),...demitidos],vagas,clubes:new Map(clubesRegistrados.map(cl=>[cl.nome,cl])),desempenhos,ano:a.ano,semente,protegido:clubeUsuario});
  for(const t of trocas){const m=mercadoTecnicos.movimentos.find(x=>x.clube===t.clube);t.entra=m?.entra||'—';t.de=m?.de||null;}
  for(const m of mercadoTecnicos.movimentos)if(m.de&&!trocas.some(t=>t.clube===m.clube))trocas.push({clube:m.clube,sai:null,entra:m.entra,de:m.de});
  u.tecnicos=mercadoTecnicos.tecnicos;u.tecnicosLivres=mercadoTecnicos.livres;
  u.premiosLigas=premiosDaTemporada(anterior.premiosLigas,a,{jogadores:c.mundo?.jogadores||[],antesPorId,tecnicos:u.tecnicos,desempenhos,usuario:c.tecnico?null:{nome:c.nome,posicao:c.posicao,idade:c.idade,clube:clubeDoAno},tecnicoUsuario:c.tecnico?{nome:c.nome,clube:c.tecnico.clube}:null});
  u.selecoes=registrarSelecoesDoAno(anterior.selecoes,a,c.mundo?.jogadores||[],semente);
  u.mercadoClubes=registrarMercadoDoAno(anterior.mercadoClubes,(c.mundo?.transferencias||[]).filter(t=>t.temporada===c.mundo?.temporada),a.ano);
  const forcasManchetes=Object.fromEntries(Object.entries(forcasAntes).map(([n,v])=>[n,typeof v==='number'?v:v?.forca]).filter(([,v])=>Number.isFinite(v)));
  const manchetes=manchetesDoAno(a,{forcas:forcasManchetes,transferencias:(c.mundo?.transferencias||[]).filter(t=>t.temporada===c.mundo?.temporada),trocas,cairam:[...cairam]});
  const sobreVoce=(a.manchetes||[]).map(m=>({ano:a.ano,tipo:'voce',texto:m.texto,clube:typeof a.clube==='string'?a.clube:a.clube?.nome,...(m.torcida?{torcida:m.torcida}:{})}));
  u.noticias=[...sobreVoce,...manchetes,...(anterior.noticias||[]).filter(n=>n.ano!==a.ano)].slice(0,70);
  if(c.tecnico){delete c.universo;c.tecnico={...c.tecnico,universo:u,forcasMundo:forcasDoMundo({...c,universo:u})};}else c.universo=u;
}

export function compactarJogos(jogos=[], {arquivarSumulas=false}={}) {
  const nomes=[...new Set(jogos.flatMap(j=>[j.casa,j.fora]).filter(Boolean))];
  const indices=new Map(nomes.map((n,i)=>[n,i]));
  const validos=jogos.filter(j=>j.casa&&j.fora&&Number.isFinite(j.golsCasa)&&Number.isFinite(j.golsFora));
  const partidas=validos.map(j=>[indices.get(j.casa),indices.get(j.fora),j.golsCasa,j.golsFora,
    j.rodada||j.fase||'',j.vencedor?indices.get(j.vencedor):null,j.penaltis?1:0,
    ...(!arquivarSumulas&&j.sumula?[j.fase||null,j.sumula]:j.fase?[j.fase]:[])]);
  const sumulas=arquivarSumulas&&validos.some(j=>j.sumula)
    ? LZString.compressToUTF16(JSON.stringify(validos.map(j=>j.sumula??null)))
    : null;
  return {nomes,partidas,...(sumulas?{sumulas}:{})};
}
export function jogosDaEdicao(edicao, {incluirSumulas=true}={}) {
  if(Array.isArray(edicao?.jogos))return edicao.jogos;
  const {nomes=[],partidas=[],sumulas}=edicao?.jogos||{};
  const arquivadas=incluirSumulas&&sumulas ? JSON.parse(LZString.decompressFromUTF16(sumulas)) : null;
  return partidas.map(([a,b,golsCasa,golsFora,rodada,v,penaltis,fase,sumula],i)=>{
    const ficha=incluirSumulas&&(sumula??arquivadas?.[i]);
    return {casa:nomes[a],fora:nomes[b],golsCasa,golsFora,rodada,vencedor:v==null?null:nomes[v],
      penaltis:!!penaltis,...(fase?{fase}:{}),...(ficha?{sumula:ficha}:{})};
  });
}
export function resumirTabelas(classificacoes) {
  return Object.fromEntries(Object.entries(classificacoes||{}).map(([liga,t])=>{const {jogos,...resumo}=t;return [liga,resumo];}));
}

// Linhas compactas mantêm décadas de carreiras pequenas também durante a simulação.
function compactarLinhaAtleta(a){return [a.ano,a.clube,a.jogos,a.gols,a.assist,a.defesas??null,a.cleanSheets??null,a.titulos||[],a.destino||null,a.aposentou?1:0,(a.porCompeticao||[]).map(t=>[t.nome,t.jogos,t.gols,t.assist,t.defesas||0,t.cleanSheets||0,...(t.jogosClassicos?[t.jogosClassicos,t.golsClassicos||0]:[])])];}
const historicosLidos=new WeakMap();
export function historicoAtleta(p){
 if(!p)return [];
 if(historicosLidos.has(p))return historicosLidos.get(p);
 const linhas=(p.historico||[]).map(a=>!Array.isArray(a)?a:{ano:a[0],clube:a[1],jogos:a[2],gols:a[3],assist:a[4],defesas:a[5],cleanSheets:a[6],titulos:a[7],destino:a[8],aposentou:!!a[9],porCompeticao:(a[10]||[]).map(t=>({nome:t[0],jogos:t[1],gols:t[2],assist:t[3],defesas:t[4],cleanSheets:t[5],...(t.length>6?{jogosClassicos:t[6],golsClassicos:t[7]}:{})}))});
 historicosLidos.set(p,linhas);return linhas;
}
