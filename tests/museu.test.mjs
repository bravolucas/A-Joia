import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAVE_MUSEU, museuVazio, extrairConquistasMuseu, mesclarMuseu, registrarMuseu, lerMuseu, importarMuseu, sincronizarMuseuDosSaves, competenciaMuseu } from '../src/museu/museu.js';
import { salvarRapido, apagarRapido } from '../src/jogador/rapido.js';
import { salvarLocal } from '../src/completo/save.js';

const storage = () => { const dados = new Map(); return { getItem: k => dados.get(k) ?? null, setItem: (k,v) => dados.set(k,String(v)), removeItem: k => dados.delete(k) }; };
const carreira = () => ({ museuId: 'carreira-1', nome: 'Lucas', codigo: 'MUSEU', nac: 'BRA', lista: [{ nome: 'Brasileirão', tipo: 'liga', ano: 2026, clube: 'Santos' }], temporadas: [{ clube: 'Santos', ano: 2026 }], torcida: { Santos: 80, Flamengo: 99 }, totais: { gols: 100, assist: 10, jogos: 150 }, titulos: { liga: 1 } });

test('taças, camisas e feitos são extraídos de resultados reais', () => {
 const itens = extrairConquistasMuseu(carreira());
 assert.ok(itens.some(i => i.categoria === 'tacas' && i.nome === 'Brasileirão'));
 assert.ok(itens.some(i => i.categoria === 'camisas' && i.nome === 'Santos'));
 assert.ok(!itens.some(i => i.categoria === 'camisas' && i.nome === 'Flamengo'));
 assert.ok(itens.some(i => i.id === 'cem-gols'));
 assert.ok(!itens.some(i => i.id === 'quinhentos-gols'));
});

test('salvar, recarregar e importar são idempotentes; outra carreira soma', () => {
 const local = storage();const c = carreira();
 registrarMuseu(c, {}, local);registrarMuseu(c, {}, local);
 const id = competenciaMuseu('Brasileirão').id;
 let m = lerMuseu(local);
 assert.equal(Object.keys(m.tacas[id].fontes).length, 1);
 importarMuseu(m, local);importarMuseu(m, local);
 assert.deepEqual(lerMuseu(local), m);
 registrarMuseu({ ...c, museuId: 'carreira-2' }, {}, local);
 m = lerMuseu(local);
 assert.equal(Object.values(m.tacas[id].fontes).reduce((n,f) => n+f.quantidade,0), 2);
 // Revisitar um snapshot antigo não apaga conquistas nem reduz a contagem.
 const evoluiu = { ...c, lista: [...c.lista, { ...c.lista[0], ano: 2027 }] };
 registrarMuseu(evoluiu, {}, local);registrarMuseu(c, {}, local);
 assert.equal(lerMuseu(local).tacas[id].fontes['rapido:carreira-1:Jogador'].quantidade, 2);
 assert.equal(Object.keys(lerMuseu(local).camisas).length, 1);
});

test('taças e camisas do treinador entram na mesma coleção sem duplicar as do atleta', () => {
 const c = carreira();
 c.tecnico = { clube: 'Santos', torcida: 82, temporadas: [{ ano: 2050, clube: 'Santos', liga: 'brasileirao', campeao: true, titulosConquistados: ['Campeonato Brasileiro Série A', 'Copa Libertadores', 'Copa do Brasil'] }] };
 const m = mesclarMuseu(museuVazio(), extrairConquistasMuseu(c));
 assert.equal(Object.keys(m.tacas).length, 3);
 assert.equal(Object.keys(m.tacas['taca-brasileirao'].fontes).length, 2);
 assert.ok(m.feitos['treinador-campeao']);assert.ok(m.feitos.triplice);
});

test('o modo completo normaliza títulos e preserva as seleções sem duplicação', () => {
 const c = { museuId: 'completa', nome: 'Maria', clube: {nome:'Santos', liga:'brasileirao'}, gols: 500, bolasDeOuro: 1, torcidaPorClube: { Santos: 90 }, titulosSelecao: ['Copa do Mundo (Brasil)'] };
 const temporadas = [{clube:'Santos', idade:20, jogos:38, titulosLista:['Campeão Brasileirão', 'Campeão da Copa Nacional'], copa: {titulo:true}}];
 const m = mesclarMuseu(museuVazio(),extrairConquistasMuseu(c,{modo:'completo',temporadas}));
 assert.ok(m.tacas['taca-brasileirao']);assert.ok(m.tacas['taca-copa-do-brasil']);assert.ok(m.tacas['taca-copa-do-mundo']);
 assert.equal(Object.values(m.tacas['taca-copa-do-mundo'].fontes)[0].quantidade,1);
 assert.ok(m.feitos['quinhentos-gols']);assert.ok(m.feitos['bola-ouro']);
});

