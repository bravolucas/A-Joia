import test from 'node:test';
import assert from 'node:assert/strict';
import {novoTecnico,avaliarTecnicoClube,manchetesDoAno} from '../src/simulacao/tecnicosMundo.js';
import {ligaEstrangeiraSimulada,CLUBES_SULAMERICANOS_EXTRAS,classificacaoInternacionalSul} from '../src/competicoes/clubesInternacionais.js';
import * as R from '../src/jogador/rapido.js';

test('técnico da IA: nome da escola do país, cargo mantido em boa fase e demissão na queda',()=>{
 const clube={nome:'Santos',liga:'brasileirao',forca:78};
 const t=novoTecnico(clube,2030,'s');assert.ok(t.nome.includes(' '));assert.ok(t.qualidade>=40&&t.qualidade<=95);assert.deepEqual(t,novoTecnico(clube,2030,'s'));
 const antigo={...t,desde:2027};
 assert.equal(avaliarTecnicoClube(antigo,{clube,ano:2030,desempenho:.4,semente:'s'}).demitido,null);
 let quedas=0;for(let i=0;i<40;i++)if(avaliarTecnicoClube(antigo,{clube,ano:2030,desempenho:-.5,movimento:'rebaixamento',semente:`q${i}`}).demitido)quedas++;
 assert.ok(quedas>=20,`demissões após queda: ${quedas}/40`);
 assert.equal(avaliarTecnicoClube({...t,desde:2030},{clube,ano:2030,desempenho:-.8,movimento:'rebaixamento',semente:'s'}).demitido,null,'recém-chegado ganha tempo');
});

test('manchetes: zebra só quando o campeão está longe dos favoritos; mercado e técnicos entram na lista',()=>{
 const forcas={A:90,B:88,C:86,D:84,E:70,F:68,G:66,H:64};
 const fases=[{fase:'Quartas de final',jogos:[{casa:'A',fora:'H'},{casa:'B',fora:'G'},{casa:'C',fora:'F'},{casa:'D',fora:'E'}]}];
 const zebra=manchetesDoAno({ano:2030,torneios:[{nome:'Copa X',tipo:'copa',campeao:'G',vice:'A',fases}]},{forcas});assert.equal(zebra[0].tipo,'zebra');
 const normal=manchetesDoAno({ano:2030,torneios:[{nome:'Copa X',tipo:'copa',campeao:'A',vice:'B',fases}]},{forcas});assert.equal(normal[0].tipo,'titulo');
 const m=manchetesDoAno({ano:2030},{transferencias:[{tipo:'transferencia',valor:90000,nome:'Craque',de:'X',para:'Y'}],trocas:[{clube:'Z',sai:'Fulano',entra:'Beltrano'}]});
 assert.deepEqual(m.map(x=>x.tipo),['mercado','tecnico']);assert.match(m[0].texto,/€ 90 mi/);
});

test('ligas estrangeiras são campeonatos simulados e definem as vagas sul-americanas',()=>{
 const peru=CLUBES_SULAMERICANOS_EXTRAS.filter(c=>c.pais==='Peru'),t=ligaEstrangeiraSimulada(peru,2030,'Peru');
 assert.equal(t.classificacao.length,peru.length);assert.ok(t.classificacao.every(x=>x.jogos===2*(peru.length-1)));
 const vagas=classificacaoInternacionalSul(2030,[]);assert.equal(vagas[t.classificacao[0].nome].competicao,'libertadores');assert.equal(vagas[t.classificacao[4].nome].competicao,'sulamericana');
 assert.deepEqual(ligaEstrangeiraSimulada(peru,2030,'Peru'),t);
});

test('carreira registra técnicos da IA e manchetes no arquivo vivo',()=>{
 let c=R.criarJogador({nome:'Mundo',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'MUNDO-VIVO-TESTE'});c.clubeNome='Santos';c.flags.baseEscolhida=true;
 const r=R.jogarTemporada(c);r.card.pendente=null;r.card.filaMomentos=[];c=R.fecharTemporada(r.c,r.card).c;
 assert.ok(Object.keys(c.universo.tecnicos).length>50);assert.equal(c.universo.tecnicos.Santos,undefined,'o clube do usuário não troca de técnico por aqui');
 assert.ok(c.universo.noticias.length>=5);assert.ok(c.universo.noticias.some(n=>n.tipo==='liga'));
});
