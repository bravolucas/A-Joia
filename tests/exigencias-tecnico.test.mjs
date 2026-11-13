import test from 'node:test';import assert from 'node:assert/strict';
import {exigenciaClubeTecnico,avaliarDiretoriaTemporada,reavaliarDiretoriaTecnico} from '../src/treinador/exigenciasTecnico.js';
import {objetivoTecnico} from '../src/treinador/tecnico.js';
import {propostasSelecoesTecnico} from '../src/treinador/selecoesTecnico.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
const real={clube:'Real Madrid',liga:'espanha',diretoria:90,torcida:90,temporadas:[]};
test('metas de gigantes não são abrandadas para treinador estreante e acompanham a liga',()=>{
 assert.equal(objetivoTecnico(real).posicao,1);assert.equal(exigenciaClubeTecnico(real).perfil,'gigante');assert.equal(exigenciaClubeTecnico({clube:'Flamengo'}).grande,true);assert.equal(exigenciaClubeTecnico({clube:'Ponte Preta'}).grande,false);assert.equal(exigenciaClubeTecnico({clube:'Real Madrid',liga:'espanha2'}).gigante,false);
});
test('Real em terceiro tem risco alto sem Champions e permanece quando a conquista',()=>{
 for(let ano=2030;ano<2060;ano++){
  const a={ano,clube:'Real Madrid',liga:'espanha',posicao:3,cumpriuObjetivo:false,titulosConquistados:[]};const sem=avaliarDiretoriaTemporada(real,a),com=avaliarDiretoriaTemporada({...real,diretoria:5,torcida:5},{...a,titulosConquistados:['UEFA Champions League']});
  assert.equal(sem.risco,.9);assert.equal(com.demitido,false);assert.equal(com.salvoPelaChampions,true);assert.equal(com.cumpriuObjetivo,true);
 }
});
test('grande fora do top 4 sofre cobrança mesmo com confiança alta; taça nacional não equivale a Champions',()=>{
 const t={clube:'Flamengo',liga:'brasileirao',diretoria:95,torcida:95};const r=avaliarDiretoriaTemporada(t,{clube:t.clube,ano:2031,liga:t.liga,posicao:7,titulosConquistados:[],cumpriuObjetivo:false});assert.ok(r.risco>=.9);assert.ok(r.diretoria<95);
 const a={ano:2030,clube:'Real Madrid',posicao:3,cumpriuObjetivo:false,titulosConquistados:['Copa del Rey']};assert.ok(avaliarDiretoriaTemporada(real,a).risco>.7);
});
test('avaliação espera todas as copas e não duplica efeito ao retomar o save',()=>{
 const a={ano:2030,clube:'Real Madrid',liga:'espanha',posicao:3,cumpriuObjetivo:false,titulosConquistados:[]};a.avaliacaoDiretoria=avaliarDiretoriaTemporada({...real,contratoCurto:{clube:'Real Madrid',ano:2030}},a,{pendente:true});let c={tecnico:{...real,temporadas:[a],copasEmJogo:{}}};assert.equal(reavaliarDiretoriaTecnico(c),c);
 c=structuredClone(c);c.tecnico.copasEmJogo=null;c.tecnico.temporadas[0].titulosConquistados.push('UEFA Champions League');const r=reavaliarDiretoriaTecnico(c);assert.equal(r.tecnico.demitido,false);assert.equal(r.tecnico.temporadas[0].contratoCurto,'renovado');assert.equal(r.tecnico.temporadas[0].avaliacaoDiretoria.pendente,false);assert.deepEqual(reavaliarDiretoriaTecnico(JSON.parse(JSON.stringify(r))),r);
});
test('ofertas de seleção são ocasionais, no máximo uma e estáveis dentro do mesmo ano',()=>{
 let anosComOferta=0;const t={reputacao:90,temporadas:[{},{}],clube:'Real Madrid',pais:'Espanha'};
 for(let ano=2025;ano<2425;ano++){const a=propostasSelecoesTecnico({...t,ano},85,geradorTecnico(ano));assert.ok(a.length<=1);if(a.length)anosComOferta++;assert.deepEqual(a,propostasSelecoesTecnico({...t,ano},85,geradorTecnico(ano)));}
 assert.ok(anosComOferta>40&&anosComOferta<140,`${anosComOferta}/400 anos`);
});

test('resultado da Champions jogada salva o treinador só depois de encerrar o calendário',async()=>{
 const {criarCampanhaCopa,decisaoCopa}=await import('../src/treinador/copasEscolha.js');
 const {criarAgenda}=await import('../src/competicoes/calendarioCopas.js');
 const {chaveCopaTecnico}=await import('../src/treinador/copasCarreiraTecnico.js');
 const {resolverCopaEscolhaTecnico}=await import('../src/treinador/tecnico.js');
 let salvou=false;
 for(let seed=0;seed<12&&!salvou;seed++){
  const cp=criarCampanhaCopa({nome:'UEFA Champions League',tipo:'continental',usuario:'Real Madrid',forcaUsuario:99,clubes:[{nome:'Real Madrid',forca:99},{nome:'Porto',forca:30}],ano:2030,formato:'mata',seed:`salvar-${seed}`});
  const a={ano:2030,clube:'Real Madrid',liga:'espanha',posicao:3,cumpriuObjetivo:false,titulosConquistados:[],torneios:[]};a.avaliacaoDiretoria=avaliarDiretoriaTemporada(real,a,{pendente:true});
  let c={nome:'Teste',idade:45,ano:2031,tecnico:{...real,ano:2031,reputacao:80,titulos:0,fase:'resultado',temporadas:[a],copasEmJogo:criarAgenda([cp],{ano:2030,clube:'Real Madrid'})}};
  for(let i=0;c.tecnico.copasEmJogo&&i<80;i++){const p=c.tecnico.copasEmJogo,cp=p.campeonatos[p.indice],d=decisaoCopa(cp);assert.equal(c.tecnico.demitido||false,false);c=resolverCopaEscolhaTecnico(c,chaveCopaTecnico(c.tecnico),p.pausa?'continuar':d?d.penaltis?'canto':'controlar':'continuar');}
  assert.equal(c.tecnico.copasEmJogo,null);if(c.tecnico.temporadas[0].titulosConquistados.includes('UEFA Champions League')){salvou=true;assert.equal(c.tecnico.demitido,false);assert.equal(c.tecnico.temporadas[0].avaliacaoDiretoria.salvoPelaChampions,true);const json=JSON.parse(JSON.stringify(c));assert.equal(reavaliarDiretoriaTecnico(json),json);}
 }
 assert.equal(salvou,true);
});
