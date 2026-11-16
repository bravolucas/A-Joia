import test from 'node:test';
import assert from 'node:assert/strict';
import { completarCarenciasMundo, simularTemporadaMundo } from '../src/comum/lib.js';
import { diagnosticarElenco } from '../src/simulacao/profundidadeElenco.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';

const clubes=[
  {nome:'Clube brasileiro',liga:'brasileirao',forca:70},
  {nome:'Clube inglês',liga:'inglaterra',forca:84},
  {nome:'Clube pequeno',liga:'serieB',forca:52},
];
const identidade=(j)=>[j.id,j.nome,j.posicao,j.clubeNome];

test('emergência preenche todas as posições sem alterar os atletas existentes',()=>{
  const original=[{id:14,nome:'Atleta antigo',posicao:'GOL',clubeNome:'Clube brasileiro',ovr:70}];
  const antes=structuredClone(original);
  const completo=completarCarenciasMundo(original,clubes,geradorTecnico('carencias'));
  assert.deepEqual(original,antes);
  assert.deepEqual(identidade(completo[0]),identidade(original[0]));
  for(const clube of clubes) {
    const d=diagnosticarElenco(completo,{clubeNome:clube.nome});
    assert.equal(d.totalFaltante,0,clube.nome);
    assert.equal(d.totalAtivo,22,clube.nome);
  }
  assert.equal(new Set(completo.map(j=>j.id)).size,completo.length);
});

test('reposição é idempotente e não multiplica atletas na mesma temporada',()=>{
 const a=completarCarenciasMundo([],clubes,geradorTecnico('elenco'));
 const b=completarCarenciasMundo(a,clubes,geradorTecnico('elenco'));
 assert.deepEqual(a,b);
});

test('motor completo mantém cobertura por 30 temporadas com aposentadorias e transferências',()=>{
 let mundo={jogadores:completarCarenciasMundo([],clubes,geradorTecnico('inicio')),cadastroElencos:true,temporada:0};
 for(let ano=0;ano<30;ano++){
   mundo=simularTemporadaMundo(mundo,geradorTecnico('temporada'+ano),{clubes});
   for(const clube of clubes)
     assert.equal(diagnosticarElenco(mundo.jogadores,{clubeNome:clube.nome}).totalFaltante,0,`${clube.nome}, temporada ${ano+1}`);
   assert.equal(new Set(mundo.jogadores.map(j=>j.id)).size,mundo.jogadores.length);
 }
});

test('simulação de 30 anos mantém elencos mínimos e controla criação excessiva',()=>{
 let atletas=completarCarenciasMundo([],clubes,geradorTecnico('trinta'));
 for(let ano=0;ano<30;ano++){
   // Saídas, incluindo transferências e aposentadorias entre temporadas.
   atletas=atletas.filter((j,i)=>i%((ano%3)+5)!==0);
   atletas=completarCarenciasMundo(atletas,clubes,geradorTecnico(`reposicao-${ano}`));
   for(const clube of clubes)assert.equal(diagnosticarElenco(atletas,{clubeNome:clube.nome}).totalFaltante,0);
   assert.equal(atletas.length,66);
 }
});
