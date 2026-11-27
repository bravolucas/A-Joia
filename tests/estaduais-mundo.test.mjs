import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,ESTADUAIS,ANO_INICIO,palmaresInicialDe} from '../src/dados/data.js';
import {HISTORICO_ESTADUAIS,historicoEstadualDoClube,edicoesEstaduaisHistoricas,feitoEstadualHistoricoValido} from '../src/dados/estaduaisHistoricos.js';
import {participantesEstadual} from '../src/competicoes/estaduaisRapidos.js';
import {simularEstaduaisMundo} from '../src/simulacao/estaduaisMundo.js';
import {simularSelecoesMundo,simularMundiaisMundo} from '../src/simulacao/copasExternasMundo.js';
import {registrarAnoHistoria,galeriaClube,acervoInicial} from '../src/historia/historiaFutebol.js';
import {galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {registrarMundoVivo,jogosDaEdicao} from '../src/simulacao/mundoVivo.js';
import {jogosDaCampanha} from '../src/competicoes/jogosCampanha.js';
import {prepararMundoTemporada,creditarCampeoesCalendario} from '../src/completo/mundoTemporada.js';
import {creditarTitulo,estadoInicialClubes,palmaresDoClube} from '../src/comum/lib.js';
const carreira=()=>({nome:'Fora do Brasil',codigo:'ESTADUAIS-VIVOS',nac:'BRA',clubeNome:'Arsenal',temporadas:[]});

test('acervo cobre as 27 federações com fontes, campeões e anos anteriores à carreira',()=>{
 assert.equal(Object.keys(ESTADUAIS).length,27);assert.equal(Object.keys(HISTORICO_ESTADUAIS).length,27);
 for(const [estado,nome] of Object.entries(ESTADUAIS)){
  const h=HISTORICO_ESTADUAIS[estado];assert.equal(h.nome,nome);assert.ok(h.fontes.length>=2);assert.ok(h.clubes&&Object.keys(h.clubes).length);
  for(const [clube,anos] of Object.entries(h.clubes)){assert.ok(clube);assert.ok(anos.length);assert.ok(anos.every(a=>Number.isInteger(a)&&a<=ANO_INICIO));}
  const historicas=edicoesEstaduaisHistoricas(nome);assert.ok(historicas.some(e=>e.ano===2024));assert.ok(historicas.every(e=>e.campeoes.length));
 }
});
test('contagens e anos dos clubes do jogo não começam em zero nem misturam supercampeonatos',()=>{
 for(const [clube,q] of [['Santos',22],['Corinthians',31],['Palmeiras',27],['São Paulo',22],['Flamengo',40],['Vasco da Gama',24],['Fluminense',33],['Botafogo',21],['Grêmio',44],['Internacional',46],['Atlético-MG',49],['Cruzeiro',38],['Athletico-PR',28],['Coritiba',39],['CRB',34],['Avaí',18],['ABC',57],['América-RN',38]]){
  const h=historicoEstadualDoClube(clube);assert.equal(h.quantidade,q,clube);assert.equal(h.anos.length,q,clube);const cl=CLUBES.find(c=>c.nome===clube);if(cl)assert.equal(palmaresInicialDe(cl).estadual,q,clube);
 }
 assert.equal(historicoEstadualDoClube('São Paulo').anos.includes(2002),false);
 assert.equal(historicoEstadualDoClube('Athletico-PR').anos.includes(2002),true);
 assert.equal(historicoEstadualDoClube('Flamengo').anos.filter(a=>a===1979).length,2);
});
test('galerias somam a conquista da carreira uma vez e não anunciam um primeiro estadual falso',()=>{
 const c=carreira(),a={ano:2025,clube:'Santos',ligaId:'brasileirao',torneios:[{nome:ESTADUAIS.SP,tipo:'estadual',campeao:'Santos'}],titulos:[{nome:ESTADUAIS.SP,tipo:'estadual'}]};
 registrarAnoHistoria(c,a);c.temporadas=[a];const g=galeriaClube(c,'Santos'),t=g.tacas.find(t=>t.tipo==='estadual');
 assert.equal(t.inicial,22);assert.equal(t.total,23);assert.deepEqual(t.anos,[2025]);assert.equal(t.anosHistoricos.length,22);assert.ok(!g.primeiros.some(t=>t.tipo==='estadual'));assert.ok(!a.feitosHistoricos.some(f=>f.nome===ESTADUAIS.SP));
 const ranking=galeriaCompeticao(c,ESTADUAIS.SP);assert.equal(ranking.ranking.find(t=>t.clube==='Santos').total,23);assert.equal(ranking.edicoes.length,1);assert.ok(ranking.historicas.some(e=>e.ano===1902));
 const antes=JSON.stringify(c);galeriaClube(c,'Santos');galeriaCompeticao(c,ESTADUAIS.SP);assert.equal(JSON.stringify(c),antes);
});
test('clubes regionais históricos aparecem no ranking e têm sua própria galeria',()=>{
 const r=galeriaCompeticao({},ESTADUAIS.SP);assert.equal(r.ranking.find(t=>t.clube==='Ituano').inicial,2);
 const g=galeriaClube({},'Ituano'),paulista=g.tacas.find(t=>t.tipo==='estadual');assert.equal(paulista.total,2);assert.deepEqual(paulista.anosHistoricos,[2002,2014]);
 const zero=acervoInicial('Guarani').tacas.find(t=>t.tipo==='estadual');assert.equal(zero.inicial,0);assert.equal(zero.historicoConhecido,true);
 assert.equal(feitoEstadualHistoricoValido({id:'primeiro|Santos|paulista',nome:ESTADUAIS.SP,clube:'Santos'}),false);
 assert.equal(feitoEstadualHistoricoValido({id:'outro',nome:ESTADUAIS.SP,clube:'Santos'}),true);
});
test('estaduais legados são acrescidos à base real sem perder títulos nem duplicá-los',()=>{
 const antigo={Santos:{palmares:{liga:8,estadual:2}}},antes=structuredClone(antigo);
 assert.equal(palmaresDoClube(antigo,'Santos').estadual,24);assert.equal(galeriaClube({estadoClubes:antigo},'Santos').tacas.find(t=>t.tipo==='estadual').total,24);
 const novo=creditarTitulo(antigo,'Santos','estadual');assert.equal(novo.Santos.palmares.estadual,25);assert.equal(novo.Santos.historicoEstadualVersao,1);assert.equal(palmaresDoClube(novo,'Santos').estadual,25);assert.deepEqual(antigo,antes);
 assert.equal(creditarTitulo(estadoInicialClubes(),'Santos','estadual').Santos.palmares.estadual,23);
});
test('27 estaduais terminam com partidas e campeão mesmo com jogador na Inglaterra; consulta é determinística',()=>{
 const c=carreira(),a={ano:2025,clube:'Arsenal'},antes=structuredClone(c),torneios=simularEstaduaisMundo(c,a);
 assert.equal(torneios.length,27);assert.deepEqual(torneios,simularEstaduaisMundo(c,a));assert.deepEqual(c,antes);
 for(const t of torneios){const pool=new Set(participantesEstadual({estado:t.estado}).clubes.map(c=>c.nome));assert.ok(pool.has(t.campeao));assert.ok(pool.has(t.vice));const jogos=jogosDaCampanha(t);assert.ok(jogos.length>0);assert.ok(jogos.every(j=>pool.has(j.casa)&&pool.has(j.fora)&&Number.isFinite(j.golsCasa)&&Number.isFinite(j.golsFora)));}
});
test('estadual efetivamente jogado é preservado mesmo se o usuário perde; os outros 26 continuam',()=>{
 const card={ano:2025,clube:'Santos',torneios:[{nome:ESTADUAIS.SP,tipo:'estadual',campeao:'Palmeiras',vice:'Santos'}]};
 const outros=simularEstaduaisMundo(carreira(),card);assert.equal(outros.length,26);assert.ok(!outros.some(t=>t.nome===ESTADUAIS.SP));assert.equal(card.torneios[0].campeao,'Palmeiras');
 const legado=simularEstaduaisMundo(carreira(),{ano:2025,clube:'Santos',estadual:{titulo:false}});assert.equal(legado.length,26);
});
test('fechamento anual arquiva campeões e placares dos estaduais sem depender da liga do usuário ou duplicar na recarga',()=>{
 const c=carreira(),a={ano:2025,clube:'Arsenal',ligaId:'inglaterra'};registrarAnoHistoria(c,a);registrarMundoVivo(c,a);
 assert.equal(c.historiaFutebol.titulos.filter(t=>t.tipo==='estadual').length,27);assert.equal(c.universo.edicoes.filter(e=>e.tipo==='estadual').length,27);
 for(const e of c.universo.edicoes.filter(e=>e.tipo==='estadual'))assert.ok(jogosDaEdicao(e).length>0);
 assert.ok(Object.entries(c.universo.clubes).some(([nome,r])=>!CLUBES.some(c=>c.nome===nome)&&r.historico[0].titulos.length));
 const antes=JSON.stringify(c);registrarAnoHistoria(c,a);registrarMundoVivo(c,a);assert.equal(JSON.stringify(c),antes);
 const reload=JSON.parse(antes);assert.equal(galeriaCompeticao(reload,ESTADUAIS.SC).edicoes.length,1);
});
test('modo completo simula e credita estaduais externos com o campeão efetivo, uma edição por competição',()=>{
 const c={...carreira(),clube:CLUBES.find(c=>c.nome==='Arsenal'),idade:16};
 const card=prepararMundoTemporada(c,{ano:2025,clube:'Arsenal',ligaId:'inglaterra'},null);
 assert.equal(card.torneiosMundo.filter(t=>t.tipo==='estadual').length,27);assert.equal(card.campeoesCalendarioMundo.filter(t=>t.tipo==='estadual').length,27);
 assert.equal(prepararMundoTemporada(c,card,null),card);
 const estados=creditarCampeoesCalendario(estadoInicialClubes(),card);
 for(const t of card.campeoesCalendarioMundo.filter(t=>t.tipo==='estadual'&&estados[t.clube]))assert.equal(estados[t.clube].palmares.estadual,palmaresInicialDe(CLUBES.find(c=>c.nome===t.clube)).estadual+1);
});
test('seleções disputam suas copas por calendário e nunca sorteiam outra edição da copa jogada',()=>{
 const c=carreira();assert.ok(!simularSelecoesMundo(c,{ano:2025}).some(t=>t.tipo==='copaMundo'));
 const copa=simularSelecoesMundo(c,{ano:2026});assert.equal(copa.filter(t=>t.nome==='Copa do Mundo').length,1);assert.ok(jogosDaCampanha(copa[0]).length>0);
 assert.ok(!simularSelecoesMundo(c,{ano:2026,torneios:[{nome:'Copa do Mundo',campeao:'Brasil'}]}).some(t=>t.nome==='Copa do Mundo'));
 const continental=simularSelecoesMundo(c,{ano:2028});assert.ok(continental.some(t=>t.nome==='Eurocopa'));assert.ok(continental.some(t=>t.nome==='Copa América'));
 const fora=simularSelecoesMundo({tecnico:{tipoEquipe:'selecao',selecao:'BRA',classificacaoSelecao:{copa:2026,classificado:false}}},{ano:2026});assert.ok(jogosDaCampanha(fora.find(t=>t.tipo==='copaMundo')).every(j=>j.casa!=='Brasil'&&j.fora!=='Brasil'));
});
test('intercontinental usa os quatro campeões reais e registra as cinco partidas',()=>{
 const clubes=[{nome:'Europa real',forca:82},{nome:'América real',forca:78},{nome:'Ásia real',forca:72},{nome:'Norte real',forca:70}];
 const nomes=['Champions League','Libertadores','Champions Asiática','Concacaf Champions'];
 const a={ano:2026,torneiosMundo:clubes.map((c,i)=>({nome:nomes[i],campeao:c.nome}))};const r=simularMundiaisMundo(carreira(),a,clubes);assert.equal(r.length,1);const t=r[0];assert.equal(jogosDaCampanha(t).length,5);const final=t.fases.at(-1).jogos[0];assert.equal(final.casa,'Europa real');assert.equal(t.campeao,final.vencedor);
 assert.deepEqual(simularMundiaisMundo(carreira(),{...a,torneios:[{nome:t.nome,campeao:'Preservado'}]},clubes),[]);
});

test('mudança de estado não apaga os títulos anteriores de Operário-MS e Comercial-MS',()=>{
 const op=galeriaClube({},'Operário-MS');assert.equal(op.tacas.find(t=>t.nome===ESTADUAIS.MT).inicial,4);assert.equal(op.tacas.find(t=>t.nome===ESTADUAIS.MS).inicial,15);
 const comercial=galeriaClube({},'Comercial-MS');assert.equal(comercial.tacas.find(t=>t.nome===ESTADUAIS.MT).inicial,1);assert.equal(comercial.tacas.find(t=>t.nome===ESTADUAIS.MS).inicial,9);
});
test('Copa São Paulo continua sem o usuário e preserva a edição própria',async()=>{
 const {simularCopinhaMundo}=await import('../src/simulacao/copasExternasMundo.js');
 const pool=CLUBES.filter(c=>c.estado),a={ano:2025};const t=simularCopinhaMundo(carreira(),a,pool);assert.equal(t.length,1);assert.ok(t[0].campeao);assert.ok(jogosDaCampanha(t[0]).length>0);
 assert.deepEqual(simularCopinhaMundo(carreira(),{...a,copinhaCarreira:{titulo:false}},pool),[]);
 assert.deepEqual(simularCopinhaMundo(carreira(),{...a,torneios:[{nome:'Copinha',tipo:'copinha',campeao:'Preservado'}]},pool),[]);
});
test('atletas adultos não recebem partidas ou gols da Copa São Paulo',async()=>{
 const {estatisticasDasPartidas}=await import('../src/simulacao/estatisticasMundo.js');
 const jovem={id:'jovem',nome:'Jovem',clubeNome:'Santos',posicao:'ATA',ovr:60,idade:18,carreira:{gols:0,jogos:0}},adulto={...jovem,id:'adulto',nome:'Adulto',idade:28};
 const antes={jogadores:[jovem,adulto]},a={ano:2025,clube:'Arsenal',torneiosMundo:[{nome:'Copa São Paulo',tipo:'copinha',fases:[{fase:'Final',jogos:[{casa:'Santos',fora:'São Paulo',golsCasa:2,golsFora:0,vencedor:'Santos'}]}]}]};
 const r=estatisticasDasPartidas(antes,antes,a,'jovens');assert.equal(r.jogadores[0].porCompeticao[0].gols,2);assert.equal(r.jogadores[0].porCompeticao[0].jogos,1);assert.equal(r.jogadores[1].porCompeticao,undefined);assert.equal(r.jogadores[1].carreira.gols,0);
});
