import test from 'node:test';
import assert from 'node:assert/strict';
import {historicoTransferenciasAtleta,tipoTransferencia,valorTransferencia,normalizarTransferencia} from '../src/simulacao/historicoTransferencias.js';
import {chaveCompeticao} from '../src/comum/arteCompeticoes.js';

test('movimentações vinculadas ao atleta registram clubes, valor e data de negociação',()=>{
 const atleta={movimentos:[
  {ano:2027,tipo:'compra',de:'Boca Juniors',para:'Flamengo',valor:12000},
  {ano:2029,tipo:'venda',de:'Flamengo',para:'Real Madrid',valor:85500},
 ]};
 const antes=structuredClone(atleta);
 const r=historicoTransferenciasAtleta(atleta,[]);
 assert.equal(r.length,2);
 assert.deepEqual(r.map(x=>[x.de,x.para,x.valor]),[['Flamengo','Real Madrid',85500],['Boca Juniors','Flamengo',12000]]);
 assert.equal(valorTransferencia(r[0].valor),'R$ 85,5 mi');
 assert.equal(tipoTransferencia(r[1].tipo),'Transferência');
 assert.deepEqual(atleta,antes);
});
test('valor zero não vira um valor estimado e informação ausente permanece ausente',()=>{
 assert.equal(valorTransferencia(0),'Sem custos');
 assert.equal(valorTransferencia(null),'Não informado');
 assert.equal(normalizarTransferencia({tipo:'transferencia',ano:2028,de:'A',para:'B'}).valor,null);
 assert.equal(normalizarTransferencia({tipo:'transferencia',ano:2028,de:'A',para:'B',valor:'0'}).valor,0);
 assert.equal(normalizarTransferencia({tipo:'renovacao',ano:2028}),null);
});
test('mudanças de clube por temporada são documentadas sem inventar taxa ou modalidade',()=>{
 const atleta={movimentos:[{ano:2028,tipo:'transferencia',de:'Santos',para:'Palmeiras',valor:1000}]};
 const temporadas=[{ano:2027,clube:'Santos'},{ano:2028,clube:'Palmeiras'},{ano:2029,clube:'Palmeiras'},{ano:2030,clube:'Grêmio'}];
 const r=historicoTransferenciasAtleta(atleta,temporadas);
 assert.equal(r.length,2);
 assert.equal(r[0].tipo,'mudanca-clube');
 assert.equal(r[0].valor,null);
 assert.equal(r[0].de,'Palmeiras');assert.equal(r[0].para,'Grêmio');
 assert.equal(r[1].valor,1000);
});
test('carreira do jogador conserva transferências livres e retornos de empréstimo',()=>{
 const linhas=historicoTransferenciasAtleta({movimentos:[{ano:2028,tipo:'livre',de:'A',para:'B',valor:0},{ano:2029,tipo:'retornoEmprestimo',de:'C',para:'B',valor:0}]},[]);
 assert.equal(linhas.length,2);assert.equal(tipoTransferencia(linhas[0].tipo),'Retorno de empréstimo');
 assert.equal(valorTransferencia(linhas[1].valor),'Sem custos');
});
test('nomes de prêmios usam imagem específica já presente no acervo',()=>{
 assert.equal(chaveCompeticao('Bola de Ouro'),'bola-de-ouro');
 assert.equal(chaveCompeticao('bolaOuro'),'bola-de-ouro');
 assert.equal(chaveCompeticao('Bota de Ouro'),'bota-de-ouro');
 assert.equal(chaveCompeticao('botaOuro'),'bota-de-ouro');
});

test('valores do Modo Jogador mantêm a moeda de origem em euros',()=>{
 const transferencias=historicoTransferenciasAtleta({voce:true,movimentos:[{ano:2028,tipo:'venda',de:'Santos',para:'Real Madrid',valor:50000}]},[]);
 assert.equal(transferencias[0].moeda,'EUR');
 assert.equal(valorTransferencia(transferencias[0].valor,transferencias[0].moeda),'€ 50 mi');
 assert.equal(valorTransferencia(4000,'BRL'),'R$ 4 mi');
});

test('taxas elevadas e intermediarias usam unidade monetaria legivel',()=>{
 assert.equal(valorTransferencia(785.4),'R$ 785 mil');
 assert.equal(valorTransferencia(1200,'EUR'),'€ 1,2 mi');
 assert.equal(valorTransferencia(0.4,'EUR'),'€ 400');
});

test('histórico compacto do universo identifica mudanças de clube sem inventar custo',()=>{
 const atleta={historicoTemporadas:[[1,2026,'Fortaleza','brasileirao',22,73,74,34,6,8,7.1],[2,2027,'Fortaleza','brasileirao',23,74,75,36,7,10,7.3],[3,2028,'Grêmio','brasileirao',24,75,76,35,8,11,7.2]]};
 const t=historicoTransferenciasAtleta(atleta,[]);
 assert.equal(t.length,1);
 assert.equal(t[0].ano,2028);
 assert.equal(t[0].de,'Fortaleza');
 assert.equal(t[0].para,'Grêmio');
 assert.equal(t[0].valor,null);
 assert.equal(t[0].fonte,'temporadas');
});
