import {normalizarPosicao} from './profundidadeElenco.js';

/**
 * Versatilidade PROCEDURAL para jogadores fictícios recém-criados.
 *
 * Não deduz aptidão de atletas reais. Não consome o RNG do simulador, para
 * manter a mesma sequência de nomes, nacionalidades, jogos e mercado entre
 * saves com a mesma semente. A posição alternativa é estável pela identidade
 * e compatível com as funções usuais de jogo.
 *
 * A probabilidade de 20% é uma política inicial de game design, não uma
 * estatística real nem um limiar oculto de proficiência.
 */
const ALTERNATIVAS = Object.freeze({
  GOL: [],
  LD: ['LE','ZAG'],
  LE: ['LD','ZAG'],
  ZAG: ['LD','LE','VOL'],
  VOL: ['MC','ZAG'],
  MC: ['VOL','MEI'],
  MEI: ['MC','PD','PE'],
  PD: ['PE','MEI','ATA'],
  PE: ['PD','MEI','ATA'],
  ATA: ['PD','PE'],
});

function hashIdentidade(atleta) {
  const chave=[atleta?.id,atleta?.nome,atleta?.nac,atleta?.posicao]
    .map(x=>String(x??'')).join('|');
  let hash=2166136261;
  for(let i=0;i<chave.length;i++) {
    hash=Math.imul(hash^chave.charCodeAt(i),16777619);
  }
  return hash>>>0;
}

export function posicoesSecundariasNewgen(atleta) {
  const principal=normalizarPosicao(atleta?.posicao);
  const alternativas=ALTERNATIVAS[principal]||[];
  if(!alternativas.length)return [];
  const hash=hashIdentidade(atleta);
  if(hash%100>=20)return [];
  const segunda=alternativas[Math.floor(hash/100)%alternativas.length];
  return [{posicao:segunda,apto:true}];
}
