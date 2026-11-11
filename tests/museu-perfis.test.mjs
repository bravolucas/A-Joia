import {test} from 'node:test';
import assert from 'node:assert/strict';
import {construirMuseuPessoal,separarMuseuPessoal,lerCuradoriaDoPerfil,salvarCuradoria,CHAVE_CURADORIA,registrarMuseuEncerrado,carreirasDisponiveis} from '../src/museu/museuPessoal.js';
const carreira=()=>({nome:'Duas histórias',museuId:'perfis',temporadas:[{ano:2026,clube:'Santos',jogos:40,gols:25,assist:8}],lista:[{nome:'Brasileirão',ano:2026,clube:'Santos'}],jornada:{mentor:{nome:'Meu treinador'},duplas:[{nome:'Companheiro',temporadas:1}]},tecnico:{temporadas:[{ano:2050,clube:'Santos',jogos:60,vitorias:40,empates:12,derrotas:8,titulosConquistados:['Brasileirão']}],memoriaJogador:{auxiliar:{nome:'Meu auxiliar'}},saidasVoluntarias:[{ano:2051,clube:'Santos'}]}});
const storage=()=>{const mapa=new Map();return {getItem:k=>mapa.get(k)||null,setItem:(k,v)=>mapa.set(k,v)};};
test('dois museus separam conquistas do mesmo clube, estatísticas, pessoas e percursos sem alterar o save',()=>{
 const c=carreira(),antes=structuredClone(c),base=construirMuseuPessoal(c),j=separarMuseuPessoal(base,c),t=separarMuseuPessoal(base,c,'treinador');
 assert.equal(j.totais.tacas,1);assert.equal(t.totais.tacas,1);assert.equal(j.totais.gols,25);assert.equal(t.totais.gols,undefined);assert.equal(t.totais.vitorias,40);
 assert.deepEqual(j.capitulos.map(x=>x.ano),[2026]);assert.deepEqual(t.capitulos.map(x=>x.ano),[2050,2051]);
 assert.deepEqual(j.objetos.filter(o=>o.tipo==='retrato').map(o=>o.nome),['Meu treinador','Companheiro']);assert.deepEqual(t.objetos.filter(o=>o.tipo==='retrato').map(o=>o.nome),['Meu auxiliar']);
 assert.ok(t.objetos.find(o=>o.tipo==='taca'&&o.sala==='trofeus'));assert.ok(t.objetos.find(o=>o.tipo==='carta'&&o.sala==='lembrancas'));assert.ok(!t.objetos.some(o=>o.tipo==='camisa'));
 assert.ok(j.visita.every(id=>j.objetos.some(o=>o.id===id)));assert.ok(t.visita.every(id=>t.objetos.some(o=>o.id===id)));assert.deepEqual(c,antes);
});
test('curadoria migra favoritos antigos por função e mantém escolhas independentes',()=>{
 const c=carreira(),base=construirMuseuPessoal(c),j=separarMuseuPessoal(base,c),t=separarMuseuPessoal(base,c,'treinador'),s=storage();
 const jid=j.objetos[0].id,tid=t.objetos[0].id,ji=new Set(j.objetos.map(o=>o.id)),ti=new Set(t.objetos.map(o=>o.id));
 s.setItem(CHAVE_CURADORIA,JSON.stringify({[base.id]:{favoritos:[jid,tid],frase:'Legado'}}));
 assert.deepEqual(lerCuradoriaDoPerfil(j,ji,s).favoritos,[jid]);assert.deepEqual(lerCuradoriaDoPerfil(t,ti,s).favoritos,[tid]);
 salvarCuradoria(t.curadoriaId,{frase:'Meu banco',favoritos:[tid]},ti,s);assert.equal(lerCuradoriaDoPerfil(j,ji,s).frase,'Legado');assert.equal(lerCuradoriaDoPerfil(t,ti,s).frase,'Meu banco');
});
test('técnico contratado do modo completo não vira carreira no banco e arquivo preserva ambas exposições',()=>{
 const c=carreira(),s=storage();registrarMuseuEncerrado(c,{fase:'treinador'},s);const salvo=carreirasDisponiveis(s)[0].c;
 assert.equal(separarMuseuPessoal(construirMuseuPessoal(salvo),salvo,'treinador').totais.tacas,1);
 c.tecnico={nome:'Treinador contratado',temporadas:3};const t=separarMuseuPessoal(construirMuseuPessoal(c,{modo:'completo'}),c,'treinador');assert.equal(t.objetos.length,0);assert.equal(t.totais.jogos,0);assert.deepEqual(t.visita,[]);
});
