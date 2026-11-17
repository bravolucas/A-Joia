#!/usr/bin/env node
/**
 * Stress test não destrutivo do catálogo REAL de clubes do A JOIA.
 * Utiliza os mesmos geradores e a progressão anual do modo rápido.
 * Não acessa IndexedDB, localStorage ou saves existentes.
 */
import {performance} from 'node:perf_hooks';
import {gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {CLUBES} from '../src/dados/data.js';
import {diagnosticarElenco} from '../src/simulacao/profundidadeElenco.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const args=Object.fromEntries(process.argv.slice(2).filter(a=>a.startsWith('--')&&a.includes('=')).map(a=>a.slice(2).split(/=(.*)/s).slice(0,2)));
const anos=args.anos===undefined?50:Number(args.anos);
const semente=args.semente||'2026';
const cobertura=args.cobertura||'principal';
if(!['principal','qualificada'].includes(cobertura))throw Error('Use --cobertura=principal|qualificada');
if(!Number.isInteger(anos)||anos<1||anos>80)throw Error('Use --anos=1..80');
const clubes=CLUBES.filter(c=>c?.nome&&Number.isFinite(c.forca));
const nomesClubes=clubes.map(c=>c.nome);
const duplicadosCatalogo=nomesClubes.length-new Set(nomesClubes).size;
const inicio=performance.now();
const tamanhoBytes=v=>Buffer.byteLength(JSON.stringify(v),'utf8');
const heapMiB=()=>+(process.memoryUsage().heapUsed/1048576).toFixed(2);
let mundo=gerarMundoJogadores(geradorTecnico('catalogo|'+semente));
const inicial={clubes:clubes.length,atletas:mundo.jogadores.length,ativos:mundo.jogadores.filter(p=>!p.aposentado).length,bytes:tamanhoBytes(mundo)};
const serie=[],problemas=[];
let maxHeapMiB=heapMiB(),maxBytes=inicial.bytes,maxAtivos=inicial.ativos,maxJogadores=inicial.atletas;
for(let i=0;i<anos;i++){
  const t0=performance.now();
  mundo=simularTemporadaMundo(mundo,geradorTecnico('catalogo|'+semente+'|'+i),{clubes,ano:2030+i});
  const tempoMs=+(performance.now()-t0).toFixed(2);
  const ids=new Set(),porClube=new Map(clubes.map(cl=>[cl.nome,[]]));
  let duplicados=0,ativos=0,aposentados=0,livres=0;
  for(const j of mundo.jogadores){
    const id=String(j.id);
    if(ids.has(id))duplicados++;else ids.add(id);
    if(j.aposentado){aposentados++;continue}
    ativos++;
    if(!j.clubeNome){livres++;continue}
    porClube.get(j.clubeNome)?.push(j);
  }
  const incompletos=[],incompletosPrincipais=[];
  for(const clube of clubes){
    const elenco=porClube.get(clube.nome)||[];
    const principal=diagnosticarElenco(elenco);
    if(!principal.completo)incompletosPrincipais.push(clube.nome);
    const diag=cobertura==='qualificada'
      ? diagnosticarElenco(elenco,{contarSecundarias:true})
      : principal;
    if(!diag.completo)incompletos.push({clube:clube.nome,totalAtivo:diag.totalAtivo,faltantes:diag.faltantes});
  }
  const bytes=tamanhoBytes(mundo);
  const linha={ano:2030+i,temporada:mundo.temporada,atletas:mundo.jogadores.length,ativos,aposentados,livres,idsDuplicados:duplicados,clubesIncompletos:incompletos.length,clubesIncompletosPrincipais:incompletosPrincipais.length,exemplos:incompletos.slice(0,6),bytes,tempoMs};
  serie.push(linha);
  if(duplicados||incompletos.length)problemas.push(linha);
  maxHeapMiB=Math.max(maxHeapMiB,heapMiB());
  maxBytes=Math.max(maxBytes,bytes);
  maxAtivos=Math.max(maxAtivos,ativos);
  maxJogadores=Math.max(maxJogadores,mundo.jogadores.length);
}
const tempos=serie.map(x=>x.tempoMs).sort((a,b)=>a-b);
const final=serie.at(-1);
const relatorio={
  tipo:'catalogo-real-completo',parametros:{anos,seed:semente,cobertura,clubesCatalogados:clubes.length,nomesDuplicadosCatalogo:duplicadosCatalogo,primeiroAno:2030,ultimoAno:2030+anos-1},
  inicio:inicial,
  fim:{atletas:final.atletas,ativos:final.ativos,aposentados:final.aposentados,livres:final.livres,bytes:final.bytes},
  indicadores:{temporadas:serie.length,violacoes:problemas.length,exemplos:problemas.slice(0,5),maxHeapMiB,maxBytes,maxAtivos,maxJogadores,maxClubesIncompletosPrincipais:Math.max(0,...serie.map(x=>x.clubesIncompletosPrincipais)),tempoTotalMs:Math.round(performance.now()-inicio),tempoTemporadaP50Ms:tempos[Math.floor(tempos.length*.5)],tempoTemporadaP95Ms:tempos[Math.min(tempos.length-1,Math.floor(tempos.length*.95))]},
  serie:serie.map(({exemplos,...x})=>x),
  limitacoes:['Este teste percorre o cadastro real de CLUBES, mas não executa o calendário detalhado de todas as ligas.','Não testa contabilidade completa, lesões, scouting, interface nem persistência real via IndexedDB.','Tamanho de save é snapshot JSON do motor; não equivale à quota/serialização da interface.','IDs duplicados e carências são avaliados a cada virada, não necessariamente entre partidas da mesma temporada.','O modo principal ignora aptidão secundária; o modo qualificada usa matching exclusivo sem dupla contagem. Ambos reportam a quantidade de clubes com faltas de posição principal.']
};
if(process.argv.includes('--json'))console.log(JSON.stringify(relatorio,null,2));else console.log(JSON.stringify({parametros:relatorio.parametros,inicio:relatorio.inicio,fim:relatorio.fim,indicadores:relatorio.indicadores},null,2));
if(problemas.length||duplicadosCatalogo)process.exitCode=1;
