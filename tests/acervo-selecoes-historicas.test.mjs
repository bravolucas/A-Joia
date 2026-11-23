import test from 'node:test';
import assert from 'node:assert/strict';
import {NACIONALIDADES,CLUBES} from '../src/dados/data.js';
import {ACERVO_SELECOES_HISTORICAS,acervoSelecaoHistoricoDe,
 REFERENCIAS_RECORDES_SELECOES,TOTAL_SELECOES_COM_FICHA} from '../src/dados/acervoSelecoesHistoricas.js';
import {ACERVO_CLUBES_HISTORICOS} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS,INVENTARIO_SELECOES_HISTORICAS,
 TOTAL_ENTIDADES_HISTORICAS,coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

test('o inventario inclui todos os clubes jogáveis, extras e as 83 seleções',()=>{
 assert.equal(NACIONALIDADES.length,83);
 assert.equal(TOTAL_ENTIDADES_HISTORICAS.selecoes,83);
 assert.ok(TOTAL_ENTIDADES_HISTORICAS.clubes>=CLUBES.length);
 for(const clube of CLUBES)assert.ok(coberturaHistoricaDe('clube',clube.nome));
 for(const selecao of NACIONALIDADES){
  assert.ok(coberturaHistoricaDe('selecao',selecao.label));
  assert.ok(acervoSelecaoHistoricoDe(selecao.label));
 }
 assert.equal(new Set(INVENTARIO_CLUBES_HISTORICOS.map(c=>c.nome)).size,INVENTARIO_CLUBES_HISTORICOS.length);
 assert.equal(INVENTARIO_SELECOES_HISTORICAS.length,83);
 assert.equal(Object.keys(ACERVO_SELECOES_HISTORICAS).length,83);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,45);
 assert.ok(TOTAL_SELECOES_COM_FICHA>=20);
 assert.equal(coberturaHistoricaDe('clube','Clube inventado'),null);
});
test('seleções com fonte possuem gols e jogos apenas comprovados, sem preencher zeros',()=>{
 const chaves=new Set();
 for(const selecao of Object.values(ACERVO_SELECOES_HISTORICAS)){
  for(const atleta of selecao.atletas){
   assert.ok(atleta.nome&&atleta.fonte?.startsWith('https://'));
   for(const campo of ['jogos','gols'])
    assert.ok(atleta[campo]===null||(Number.isInteger(atleta[campo])&&atleta[campo]>0));
  }
  for(const t of selecao.titulos)assert.ok(t.ano&&t.competicao);
  if(!selecao.atletas.length)assert.equal(selecao.cobertura,'pendente_apuracao');
 }
 for(const registro of REFERENCIAS_RECORDES_SELECOES){
  assert.ok(registro.fonte?.startsWith('https://'));
  assert.ok(['golsSelecao','jogosSelecao'].includes(registro.id));
  assert.ok(Number.isInteger(registro.valor)&&registro.valor>0);
  const id=registro.nome+'|'+registro.id;
  assert.ok(!chaves.has(id),'Recorde duplicado: '+id);
  chaves.add(id);
  assert.ok(acervoSelecaoHistoricoDe(registro.nome).atletas.some(a=>a.nome===registro.atleta));
 }
});
test('separa recordes reais de Brasil, Argentina e Portugal dos dados do save',()=>{
 const r=(pais,id)=>consultarRecordesFutebol({},'selecao',pais).recordes.find(x=>x.id===id);
 assert.equal(r('Brasil','golsSelecao').real.valor,80);
 assert.equal(r('Argentina','golsSelecao').real.valor,126);
 assert.equal(r('Portugal','golsSelecao').real.valor,146);
 assert.equal(r('Portugal','jogosSelecao').real.valor,234);
 assert.equal(r('Espanha','golsSelecao').real.valor,59);
 assert.equal(r('Estados Unidos','golsSelecao').real.valor,57);
 assert.equal(r('França','golsSelecao').real.valor,67);
 assert.equal(r('Alemanha','golsSelecao').real.valor,71);
 assert.equal(r('Japão','golsSelecao').simulado,null);
});
test('títulos históricos das seleções ficam disponíveis sem save e sem inventar títulos',()=>{
 const brasil=acervoSelecaoHistoricoDe('Brasil');
 assert.ok(brasil.titulos.some(t=>t.ano===2002&&t.competicao==='Copa do Mundo'));
 const espanha=acervoSelecaoHistoricoDe('Espanha');
 assert.ok(espanha.titulos.some(t=>t.ano===2026&&t.competicao==='Copa do Mundo'));
 const fiji=acervoSelecaoHistoricoDe('Fiji');
 assert.ok(fiji&&fiji.atletas.length===0);
 assert.ok(!fiji.titulos.some(t=>t.competicao==='Copa do Mundo'));
});
