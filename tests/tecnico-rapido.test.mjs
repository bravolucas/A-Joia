import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, cartaAtualTecnico, tomarDecisaoTecnico, simularEtapaTecnico } from '../tecnico.js';
import { avancarTecnicoRapido } from '../tecnicoRapido.js';
function criar() {
 let c = iniciarCarreiraTecnico({ nome:'Teste', aposentado:true, idade:40, ano:2050, clubeNome:'Flamengo', temporadas:[], legado:{pontos:300}, attrs:{passe:80} });
 if(c.tecnico.opcoesInicio.length) c=iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
 return c;
}
for(const [ritmo,anos] of [['intenso',1],['normal',2],['expresso',3]]) test(`ritmo ${ritmo} registra ${anos} anos sem alterar atleta`,()=>{
 const original=criar(), copia=structuredClone(original);
 let c=avancarTecnicoRapido(original,{tipo:'ritmo',id:ritmo});
 c=avancarTecnicoRapido(c,{tipo:'estilo',id:'ofensivo'},()=>0.1);
 assert.equal(c.tecnico.temporadas.length,anos); assert.equal(c.idade,40+anos); assert.equal(c.ano,2050+anos);
 assert.deepEqual(c.temporadas,original.temporadas); assert.deepEqual(c.attrs,original.attrs); assert.deepEqual(original,copia);
 assert.ok(c.tecnico.temporadas.every(t=>t.confrontos.length===38));
});
test('save antigo no meio da campanha retoma sem duplicar jogos',()=>{
 let c=criar(); while(cartaAtualTecnico(c.tecnico)) c=tomarDecisaoTecnico(c,cartaAtualTecnico(c.tecnico).opcoes[0].id,()=>0.1);
 c=simularEtapaTecnico(c,()=>0.1); const jogos=structuredClone(c.tecnico.andamento.confrontos);
 c=avancarTecnicoRapido(JSON.parse(JSON.stringify(c)),{tipo:'ritmo',id:'intenso'});
 c=avancarTecnicoRapido(c,{tipo:'continuar'},()=>0.1);
 assert.equal(c.tecnico.temporadas.length,1); assert.deepEqual(c.tecnico.temporadas[0].confrontos.slice(0,10),jogos);
});
test('crise interrompe e conserva duração restante após salvar',()=>{
 let c=criar(); c.tecnico.diretoria=46; c.tecnico.torcida=50;
 c=avancarTecnicoRapido(c,{tipo:'continuar'},()=>0.99);
 assert.ok(c.tecnico.reuniaoPendente || c.tecnico.demitido);
 if(c.tecnico.reuniaoPendente){
  assert.equal(c.tecnico.anosRestantesRapido,2);
  const antes=c.tecnico.andamento.jogos;
  c=avancarTecnicoRapido(JSON.parse(JSON.stringify(c)),{tipo:'reuniao',id:'responsabilidade'},()=>0.1);
  assert.ok(c.tecnico.temporadas.length>0 || c.tecnico.andamento.jogos>antes);
 }
});
test('demissão bloqueia avanço e espera preserva histórico',()=>{
 let c=criar(); c.tecnico.diretoria=0; c.tecnico.torcida=0;
 c=avancarTecnicoRapido(c,{tipo:'continuar'},()=>0.99);
 assert.equal(c.tecnico.demitido,true); assert.equal(c.tecnico.temporadas.length,1);
 assert.throws(()=>avancarTecnicoRapido(c,{tipo:'continuar'}));
 const depois=avancarTecnicoRapido(c,{tipo:'esperar'},()=>0.5);
 assert.deepEqual(depois.tecnico.temporadas,c.tecnico.temporadas); assert.equal(depois.idade,c.idade+1);
});
