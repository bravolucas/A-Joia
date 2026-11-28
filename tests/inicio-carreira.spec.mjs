import {test,expect} from '@playwright/test';
import {instalarSave} from './helpers/save-browser.mjs';
import {normalizarSave} from '../src/completo/save.js';
import {CLUBES} from '../src/dados/data.js';
import {gerarMundoJogadores,simularTemporada} from '../src/comum/lib.js';
const base='http://127.0.0.1:4173/A-Joia/';
for(const [width,anoInicio] of [[390,2026],[1366,2025]])test(`calendário completo preserva início em ${anoInicio} e avança uma vez em ${width}px`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:850});await page.emulateMedia({reducedMotion:'reduce'});
 const clube=CLUBES.find(c=>c.nome==='Santos'),rival=CLUBES.find(c=>c.nome==='Flamengo'),linha=clube=>({clube,pts:0,j:0,v:0,e:0,d:0,gp:0,gc:0,sg:0});
 const s=normalizarSave({versao:1,nome:'Calendário Mundial',posicao:'MD',nacionalidade:'BRA',personalidade:'ascensao',pernaDominante:'destro',temporadas:[],mundo:gerarMundoJogadores(),aba:'carreira',modoSimulacao:'jogoAJogo',carreira:{posicao:'MD',clube,attrs:{velocidade:65,finalizacao:65,passe:65,drible:65,defesa:65,fisico:65,fintas:3,pernaRuim:3},anoInicio,idade:16,picoOvr:65,contrato:{salario:1000,multa:5000,anos:3,restantes:2}}});
 const card=simularTemporada(s.carreira);card.lesao=null;card.copaResultado=null;card.continentalPendente=null;card.copaNacionalPendente=null;card.ligaDecisiva=false;
 s.carreira.temporadaAndamento={calendario:[[{casa:clube,fora:rival}],[{casa:rival,fora:clube}]],rodadaAtual:0,eventosAgendados:[],cardOriginal:card,tabela:{Santos:linha(clube),Flamengo:linha(rival)},logJogos:[],resultadosRodadas:[],historicoRodada:[],golsRestantes:2,assistRestantes:1};
 const erros=[];page.on('pageerror',e=>erros.push(e.message));
 await page.goto(base);await instalarSave(page,s,'ajoia_save_auto');await page.reload();await page.getByRole('button',{name:/Modo Carreira completo/}).click();await page.getByRole('button',{name:/Continuar carreira/}).click();
 await page.getByRole('button',{name:/Simular temporada inteira/}).click();
 const resumo=()=>page.evaluate(async()=>{
  const marca=JSON.parse(localStorage.getItem('ajoia_save_auto')||'null');let save=marca;
  if(marca?.arquivoMundo){const db=await new Promise(resolve=>{const r=indexedDB.open('ajoia-carreiras',1);r.onsuccess=()=>resolve(r.result);});const hidratar=async(db,s)=>{for(const r of [s?.c,s?.carreira,s?.ativo?.c,s])for(const d of [r,r?.tecnico])if(d?.universo?.arquivoSeparado)d.universo=await new Promise(ok=>{const q=db.transaction('saves').objectStore('saves').get(d.universo.arquivoSeparado);q.onsuccess=()=>ok(q.result);});return s;};save=await hidratar(db,await new Promise(resolve=>{const r=db.transaction('saves').objectStore('saves').get('ajoia_save_auto');r.onsuccess=()=>resolve(r.result);}));db.close();}
  const card=save?.temporadas?.at(-1);if(!card)return null;
  const u=save.carreira.universo,inglesa=card.classificacoesMundo.inglaterra;
  return {versao:card.calendarioMundoVersao,ano:card.ano,liga:card.ligaId,rodadas:card.jogosLiga.length,jogosArquivados:u.edicoes.find(e=>e.nome===card.ligaNome)?.jogos?.partidas?.length,inglesa:u.edicoes.find(e=>e.nome==='Premier League')?.jogos?.partidas?.length,semDuplicacao:inglesa.jogos===undefined,inglesaN:inglesa.classificacao.length,campeao:inglesa.classificacao[0].nome,campeaoHistoria:save.carreira.historiaFutebol.titulos.find(t=>t.ano===card.ano&&t.nome==='Premier League')?.clube,anos:u.anos,origens:[...new Set(save.mundo.jogadores.filter(p=>!p.aposentado).map(p=>p.origemEstatisticas))],premios:save.mundo.historicoBolaDeOuro.filter(h=>h.temporada===save.mundo.temporada).length};
 });
 await expect.poll(async()=> (await resumo())?.versao,{timeout:60000}).toBe(1);
 const r=await resumo();expect(r.ano).toBe(anoInicio);expect(r.semDuplicacao).toBe(true);expect(r.rodadas).toBe(2);expect(r.jogosArquivados).toBe(2);expect(r.inglesa).toBe(r.inglesaN*(r.inglesaN-1));expect(r.campeaoHistoria).toBe(r.campeao);expect(r.anos).toEqual([r.ano]);expect(r.premios).toBe(1);expect(r.origens).toContain('partidas');
 await page.reload();await page.getByRole('button',{name:/Modo Carreira completo/}).click();await page.getByRole('button',{name:/Continuar carreira/}).click();expect(await resumo()).toEqual(r);expect(erros).toEqual([]);
});
