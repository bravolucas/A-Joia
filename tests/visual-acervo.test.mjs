import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TACAS_MUSEU } from '../src/museu/museu.js';
import { resolverImagemCompeticao } from '../src/comum/arteCompeticoes.js';

test('estaduais com fonte específica resolvem imagens distintas da taça genérica',()=>{
 const fontes=JSON.parse(fs.readFileSync(new URL('../arte/competicoes/estaduais-fontes.json',import.meta.url)));
 const arquivos=Object.fromEntries(fs.readdirSync(new URL('../arte/competicoes/',import.meta.url)).filter(n=>n.endsWith('.webp')).map(n=>[n.slice(0,-5),n]));
 const nomes=['Paulista','Carioca','Mineiro','Gaúcho','Paranaense','Catarinense','Goiano','Alagoano'];
 const resolvidas=nomes.map(n=>resolverImagemCompeticao(`Campeonato ${n}`,arquivos));
 assert.ok(resolvidas.every(Boolean));
 assert.equal(new Set(resolvidas).size,nomes.length);
 for(const arquivo of resolvidas){
  assert.ok(fs.statSync(new URL('../arte/competicoes/'+arquivo,import.meta.url)).size>1000);
  assert.ok(fontes[arquivo.slice(0,-5)].fonte.includes('/trophys/ST_'));
 }
 assert.ok(fontes.pendentes.includes('Campeonato Amazonense'));
 assert.match(fontes.descartes['ST_amazonense.png'],/TURNO/);
});

test('todas as competições do catálogo têm imagem própria ou ilustração original',()=>{
 const arquivos=Object.fromEntries(fs.readdirSync(new URL('../arte/competicoes/',import.meta.url)).filter(n=>/\.(svg|png|webp)$/.test(n)).map(n=>[n.replace(/\.(svg|png|webp)$/, ''),n]));
 for(const t of TACAS_MUSEU)assert.ok(resolverImagemCompeticao(t.nome,arquivos),t.nome);
 assert.equal(resolverImagemCompeticao('Concacaf',arquivos),resolverImagemCompeticao('Concacaf Champions',arquivos));
});

test('animações originais são independentes e têm duração limitada',()=>{
 for(const nome of ['gol','taca','contrato']){
  const a=JSON.parse(fs.readFileSync(new URL(`../arte/animacoes/${nome}.json`,import.meta.url)));
  assert.ok(a.layers.length>0);assert.ok((a.op-a.ip)/a.fr<=2);
  assert.ok(a.assets.every(asset=>!asset.p));
 }
});

test('as fontes necessárias estão empacotadas com suas licenças',()=>{
 const css=fs.readFileSync(new URL('../arte/fontes/fontes.css',import.meta.url),'utf8');
 for(const m of css.matchAll(/url\("([^"/]+\.woff2)"\)/g))assert.ok(fs.existsSync(new URL('../arte/fontes/'+m[1],import.meta.url)));
 for(const family of ['inter','rajdhani','oswald','playfair-display','unbounded'])assert.ok(fs.existsSync(new URL(`../arte/fontes/${family}-LICENSE.txt`,import.meta.url)));
 assert.ok(!css.includes('https://'));
});
