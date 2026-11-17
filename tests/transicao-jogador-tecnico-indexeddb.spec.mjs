import {test,expect} from '@playwright/test';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync,unlinkSync} from 'node:fs';
import {resolve} from 'node:path';
import {simularCarreiraAutomatica} from '../src/jogador/rapido.js';

const URL='http://127.0.0.1:4173/A-Joia/';
const CHAVE='ajoia_rapido_v1';
const hash=valor=>createHash('sha256').update(JSON.stringify(valor)).digest('hex');
let retirado,bundle;
const FIXTURE='dist/auditoria-transicao-carreira.json';
test.setTimeout(360000);

test.beforeAll(async({},testInfo)=>{
  // A carreira completa é custosa: o limite padrão de 30s do hook não serve.
  // Isso não reduz nem pula qualquer temporada, teste ou verificação.
  testInfo.setTimeout(360000);
  // Usar a carreira REAL do modo rápido; o teste não fabrica histórico de atleta.
  retirado=simularCarreiraAutomatica({
    nome:'Auditoria transição',nac:'BRA',posicao:'ATA',
    origem:'base',personalidade:'disciplinado',pe:'destro',
    numero:9,ritmo:'expresso',codigo:'TRANSICAO-IDB-2026',
  },op=>op[0],()=> 'equilibrio');
  if(!retirado.aposentado||!retirado.temporadas?.length||
     !retirado.mundo?.jogadores?.length) {
    throw new Error('O motor não concluiu uma carreira real com mundo e histórico.');
  }
  // O fixture gerado pelo motor fica temporariamente no dist do runner;
  // buscar pelo próprio Chromium evita clonar dezenas de MB pelo canal IPC
  // do Playwright antes do teste de IndexedDB.
  const serializado=JSON.stringify(retirado);
  console.log('[transicao] anos=',retirado.temporadas.length,
    'atletas=',retirado.mundo.jogadores.length,
    'bytes fixture=',Buffer.byteLength(serializado,'utf8'));
  writeFileSync(FIXTURE,serializado);
  const script=[
    "export {salvarRapidoConfirmado,carregarRapido,CHAVE_SAVE_RAPIDO} from './src/jogador/rapido.js';",
    "export {prepararArmazenamento,lerPersistente,aguardarSalvamentos} from './src/simulacao/armazenamentoMundo.js';",
    "export {iniciarCarreiraTecnico,tomarDecisaoTecnico,cartaAtualTecnico,simularEtapaTecnico,QUANTIDADE_DECISOES_TECNICO} from './src/treinador/tecnico.js';",
  ].join('\n');
  const out=await build({stdin:{contents:script,resolveDir:process.cwd(),sourcefile:'auditoria-transicao.js'},
    bundle:true,write:false,platform:'browser',format:'iife',
    globalName:'__ajoiaTransicao',logLevel:'silent'});
  bundle=out.outputFiles[0].text;
});

test.afterAll(()=>{try{unlinkSync(FIXTURE);}catch{ /* fixture de runner já eliminado */ }});

async function preparar(page){
  await page.addScriptTag({content:bundle});
  await page.evaluate(()=>window.__ajoiaTransicao.prepararArmazenamento());
}

async function resumo(page){
 return page.evaluate(async chave=>{
   const api=window.__ajoiaTransicao;
   const c=api.lerPersistente(chave)?.c;
   if(!c)return {erro:'save indisponível'};
   const digest=async value=>{
     const data=new TextEncoder().encode(JSON.stringify(value));
     const raw=await crypto.subtle.digest('SHA-256',data);
     return [...new Uint8Array(raw)].map(v=>v.toString(16).padStart(2,'0')).join('');
   };
   const ids=c.mundo?.jogadores?.map(x=>String(x.id))||[];
   return {
     nome:c.nome,aposentado:c.aposentado,
     anosJogador:c.temporadas?.length||0,anosTecnico:c.tecnico?.temporadas?.length||0,
     idade:c.idade,idadeTecnico:c.tecnico?.idade??null,
     clubeTecnico:c.tecnico?.clube||null,
     jogosTecnico:c.tecnico?.andamento?.jogos||0,
     atletas:ids.length,idsUnicos:new Set(ids).size,
     digestMundo:await digest(c.mundo),
     digestHistorico:await digest(c.temporadas),
     digestTitulos:await digest(c.titulos),
     marcador:localStorage.getItem(chave),
   };
 },CHAVE);
}

