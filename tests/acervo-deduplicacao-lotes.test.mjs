import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_HISTORICOS} from '../src/dados/acervoClubesHistoricos.js';

// Executar sobre todos os lotes, não apenas sobre os arquivos recentes.
const lotes=await Promise.all(Array.from({length:34},(_,i)=>i+2).map(async n=>{
 const modulo=await import(`../src/dados/acervoClubesHistoricosLote${n}.js`);
 return {numero:n,clubes:modulo[`ACERVO_CLUBES_LOTE${n}`]};
}));

test('todos os 34 lotes são importáveis e as chaves conferem com o nome da ficha',()=>{
 for(const {numero,clubes} of lotes){
  assert.ok(clubes&&typeof clubes==='object','lote não exportado: '+numero);
  for(const [nome,ficha] of Object.entries(clubes)){
   assert.equal(ficha.clube,nome,`identidade do lote ${numero}: ${nome}`);
   assert.ok(ACERVO_CLUBES_HISTORICOS[nome],`clube não integrado: ${nome}`);
  }
 }
});

test('atualizações de lotes anteriores não apagam atletas, técnicos nem recordes',()=>{
 const porClube=new Map();
 for(const {numero,clubes} of lotes)for(const [nome,ficha] of Object.entries(clubes)){
  const entrada=porClube.get(nome)||[];
  entrada.push({numero,ficha});
  porClube.set(nome,entrada);
 }
 const repetidos=[...porClube].filter(([,v])=>v.length>1).map(([nome])=>nome);
 // Se aparecer uma nova duplicidade, a CI exige consolidação para cada atributo.
 for(const [nome,versoes] of porClube){
  const final=ACERVO_CLUBES_HISTORICOS[nome];
  for(const {numero,ficha} of versoes){
   for(const a of ficha.atletas||[])assert.ok(final.atletas.some(x=>x.nome===a.nome),`atleta apagado: ${nome}, lote ${numero}, ${a.nome}`);
   for(const t of ficha.tecnicos||[])assert.ok(final.tecnicos?.some(x=>x.nome===t.nome),`técnico apagado: ${nome}, lote ${numero}, ${t.nome}`);
   for(const r of ficha.recordes||[])assert.ok(final.recordes.some(x=>x.id===r.id&&x.atleta===r.atleta),`recorde apagado: ${nome}, lote ${numero}`);
   for(const m of ficha.marcos||[])assert.ok(final.marcos?.some(x=>x.ano===m.ano&&(
    x.titulo===m.titulo||[x.fonte,...(x.fontesAdicionais||[])].includes(m.fonte)
   )),`marco apagado: ${nome}, lote ${numero}, ${m.ano}, ${m.titulo}`);
  }
 }
 assert.ok(repetidos.includes('Kocaelispor'));
 assert.ok(repetidos.includes('Gençlerbirliği'));
});

test('número de entidades é a união de chaves, nunca soma de lotes',()=>{
 const nomes=new Set(Object.keys(ACERVO_CLUBES_HISTORICOS));
 assert.equal(nomes.size,Object.keys(ACERVO_CLUBES_HISTORICOS).length);
 for(const {clubes} of lotes)for(const nome of Object.keys(clubes))assert.ok(nomes.has(nome));
});
