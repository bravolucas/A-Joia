import {prepararDecisaoJogo} from '../src/jogador/decisaoDeJogo.js';
import{test,expect}from'@playwright/test';
import{criarJogador,sortearEvento,ovrDe}from'../src/jogador/rapido.js';
import{registrarMuseu}from'../src/museu/museu.js';
const base='http://127.0.0.1:4173/A-Joia/';
function jogador(){const c=criarJogador({nome:'Jornada UI',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,ritmo:'normal',codigo:'JORNADA-UI'});c.idade=30;c.ano=2040;c.desafioAno=c.ano;c.flags.baseEscolhida=true;c.clubeNome='Santos';c.primeiroClube='Santos';c.torcida.Santos=85;c.patrimonio=5000;for(const k of Object.keys(c.attrs)){c.attrs[k]=76;c.potencial[k]=90;}c.contrato={clube:'Santos',anos:3,restantes:3,salario:1000,multa:30000};return c;}
async function abrir(page,c,extras={}){await page.goto(base);await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),{v:1,etapa:'evento',c,auto:false,...extras});await page.reload();await page.getByRole('button',{name:/Continuar · Jornada UI/}).click();}

for(const width of[390,1366])test(`troca real de posição mostra prazo, altera o save e retoma em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:760});await page.emulateMedia({reducedMotion:'reduce'});await abrir(page,jogador());
 await expect(page.getByRole('navigation',{name:'Fases da temporada'})).toContainText('Preparação');
 await page.locator('.jr-painel>details>summary').click();await page.getByRole('button',{name:'Mudar de posição',exact:true}).click();
 const modal=page.getByRole('dialog',{name:'Mudar de posição de verdade'});await expect(modal).toContainText('temporários');
 await modal.getByRole('button',{name:/ATA → MEI/}).click();await expect(modal).toHaveCount(0);
 const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')));expect(salvo.c.posicao).toBe('MEI');expect(salvo.c.jornada.transicao.restantes).toBe(2);
 await expect(page.locator('.jr-painel')).toContainText('MEI');await page.reload();await page.getByRole('button',{name:/Continuar · Jornada UI/}).click();
 await expect(page.locator('.jr-painel')).toContainText('Nova função');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`/tmp/jornada-posicao-${width}.png`,fullPage:true});
});

test('preferência e assinatura são opcionais, persistem e não concedem OVR ao clicar',async({page})=>{
 const c=jogador();c.jornada.assinaturas={vertical:{anos:[2037,2038,2039]},decisivo:{anos:[2037,2038,2039]}};
 await abrir(page,c);await page.locator('.jr-painel>details>summary').click();await page.getByRole('button',{name:'Disputar títulos',exact:true}).click();
 await page.getByRole('button',{name:'Assinatura técnica',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:/Passe que quebra linhas/}).click();
 const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c);expect(salvo.jornada.preferencia).toBe('titulos');expect(salvo.jornada.assinaturaAtiva).toBe('vertical');expect(ovrDe(salvo)).toBe(ovrDe(c));
});

test('UP comprado continua visível na preparação sem abrir a loja',async({page})=>{
 const c=jogador();await abrir(page,c);await page.locator('.lj-atalho').click();const loja=page.getByRole('dialog',{name:'Loja do jogador'});
 const item=loja.locator('article').filter({has:page.getByRole('heading',{name:'UP de criação',exact:true})});await item.getByRole('button',{name:/Comprar/}).click();await loja.getByRole('button',{name:'Fechar loja',exact:true}).click();
 await expect(page.getByLabel('Impulsos ativos na temporada')).toContainText('UP de criação');await expect(page.getByLabel('Impulsos ativos na temporada')).toContainText('1 temporada(s) restante(s)');
});

test('álbum usa os três marcos escolhidos e não exige continuar uma decisão',async({page})=>{
 const c=jogador();c.jornada.memorias=[{id:'m1',ano:2026,clube:'Santos',titulo:'Primeiro contrato',texto:'Sua primeira assinatura.'},{id:'m2',ano:2028,clube:'Santos',titulo:'Primeiro título',texto:'Copa do Brasil.'},{id:'m3',ano:2030,clube:'Milan',titulo:'Uma nova casa',texto:'Contrato assinado.'},{id:'m4',ano:2038,clube:'Santos',titulo:'A volta',texto:'Retorno ao clube formador.'}];
 await abrir(page,c);await page.locator('.jr-painel>details>summary').click();await page.getByRole('button',{name:'Meu álbum',exact:true}).click();const modal=page.getByRole('dialog',{name:'Seu álbum de momentos'});
 await expect(modal.locator('.jr-poster article')).toHaveCount(3);await expect(modal.getByRole('checkbox').last()).toBeDisabled();await modal.getByRole('checkbox').first().uncheck();await modal.getByRole('checkbox').last().check();await expect(modal.locator('.jr-poster')).toContainText('A volta');await expect(modal.locator('.jr-poster')).not.toContainText('Primeiro contrato');const baixou=page.waitForEvent('download');await modal.getByRole('button',{name:'Salvar meus três momentos'}).click();expect((await baixou).suggestedFilename()).toBe('a-joia-meus-momentos.png');
});

test('camisa do museu conserva anos e número e há progresso transparente',async({page})=>{
 const c=jogador();c.temporadas=[{ano:2038,clube:'Santos',posicao:'ATA',numero:9,jogos:30,titulos:[],gols:10,assist:3}];c.jornada.primeiros['primeira-defesa']={id:'primeiro:primeira-defesa',ano:2038,clube:'Santos',numero:9,posicao:'GOL',texto:'Defesa decisiva registrada.'};let museu;
 registrarMuseu(c,{}, {getItem:()=>null,setItem:(_,v)=>museu=v});await page.goto(base);await page.evaluate(({c,museu})=>{localStorage.setItem('ajoia_rapido_v1',JSON.stringify({v:1,etapa:'evento',c}));localStorage.setItem('ajoia_museu_v1',museu);},{c,museu});await page.reload();await page.getByRole('button',{name:/Meu museu/}).click();await page.getByRole('tab',{name:/Camisas/}).click();await page.getByRole('searchbox').fill('Santos');await page.getByRole('button',{name:'Santos, desbloqueado',exact:true}).click();
 const modal=page.getByRole('dialog');await expect(modal).toContainText('2038');await expect(modal).toContainText('Camisa 9');await modal.getByRole('button',{name:'Fechar detalhes',exact:true}).click();await page.getByRole('tab',{name:/Feitos/}).click();await page.getByRole('searchbox').fill('Garçom');await page.getByRole('button',{name:'Garçom de luxo, bloqueado',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('Progresso nesta carreira');
});

test('transferência apresenta despedida histórica, anúncio e primeiro dia sem aplicar contrato duas vezes',async({page})=>{
 await page.setViewportSize({width:390,height:760});await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.install({time:new Date('2026-11-06T15:00:00Z')});await page.clock.pauseAt(new Date('2026-11-06T15:00:00.100Z'));
 const c=jogador();c.flags.impasseAno=c.ano;c.temporadas=[2038,2039].map((ano,i)=>({ano,clube:'Santos',jogos:30,titulos:[],nota:7,gols:10,assist:5,ovr:76,ovrDepois:76,idade:28+i,ligaId:'brasileirao',ligaNome:'Brasileirão',posLiga:5,idx:i}));c.lista=[2036,2037,2038].map(ano=>({ano,clube:'Santos',nome:'Brasileirão',tipo:'liga'}));const evento=sortearEvento(c,{somente:'propostas'}),op=evento.opcoes.find(o=>o.oferta&&o.negociar);expect(op).toBeTruthy();
 c.jornada.duplas=[{id:'reuniao',nome:'Davi Monteiro',clube:op.oferta.clube,conexao:3,temporadas:4,reencontros:0,nascimento:2011,rota:[{ano:2035,clube:'Santos'},{ano:2039,clube:op.oferta.clube}]}];
 await abrir(page,c,{evento});const linha=page.locator('.rp-evento .rp-opcao').filter({hasText:op.oferta.clube});await linha.getByRole('button').first().click();const despedida=page.getByRole('dialog',{name:'Despedida do clube'});await expect(despedida).toContainText('Uma volta para agradecer');await expect(despedida.locator('.jr-cinema-arte img')).toHaveAttribute('src',/despedidas/);
 await page.clock.runFor(1000);await expect(despedida).toHaveAttribute('data-ato','1');await expect(despedida.locator('.jr-aplausos i')).toHaveCount(24);await expect(despedida.getByLabel('Brasileirão: 3 títulos')).toContainText('×3');await expect(despedida.getByLabel('Brasileirão: 3 títulos')).toContainText('2038 · 2037 · 2036');await expect.poll(()=>despedida.locator('.jr-cinema-tacas img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);await page.screenshot({path:'/tmp/jornada-despedida-animada.png',animations:'disabled'});
 await despedida.getByRole('button',{name:/Seguir para o novo clube/}).click();await page.clock.runFor(3200);const primeiro=page.getByRole('dialog',{name:'Primeiro dia no clube'});
 // Anúncios grandes aguardam vestir a camisa; anúncios curtos seguem sozinhos.
 if(await primeiro.count()===0){const vestir=page.getByRole('button',{name:/Vestir a camisa/});if(await vestir.count())await vestir.click();}
 await expect(primeiro).toContainText(op.oferta.clube);await expect(primeiro.getByLabel('Reencontro da dupla')).toContainText('Davi Monteiro');await page.screenshot({path:'/tmp/jornada-reencontro-chegada.png',animations:'disabled'});const botao=await primeiro.getByRole('button',{name:/Entrar na temporada/}).boundingBox();expect(botao.y+botao.height).toBeLessThanOrEqual(760);await primeiro.getByRole('button',{name:/Entrar na temporada/}).click();const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c);expect(salvo.transferencias).toHaveLength(1);expect(salvo.clubeNome).toBe(op.oferta.clube);expect(salvo.jornada.adaptacao.restantes).toBeGreaterThan(0);
});

for(const width of[390,1366])test(`reencontro opcional mostra consequência e persiste sem impedir minigame em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:760});await page.emulateMedia({reducedMotion:'reduce'});
 const c=jogador();c.temporadas=[{ano:2038,clube:'Milan',jogos:30,titulos:[],gols:10,assist:5,nota:7,ovr:76,idade:28}];c.torcida.Milan=60;
 const momento={tipo:'copa',nome:'Champions League',mini:'penalti',titulo:'Diante do antigo clube',texto:'Final',ordem:1,total:1,adversario:{tipo:'clube',nome:'Milan'}};
 const card={ano:c.ano,pendente:momento,filaMomentos:[],momentos:[],titulos:[],jogos:30,gols:10,assist:5};await abrir(page,c,{etapa:'momento',card});
 await page.locator('.jr-reacao>summary').click();await page.getByRole('button',{name:/Reconhecer a torcida/}).click();await expect(page.locator('.jr-reacao')).toContainText('+2 de carinho');
 const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c);expect(salvo.torcida.Milan).toBe(62);await page.reload();await page.getByRole('button',{name:/Continuar · Jornada UI/}).click();await page.locator('.jr-reacao>summary').click();await expect(page.getByRole('button',{name:/Reconhecer a torcida/})).toHaveCount(0);await expect(page.locator('.dj-escolhas button').first()).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('história das duplas mostra rota e memórias registradas com acesso por teclado',async({page})=>{
 const c=jogador();c.jornada.duplas=[{id:'dupla1',nome:'Caio Nunes',clube:'Milan',conexao:3,temporadas:4,reencontros:1,nascimento:2010,rota:[{ano:2034,clube:'Santos'},{ano:2039,clube:'Milan'}]}];c.jornada.memorias=[{id:'dupla:t1',tipo:'dupla',ano:2037,titulo:'Uma taça em parceria',texto:'Você e Caio Nunes dividiram o Brasileirão.'}];
 await abrir(page,c);await page.locator('.jr-painel>details>summary').click();await page.getByRole('button',{name:'História das duplas'}).click();const modal=page.getByRole('dialog',{name:'Quem dividiu o caminho'});await expect(modal).toContainText('2034');await expect(modal).toContainText('2039');await expect(modal).toContainText('Brasileirão');await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);
});

