import test from 'node:test';
import assert from 'node:assert/strict';
import {valorMercadoEuro,salarioMensalEuro,verbaTransferenciasEuro,formatarEuro,VERSAO_ECONOMIA} from '../src/simulacao/economia.js';
import {converterGestaoEconomia,migrarEconomiaMundo} from '../src/simulacao/elencoUnificado.js';
import {prepararGestaoTecnico,criarGestaoTecnico,contratarJogadorTecnico,venderJogadorTecnico} from '../src/treinador/mercadoTecnico.js';
import {gerarMundoJogadores} from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const base=()=>({nome:'Treinador',idade:45,ano:2030,mundo:gerarMundoJogadores(geradorTecnico('economia')),
 tecnico:{clube:'Flamengo',liga:'brasileirao',elenco:86,ano:2030,fase:'pretemporada',temporadas:[],personagens:[],reputacao:60,moral:50,diretoria:60,torcida:50}});

test('valor de mercado em euros segue faixas realistas e cresce com o nível',()=>{
 const pl=o=>valorMercadoEuro({ovr:o,idade:25,liga:'inglaterra',contrato:4});
 assert.ok(pl(99)>=150000&&pl(99)<=250000,'craque mundial entre € 150 e 250 mi');
 assert.ok(pl(90)>=40000&&pl(90)<=70000);
 assert.ok(pl(70)>=2000&&pl(70)<=8000);
 for(let o=41;o<=99;o++)assert.ok(pl(o)>=pl(o-1),`OVR ${o}`);
 // Mesma qualidade vale menos fora das grandes ligas; Série C abaixo da Série A.
 const v=liga=>valorMercadoEuro({ovr:80,idade:25,liga,contrato:4});
 assert.ok(v('inglaterra')>v('brasileirao')&&v('brasileirao')>v('serieB')&&v('serieB')>v('serieC'));
 // Veterano e contrato no fim derrubam o preço.
 assert.ok(valorMercadoEuro({ovr:85,idade:34,liga:'italia',contrato:4})<valorMercadoEuro({ovr:85,idade:26,liga:'italia',contrato:4})/4);
 assert.ok(valorMercadoEuro({ovr:85,idade:26,liga:'italia',contrato:1})<valorMercadoEuro({ovr:85,idade:26,liga:'italia',contrato:4}));
});

test('salário mensal respeita piso da liga e escala com o nível',()=>{
 assert.ok(salarioMensalEuro({ovr:98,liga:'espanha'})>=1000,'estrela ganha mais de € 1 mi por mês');
 assert.ok(salarioMensalEuro({ovr:50,liga:'serieC'})<=5);
 assert.ok(salarioMensalEuro({ovr:50,liga:'inglaterra'})>=40,'piso da Premier League');
 assert.equal(verbaTransferenciasEuro([{valor:1000},{valor:4000}]),1000);
 assert.equal(formatarEuro(1500),'€ 1,5 mi');assert.equal(formatarEuro(850),'€ 850 mil');
});

test('gestão nova nasce em euros e transações registram a moeda',()=>{
 const c=prepararGestaoTecnico(base()),g=c.tecnico.gestao;
 assert.equal(g.economia,VERSAO_ECONOMIA);
 assert.ok(g.saldo>=20000&&g.saldo<=150000,`verba do Flamengo entre € 20 e 150 mi (${g.saldo})`);
 const alvo=g.mercado.find(j=>j.valor<=g.saldo&&j.clubeVendedor);assert.ok(alvo);
 const comprado=contratarJogadorTecnico(c,alvo.id);
 assert.equal(comprado.tecnico.gestao.movimentos.at(-1).moeda,'EUR');
 assert.equal(comprado.mundo.jogadores.find(p=>String(p.id)===String(alvo.id)).movimentos.at(-1).moeda,'EUR');
 const vendido=venderJogadorTecnico(c,g.elenco.find(j=>j.setor==='ATA').id);
 assert.equal(vendido.tecnico.gestao.movimentos.at(-1).moeda,'EUR');
});

test('save da economia antiga (R$) é convertido uma vez, preservando a proporção do caixa',()=>{
 const atual=prepararGestaoTecnico(base());
 const antigo=structuredClone(atual);
 // Simula um save anterior: gestão em R$ mil sem marca de versão e com metade da verba em caixa.
 const legado={...antigo.tecnico.gestao,economia:undefined,orcamentoInicial:29768,saldo:14884,tetoSalarial:1030};
 delete legado.economia;
 antigo.tecnico.gestao=legado;delete antigo.mundo.economia;
 antigo.mundo.gestoesClubes={...antigo.mundo.gestoesClubes,Flamengo:legado};
 const convertido=prepararGestaoTecnico(antigo),g=convertido.tecnico.gestao;
 assert.equal(g.economia,VERSAO_ECONOMIA);assert.equal(convertido.mundo.economia,VERSAO_ECONOMIA);
 assert.ok(Math.abs(g.saldo/g.orcamentoInicial-.5)<.01,'metade da verba continua disponível');
 assert.ok(g.tetoSalarial>=g.elenco.reduce((n,j)=>n+j.salario,0),'teto comporta a folha convertida');
 // Recarregar não converte de novo.
 assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(convertido))),convertido);
 assert.equal(converterGestaoEconomia(g,[], 'brasileirao'),g);
 assert.equal(migrarEconomiaMundo(convertido.mundo),convertido.mundo);
});

test('gestão legada sem cadastro do mundo também é convertida para euros',()=>{
 const t={clube:'Palmeiras',liga:'brasileirao',elenco:85,ano:2030,fase:'em-andamento'};
 const nova=criarGestaoTecnico(t);
 const legado={...nova,economia:undefined,orcamentoInicial:28800,saldo:28800,tetoSalarial:964,
  elenco:nova.elenco.map(j=>({...j,valor:3000,salario:30}))};
 const g=criarGestaoTecnico({...t,gestao:legado});
 assert.equal(g.economia,VERSAO_ECONOMIA);
 assert.equal(g.saldo,g.orcamentoInicial);
 assert.ok(g.elenco.every(j=>j.valor===valorMercadoEuro({...j,liga:'brasileirao'})));
});
