import test from 'node:test';
import assert from 'node:assert/strict';
import { criarJogador, jogarTemporada, fecharTemporada, aposentar } from '../rapido.js';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, cartaAtualTecnico, jogarTemporadaExpressaTecnico, proximaTemporadaTecnico } from '../tecnico.js';

test('modo treinador expresso: clube, uma decisao, resumo e segunda temporada', () => {
  for (let i = 0; i < 24; i++) {
    let c = criarJogador({ nome:'Expresso '+i, nac:'BRA', posicao: i%2 ? 'ATA':'MC', personalidade:'equilibrado', origem:'base', pe:'destro', numero:9, ritmo:'equilibrado', codigo:'EXPRESSO'+i });
    for (let j = 0; j < 18; j++) { const s = jogarTemporada(c); c = fecharTemporada(s.c,s.card).c; }
    c = aposentar(c);
    const jogador = structuredClone(c.temporadas);
    c = iniciarCarreiraTecnico(c);
    if (c.tecnico.opcoesInicio?.length) c = iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
    for (let ano = 0; ano < 2; ano++) {
      const carta = cartaAtualTecnico(c.tecnico);
      assert.ok(carta?.opcoes?.length);
      c = jogarTemporadaExpressaTecnico(c,carta.opcoes[i % carta.opcoes.length].id,()=>0.75);
      assert.equal(c.tecnico.fase,'resultado');
      assert.equal(c.tecnico.temporadas.length,ano+1);
      const r = c.tecnico.temporadas.at(-1);
      assert.equal(r.vitorias+r.empates+r.derrotas,38);
      assert.equal(r.pontos,3*r.vitorias+r.empates);
      assert.deepEqual(c.temporadas,jogador);
      if (ano===0) {
        // Esta simulacao usa um sorteio estavel, mas uma demissao pode ocorrer.
        if (c.tecnico.demitido) break;
        c = proximaTemporadaTecnico(c);
      }
    }
  }
});
