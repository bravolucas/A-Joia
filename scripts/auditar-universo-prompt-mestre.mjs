#!/usr/bin/env node
/**
 * Auditoria não destrutiva A JOIA — Prompt Mestre, fases 1/2/8.
 * 50 anos de mundo em três clubes de forças diferentes + 10.000 nomes
 * distribuídos entre as nacionalidades registradas.
 * Nenhum save do navegador é lido ou escrito.
 * Saída JSON é exploratória; não prova economia/scouting ou escala mundial.
 */
import { performance } from 'node:perf_hooks';
import { completarCarenciasMundo, simularTemporadaMundo } from '../src/comum/lib.js';
import { diagnosticarElenco, TOTAL_MINIMO_ELENCO } from '../src/simulacao/profundidadeElenco.js';
import { gerarNomeRegional, origemNomes } from '../src/simulacao/nomesRegionais.js';
import { NACIONALIDADES } from '../src/dados/data.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';

const options = Object.fromEntries(process.argv.slice(2)
  .filter(a => a.startsWith('--') && a.includes('='))
  .map(a => a.slice(2).split(/=(.*)/s).slice(0, 2)));
const anos = options.anos === undefined ? 50 : Number(options.anos);
const amostra = options.amostra === undefined ? 10000 : Number(options.amostra);
const semente = options.semente || '2026';
if (!Number.isInteger(anos) || anos < 1 || anos > 80 ||
    !Number.isInteger(amostra) || amostra < 83 || amostra > 30000) {
  throw new Error('Use --anos=1..80 e --amostra=83..30000.');
}
const clubes = [
  {nome:'Clube brasileiro',liga:'brasileirao',forca:70},
  {nome:'Clube inglês',liga:'inglaterra',forca:84},
  {nome:'Clube pequeno',liga:'serieB',forca:52},
];
const memoria = () => Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
const bytes = valor => Buffer.byteLength(JSON.stringify(valor), 'utf8');
const inicio = performance.now();
let mundo = {jogadores:completarCarenciasMundo([],clubes,geradorTecnico('inicial|' + semente)),cadastroElencos:true,temporada:0};
const tamanhoInicial = bytes(mundo);
const totalInicial = mundo.jogadores.length;
const cobertura = [], problemas = [];
let maxTotal = mundo.jogadores.length, maxAtivos = 0, maxHeapMiB = memoria(), maxBytes = tamanhoInicial;
for (let indice=0;indice<anos;indice++) {
  mundo = simularTemporadaMundo(mundo,geradorTecnico('ano|' + semente + '|' + indice),{clubes,ano:2030+indice});
  const ids = mundo.jogadores.map(j=>String(j.id));
  const idsDuplicados = ids.length - new Set(ids).size;
  const clubesAno = clubes.map(clube => {
    const d = diagnosticarElenco(mundo.jogadores,{clubeNome:clube.nome});
    return {clube:clube.nome,ativos:d.totalAtivo,faltantes:d.totalFaltante};
  });
  const ativos = mundo.jogadores.filter(j=>!j.aposentado).length;
  const linha = {ano:2030+indice,temporada:mundo.temporada,ativos,mundiais:mundo.jogadores.length,idsDuplicados,clubes:clubesAno};
  cobertura.push(linha);
  if (idsDuplicados || clubesAno.some(c=>c.faltantes > 0)) problemas.push(linha);
  maxTotal = Math.max(maxTotal,mundo.jogadores.length);
  maxAtivos = Math.max(maxAtivos,ativos);
  maxHeapMiB = Math.max(maxHeapMiB,memoria());
  maxBytes = Math.max(maxBytes,bytes(mundo));
}
const codigos = NACIONALIDADES.map(n=>n.id);
const rng = geradorTecnico('nome|' + semente);
const porPais = new Map(codigos.map(c=>[c, {codigo:c,origem:origemNomes(c),total:0,distintos:new Set()}]));
for(let i=0;i<amostra;i++){
  const codigo = codigos[i % codigos.length];
  const nome = gerarNomeRegional(codigo,rng);
  const grupo = porPais.get(codigo);
  grupo.total++;
  grupo.distintos.add(nome);
}
const paises = [...porPais.values()].map(g => ({
  codigo:g.codigo,origem:g.origem,total:g.total,nomesDistintos:g.distintos.size,
  nomesRepetidos:g.total-g.distintos.size
}));
const repetidos = paises.reduce((n,p)=>n+p.nomesRepetidos,0);
// Repetição também pode surgir entre duas nacionalidades que compartilham
// um conjunto cultural; não confundir isso com repetição dentro do país.
const todosNomes = new Map();
for (const grupo of porPais.values()) for (const nome of grupo.distintos) {
  if (!todosNomes.has(nome)) todosNomes.set(nome, new Set());
  todosNomes.get(nome).add(grupo.codigo);
}
const nomesCompartilhadosEntrePaises = [...todosNomes]
  .filter(([, paises]) => paises.size > 1)
  .map(([nome, paises]) => ({nome, paises:[...paises]}))
  .sort((a,b) => b.paises.length - a.paises.length || a.nome.localeCompare(b.nome,'pt-BR'));