test('jogador aposentado reabre e vira técnico mantendo mundo, histórico e títulos no IndexedDB',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(URL);
  await preparar(page);
  const esperado={atletas:retirado.mundo.jogadores.length,
    digestMundo:hash(retirado.mundo),
    digestHistorico:hash(retirado.temporadas),
    digestTitulos:hash(retirado.titulos),
    anosJogador:retirado.temporadas.length,
  };
  page.on('crash',()=>console.error('[transicao] Chromium encerrou o renderer durante o teste'));
  const inicial=await page.evaluate(async()=>{
    const resposta=await fetch('./auditoria-transicao-carreira.json',{cache:'no-store'});
    if(!resposta.ok)throw new Error('Fixture de carreira não servido: '+resposta.status);
    const c=await resposta.json();
    const api=window.__ajoiaTransicao;
    if(api.CHAVE_SAVE_RAPIDO!=='ajoia_rapido_v1')throw Error('Chave de save real divergente');
    await api.salvarRapidoConfirmado({etapa:'aposentadoria',c,auto:false});
    await api.aguardarSalvamentos();
    return {marcador:localStorage.getItem(api.CHAVE_SAVE_RAPIDO)};
  });
  expect(inicial.marcador).toBe('{"arquivoMundo":1}');
  const antes=await resumo(page);
  expect(antes.atletas).toBe(esperado.atletas);
  expect(antes.digestMundo).toBe(esperado.digestMundo);
  expect(antes.digestHistorico).toBe(esperado.digestHistorico);
  expect(antes.digestTitulos).toBe(esperado.digestTitulos);
  expect(antes.anosTecnico).toBe(0);

  // Reinicia o navegador: a transição DEVE partir da carreira recarregada,
  // não do objeto Node original ainda em memória.
  await page.reload();await preparar(page);
  const transicao=await page.evaluate(async()=>{
    const api=window.__ajoiaTransicao;
    const salvo=api.carregarRapido();
    if(!salvo?.c?.aposentado)throw Error('Carreira de jogador não recuperada.');
    let c=api.iniciarCarreiraTecnico(salvo.c);
    if(!c.tecnico?.clube)throw Error('Nenhum clube inicial de técnico.');
    for(let i=0;i<api.QUANTIDADE_DECISOES_TECNICO;i++){
      const carta=api.cartaAtualTecnico(c.tecnico);
      if(!carta?.opcoes?.length)throw Error('Decisão do treinador inválida.');
      c=api.tomarDecisaoTecnico(c,carta.opcoes[0].id,()=>.9);
    }
    c=api.simularEtapaTecnico(c,()=>.4);
    await api.salvarRapidoConfirmado({etapa:'tecnico',c,auto:false});
    await api.aguardarSalvamentos();
    return {clube:c.tecnico.clube,jogos:c.tecnico.andamento?.jogos??0,
      idade:c.tecnico.idade,historico:c.temporadas.length};
  });
  expect(transicao.clube).toBeTruthy();
  expect(transicao.jogos).toBeGreaterThan(0);
  expect(transicao.historico).toBe(esperado.anosJogador);

  const posTransicao=await resumo(page);
  expect(posTransicao.digestMundo).toBe(esperado.digestMundo);
  expect(posTransicao.digestHistorico).toBe(esperado.digestHistorico);
  expect(posTransicao.digestTitulos).toBe(esperado.digestTitulos);
  expect(posTransicao.anosJogador).toBe(esperado.anosJogador);
  expect(posTransicao.idsUnicos).toBe(posTransicao.atletas);
  expect(posTransicao.jogosTecnico).toBe(transicao.jogos);

  await page.reload();
  await page.setViewportSize({width:1366,height:900});
  await preparar(page);
  const recarga=await resumo(page);
  expect(recarga).toEqual(posTransicao);
  const carregado=await page.evaluate(()=>window.__ajoiaTransicao.carregarRapido());
  expect(carregado?.c?.tecnico).toBeTruthy();
  expect(carregado.c.temporadas).toHaveLength(esperado.anosJogador);
  expect(carregado.c.aposentado).toBe(true);

  const medidas={modo:'rapido-jogador-aposentado-para-tecnico',
    anosJogador:esperado.anosJogador,atletas:esperado.atletas,
    clubeTecnico:transicao.clube,jogosTecnico:transicao.jogos,
    mantemMundo:recarga.digestMundo===esperado.digestMundo,
    mantemHistorico:recarga.digestHistorico===esperado.digestHistorico,
    mantemTitulos:recarga.digestTitulos===esperado.digestTitulos,
    recarregouEmMobileEDesktop:true};
  mkdirSync('resultados-auditoria',{recursive:true});
  writeFileSync('resultados-auditoria/transicao-jogador-tecnico-indexeddb.json',JSON.stringify(medidas,null,2));
  await testInfo.attach('transicao-jogador-tecnico-indexeddb.json',{
    body:Buffer.from(JSON.stringify(medidas,null,2)),contentType:'application/json'});
});