for(const [width,height]of[[320,568],[1366,640]])test(`comemoração bem sucedida mantém continuar na tela em ${width}×${height}`,async({page})=>{
 await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});const c=jogador();
 const momento={tipo:'copa',mini:'penalti',nome:'Copa do Brasil',titulo:'O primeiro gol decisivo',texto:'Final',ordem:1,total:1,adversario:{tipo:'clube',nome:'Flamengo'}};const card={ano:c.ano,pendente:momento,filaMomentos:[],momentos:[],titulos:[],jogos:30,gols:0,assist:0};await abrir(page,c,{etapa:'momento',card});
 await page.evaluate(()=>{Math.random=()=>0;});const indice=prepararDecisaoJogo(c,momento).opcoes.findIndex(op=>op.acao==='finalizar');await page.locator('.dj-escolhas button').nth(indice).click();await expect(page.locator('.jr-festa-estreia')).toBeVisible();const b=await page.locator('.dj-continuar').boundingBox();expect(b.y).toBeGreaterThan(0);expect(b.y+b.height).toBeLessThanOrEqual(height);await page.screenshot({path:`/tmp/jornada-comemoracao-${width}.png`});
});

test('história do rival diferencia lances, transferência e prêmio sem presumir resultado antigo',async({page})=>{
 const c=jogador();c.jornada={...c.jornada,rivalMemorias:[{ano:2037,clube:'Porto',confronto:true},{ano:2038,clube:'Porto',confronto:true,acertou:false},{ano:2039,clube:'Santos',transferencia:{de:'Porto',para:'Santos'},premio:5,gols:12,assist:7}]};
 await page.setViewportSize({width:320,height:568});await abrir(page,c);await page.locator('.jr-painel>details>summary').click();const historia=page.getByText('Seu rival tem história',{exact:true}).locator('..');await historia.locator('summary').click();await expect(historia).toContainText('confronto registrado');await expect(historia).toContainText('sua oportunidade escapou');await expect(historia).toContainText('Porto → Santos');await expect(historia).toContainText('5º na Bola de Ouro');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