const duracaoMs = Math.round(performance.now()-inicio);
const relatorio = {
  base:'Auditoria exploratória A JOIA (não representa o universo completo nem a economia)',
  parametros:{anos,amostraNomes:amostra,seed:semente,clubes:clubes.length,nacionalidades:codigos.length,elencoMinimoPadrao:TOTAL_MINIMO_ELENCO},
  mundo:{temporadasSimuladas:cobertura.length,ultimoAno:2030+anos-1,
    jogadoresIniciais:totalInicial,jogadoresMundoFinal:mundo.jogadores.length,
    jogadoresAtivosFinal:mundo.jogadores.filter(j=>!j.aposentado).length,
    maxTotalJogadores:maxTotal,maxAtivos,
    tamanhoJsonInicialBytes:tamanhoInicial,tamanhoJsonFinalBytes:bytes(mundo),
    maxTamanhoJsonBytes:maxBytes,maxHeapMiB,
    violacoes:problemas.length,exemplosViolacao:problemas.slice(0,5),
    serie:cobertura.map(l=>({ano:l.ano,ativos:l.ativos,mundiais:l.mundiais,idsDuplicados:l.idsDuplicados,faltantes:l.clubes.reduce((s,c)=>s+c.faltantes,0)}))},
  nomes:{totalGerados:amostra,totalRepetidosPorNacionalidade:repetidos,
    taxaRepeticaoPercentual:+(100*repetidos/amostra).toFixed(2),
    paisesSemOrigemRegional:paises.filter(p=>p.origem==='INT').map(p=>p.codigo),
    totalNomesDistintosGlobais:todosNomes.size,
    combinacoesCompartilhadasEntreNacionalidades:nomesCompartilhadosEntrePaises.length,
    exemplosDeNomesCompartilhados:nomesCompartilhadosEntrePaises.slice(0,15),
    dezPaisesComMaisRepeticoes:paises.slice().sort((a,b)=>b.nomesRepetidos-a.nomesRepetidos).slice(0,10),
    porNacionalidade:paises},
  medicao:{duracaoMs,heapFinalMiB:memoria()},
  limitacoes:['Ensaio com 3 clubes apenas; não prova cobertura ou orçamento mundial.','Amostras de nomes percorrem 83 países igualmente; não representam distribuição real de futebolistas.','Sem testes de lesões, scouting, reputação multidimensional ou economia detalhada.','Amostragem detecta nomes repetidos por país e homônimos compartilhados entre países, mas não identifica combinações culturalmente inadequadas nem migração familiar.']
};
if(options.json!==undefined || process.argv.includes('--json')) console.log(JSON.stringify(relatorio,null,2));
else console.log('Fases 1/2: '+anos+' anos; '+amostra+' nomes; '+problemas.length+' violacoes de elenco/ID; '+relatorio.nomes.taxaRepeticaoPercentual+'% de repeticoes de nomes por nacionalidade; '+duracaoMs+' ms; '+Math.round(maxBytes/1024)+' KiB de save maximo.');
if (problemas.length) process.exitCode=1;
