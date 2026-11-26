import {ESTILOS, formacaoTecnico} from './decisoesLigasRapidas.js';
import {setorJogador} from '../simulacao/forcaEquipe.js';
import {simularPlacarDeLiga} from '../treinador/classificacoesMundoTecnico.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';

export function elencosParaLigasRapidas(jogadores = []) {
  const elencos = Object.create(null);
  for (const atleta of jogadores) {
    if (atleta.aposentado || !atleta.clubeNome || atleta.id == null) continue;
    (elencos[atleta.clubeNome] ??= []).push({
      id: atleta.id, nome: atleta.nome, idade: atleta.idade ?? null, setor: setorJogador(atleta), ovr: atleta.ovr ?? 50,
    });
  }
  return elencos;
}

// Cada ficha guarda os titulares e reservas que entraram em pares [id, minutos].
function escalar(clube, elenco, memoria, rodada, rng, tecnico) {
  const formacao = formacaoTecnico(tecnico);
  const estilo = ESTILOS[formacao];
  const referencia = clube.elenco ?? clube.forca ?? 50;
  const ficha = {formacao, ...(tecnico ? {tecnico:tecnico.nome} : {}), minutos: [], ausencias: []};
  const setores = {};
  const trocas = [];
  for (const [setor, vagas] of Object.entries(estilo.vagas)) {
    const candidatos = [];
    for (const p of elenco) {
      if (p.setor !== setor) continue;
      const atual = memoria[p.id] ??= {};
      const carga = Math.max(0, (atual.carga ?? 0) - 24 * (rodada - (atual.rodada ?? rodada)));
      atual.carga = carga;
      atual.rodada = rodada;
      if (atual.lesionadoAte >= rodada || atual.suspenso) {
        ficha.ausencias.push(p.id, atual.lesionadoAte >= rodada ? 'lesão' : 'suspensão');
        if (!(atual.lesionadoAte >= rodada)) atual.suspenso = false;
        continue;
      }
      candidatos.push({p, atual, peso: p.ovr + (atual.forma ?? 0) - carga / 10 * estilo.rodagem + rng() * 2});
    }
    candidatos.sort((a, b) => b.peso - a.peso);
    const titulares = candidatos.slice(0, vagas);
    const melhorReserva = candidatos[vagas];
    const ultimoTitular = titulares.at(-1);
    if (melhorReserva && ultimoTitular &&
        melhorReserva.atual.carga >= 20 &&
        melhorReserva.peso + melhorReserva.atual.carga / 10 * estilo.rodagem > ultimoTitular.peso + ultimoTitular.atual.carga / 10 * estilo.rodagem) {
      ficha.ausencias.push(melhorReserva.p.id, 'poupado no início');
    }
    setores[setor] = (titulares.reduce((soma, t) => soma + t.p.ovr - t.atual.carga / 24, 0) +
      Math.max(0, vagas - titulares.length) * (referencia - 12)) / vagas;
    for (const t of titulares) ficha.minutos.push(t.p.id, 90);
    if (setor !== 'GOL' && titulares.length && candidatos[vagas]) {
      const cansado = titulares.reduce((a, b) => a.atual.carga >= b.atual.carga ? a : b);
      trocas.push({sai: cansado.p.id, entra: candidatos[vagas].p.id});
    }
  }
  ficha.titulares = ficha.minutos.length / 2;
  for (const [indice, {sai, entra}] of trocas.entries()) {
    const minuto = 62 + 7 * indice;
    const posicao = ficha.minutos.findIndex((id, i) => i % 2 === 0 && id === sai);
    ficha.minutos[posicao + 1] = minuto;
    ficha.minutos.push(entra, 90 - minuto);
  }
  const ataque = setores.ATA * .65 + setores.MEI * .35 + estilo.ataque;
  const defesa = setores.DEF * .60 + setores.GOL * .25 + setores.MEI * .15 + estilo.defesa;
  return {
    ficha,
    equipe: {...clube, ataque: ((clube.ataque ?? referencia) + ataque) / 2, defesa: ((clube.defesa ?? referencia) + defesa) / 2},
  };
}

function registrar(ficha, memoria, saldo, rodada, rng) {
  for (let i = 0; i < ficha.minutos.length; i += 2) {
    const id = ficha.minutos[i], minutos = ficha.minutos[i + 1];
    const atleta = memoria[id];
    atleta.minutos = (atleta.minutos ?? 0) + minutos;
    atleta.carga = Math.min(110, atleta.carga + minutos * .42);
    atleta.forma = Math.max(-5, Math.min(5, (atleta.forma ?? 0) * .75 +
      (Math.sign(saldo) + (rng() - .5) * 4) * minutos / 90));
    if (rng() < minutos / 90 * (.008 + atleta.carga / 2500)) {
      atleta.lesionadoAte = rodada + 1 + Math.floor(rng() * 3);
    }
    if (rng() < minutos / 90 * .16) {
      atleta.amarelos = (atleta.amarelos ?? 0) + 1;
      if (atleta.amarelos === 5) {
        atleta.suspenso = true;
        atleta.amarelos = 0;
      }
    }
  }
}

export function prepararPartidasLigasRapidas(elencos, seed, anteriores = {}, tecnicos = {}, memoriaExistente = null) {
  const memoria = memoriaExistente ?? Object.fromEntries(Object.entries(anteriores).map(([id, estado]) => [id, {...estado}]));
  const disputar = (casa, fora, rodada, formaCasa, formaFora, sorteio) => {
    const rng = geradorTecnico(`${seed}|${casa.nome}|${fora.nome}|${rodada}|escalacao`);
    const a = elencos[casa.nome]?.length ? escalar(casa, elencos[casa.nome], memoria, rodada, rng, tecnicos[casa.nome]) : null;
    const b = elencos[fora.nome]?.length ? escalar(fora, elencos[fora.nome], memoria, rodada, rng, tecnicos[fora.nome]) : null;
    const placar = simularPlacarDeLiga(a?.equipe ?? casa, b?.equipe ?? fora, formaCasa, formaFora, sorteio);
    const saldo = placar.golsCasa - placar.golsFora;
    if (a) registrar(a.ficha, memoria, saldo, rodada, rng);
    if (b) registrar(b.ficha, memoria, -saldo, rodada, rng);
    return a || b ? {...placar, sumula: [a?.ficha ?? null, b?.ficha ?? null]} : placar;
  };
  return {disputar, memoria};
}
