import {test,expect} from '@playwright/test';
import {instalarSave,lerSave} from './helpers/save-browser.mjs';
import {normalizarSave} from '../src/completo/save.js';
import {CLUBES} from '../src/dados/data.js';
const base='http://127.0.0.1:4173/A-Joia/';
for(const tipo of ['copaNacional','continental']) test(`partida ao vivo alimenta a chave persistente de ${tipo}`,async({page})=>{
 test.setTimeout(90000);
 const clube=CLUBES.find(c=>c.nome==='Santos'),rival=CLUBES.find(c=>c.nome==='Flamengo');
 const linha=clube=>({clube,pts:0,j:0,v:0,e:0,d:0,gp:0,gc:0,sg:0});
 const card={copasPersistentesVersao:1,jogos:4,gols:2,assist:1,nota:7,ovr:65,...(tipo==='continental'?{continentalPendente:{nome:'Libertadores',formato:'grupo'}}:{})};
 const s=normalizarSave({versao:1,nome:'Chave Real',posicao:'MD',nacionalidade:'BRA',personalidade:'ascensao',pernaDominante:'destro',temporadas:[],aba:'carreira',modoSimulacao:'jogoAJogo',carreira:{posicao:'MD',clube,jogosCarreiraTotal:10,attrs:{velocidade:65,finalizacao:65,passe:65,drible:65,defesa:65,fisico:65,fintas:3,pernaRuim:3},idade:24,picoOvr:65,contrato:{salario:1000,multa:5000,anos:3,restantes:2},temporadaAndamento:{calendario:Array.from({length:4},(_,i)=>[{casa:i%2?rival:clube,fora:i%2?clube:rival}]),rodadaAtual:0,posturaEscolhidaRodada:true,eventosAgendados:[{tipo,rodadaAlvo:0,adversario:'Adversário antigo',jogoGrupo:0}],cardOriginal:card,tabela:{Santos:linha(clube),Flamengo:linha(rival)},logJogos:[],resultadosRodadas:[],historicoRodada:[],golsRestantes:2,assistRestantes:1}}});
 const erros=[];page.on('pageerror',e=>erros.push(e.message));
 await page.goto(base);await instalarSave(page,s,'ajoia_save_auto');await page.reload();
 await page.getByRole('button',{name:/Modo Carreira completo/}).click();await page.getByRole('button',{name:/Continuar carreira/}).click();
 await page.getByRole('button',{name:/Avançar — rodada/}).click();
 await expect(page.getByRole('button',{name:/Pular pro final/})).toBeVisible();
 await expect(page.getByText('Adversário antigo',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:/Pular pro final/}).click();
 // A partida pode apresentar uma cena de carreira após o apito final.
 // Fechá-la pelo botão próprio antes de continuar a rodada, sem clicar através do modal.
 const popupCarreira=page.getByRole('dialog',{name:'Detalhes da carreira'});
 // Resultados das copas têm um diálogo próprio com "Continuar"; outras
 // cenas de carreira podem oferecer "Seguir em frente". A ação deve ser
 // disparada DENTRO do diálogo ativo, nunca no botão atrás do overlay.
 await expect(async()=>{
   if(await popupCarreira.isVisible()){
     await popupCarreira.getByRole('button',{name:/^(?:Continuar|Seguir em frente)$/}).click({timeout:3000});
     await expect(popupCarreira).toHaveCount(0);
   } else {
     await page.getByRole('button',{name:'Continuar',exact:true}).first().click({timeout:3000});
   }
 }).toPass({timeout:20000,intervals:[200,1000]});
 await page.getByRole('button',{name:'💾 Salvar',exact:true}).click();
 await page.getByRole('button',{name:'Salvar aqui',exact:true}).first().click();
 const salvo=await lerSave(page,'ajoia_save_1'),ta=salvo.carreira.temporadaAndamento,k=ta.cardOriginal;
 expect(ta.rodadaAtual).toBe(0);
 expect(k.partidasCompeticoes).toHaveLength(1);
 const partida=k.partidasCompeticoes[0],camp=k.campanhasCompletas[tipo];
 expect(camp.pool.some(c=>c.nome==='Adversário antigo')).toBe(false);
 if(tipo==='copaNacional')expect(k.pernasCopas.copaNacional).toMatchObject({casa:partida.casa,fora:partida.fora,golsCasa:partida.golsCasa,golsFora:partida.golsFora});
 else {expect(camp.jogosUsuario).toHaveLength(1);expect(camp.jogosUsuario[0]).toMatchObject({casa:partida.casa,fora:partida.fora,golsCasa:partida.golsCasa,golsFora:partida.golsFora});expect(camp.jogosLiga).toHaveLength(2);}
 expect(k.statsCompeticoes[tipo].jogos).toBe(1);
 expect(ta.eventosAgendados.some(e=>e.tipo===tipo)).toBe(true);
 expect(erros).toEqual([]);
});
