import test from 'node:test';
import assert from 'node:assert/strict';
import {bonusTemporadaTecnico,reajusteTituloTecnico,salarioBaseClubeTecnico,VERSAO_SALARIO_TECNICO,MESES_INDENIZACAO_REBAIXAMENTO} from '../src/treinador/contratoTecnico.js';
import {CLUBES_CONVITES_TECNICO,negociarContratoTecnico,salarioNegociadoTecnico,riscoNegociacaoTecnico,migrarSalarioDoSaveTecnico,pedirDemissaoTecnico} from '../src/treinador/tecnico.js';

const clube=nome=>CLUBES_CONVITES_TECNICO.find(x=>x.nome===nome);

test('salário-base do técnico em euros acompanha o porte do clube',()=>{
 assert.ok(clube('Real Madrid').salario>=700&&clube('Real Madrid').salario<=1600,'gigante europeu ~€ 1 mi/mês');
 assert.ok(clube('Flamengo').salario>=100&&clube('Flamengo').salario<=300,'grande brasileiro ~€ 170 mil/mês');
 assert.ok(clube('Confiança').salario<=10,'Série C paga poucos milhares');
 assert.equal(salarioBaseClubeTecnico({forca:86,liga:'brasileirao'}),clube('Flamengo').salario);
});

test('bônus por colocação e títulos, em meses de salário; seleção não recebe',()=>{
 assert.deepEqual(bonusTemporadaTecnico(100,{}),{valor:0,itens:[]});
 assert.equal(bonusTemporadaTecnico(100,{campeao:true,cumpriuObjetivo:true}).valor,350);
 assert.equal(bonusTemporadaTecnico(100,{posicao:3,titulosConquistados:['Libertadores','Copa do Brasil']}).valor,500);
 assert.equal(bonusTemporadaTecnico(100,{posicao:9}).valor,0);
 assert.equal(bonusTemporadaTecnico(100,{tipoEquipe:'selecao',campeao:true}).valor,0);
});

test('títulos reajustam o salário ao seguir no clube, com teto de 25%',()=>{
 assert.equal(reajusteTituloTecnico(100,{campeao:true}),112);
 assert.equal(reajusteTituloTecnico(100,{campeao:true,titulosConquistados:['Champions League','Mundial de Clubes']}),124);
 assert.equal(reajusteTituloTecnico(100,{campeao:true,titulosConquistados:['Champions League','Libertadores','Champions League']}),125);
 assert.equal(reajusteTituloTecnico(100,{posicao:2}),100);
});

const desempregado=()=>({nome:'T',idade:50,ano:2031,tecnico:{fase:'resultado',desempregado:true,clube:null,ano:2031,reputacao:70,temporadas:[],
 propostas:[{...clube('Flamengo'),tipo:'clube'}],versaoSalario:VERSAO_SALARIO_TECNICO}});

test('negociação: estratégia muda salário e risco; cláusula reduz 10% e fica registrada',()=>{
 const p=clube('Flamengo');
 assert.equal(salarioNegociadoTecnico(p,'salario'),Math.round(p.salario*1.2));
 assert.equal(salarioNegociadoTecnico(p,'prudente',true),Math.round(p.salario*0.9));
 assert.ok(riscoNegociacaoTecnico({reputacao:70},p,'salario')>riscoNegociacaoTecnico({reputacao:70},p,'prudente'));
 const c=negociarContratoTecnico(desempregado(),'Flamengo','prudente',()=>0.99,{clausula:true});
 assert.equal(c.tecnico.clube,'Flamengo');assert.equal(c.tecnico.salario,Math.round(p.salario*0.9));
 assert.deepEqual(c.tecnico.clausulaRebaixamento,{clube:'Flamengo',ano:2031});
 const recusado=negociarContratoTecnico(desempregado(),'Flamengo','salario',()=>0);
 assert.equal(recusado.tecnico.ultimaNegociacao.aceita,false);
});

test('cláusula de rebaixamento: sair após a queda paga indenização; sem cláusula, não',()=>{
 const base=(clausula)=>({nome:'T',idade:50,ano:2032,tecnico:{fase:'resultado',clube:'Flamengo',tipoEquipe:'clube',ano:2032,idade:50,salario:200,reputacao:60,
  clubeInicialEscolhido:true,carteiraTecnico:{saldo:1000,pagamentos:[],compras:[]},temporadas:[{ano:2031,clube:'Flamengo',rebaixado:{de:'brasileirao',para:'serieB'}}],
  ...(clausula?{clausulaRebaixamento:{clube:'Flamengo',ano:2030}}:{})}});
 const com=pedirDemissaoTecnico(base(true),()=>0.5).tecnico;
 assert.equal(com.carteiraTecnico.saldo,1000+200*MESES_INDENIZACAO_REBAIXAMENTO);assert.equal(com.ultimaSaida.clausulaRebaixamento,true);
 const sem=pedirDemissaoTecnico(base(false),()=>0.5).tecnico;
 assert.equal(sem.carteiraTecnico.saldo,1000);assert.equal(sem.ultimaSaida.clausulaRebaixamento,undefined);
});

test('save antigo: salário e carteira convertidos uma vez, preservando meses de salário',()=>{
 const antigo={nome:'T',tecnico:{clube:'Flamengo',salario:87,carteiraTecnico:{saldo:870,pagamentos:[],compras:[]}}};
 const c=migrarSalarioDoSaveTecnico(antigo);
 assert.equal(c.tecnico.versaoSalario,VERSAO_SALARIO_TECNICO);
 assert.ok(Math.abs(c.tecnico.carteiraTecnico.saldo/c.tecnico.salario-10)<0.05,'saldo continua valendo 10 salários');
 assert.equal(migrarSalarioDoSaveTecnico(c),c);
});
