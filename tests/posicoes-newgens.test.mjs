import test from 'node:test';
import assert from 'node:assert/strict';
import {posicoesSecundariasNewgen} from '../src/simulacao/posicoesSecundariasNewgen.js';
import {completarCarenciasMundo,simularTemporadaMundo} from '../src/comum/lib.js';
import {diagnosticarElenco} from '../src/simulacao/profundidadeElenco.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const clubes=Array.from({length:10},(_,i)=>({
  nome:'Clube fictício '+i,liga:i%2?'inglaterra':'brasileirao',forca:50+i*4,
}));
const pares={
  GOL:[],LD:['LE','ZAG'],LE:['LD','ZAG'],ZAG:['LD','LE','VOL'],
  VOL:['MC','ZAG'],MC:['VOL','MEI'],MEI:['MC','PD','PE'],
  PD:['PE','MEI','ATA'],PE:['PD','MEI','ATA'],ATA:['PD','PE'],
};

test('aptidão de newgens é determinística, moderada e nunca inclui uma posição incompatível',()=>{
  const atletas=Array.from({length:300},(_,i)=>({
    id:i+1,nome:'Fictício '+i,nac:i%2?'BRA':'ENG',
    posicao:Object.keys(pares)[i%10],
  }));
  const antes=structuredClone(atletas);
  const geradas=atletas.map(posicoesSecundariasNewgen);
  assert.deepEqual(atletas,antes);
  assert.deepEqual(geradas,atletas.map(posicoesSecundariasNewgen));
  const total=geradas.filter(r=>r.length>0).length;
  assert.ok(total>20 && total<100,'Distribuição inicial não deve criar polivalentes em excesso');
  for(let i=0;i<geradas.length;i++){
    assert.ok(geradas[i].length<=1);
    for(const posicao of geradas[i]){
      assert.ok(pares[atletas[i].posicao].includes(posicao.posicao));
      assert.equal(posicao.apto,true);
      assert.notEqual(posicao.posicao,atletas[i].posicao);
    }
  }
});

test('reposições mantêm posição principal, nome regional, IDs únicos e saves antigos intactos',()=>{
  const legado={id:'99',nome:'Jogador histórico',posicao:'GOL',clubeNome:clubes[0].nome,nac:'BRA',idade:22};
  const entrada=[legado];const copia=structuredClone(entrada);
  const gerar=()=>completarCarenciasMundo(entrada,clubes,geradorTecnico('polivalencia-seed'));
  const lista=gerar();
  assert.deepEqual(entrada,copia);
  assert.equal(lista[0],legado);
  assert.deepEqual(lista,gerar());
  assert.equal(new Set(lista.map(j=>String(j.id))).size,lista.length);
  const gerados=lista.slice(1);
  assert.ok(gerados.some(j=>j.posicoesSecundarias?.length));
  for(const clube of clubes){
    assert.equal(diagnosticarElenco(lista,{clubeNome:clube.nome}).totalFaltante,0);
    assert.equal(diagnosticarElenco(lista,{clubeNome:clube.nome,contarSecundarias:true}).totalFaltante,0);
  }
  assert.equal(legado.posicoesSecundarias,undefined);
});

test('jovens surgidos após aposentadorias recebem apenas aptidões procedurais compatíveis',()=>{
  const base=completarCarenciasMundo([],clubes.slice(0,1),geradorTecnico('aposentadoria-polivalente'));
  const velhos=base.map(p=>({...p,idade:40,picoIdade:26}));
  const ids=new Set(base.map(p=>String(p.id)));
  const proximo=simularTemporadaMundo(
    {jogadores:velhos,cadastroElencos:true,temporada:0},
    geradorTecnico('aposentadoria-polivalente-1'),
    {clubes:clubes.slice(0,1),ano:2030}
  );
  const jovens=proximo.jogadores.filter(p=>!ids.has(String(p.id)));
  assert.ok(jovens.length>0);
  for(const p of jovens)for(const secundaria of (p.posicoesSecundarias||[])){
    assert.ok(pares[p.posicao]?.includes(secundaria.posicao));
    assert.equal(secundaria.apto,true);
  }
  assert.equal(new Set(proximo.jogadores.map(j=>String(j.id))).size,proximo.jogadores.length);
  assert.equal(diagnosticarElenco(proximo.jogadores,{clubeNome:clubes[0].nome,contarSecundarias:true}).totalFaltante,0);
});
