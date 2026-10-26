import test from "node:test";
import assert from "node:assert/strict";
import { criarJogador, jogarTemporada, fecharTemporada, noticiasDaTemporada, retrospectoRivalidade, VERSAO_RAPIDO, CHAVE_SAVE_RAPIDO } from "../rapido.js";

test("carreira real: criação, três temporadas, notícias e retrospecto",()=>{
  let c=criarJogador({nome:"Jogador de Teste",nac:"BRA",posicao:"ATA",personalidade:"equilibrado",origem:"base",pe:"destro",numero:9,ritmo:"equilibrado",codigo:"AUDIT2026"});
  assert.ok(c.attrs && c.rival);
  for(let i=0;i<3;i++){
    const anterior=c.ano;
    const simulacao=jogarTemporada(c);
    const card=simulacao.card;
    assert.ok(card && Number.isFinite(card.jogos));
    const resultado=fecharTemporada(simulacao.c,card);
    c=resultado.c;
    assert.equal(c.ano,anterior+1);
    assert.equal(c.temporadas.length,i+1);
    const noticias=noticiasDaTemporada(c,resultado.card);
    assert.ok(noticias.length>0&&noticias.length<=4);
    assert.ok(noticias.every(n=>typeof n.titulo==="string"&&typeof n.detalhe==="string"));
    const retrospecto=retrospectoRivalidade(c);
    assert.equal(retrospecto.anos.length, c.temporadas.filter(t=>t.rival).length);
    assert.equal(retrospecto.voce+retrospecto.rival+retrospecto.empates,retrospecto.anos.length);
  }
  assert.equal(VERSAO_RAPIDO,1);
  assert.equal(CHAVE_SAVE_RAPIDO,"ajoia_rapido_v1");
});