test('um backup inválido e uma falha de armazenamento preservam os dados', () => {
 const local = storage();registrarMuseu(carreira(),{},local);const antes=local.getItem(CHAVE_MUSEU);
 assert.throws(()=>importarMuseu({versao:99},local));assert.equal(local.getItem(CHAVE_MUSEU),antes);
 local.setItem(CHAVE_MUSEU,'arquivo danificado');
 assert.equal(registrarMuseu(carreira(),{},local).ok,false);assert.equal(local.getItem(CHAVE_MUSEU),'arquivo danificado');
 const indisponivel={getItem:()=>null,setItem:()=>{throw Error('quota')}};
 assert.equal(registrarMuseu(carreira(),{},indisponivel).ok,false);
 assert.equal(registrarMuseu(carreira(),{},null).ok,false);
});

test('integração: nova carreira e apagar saves não apagam o museu', () => {
 const antes=globalThis.localStorage;globalThis.localStorage=storage();
 try {
  assert.equal(salvarRapido({c:carreira(),etapa:'resumo'}),true);
  const colecao=localStorage.getItem(CHAVE_MUSEU);apagarRapido();
  assert.equal(localStorage.getItem(CHAVE_MUSEU),colecao);
  salvarRapido({c:{...carreira(),museuId:'nova',lista:[],torcida:{},temporadas:[],totais:{}},etapa:'evento'});
  assert.equal(localStorage.getItem(CHAVE_MUSEU),colecao);
  const c={nome:'Clara',museuId:'completa',torcidaPorClube:{Santos:80}};
  const save={nome:'Clara',carreira:c,temporadas:[{clube:'Santos',titulosLista:['Campeão da Libertadores'],idade:21}]};
  assert.equal(salvarLocal('1',save).ok,true);assert.ok(lerMuseu().tacas['taca-libertadores']);
  salvarLocal('2',save);assert.equal(Object.keys(lerMuseu().tacas['taca-libertadores'].fontes).length,1);
 } finally {globalThis.localStorage=antes;}
});

test('migração de saves antigos usa uma identidade estável entre slots e transferências', () => {
 const local=storage();const c=carreira();delete c.museuId;
 local.setItem('ajoia_rapido_v1',JSON.stringify({c}));
 const antigo={nome:'Ana',carreira:{clube:{nome:'Santos'},torcidaPorClube:{Santos:80}},temporadas:[{clube:'Santos',idade:18,titulosLista:['Campeão da Libertadores']}]};
 local.setItem('ajoia_save_1',JSON.stringify(antigo));local.setItem('ajoia_save_2',JSON.stringify(antigo));
 assert.equal(sincronizarMuseuDosSaves(local),true);
 const anterior=local.getItem(CHAVE_MUSEU);sincronizarMuseuDosSaves(local);assert.equal(local.getItem(CHAVE_MUSEU),anterior);
 antigo.carreira.clube.nome='Flamengo';local.setItem('ajoia_save_2',JSON.stringify(antigo));sincronizarMuseuDosSaves(local);
 assert.equal(Object.keys(lerMuseu(local).tacas['taca-libertadores'].fontes).length,1);
});

test('saves antigos preservam idolatria registrada em temporadas anteriores', () => {
 const c = { nome: 'Ídolo', torcidaPorClube: { Santos: 30 }, clube: { nome: 'Flamengo', liga: 'brasileirao' } };
 const temporadas = [{ clube: 'Santos', torcidaFim: 80, ligaNome: 'Brasileirão', titulosLista: [] }];
 const itens = extrairConquistasMuseu(c, { modo: 'completo', temporadas });
 assert.ok(itens.some(i => i.id === 'camisa-santos'));
 assert.equal(c.torcidaPorClube.Santos, 30);
});
