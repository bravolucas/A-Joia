#!/usr/bin/env node
/**
 * Auditoria exploratória do Modo Treinador com o motor real.
 * Exemplos:
 *   node scripts/auditar-dificuldade-treinador.mjs --amostras=12
 *   node scripts/auditar-dificuldade-treinador.mjs --liga=brasileirao --amostras=50 --semente=2026 --json
 *
 * Não altera o jogo, os saves, os dados nem o motor da simulação.
 * Não é executado automaticamente no CI: a amostragem completa é custosa.
 */
import { pathToFileURL } from 'node:url';
import {
  CLUBES_CONVITES_TECNICO, iniciarCarreiraTecnico, jogarTemporadaExpressaTecnico,
} from '../src/treinador/tecnico.js';

export function selecionarFaixas(clubes, liga = 'brasileirao') {
  const participantes = clubes.filter(c => c.liga === liga && Number.isFinite(c.elenco))
    .sort((a,b) => a.elenco - b.elenco || a.nome.localeCompare(b.nome, 'pt-BR'));
  if (participantes.length < 3) throw new Error('A liga solicitada precisa de pelo menos três clubes cadastrados.');
  return [
    { faixa: 'fraco', ...participantes[0] },
    { faixa: 'medio', ...participantes[Math.floor((participantes.length - 1) / 2)] },
    { faixa: 'forte', ...participantes.at(-1) },
  ];
}

export function rngSemente(semente) {
  let estado = semente >>> 0;
  return () => ((estado = (Math.imul(1664525, estado) + 1013904223) >>> 0) / 4294967296);
}
export function resumirAmostras(amostras = []) {
  const total = amostras.length;
  if (!total) throw new Error('Nenhuma temporada para resumir.');
  const media = campo => Number((amostras.reduce((s,x) => s + (x[campo] ?? 0), 0) / total).toFixed(2));
  const quantidade = campo => amostras.filter(x => x[campo] === true).length;
  const taxa = campo => Number((quantidade(campo) * 100 / total).toFixed(2));
  const faixas = campo => {
    const valores = amostras.map(x => x[campo]).filter(Number.isFinite).sort((a,b)=>a-b);
    if (!valores.length) return null;
    return { minimo: valores[0], p50: valores[Math.floor((valores.length - 1) * .5)], p90: valores[Math.floor((valores.length - 1) * .9)], maximo: valores.at(-1) };
  };
  return {
    amostras: total, titulosLiga: quantidade('campeaoLiga'),
    percentualTitulosLiga: taxa('campeaoLiga'),
    percentualDemissoes: taxa('demitido'),
    mediaPontos: media('pontos'),
    mediaPosicao: media('posicao'),
    posicoes: faixas('posicao'),
    pontos: faixas('pontos'),
    mediaOutrosTitulos: media('outrosTitulos'),
  };
}

function argumentos(argv) {
  const config = { liga: 'brasileirao', amostras: 12, semente: 2026, json: false };
  for (const item of argv) {
    if (item === '--json') { config.json = true; continue; }
    const [k, ...partes] = item.split('='), valor = partes.join('=');
    if (k === '--liga') config.liga = valor;
    else if (k === '--amostras') config.amostras = Number(valor);
    else if (k === '--semente') config.semente = Number(valor);
    else throw new Error('Parâmetro desconhecido: ' + item);
  }
  if (!config.liga || !Number.isInteger(config.amostras) || config.amostras < 1 || config.amostras > 200 ||
      !Number.isSafeInteger(config.semente) || config.semente < 0) {
    throw new Error('Use --liga=... --amostras=1..200 --semente=inteiro-positivo [--json].');
  }
  return config;
}

function simularUmaTemporada(clube, semente, indice) {
  const atleta = {
    nome: 'Auditoria ' + indice, idade: 40, ano: 2030, aposentado: true,
    clubeNome: clube.nome, temporadas: [], totais: {}, legado: { pontos: 600 },
  };
  const inicial = iniciarCarreiraTecnico(atleta);
  const base = {
    ...inicial, ritmo: 'expresso',
    tecnico: {
      ...inicial.tecnico, clubeInicialEscolhido: true,
      clube: clube.nome, pais: clube.pais, liga: clube.liga,
      elenco: clube.elenco,
    },
  };
  // A mesma semente é utilizada nas três faixas para comparação pareada.
  const resultado = jogarTemporadaExpressaTecnico(base, null, rngSemente(semente));
  const temporada = resultado.tecnico?.temporadas?.at(-1);
  if (!temporada || resultado.tecnico.temporadas.length !== 1 ||
      !Number.isFinite(temporada.posicao) || !Number.isFinite(temporada.pontos)) {
    throw new Error(`Resultado incompleto: ${clube.nome} / semente ${semente}`);
  }
  const titulos = temporada.titulosConquistados ?? [];
  return {
    semente, clube: clube.nome, forcaInicial: clube.elenco,
    posicao: temporada.posicao, pontos: temporada.pontos,
    campeaoLiga: temporada.posicao === 1,
    outrosTitulos: Array.isArray(titulos) ? titulos.length - Number(titulos.includes(temporada.liga)) : 0,
    demitido: !!(temporada.demitido || resultado.tecnico.demitido),
  };
}

export async function auditar({ liga = 'brasileirao', amostras = 12, semente = 2026 } = {}) {
  const clubes = selecionarFaixas(CLUBES_CONVITES_TECNICO, liga);
  const series = clubes.map(clube => ({ faixa: clube.faixa, clube: clube.nome, forca: clube.elenco, dados: [] }));
  for (let i = 0; i < amostras; i++) {
    // Uma semente por repetição, igual para cada faixa, e progressão previsível.
    const seed = (semente + Math.imul(i + 1, 7919)) >>> 0;
    for (let j = 0; j < clubes.length; j++) {
      series[j].dados.push(simularUmaTemporada(clubes[j], seed, i));
    }
  }
  return {
    metodo: 'motor real do Modo Treinador, uma temporada por carreira, ritmo expresso, sem decisão opcional',
    liga, semente, repeticoesPorFaixa: amostras,
    aviso: 'Amostragem exploratória, não prova de realismo; para comparação publicar parâmetros idênticos antes/depois.',
    faixas: series.map(({dados,...m}) => ({...m, ...resumirAmostras(dados)})),
  };
}

const principal = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (principal) {
  try {
    const config = argumentos(process.argv.slice(2));
    const resultado = await auditar(config);
    if (config.json) console.log(JSON.stringify(resultado, null, 2));
    else {
      console.log(`A JOIA — Dificuldade do treinador | ${resultado.liga} | ${config.amostras} amostras por força`);
      console.table(resultado.faixas.map(({faixa,clube,forca,percentualTitulosLiga,percentualDemissoes,mediaPontos,mediaPosicao}) => ({
        faixa,clube,forca,titulosLigaPct:percentualTitulosLiga,demissoesPct:percentualDemissoes,pontosMedios:mediaPontos,posicaoMedia:mediaPosicao,
      })));
      console.log(resultado.aviso);
    }
  } catch(e) { console.error('Auditoria interrompida:', e.message); process.exitCode = 1; }
}
