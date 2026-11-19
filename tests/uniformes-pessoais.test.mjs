import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {auditarUniformes,uniformeDe,UNIFORMES,tintaUniforme} from '../src/dados/uniformes.js';
import {ITENS_PESSOAIS} from '../src/jogador/itensPessoais.js';
import {criarJogador,comprarInvestimento,formatarValor,jogarTemporada,fecharTemporada} from '../src/jogador/rapido.js';
test('todos os 364 clubes possuem modelo clássico explícito e paleta válida independente da marca',()=>{const a=auditarUniformes();assert.equal(a.length,CLUBES.length);assert.ok(Object.keys(UNIFORMES).length>=CLUBES.length);for(const u of a){assert.equal(u.revisado,true,u.clube);for(const k of ['base','secundaria','detalhe'])assert.match(u[k],/^#[0-9a-f]{6}$/i);assert.ok(['#19232b','#fff9eb'].includes(tintaUniforme(u)));}assert.equal(uniformeDe('Paysandu').base,'#f4f3ed');assert.equal(uniformeDe('Paysandu').padrao,'listras');assert.equal(uniformeDe('Novorizontino').padrao,'listras');assert.equal(uniformeDe('Vila Nova').base,'#c92536');assert.equal(uniformeDe('River Plate').padrao,'diagonal');assert.equal(uniformeDe('São Paulo').padrao,'faixa');assert.equal(uniformeDe('Palmeiras').padrao,'lisa');});
test('clube desconhecido recebe fallback válido sem cor nula ou marcação como revisado',()=>{const u=uniformeDe('Clube teste',null);assert.equal(u.base,'#147356');assert.equal(u.revisado,false);});
const cbase=()=>({...criarJogador({nome:'Pessoal',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'PESSOAL'}),patrimonio:100000,moral:50});
test('itens de vida pessoal à venda cobrem valores modestos e luxo sem conceder atributos',()=>{const venda=ITENS_PESSOAIS.filter(x=>!x.descontinuado);assert.equal(venda.length,23);assert.equal(new Set(ITENS_PESSOAIS.map(x=>x.id)).size,ITENS_PESSOAIS.length);assert.ok(venda.some(x=>x.custo<1));assert.ok(venda.some(x=>x.custo>=60000));for(const i of venda){const c=cbase(),antes=structuredClone(c),r=comprarInvestimento(c,i.id);assert.equal(r.ok,true,i.id);assert.deepEqual(r.c.attrs,c.attrs);assert.deepEqual(c,antes);assert.equal(r.c.patrimonio,Math.round((100000-i.custo)*1000)/1000);assert.equal(comprarInvestimento(r.c,i.id).ok,false);assert.ok(r.c.moral<=100);}});
test('preço modesto exibe euros e compra desconta em precisão de euros uma única vez',()=>{const c=cbase();c.patrimonio=1;assert.equal(formatarValor(.15),'€ 150');const r=comprarInvestimento(c,'tenis-casual');assert.equal(r.c.patrimonio,.85);assert.equal(r.c.moral,51);const ruim={...c,patrimonio:.1};assert.equal(comprarInvestimento(ruim,'tenis-casual').ok,false);});
test('novo luxo participa da manutenção anual real e mantém OVR intacto na compra',()=>{const c=cbase(),r=comprarInvestimento(c,'jato-luxo');assert.equal(r.ok,true);const {c:ano,card}=jogarTemporada(r.c);const f=fecharTemporada(ano,card);assert.equal(f.card.ganhos.manutencao,3600);});
test('loja do jogador: itens fora de linha somem da vitrine e adaptação reduz a queda no primeiro ano fora',async()=>{
 const {impedimentoLojaJogador}=await import('../src/jogador/lojaJogador.js');const {investimentoDe}=await import('../src/jogador/rapido.js');
 const c=cbase();assert.equal(impedimentoLojaJogador(c,investimentoDe('videogame-pessoal')),'Fora de linha');
 assert.equal(impedimentoLojaJogador({...c,investimentos:['videogame-pessoal']},investimentoDe('videogame-pessoal')),'Adquirido','quem comprou continua com o item');
 assert.equal(impedimentoLojaJogador(c,investimentoDe('curso-idioma-pessoal')),null);
 // Primeiro ano num clube de outro país: rendimento cai; idioma + consultoria + família anulam a queda.
 const fora=x=>({...x,clubeNome:'Real Madrid',temporadas:[{ano:x.ano-1,clube:'Santos',jogos:30,gols:5,assist:3,nota:7}],flags:{...x.flags,baseEscolhida:true}});
 const sem=jogarTemporada(fora(cbase())).card,com=jogarTemporada(fora({...cbase(),investimentos:['curso-idioma-pessoal','consultoria-adaptacao','familia-perto']})).card;
 assert.equal(sem.adaptacao.queda,1);assert.equal(com.adaptacao.queda,0);
 assert.ok(sem.destaques.some(d=>/Primeiro ano em outro país/.test(d)));
 const casa=jogarTemporada({...cbase(),flags:{...cbase().flags,baseEscolhida:true}}).card;assert.equal(casa.adaptacao,undefined);
});
