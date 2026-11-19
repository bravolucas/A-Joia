import test from 'node:test';
import assert from 'node:assert/strict';
import {prepararGestaoTecnico,criarGestaoTecnico} from '../src/treinador/mercadoTecnico.js';
import {gerarNomeRegionalUnico,origemNomes} from '../src/simulacao/nomesRegionais.js';
import {nacionalidadeNovoAtletaLiga} from '../src/simulacao/nacionalidadesLiga.js';
import {TOTAL_MINIMO_ELENCO} from '../src/simulacao/profundidadeElenco.js';

const carreira=(clube,liga)=>({
 nome:'Treinador de teste',idade:40,ano:2030,
 mundo:{jogadores:[],cadastroElencos:1},
 tecnico:{clube,liga,ano:2030,elenco:74,moral:50,diretoria:60,
  torcida:55,reputacao:50,temporadas:[],fase:'pretemporada'},
});
function gerador(semente){
 let n=2166136261;
 for(const c of String(semente))n=Math.imul(n^c.charCodeAt(0),16777619);
 return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
}
const novos=r=>r.mundo.jogadores.filter(p=>p.origem==='base');

test('base da gestão cria espanhóis/estrangeiros em clube espanhol, com nomes regionais e IDs únicos',()=>{
 const c=carreira('Real Madrid','espanha');
 const original=structuredClone(c);
 const a=prepararGestaoTecnico(c);
 const b=prepararGestaoTecnico(c);
 assert.deepEqual(c,original);
 assert.deepEqual(a,b,'reprodutível sem deslocar a RNG compartilhada');
 const atletas=novos(a);
 assert.equal(atletas.length,TOTAL_MINIMO_ELENCO);
 assert.equal(new Set(atletas.map(p=>String(p.id))).size,atletas.length);
 assert.equal(new Set(atletas.map(p=>p.nome)).size,atletas.length);
 assert.ok(atletas.some(p=>p.nac==='ESP'),'não transformar todos os espanhóis em BRA');
 assert.ok(atletas.every(p=>origemNomes(p.nac)!=='INT'));
 const usados=new Set();
 for(const p of atletas){
  assert.equal(p.nac,nacionalidadeNovoAtletaLiga('espanha',gerador(`${p.id}|origem-base-v1`)));
  const esperado=gerarNomeRegionalUnico(p.nac,`${p.id}|nome-base-v1`,usados);
  assert.equal(p.nome,esperado,'nome derivado da própria nacionalidade');
  usados.add(p.nome);
 }
 assert.deepEqual(prepararGestaoTecnico(a),a,'base integrada só uma vez');
});

test('a divisão inglesa e uma liga mista recebem novas identidades coerentes, sem default brasileiro',()=>{
 for(const [clube,liga] of [['Clube Teste Inglês','inglaterra2'],['Clube Teste Misto','sulamericano']]){
  const c=carreira(clube,liga);
  const a=prepararGestaoTecnico(c);
  const atletas=novos(a);
  assert.equal(atletas.length,TOTAL_MINIMO_ELENCO);
  for(const p of atletas){
   assert.equal(p.nac,nacionalidadeNovoAtletaLiga(liga,gerador(`${p.id}|origem-base-v1`)));
   assert.ok(p.nome?.includes(' '));
  }
  if(liga==='inglaterra2')assert.ok(atletas.some(p=>p.nac==='ENG'));
 }
});

test('migração de gestão anterior não inventa BRA quando nacionalidade é desconhecida',()=>{
 const t=carreira('Real Madrid','espanha').tecnico;
 const legado=criarGestaoTecnico(t);
 legado.elenco[0].nac='ESP';
 const c={...carreira('Real Madrid','espanha'),tecnico:{...t,gestao:legado}};
 const copia=structuredClone(c);
 const r=prepararGestaoTecnico(c);
 const doClube=r.mundo.jogadores.filter(p=>p.clubeNome==='Real Madrid');
 assert.deepEqual(c,copia);
 assert.equal(doClube.length,legado.elenco.length);
 assert.equal(doClube[0].nac,'ESP','metadado conhecido preservado');
 assert.ok(doClube.slice(1).every(p=>p.nac===null),'desconhecido não é brasileiro');
 assert.ok(doClube.every(p=>p.origemCadastroReal!==true),'não usar marca de atleta real em legado fictício');
 assert.equal(novos(r).length,0,'não duplica elenco fictício ao migrar');
 assert.deepEqual(prepararGestaoTecnico(r),r,'migração idempotente');
});
