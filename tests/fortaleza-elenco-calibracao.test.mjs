import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,JOGADORES_REAIS_BASE} from '../src/dados/data.js';
import {gerarMundoJogadores} from '../src/comum/lib.js';
import {avaliarClubeNoMundo} from '../src/simulacao/forcaEquipe.js';
import {forcasDoMundo} from '../src/simulacao/mundoVivo.js';
import {normalizarSave} from '../src/completo/save.js';
import {AJUSTE_FORTALEZA,AJUSTE_ELENCO_FORTALEZA,corrigirEquilibrioClubes} from '../src/dados/equilibrioClubes.js';

const fortaleza=CLUBES.find(c=>c.nome==='Fortaleza');
const modelos=JOGADORES_REAIS_BASE.filter(j=>j.time==='Fortaleza');
const porNome=new Map(modelos.map(j=>[j.nome,j]));
function rngDeterministico(seed=98373){
 let n=seed>>>0;
 return ()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
}
const mundoNovo=()=>gerarMundoJogadores(rngDeterministico());

test('29 jogadores calibrados: força REAL inicial próxima da base 64 em todos os modos',()=>{
 assert.equal(fortaleza.forca,64);
 assert.equal(fortaleza.liga,'serieB');
 assert.equal(modelos.length,29);
 assert.ok(modelos.every(j=>Number.isFinite(j.ovrLegadoAJoia)&&j.ovr===Math.max(52,j.ovrLegadoAJoia-13)));
 const mundo=mundoNovo();
 assert.equal(mundo.calibracaoFortalezaElenco,'2026-v2');
 assert.equal(mundo.elencosCompletos,true);
 const elenco=mundo.jogadores.filter(j=>j.clubeNome==='Fortaleza'&&!j.aposentado);
 assert.ok(elenco.length>=29,'nomes de verdade e jovens adicionais são preservados');
 for(const j of modelos)assert.equal(elenco.find(x=>x.nome===j.nome)?.ovr,j.ovr,j.nome);
 const dados=avaliarClubeNoMundo({mundo},fortaleza);
 assert.ok(dados.forca>=62.5&&dados.forca<=66.5,JSON.stringify(dados));
 assert.equal(forcasDoMundo({mundo},[fortaleza]).Fortaleza,dados.forca);
 assert.equal(corrigirEquilibrioClubes({mundo,ajustesCadastro:{[AJUSTE_FORTALEZA]:true}}).mundo,mundo,'não rebaixar mundo criado na versão atual');
});

test('mundo legado com atletas 77+ é migrado uma vez, sem transferências nem histórico alterados',()=>{
 const atual=mundoNovo();
 const legado=structuredClone(atual);
 delete legado.calibracaoFortalezaElenco;
 legado.jogadores=legado.jogadores.map(p=>{
  const modelo=p.clubeNome==='Fortaleza'&&porNome.get(p.nome);
  if(!modelo)return p;
  const diferenca=modelo.ovrLegadoAJoia-modelo.ovr;
  return {...p,ovr:p.ovr+diferenca,potencial:Math.min(99,(p.potencial??p.ovr)+diferenca)};
 });
 const jogador=legado.jogadores.find(j=>j.nome==='Brenno'&&j.clubeNome==='Fortaleza');
 jogador.ovr+=3; // Treino acumulado na carreira antes do patch.
 jogador.potencial=Math.max(jogador.potencial,jogador.ovr);
 jogador.carreira={jogos:24,gols:0,temporadas:1,titulos:0};
 const novoReforco={...jogador,id:'contratado-exterior',clubeOrigem:'Atlético-MG',nome:'Brenno',ovr:84,movimentos:[{tipo:'transferencia',de:'Atlético-MG',para:'Fortaleza'}]};
 legado.jogadores.push(novoReforco);
 const antes=structuredClone(legado);
 const c={ajustesCadastro:{[AJUSTE_FORTALEZA]:true},
  temporadas:[{ano:2030,clube:'Fortaleza',posicao:4,pontos:65}],mundo:legado,
  tecnico:{clube:'Fortaleza',elenco:64,forcasMundo:{Fortaleza:78,Flamengo:86},
   gestao:{clube:'Fortaleza',cadastroUnificado:1,forcaReferencia:64,elenco:[
    {id:jogador.id,mundoId:jogador.id,qualidade:jogador.ovr,potencial:jogador.potencial},
   ]}}};
 const passado=structuredClone(c);
 const r=corrigirEquilibrioClubes(c);
 assert.equal(r.ajustesCadastro[AJUSTE_ELENCO_FORTALEZA],true);
 assert.equal(r.mundo.calibracaoFortalezaElenco,'2026-v2');
 assert.ok(r.tecnico.forcasMundo.Fortaleza<68);
 assert.equal(r.tecnico.forcasMundo.Flamengo,86);
 const agora=r.mundo.jogadores.find(j=>j.id===jogador.id);
 assert.equal(agora.ovr,porNome.get('Brenno').ovr+3,'preserva treino e diferença positiva acumulada');
 assert.deepEqual(agora.carreira,jogador.carreira);
 assert.equal(r.tecnico.gestao.elenco[0].qualidade,agora.ovr,'gestão unificada não fica desatualizada');
 assert.equal(r.mundo.jogadores.find(j=>j.id==='contratado-exterior').ovr,84,'reforço contratado não é rebaixado');
 assert.deepEqual(r.temporadas,c.temporadas,'não modificar temporadas encerradas');
 assert.deepEqual(c,passado,'migração não muta objeto original');
 assert.deepEqual(corrigirEquilibrioClubes(r),r,'executar novamente não altera nada');
 assert.ok(avaliarClubeNoMundo({mundo:antes},fortaleza).forca>73,'bug original reproduzido');
});

test('modo completo: mundo externo ao objeto carreira também migra e não duplica jogadores',()=>{
 const atual=mundoNovo();
 const antigo=structuredClone(atual);
 delete antigo.calibracaoFortalezaElenco;
 antigo.jogadores=antigo.jogadores.map(j=>{
  const modelo=j.clubeNome==='Fortaleza'&&porNome.get(j.nome);
  if(!modelo)return j;
  return {...j,ovr:modelo.ovrLegadoAJoia,potencial:Math.min(99,(j.potencial??j.ovr)+(modelo.ovrLegadoAJoia-modelo.ovr))};
 });
 const save={versao:1,carreira:{nome:'Teste',clube:{nome:'Fortaleza',forca:64,liga:'serieB'},ajustesCadastro:{[AJUSTE_FORTALEZA]:true},
  temporadas:[{ano:2031,clube:'Fortaleza',gols:2}]},mundo:antigo,temporadas:[{ano:2031,clube:'Fortaleza',gols:2}]};
 const copia=structuredClone(save),r=normalizarSave(save);
 assert.equal(r.carreira.ajustesCadastro[AJUSTE_ELENCO_FORTALEZA],true);
 assert.equal(r.carreira.mundo,undefined,'não salvar mundo duplicado em carreira');
 assert.equal(r.mundo.jogadores.length,save.mundo.jogadores.length);
 assert.ok(avaliarClubeNoMundo({mundo:r.mundo},fortaleza).forca<67);
 assert.deepEqual(r.temporadas.map(x=>[x.ano,x.clube,x.gols]),[[2031,'Fortaleza',2]]);
 assert.deepEqual(save,copia);
 assert.deepEqual(normalizarSave(r),r,'recarregar save após migração é idempotente');
});
