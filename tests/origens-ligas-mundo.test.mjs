import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {completarCarenciasMundo} from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {origemNomes} from '../src/simulacao/nomesRegionais.js';
import {
  NACIONALIDADE_LOCAL_LIGA, nacionalidadeLocalLiga,
  nacionalidadeInicialLiga, nacionalidadeNovoAtletaLiga,
} from '../src/simulacao/nacionalidadesLiga.js';

test('19 ligas jogáveis e segundas divisões têm origem local; grupo misto não inventa país',()=>{
  const esperadas={
    brasileirao:'BRA',serieB:'BRA',argentina:'ARG',
    inglaterra:'ENG',inglaterra2:'ENG',
    espanha:'ESP',espanha2:'ESP',
    italia:'ITA',italia2:'ITA',
    alemanha:'ALE',alemanha2:'ALE',
    franca:'FRA',franca2:'FRA',
    portugal:'POR',portugal2:'POR',
    holanda:'HOL',arabia:'ARS',mls:'EUA',turquia:'TUR',
  };
  assert.equal(Object.keys(esperadas).length,19);
  for(const [liga,nac] of Object.entries(esperadas)) {
    assert.ok(CLUBES.some(cl=>cl.liga===liga), 'liga presente: '+liga);
    assert.equal(nacionalidadeLocalLiga(liga),nac);
    assert.notEqual(origemNomes(nac),'INT');
  }
  assert.equal(NACIONALIDADE_LOCAL_LIGA.brasileiro,'BRA','alias legado');
  assert.equal(nacionalidadeLocalLiga('sulamericano'),null);
  assert.equal(nacionalidadeLocalLiga('liga-inesperada'),null);
});

test('regra inicial mantém 85% Brasil, 55% exterior e sorteios legados',()=>{
  const rng=seq=>{let i=0;return ()=>{assert.ok(i<seq.length,'RNG sem sorteio extra');return seq[i++];};};
  assert.equal(nacionalidadeInicialLiga('brasileirao',rng([0.84])),'BRA');
  assert.equal(nacionalidadeInicialLiga('serieB',rng([0.84])),'BRA');
  assert.equal(nacionalidadeInicialLiga('espanha2',rng([0.54])),'ESP');
  assert.equal(nacionalidadeInicialLiga('argentina',rng([0.54])),'ARG');
  assert.equal(nacionalidadeInicialLiga('inglaterra2',rng([0.54])),'ENG');
  assert.equal(nacionalidadeInicialLiga('sulamericano',rng([0.1,0])),'BRA','sem local: fallback global');
  assert.equal(nacionalidadeInicialLiga('franca2',rng([0.9,0])),'BRA','estrangeiros continuam possíveis');
  assert.equal(nacionalidadeInicialLiga('alemanha',rng([0.9,0])),'BRA','sem aumento do pool europeu');
});

test('revelações mantêm chance local, permitem estrangeiros e não consomem RNG global extra',()=>{
  const uma=()=>{let chamadas=0;return {rng:()=>{chamadas++;return 0.2;}, chamadas:()=>chamadas};};
  for(const liga of ['argentina','inglaterra2','espanha2','italia2','alemanha2','franca2','portugal2','holanda','arabia','mls','turquia']){
    const a=uma();
    assert.equal(nacionalidadeNovoAtletaLiga(liga,a.rng),nacionalidadeLocalLiga(liga));
    assert.equal(a.chamadas(),1,liga);
  }
  const b=uma();
  assert.equal(nacionalidadeNovoAtletaLiga('sulamericano',b.rng),nacionalidadeNovoAtletaLiga('sulamericano',()=>0.2));
  assert.equal(b.chamadas(),1,'liga mista só sorteia origem global');
  assert.equal(nacionalidadeNovoAtletaLiga('holanda',(()=>{let i=0;return ()=>[0.9,0][i++];})()),'BRA');
});

test('reposição de clubes estrangeiros cria jovens com nomes coerentes sem duplicar IDs',()=>{
  const clubes=[
    {nome:'Clube teste Segunda Espanhola',liga:'espanha2',forca:68},
    {nome:'Clube teste Argentino',liga:'argentina',forca:70},
    {nome:'Clube teste MLS',liga:'mls',forca:66},
  ];
  const originais=[]; const copia=structuredClone(originais);
  const criar=()=>completarCarenciasMundo(originais,clubes,geradorTecnico('origens-ligas-2026'));
  const jogadores=criar();
  assert.deepEqual(originais,copia,'sem reescrever elenco antigo');
  assert.deepEqual(jogadores,criar(),'seed reprodutível');
  assert.equal(new Set(jogadores.map(j=>String(j.id))).size,jogadores.length);
  for(const clube of clubes){
    const grupo=jogadores.filter(j=>j.clubeNome===clube.nome);
    assert.ok(grupo.length>=22);
    const local=nacionalidadeLocalLiga(clube.liga);
    assert.ok(grupo.filter(j=>j.nac===local).length>=12,'maioria local: '+clube.liga);
    assert.ok(grupo.every(j=>origemNomes(j.nac)!=='INT'));
    assert.ok(grupo.every(j=>typeof j.nome==='string'&&j.nome.includes(' ')));
    assert.ok(grupo.every(j=>j.daBase===true));
  }
});
