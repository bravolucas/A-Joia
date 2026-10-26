import test from 'node:test';
import assert from 'node:assert/strict';
import { criarJogador, jogarTemporada, fecharTemporada, aposentar } from '../rapido.js';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, cartaAtualTecnico, jogarTemporadaExpressaTecnico, proximaTemporadaTecnico, carreiraTecnicoEncerrada, LIMITE_TEMPORADAS_TECNICO, titulosConquistadosTecnico } from '../tecnico.js';

test('vitrine de titulos e encerramento obrigatorio apos 30 temporadas', () => {
  let c = criarJogador({ nome:'Trinta anos', nac:'BRA', posicao:'ATA', personalidade:'equilibrado', origem:'base', pe:'destro', numero:9, ritmo:'equilibrado', codigo:'TREINADOR30' });
  for(let i=0;i<18;i++){const r=jogarTemporada(c);c=fecharTemporada(r.c,r.card).c;}
  c=iniciarCarreiraTecnico(aposentar(c));
  if(c.tecnico.opcoesInicio?.length)c=iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
  for(let i=0;i<LIMITE_TEMPORADAS_TECNICO;i++){
    // Evitar demissão para exercitar o limite de duração.
    c={...c,tecnico:{...c.tecnico,diretoria:100,torcida:100,elenco:95,moral:95}};
    const carta=cartaAtualTecnico(c.tecnico);
    c=jogarTemporadaExpressaTecnico(c,carta.opcoes[0].id,()=>0.01);
    assert.equal(c.tecnico.temporadas.length,i+1);
    if(i<29){assert.equal(c.tecnico.demitido,false);c=proximaTemporadaTecnico(c);}
  }
  assert.equal(carreiraTecnicoEncerrada(c.tecnico),true);
  assert.equal(c.tecnico.temporadas.length,30);
  assert.equal(titulosConquistadosTecnico(c.tecnico).length,c.tecnico.temporadas.filter(t=>t.campeao).length);
  assert.throws(()=>proximaTemporadaTecnico(c),/30 temporadas/);
});
