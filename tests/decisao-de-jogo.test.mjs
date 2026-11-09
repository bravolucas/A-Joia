import test from 'node:test';
import assert from 'node:assert/strict';
import {CENAS_DECISAO,prepararDecisaoJogo,chanceDecisaoJogo,resolverDecisaoJogo,estatisticasDecisao} from '../src/jogador/decisaoDeJogo.js';
import {aplicarMomento} from '../src/jogador/rapido.js';
const c={codigo:'LEITURA',ano:2030,posicao:'ATA',attrs:{finalizacao:70,passe:70,drible:70,defesa:70,fisico:70,velocidade:70}};
const m={tipo:'continental',titulo:'A decisão',ordem:1};
test('12 situações, três escolhas por situação, sem alterar cenário ao reabrir',()=>{
 assert.equal(Object.values(CENAS_DECISAO).flat().length,12);
 for(const lista of Object.values(CENAS_DECISAO))for(const cena of lista){assert.equal(cena.opcoes.length,3);assert.equal(new Set(cena.opcoes.map(x=>x.id)).size,3);}
 assert.deepEqual(prepararDecisaoJogo(c,m),prepararDecisaoJogo(structuredClone(c),structuredClone(m)));
 assert.equal(prepararDecisaoJogo({...c,posicao:'GOL'},m).perfil,'goleiro');assert.equal(prepararDecisaoJogo({...c,posicao:'ZAG'},m).perfil,'defesa');
});
test('atributo e leitura influenciam chance, escolha inválida é rejeitada',()=>{
 const cena=prepararDecisaoJogo(c,m);assert.equal(new Set(cena.opcoes.map(x=>chanceDecisaoJogo(c,x))).size,3);
 for(const op of cena.opcoes){assert.ok(chanceDecisaoJogo({...c,attrs:{[op.atributo]:95}},op)>chanceDecisaoJogo({...c,attrs:{[op.atributo]:30}},op));for(const n of [-100,200]){const p=chanceDecisaoJogo({...c,attrs:{[op.atributo]:n}},op);assert.ok(p>=.22&&p<=.88);}}
 assert.throws(()=>resolverDecisaoJogo(c,m,'inexistente'));
});
test('consequência e histórico guardam decisão real sem chamar de pênalti',()=>{
 const id=prepararDecisaoJogo(c,m).opcoes[0].id,r=resolverDecisaoJogo(c,m,id,()=>0),derrota=resolverDecisaoJogo(c,m,id,()=>.99);assert.equal(r.acertou,true);assert.equal(derrota.acertou,false);
 const card={titulos:[],destaques:[],continental:{nome:'Libertadores'},pendente:{...m,mini:r.mini,decisaoJogo:r,lance:{minuto:89,gp:0,gc:0,disputa:false}},filaMomentos:[]};
 const novo=aplicarMomento(card,true);assert.deepEqual(novo.momentos[0].decisaoJogo,r);assert.ok(!novo.destaques.join(' ').includes('Pênalti'));assert.equal(card.titulos.length,0);
 assert.deepEqual(estatisticasDecisao({decisaoJogo:{acao:'passe'}},true),{gols:0,assist:1});assert.deepEqual(estatisticasDecisao({decisaoJogo:{acao:'defender'}},true),{gols:0,assist:0});
});
