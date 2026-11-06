import {compararMarcasCopas} from './recordesHistoricos.js';
import {consolidarElencoCopa} from './elencoSelecao.js';
import {CLUBES,LIGAS} from './data.js';
import {calcOVR} from './lib.js';
import {IDENTIDADES_POSICAO,fecharAdaptacaoPosicao,penalidadePosicao} from './posicoesCarreira.js';

const copiar=x=>JSON.parse(JSON.stringify(x));
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const hash=s=>[...String(s)].reduce((n,v)=>Math.imul(n^v.charCodeAt(0),16777619)>>>0,2166136261);
const numero=n=>Number.isFinite(n)?n:0;
const PAISES={brasileirao:'Brasil',serieB:'Brasil',argentina:'Argentina',inglaterra:'Inglaterra',espanha:'Espanha',italia:'Itália',alemanha:'Alemanha',franca:'França',portugal:'Portugal',holanda:'Holanda',turquia:'Turquia',arabia:'Arábia Saudita',mls:'Estados Unidos',mexico:'México',japao:'Japão',belgica:'Bélgica'};
const clubeDe=n=>{const x=CLUBES.find(x=>x.nome===n)||{nome:n,liga:'',forca:60};return {...x,pais:x.pais||PAISES[x.liga.replace(/2$/,'')]||x.liga};};
const clubeAtual=c=>c.emprestimo?.destino||c.clubeNome;
const semPremio=t=>!['bolaOuro','botaOuro'].includes(t.tipo);
const NOMES=['Caio Nunes','Mateo Duarte','André Lemos','Davi Monteiro','Rafael Vidal','Gabriel Costa','Nicolas Reis','Bruno Azevedo'];
export const ASSINATURAS=[
 {id:'cruzador',nome:'Cruzamento preciso',meta:3,descricao:'Três temporadas contribuindo pelo corredor ou decidindo cruzamentos.',efeito:'+3% em assistências · uma assinatura ativa.'},
 {id:'vertical',nome:'Passe que quebra linhas',meta:3,descricao:'Três temporadas com criação de chances ou passes decisivos.',efeito:'+3% em assistências · uma assinatura ativa.'},
 {id:'antecipador',nome:'Leitura de jogo',meta:3,descricao:'Três temporadas defendendo bem ou cortando o último passe.',efeito:'+0,06 na nota · uma assinatura ativa.'},
 {id:'decisivo',nome:'Frieza na área',meta:3,descricao:'Três temporadas com gols ou finalizações decisivas.',efeito:'+3% em gols · uma assinatura ativa.'},
 {id:'paredao',nome:'Mãos decisivas',meta:3,descricao:'Três temporadas de goleiro com boa nota ou defesas decisivas.',efeito:'+0,06 na nota · uma assinatura ativa.'},
 {id:'aereo',nome:'Tempo de bola',meta:3,descricao:'Decidir cabeceios em três temporadas diferentes.',efeito:'Mais tolerância no tempo do cabeceio · uma assinatura ativa.'},
];
export function iniciarJornada(c){
 if(!c.jornada||typeof c.jornada!=='object')c.jornada={};
 const j=c.jornada;j.versao=1;j.posicaoInicial=j.posicaoInicial||c.posicao;
 for(const k of ['memorias','ecos','duplas','rivalMemorias','relatoriosEmprestimo','interesses','reacoesReencontro'])if(!Array.isArray(j[k]))j[k]=[];
 j.duplas=j.duplas.filter(d=>d&&typeof d==='object'&&d.clube).map(d=>({...d,rota:Array.isArray(d.rota)&&d.rota.length?d.rota:[{ano:c.ano,clube:d.clube}],temporadas:numero(d.temporadas),conexao:clamp(numero(d.conexao),0,4),reencontros:numero(d.reencontros),nascimento:Number.isFinite(d.nascimento)?d.nascimento:c.ano-c.idade+1}));
 j.idiomas=Array.isArray(j.idiomas)?j.idiomas:[idiomaClube(c.primeiroClube||c.clubeNome)];
 j.assinaturas=j.assinaturas&&typeof j.assinaturas==='object'?j.assinaturas:{};
 j.primeiros=j.primeiros&&typeof j.primeiros==='object'?j.primeiros:{};
 j.preferencia=['jogar','titulos','salario'].includes(j.preferencia)?j.preferencia:'jogar';
 return j;
}
export function memorizar(c,tipo,titulo,texto,{id,clube=clubeAtual(c),ano=c.ano,numeroCamisa=c.numero,...outros}={}){
 const j=iniciarJornada(c),chave=id||`${tipo}:${ano}:${clube}:${titulo}`;
 if(j.memorias.some(m=>m.id===chave))return null;
 const m={id:chave,tipo,titulo,texto,clube,ano,numero:numeroCamisa,posicao:c.posicao,...outros};
 j.memorias=[...j.memorias,m].slice(-120);return m;
}
function primeiro(c,id,titulo,texto,card){
 const j=iniciarJornada(c);if(j.primeiros[id])return;
 const condicoes={estreia:t=>t.jogos>0,'primeiro-gol':t=>t.gols>0,'primeira-assistencia':t=>t.assist>0,titulo:t=>t.titulos?.some(semPremio),convocacao:t=>t.selecao?.convocado||t.copa?.convocado,'estreia-selecao':t=>(t.selecao?.jogos||0)>0,'primeira-defesa':t=>t.momentos?.some(m=>['defesa','reflexo'].includes(m.mini)&&m.acertou),'primeira-recuperacao':t=>t.momentos?.some(m=>m.mini==='interceptacao'&&m.acertou),'primeiro-cruzamento':t=>t.momentos?.some(m=>m.mini==='cruzamento'&&m.acertou)};
 const anterior=condicoes[id]?(c.temporadas||[]).find(condicoes[id]):null,origem=anterior||card;
 const m=memorizar(c,'primeiro',titulo,anterior?`Registro da temporada ${origem.ano} pelo ${origem.clube}.`:texto,{id:`primeiro:${id}`,ano:origem.ano,clube:origem.clube,numeroCamisa:origem.numero??c.numero});
 j.primeiros[id]=m||{ano:origem.ano,clube:origem.clube};if(m&&!anterior)card.jornada.memorias.push(m);
}
export function registrarEscolhaJornada(c,evento,opcao,texto){
 const j=iniciarJornada(c);if(evento.id==='base'){
  j.mentor=j.mentor||{nome:`Prof. ${NOMES[hash(c.codigo)%NOMES.length]}`,clube:c.primeiroClube,clubeAtual:c.primeiroClube,ficticio:true};
  const m=memorizar(c,'primeiro','Primeiro contrato',`Seu primeiro orientador, ${j.mentor.nome}, recebeu você no ${c.primeiroClube}.`,{id:'primeiro:contrato'});if(m)j.primeiros.contrato=m;return;
 }
 const id=`escolha:${c.ano}:${evento.id}`;
 if(j.ecos.some(e=>e.id===id)||j.memorias.some(m=>m.id===id))return;
 memorizar(c,'escolha',evento.titulo,texto,{id});
 const eixo=/mentor|grupo|coletivo|humilde|casa|ficar/.test(opcao.id)?'vinculo':/forcar|provoc|traicao|agressivo/.test(opcao.id)?'pressao':/trein|fisio|sono|dieta|recup/.test(evento.id+opcao.id)?'preparo':'trajetoria';
 if(j.ecos.some(e=>e.origem===c.ano))return;
 j.ecos=[...j.ecos,{id,origem:c.ano,ano:c.ano+1+(hash(id+c.codigo)%2),clube:clubeAtual(c),titulo:evento.titulo,escolha:opcao.label,eixo}].slice(-12);
}
export function ativarAssinatura(c0,id){
 const c=copiar(c0),j=iniciarJornada(c);
 if(id!==null&&!ASSINATURAS.some(s=>s.id===id&&(j.assinaturas[id]?.anos||[]).length>=s.meta))throw new Error('Assinatura ainda não conquistada.');
 if(c.lojaAnoEmCurso===c.ano)throw new Error('Troque a assinatura entre temporadas.');
 j.assinaturaAtiva=id;return c;
}
export function definirPreferenciaMercado(c0,id){if(!['jogar','titulos','salario'].includes(id))throw new Error('Preferência inválida.');const c=copiar(c0);iniciarJornada(c).preferencia=id;return c;}
const IDIOMAS={Brasil:'Português',Portugal:'Português',Angola:'Português',Argentina:'Espanhol',Uruguai:'Espanhol',Colômbia:'Espanhol',Colombia:'Espanhol',México:'Espanhol',Espanha:'Espanhol',Chile:'Espanhol',Inglaterra:'Inglês','Estados Unidos':'Inglês',EUA:'Inglês',Escócia:'Inglês',Irlanda:'Inglês',Alemanha:'Alemão',Áustria:'Alemão',França:'Francês',Itália:'Italiano',Holanda:'Holandês',Bélgica:'Francês',Turquia:'Turco',Japão:'Japonês','Arábia Saudita':'Árabe'};
export const idiomaClube=nome=>IDIOMAS[clubeDe(nome).pais]||clubeDe(nome).pais||'Idioma local';
export function projetoOferta(c,nome){
 const x=clubeDe(nome),ovr=c.attrs?Math.max(40,calcOVR({...c.attrs,fintas:3,pernaRuim:3},c.posicao)-penalidadePosicao(c)):60;
 // O jogo fornece seu OVR ponderado para os cartões de oferta quando disponível.
 const nivel=c._ovrProjeto??ovr,dif=nivel-x.forca;
 const share=dif>=6?.92:dif>=0?.75:dif>=-5?.52:.3;
 return{papel:dif>=6?'Protagonista':dif>=0?'Disputa a titularidade':dif>=-5?'Rotação com oportunidade':'Desenvolvimento',jogos:[Math.max(5,Math.round(48*share)-6),Math.min(52,Math.round(48*share)+6)],liga:x.liga,forca:x.forca,forcaLiga:Math.round((LIGAS[x.liga]?.mult??.7)*100),idioma:idiomaClube(nome),mensagem:'Projeção, sujeita a desempenho, adaptação e lesões.'};
}
export function pesoProjeto(c,destino){
 const j=c.jornada||{},atual=clubeDe(clubeAtual(c)),pref=j.preferencia||'jogar';let peso=1;
 if(atual.pais&&destino.pais===atual.pais)peso*=1.22;
 else if(idiomaClube(destino.nome)===idiomaClube(atual.nome))peso*=1.12;
 const a=c.attrs||{},media=(a.passe+a.fisico+a.finalizacao+a.defesa+a.drible+a.velocidade)/6,nivel=c._ovrProjeto??(Number.isFinite(media)?media:60);
 if(pref==='jogar')peso*=destino.forca<=nivel+2?1.35:.85;
 if(pref==='titulos')peso*=destino.forca>=78?1.35:1;
 if(pref==='salario')peso*=destino.forca>=80||destino.liga==='arabia'?1.3:1;
 if(c.idade>=32&&destino.nome===c.primeiroClube)peso*=1.8;
 if(j.duplas?.some(d=>!d.aposentado&&d.clube===destino.nome))peso*=1.4;
 return peso;
}
export function memoriaTorcida(c,nome=clubeAtual(c)){
 const anos=(c.temporadas||[]).filter(t=>t.clube===nome),titulos=(c.lista||[]).filter(t=>t.clube===nome&&semPremio(t));
 const volta=(c.transferencias||[]).findLast(t=>t.para===nome&&anos.some(a=>a.ano<t.ano));
 const ruim=(c.transferencias||[]).findLast(t=>t.de===nome&&(['traicao','forcada'].includes(t.tipo)||t.cena?.tipo==='ruptura'));
 if(volta)return `A torcida lembra do seu retorno em ${volta.ano}${titulos.length?` e de ${titulos.length} título(s) juntos`:''}.`;
 if(titulos.length)return `A arquibancada guarda ${titulos[0].nome} ${titulos[0].ano}${titulos.length>1?` e mais ${titulos.length-1} conquista(s)`:''}.`;
 if(ruim)return `A saída em ${ruim.ano} deixou uma relação para reconstruir.`;
 return anos.length?`${anos.length} temporada(s) defendendo este clube fazem parte da sua história.`:'Uma relação que começa a ser construída em campo.';
}
export function cenaDespedida(c,t,saida){
 const anos=(c.temporadas||[]).filter(a=>a.clube===t.de),titulos=(c.lista||[]).filter(a=>a.clube===t.de&&semPremio(a)),torcida=c.torcida?.[t.de]??30;
 const tipo=t.tipo==='aposentadoria'?'aposentadoria':t.tipo==='retornoEmprestimo'?'retornoEmprestimo':t.tipo==='emprestimo'?'emprestimo':t.tipo==='traicao'||saida==='forcada'?'ruptura':titulos.length>=3&&torcida>=65?'estadio':t.de===c.primeiroClube&&anos.length>=1&&torcida>=45?'base':c.idade<=23&&clubeDe(t.para).forca>=clubeDe(t.de).forca+8?'ascensao':anos.length>=4&&torcida>=60?'homenagem':t.valor===0&&anos.length>=2?'imprensa':'vestiario';
 const dados={ascensao:['Uma porta se abriu','O próximo desafio é maior. A despedida leva a gratidão por quem abriu o caminho.'],aposentadoria:['Obrigado pelo futebol','A última volta pelo gramado reúne quem fez parte desta história.'],retornoEmprestimo:['Aprendizado na bagagem','O empréstimo terminou. Os jogos e a evolução ficam registrados no relatório de volta.'],emprestimo:['Até breve, não adeus','Uma temporada longe pode abrir espaço para crescer. O vínculo com a casa continua.'],ruptura:['Pela porta dos fundos','O fim do ciclo aconteceu longe da festa. Uma saída difícil deixa marcas.'],estadio:['Uma volta para agradecer',`A torcida aplaude a passagem de ${anos.length} temporadas e ${titulos.length} títulos.`],base:['O abraço de quem acreditou','No CT, o primeiro orientador se despede do garoto que viu começar.'],homenagem:['A casa reconhece sua história','Companheiros e funcionários se reúnem para agradecer os anos juntos.'],imprensa:['Palavras antes da partida','Diante dos microfones, você encerra um capítulo e agradece pelo caminho.'],vestiario:['Última passagem pelo vestiário','A mala está pronta. Restam os cumprimentos de quem dividiu o campo.']}[tipo];
 return{tipo,titulo:dados[0],texto:dados[1],clube:t.de,ano:t.ano,temporadas:anos.length,titulos,torcida};
}
export function registrarTransferenciaJornada(c,t,saida){
 const j=iniciarJornada(c),id=`transferencia:${t.ano}:${t.de}:${t.para}`;
 if(j.memorias.some(m=>m.id===id))return;
 t.cena=cenaDespedida(c,t,saida);
 const conhecidos=j.duplas.filter(d=>!d.aposentado&&d.clube===t.para);
 const paisIgual=clubeDe(t.de).pais===clubeDe(t.para).pais,idiomaIgual=idiomaClube(t.de)===idiomaClube(t.para)||j.idiomas.includes(idiomaClube(t.para));
 const retornou=(c.temporadas||[]).some(a=>a.clube===t.para);
 const total=paisIgual||retornou?1:idiomaIgual?1:2;
 j.ultimaMudanca=t;
 j.adaptacao={clube:t.para,de:t.de,idioma:idiomaClube(t.para),inicio:t.ano,total,restantes:retornou&&idiomaIgual?0:Math.max(1,total-(conhecidos.length?1:0)),continuidade:retornou,reuniao:conhecidos[0]?.nome||null};
 t.projeto=projetoOferta(c,t.para);
 t.primeiroDia={numero:c.numero,objetivo:`Conquistar espaço como ${IDENTIDADES_POSICAO[c.posicao]?.nome||c.posicao}`,clube:t.para};
 if(conhecidos.length){
  const dupla=conhecidos[0];
  t.reencontro={nome:dupla.nome,temporadas:dupla.temporadas,conexao:dupla.conexao,moral:5,torcida:3};dupla.reencontros=(dupla.reencontros||0)+1;dupla.ultimoReencontro=c.ano;
  c.moral=clamp((c.moral??65)+5);c.torcida[t.para]=clamp((c.torcida[t.para]??30)+3);
  memorizar(c,'dupla',`Reencontro com ${dupla.nome}`,`A parceria registrada volta no ${t.para}: +5 moral e +3 torcida. Entrosamento ajuda na adaptação.`,{id:`reencontro:${id}`,ficticio:true});
 }
 memorizar(c,'transferencia',`${t.de} → ${t.para}`,t.cena.texto,{id,clube:t.para});
}
export function prepararJornada(c){
 const j=iniciarJornada(c);if(j.preparado===c.ano)return;
 j.preparado=c.ano;c.mod=c.mod||{};
 const a=j.adaptacao;
 if(a?.clube===clubeAtual(c)&&a.restantes>0){c.mod.notaBonus=(c.mod.notaBonus||0)-.08;c.mod.shareAdd=(c.mod.shareAdd||0)-.025;}
 const dupla=j.duplas.find(d=>d.clube===clubeAtual(c)&&!d.aposentado&&d.conexao>=2);
 let bonus=dupla?Math.min(.06,dupla.conexao*.015):0;
 const assinatura=j.assinaturaAtiva;
 if(['cruzador','vertical'].includes(assinatura))c.mod.assistMult=(c.mod.assistMult??1)*1.03;
 if(assinatura==='decisivo')c.mod.golsMult=(c.mod.golsMult??1)*1.03;
 if(['paredao','antecipador'].includes(assinatura))bonus+=.06;
 if(j.capitao?.clube===clubeAtual(c))bonus+=.02;
 if(j.veterano?.estilo==='mentor')bonus+=.02;
 c.mod.notaBonus=(c.mod.notaBonus||0)+Math.min(.14,bonus);
}
function atualizarDuplas(c,card){
 const j=c.jornada,atual=card.clube;
 if(!j.duplas.some(d=>d.clube===atual&&!d.aposentado)&&j.duplas.length<3&&card.jogos>=12){
  const id=`dupla:${atual}:${card.ano}`,livres=NOMES.filter(n=>!j.duplas.some(d=>d.nome===n)),nome=livres[hash(c.codigo+id)%livres.length]||NOMES[0];
  j.duplas.push({id,nome,clube:atual,nascimento:card.ano-card.idade+1,conexao:0,temporadas:0,reencontros:0,rota:[{ano:card.ano,clube:atual}],ficticio:true});
 }
 for(const d of j.duplas){
  if(d.aposentado)continue;
  if(card.ano-d.nascimento>=38){d.aposentado=true;const texto=`${d.nome} pendurou as chuteiras. ${d.temporadas} temporada(s) juntos ficam na memória.`;card.jornada.noticias.push({tipo:'dupla',titulo:'Um parceiro se despede',detalhe:texto});memorizar(c,'dupla','A despedida de uma dupla',texto,{id:`dupla:aposentadoria:${d.id}`,ano:card.ano,ficticio:true});continue;}
  if(d.clube===atual&&card.jogos>=10){d.conexao=Math.min(4,d.conexao+1);d.temporadas++;if(d.temporadas===2)card.jornada.noticias.push({tipo:'dupla',titulo:`Uma dupla com ${d.nome}`,detalhe:'A parceria recorrente rende entrosamento, com bônus limitado a +0,06 na nota.'});}
  if(d.clube===atual&&d.temporadas>=2&&card.titulos?.some(semPremio)){
   const titulo=card.titulos.find(semPremio),texto=`Você e ${d.nome} dividiram ${titulo.nome} em ${card.ano}, pelo ${atual}.`;
   memorizar(c,'dupla','Uma taça em parceria',texto,{id:`dupla:titulo:${d.id}:${card.ano}`,ano:card.ano,clube:atual,ficticio:true});
   card.jornada.noticias.push({tipo:'dupla',titulo:'Uma taça em parceria',detalhe:texto});
  }
  if(d.clube!==atual&&(card.momentos||[]).some(m=>m.adversario?.nome===d.clube)){
   const texto=`${d.nome} estava no ${d.clube}, adversário desta decisão. A parceria de ${d.temporadas} temporada(s) agora cruza o outro lado do campo.`;
   memorizar(c,'dupla','Amigos, agora adversários',texto,{id:`dupla:adversario:${d.id}:${card.ano}`,ano:card.ano,ficticio:true});card.jornada.noticias.push({tipo:'dupla',titulo:'Amigos, agora adversários',detalhe:texto});
  }
  // Trajetória própria e determinística; um reencontro não teleporta o companheiro.
  if(card.ano-d.rota[0].ano>=2&&hash(c.codigo+d.id+card.ano)%4===0){
   const atualDados=clubeDe(d.clube),pool=CLUBES.filter(x=>x.nome!==d.clube&&Math.abs(x.forca-atualDados.forca)<=8);
   if(pool.length){const de=d.clube;d.clube=pool[hash(d.id+card.ano)%pool.length].nome;d.rota=[...d.rota,{ano:card.ano+1,clube:d.clube}].slice(-8);
    const texto=`${d.nome}: ${de} → ${d.clube} para a próxima temporada.`;card.jornada.noticias.push({tipo:'dupla',titulo:de===atual?'A dupla segue outro caminho':d.clube===atual?'Um rosto conhecido chega':'Notícia de um parceiro',detalhe:texto});
    memorizar(c,'dupla','O caminho de um parceiro',texto,{id:`dupla:mudanca:${d.id}:${card.ano}`,ano:card.ano,ficticio:true});
    if(d.clube===atual){d.reencontros++;d.ultimoReencontro=card.ano+1;c.moral=clamp((c.moral??65)+5);c.torcida[atual]=clamp((c.torcida[atual]??30)+3);card.jornada.noticias.push({tipo:'reencontro',titulo:`${d.nome} vem jogar com você`,detalhe:'O parceiro chega para a próxima temporada: +5 moral e +3 torcida, uma única vez.'});}
   }
  }
 }
}
export function fecharJornada(c,card){
 const j=iniciarJornada(c);if(j.fechado===card.ano)return;
 consolidarElencoCopa(c,card);
 j.fechado=card.ano;card.jornada={noticias:[],mensagens:[],memorias:[],assinaturas:[]};
 const n=card.jornada;
 const recordes=card.recordesUniverso||[];
 for(const r of recordes){const m=memorizar(c,'recorde-observado',r.titulo,r.texto,{id:`recorde:${r.escopo}:${r.metrica}:${card.ano}:${card.clube}`,ano:card.ano,clube:card.clube});if(m)n.memorias.push(m);}
 if(recordes.length)n.noticias.push({tipo:'recorde',titulo:recordes[0].titulo,detalhe:recordes[0].texto});

 for(const marca of compararMarcasCopas(c,card))for(const [etapa,ano]of [['igualou',marca.anoIgualou],['superou',marca.anoSuperou]]){
  if(ano==null)continue;
  const m=memorizar(c,'marca-historica',`${etapa==='igualou'?'Igualou':'Superou'} uma marca de ${marca.atleta}`,`${marca.nome}: referência histórica de ${marca.valor}, na base 1930–2022. Feito da sua carreira simulada.`,{id:`marca:${marca.id}:${etapa}`,ano,clube:'Seleção'});
  if(m&&ano===card.ano)n.memorias.push(m);
 }

 const due=j.ecos.filter(e=>e.ano<=card.ano);
 if(due.length){const e=due[0],mesmo=e.clube===card.clube,bonus=e.eixo==='vinculo'&&mesmo?2:e.eixo==='preparo'?1:0;
  if(bonus)c.moral=clamp((c.moral??65)+bonus);
  const detalhe=`A escolha “${e.escolha}”, feita em ${e.origem}, voltou à conversa${mesmo?' no mesmo clube':''}.${bonus?` +${bonus} moral.`:' Sua trajetória guarda essa decisão.'}`;
  n.noticias.push({tipo:'eco',titulo:`O eco de ${e.titulo}`,detalhe});memorizar(c,'eco','Uma escolha deixou marcas',detalhe,{id:`eco:${e.id}`,ano:card.ano,clube:card.clube});j.ecos=j.ecos.filter(x=>x.id!==e.id);
 }
 const funcao=IDENTIDADES_POSICAO[card.posicao||c.posicao]||IDENTIDADES_POSICAO.MC;
 n.noticias.push({tipo:'funcao',titulo:`${funcao.nome} no ${card.clube}`,detalhe:funcao.descricao});
 if(card.jogos>0)primeiro(c,'estreia','Primeira temporada em campo',`${card.jogos} jogos pelo ${card.clube}.`,card);
 if(card.gols>0)primeiro(c,'primeiro-gol','Primeiro gol registrado',`${card.gols} gol(s) na temporada ${card.ano}.`,card);
 if(card.assist>0)primeiro(c,'primeira-assistencia','Primeira assistência registrada',`${card.assist} assistência(s) em ${card.ano}.`,card);
 const momentos=card.momentos||[];
 for(const [mini,id,titulo]of [['defesa','primeira-defesa','Primeira defesa decisiva'],['reflexo','primeira-defesa','Primeira defesa decisiva'],['interceptacao','primeira-recuperacao','Primeira recuperação decisiva'],['cruzamento','primeiro-cruzamento','Primeiro cruzamento decisivo']])if(momentos.some(m=>m.mini===mini&&m.acertou))primeiro(c,id,titulo,`Lance registrado pelo ${card.clube} em ${card.ano}.`,card);
 if(card.titulos?.some(semPremio))primeiro(c,'titulo','Primeiro título',card.titulos.find(semPremio).nome,card);
 if(card.selecao?.convocado||card.copa?.convocado){
  primeiro(c,'convocacao','A primeira convocação',`Sua primeira lista registrada pela seleção.`,card);
  if((card.selecao?.jogos||0)>0)primeiro(c,'estreia-selecao','Estreia internacional','A camisa do país entrou na sua história.',card);
  n.geracao=atualizarGeracaoSelecao(c,card.ano);
 }
 const contrib={cruzador:['LD','LE','ALE','ALD','ME','MD','PE','PD'].includes(card.posicao||c.posicao)&&card.assist>=3||momentos.some(m=>m.mini==='cruzamento'&&m.acertou),vertical:card.assist>=5||momentos.some(m=>m.mini==='passe'&&m.acertou),antecipador:['ZAG','VOL'].includes(card.posicao||c.posicao)&&card.nota>=7||momentos.some(m=>m.mini==='interceptacao'&&m.acertou),decisivo:card.gols>=10||momentos.some(m=>['penalti','falta'].includes(m.mini)&&m.acertou),paredao:(card.posicao||c.posicao)==='GOL'&&(card.nota>=7||momentos.some(m=>['defesa','reflexo'].includes(m.mini)&&m.acertou)),aereo:momentos.some(m=>m.mini==='cabeceio'&&m.acertou)};
 for(const s of ASSINATURAS){if(!contrib[s.id])continue;const a=j.assinaturas[s.id]||{anos:[]};if(!a.anos.includes(card.ano))a.anos=[...a.anos,card.ano];j.assinaturas[s.id]=a;if(a.anos.length===s.meta){n.assinaturas.push(s.nome);if(!j.assinaturaAtiva)j.assinaturaAtiva=s.id;memorizar(c,'assinatura',s.nome,'Uma marca técnica conquistada em três temporadas distintas.',{ano:card.ano,id:`assinatura:${s.id}`});}}
 atualizarDuplas(c,card);
 const anosNoClube=(c.temporadas||[]).filter(a=>a.clube===card.clube).length+1;
 if(!(j.recusaCapitania?.ano===card.ano&&j.recusaCapitania?.clube===card.clube)&&anosNoClube>=3&&c.idade>=24&&(c.moral??65)>=50&&(c.torcida?.[card.clube]??0)>=60&&card.jogos>=20){
  const antes=j.capitao;j.capitao={clube:card.clube,desde:antes?.clube===card.clube?antes.desde:card.ano};
  if(antes?.clube!==card.clube){const m=memorizar(c,'capitao','A braçadeira pela trajetória',`${anosNoClube} temporadas e confiança da torcida fizeram de você uma referência.`,{id:`capitao:${card.clube}`,ano:card.ano,clube:card.clube});if(m)n.memorias.push(m);}
 }
 else if(j.capitao?.clube!==card.clube||(c.torcida?.[card.clube]??30)<35||card.jogos<5)j.capitao=null;
 for(const campo of ['gols','assist','nota']){const anteriores=(c.temporadas||[]).filter(t=>t.clube===card.clube);if(anteriores.length>=2&&card[campo]>Math.max(...anteriores.map(t=>t[campo]||0))){n.noticias.push({tipo:'recorde',titulo:`Sua melhor marca de ${campo==='assist'?'assistências':campo} no ${card.clube}`,detalhe:`${card[campo]} em ${card.ano}. Marca pessoal nesta carreira, não recorde histórico do clube.`});break;}}
 const repetiuLiga=(c.temporadas||[]).filter(t=>t.ligaId===card.ligaId);
 if(repetiuLiga.length>=3&&card.assist>Math.max(...repetiuLiga.map(t=>t.assist||0)))n.noticias.push({tipo:'recorde',titulo:'Sua melhor temporada de criação nesta liga',detalhe:`${card.assist} assistências · marca pessoal registrada.`});
 if(card.rival){const r=card.rival;const m={ano:card.ano,clube:r.clube,premio:r.bola&&r.bola<=20?r.bola:null,transferencia:r.mudou||null,gols:r.gols||0,assist:r.assist||0};j.rivalMemorias=[...j.rivalMemorias,m].slice(-8);}
 for(const m of momentos){
  const nome=m.adversario?.nome;if(!nome)continue;
  if((c.temporadas||[]).some(t=>t.clube===nome))n.noticias.push({tipo:'reencontro',titulo:`Contra o antigo ${nome}`,detalhe:`${m.acertou?'Você decidiu o lance.':'A oportunidade escapou.'} ${memoriaTorcida(c,nome)}`});
  if(c.rival?.clube===nome)j.rivalMemorias=[...j.rivalMemorias,{ano:card.ano,clube:nome,confronto:true,acertou:m.acertou}].slice(-8);
 }
 if(j.mentor){
  if(!j.mentor.promovido&&(c.temporadas||[]).length>=10){const origem=clubeDe(j.mentor.clube),pool=CLUBES.filter(x=>x.nome!==origem.nome&&Math.abs(x.forca-origem.forca)<=8);j.mentor.clubeAtual=pool[hash(c.codigo+':mentor')%pool.length]?.nome||j.mentor.clube;j.mentor.promovido=card.ano;j.mentor.funcao='Treinador principal';memorizar(c,'mentor',`${j.mentor.nome} assume um novo projeto`,`Seu orientador foi registrado como treinador do ${j.mentor.clubeAtual}.`,{id:'mentor:promocao',ano:card.ano});}
  const etapa=(c.temporadas||[]).length===0?'estreia':c.idade>=30&&!j.memorias.some(m=>m.id==='mentor:veterano')?'veterano':(c.temporadas||[]).length===5?'caminho':null;
  if(etapa){const texto=etapa==='estreia'?'Lembro do seu primeiro treino. Agora o campo conta a sua história.':etapa==='veterano'?'A velocidade muda. A leitura que você construiu pode abrir outro caminho.':'Você já percorreu muita estrada. Não esqueça quem jogava por prazer no começo.';n.mensagens.push({de:j.mentor.nome,texto,ficticio:true});memorizar(c,'mensagem',`Mensagem de ${j.mentor.nome}`,texto,{id:`mentor:${etapa}`,ano:card.ano});}
 }
 if(n.memorias.some(m=>m.id==='primeiro:convocacao'))n.mensagens.unshift({de:'Família',texto:'A lista saiu. O país vai ver o nome que a gente conhece desde pequeno.'});
 if(!card.lesao&&j.lesaoAnterior)n.mensagens.unshift({de:'Família',texto:'Bom ver você de volta ao campo. A recuperação também faz parte da sua história.'});
 if(card.lesao&&!j.lesaoAnterior)n.mensagens.push({de:'Família',texto:'O jogo pode esperar sua recuperação. Você tem gente torcendo fora do estádio.'});
 j.lesaoAnterior=!!card.lesao;n.mensagens=n.mensagens.slice(0,1);
 if(j.adaptacao?.clube===card.clube&&j.adaptacao.restantes>0){j.adaptacao.restantes--;n.adaptacao={...j.adaptacao};if(!j.adaptacao.restantes){j.idiomas=[...new Set([...j.idiomas,j.adaptacao.idioma])];}if(!j.adaptacao.restantes)card.destaques.push(`Adaptação ao ${card.clube} concluída. O desconto temporário terminou.`);}
 if(c.emprestimo&&(c.emprestimo.restantes??1)<=1){const e=c.emprestimo,anos=[...(c.temporadas||[]).filter(t=>t.ano>=e.inicio&&t.clube===e.destino),card];const jogos=anos.reduce((v,t)=>v+t.jogos,0);const rel={ano:card.ano,clube:e.destino,origem:e.origem||c.clubeNome,jogos,esperados:e.projeto?.jogos||null,ovrAntes:e.ovrInicio,ovrDepois:card.ovrDepois,temporadas:anos.length};j.relatoriosEmprestimo=[...j.relatoriosEmprestimo,rel].slice(-6);n.emprestimo=rel;}
 fecharAdaptacaoPosicao(c,card);
 n.memoriaTorcida=memoriaTorcida(c,card.clube);n.capitao=j.capitao?.clube===card.clube?{...j.capitao}:null;
 n.noticias=n.noticias.sort((a,b)=>(a.tipo==='funcao'?1:0)-(b.tipo==='funcao'?1:0)).slice(0,6);
}
export function legadoNarrativo(c){
 const ts=c.temporadas||[],clubes=[...new Set(ts.map(t=>t.clube))],idolos=Object.values(c.torcida||{}).filter(n=>n>=75).length,labels=[];
 if(idolos)labels.push({nome:'Ídolo local',motivo:`Identificação de ídolo em ${idolos} clube(s).`});
 if(clubes.length>=5)labels.push({nome:'Viajante do futebol',motivo:`Temporadas disputadas por ${clubes.length} clubes.`});
 if(c.jornada?.capitao||c.jornada?.memorias?.some(m=>m.tipo==='capitao'))labels.push({nome:'Líder de vestiário',motivo:'Recebeu a braçadeira pela trajetória e confiança.'});
 if(c.jornada?.trocas?.length)labels.push({nome:'Jogador reinventado',motivo:`${c.jornada.trocas.length} mudança(s) de posição real(is).`});
 if(ts.length>=15)labels.push({nome:'Longevidade',motivo:`${ts.length} temporadas como jogador.`});
 return labels.length?labels:[{nome:'Uma história própria',motivo:`${ts.length} temporada(s) e escolhas que ficaram na memória.`}];
}


// Núcleo narrativo por função: não substitui nem inventa estatísticas do motor da seleção.
export function atualizarGeracaoSelecao(c,ano=c.ano){
 const j=iniciarJornada(c),funcoes=['GOL','LD','ZAG','ZAG','LE','VOL','MC','MEI','PD','PE','ATA'];
 if(j.geracaoNac!==c.nac){j.geracao=[];j.geracaoNac=c.nac;j.exGeracao=[];}
 const antigos=Array.isArray(j.geracao)?j.geracao:[],saidas=antigos.filter(p=>ano-p.nascimento>37);
 j.exGeracao=[...(j.exGeracao||[]),...saidas.map(p=>({...p,saida:ano}))].slice(-22);
 const ativos=antigos.filter(p=>ano-p.nascimento<=37&&ano-p.nascimento>=18).slice(0,11);
 const usados=new Set(ativos.map(p=>p.slot).filter(Number.isInteger));
 ativos.forEach(p=>{if(!Number.isInteger(p.slot)){p.slot=funcoes.findIndex((_,i)=>!usados.has(i));usados.add(p.slot);}p.posicao=funcoes[p.slot];});
 for(let i=0;i<11;i++)if(!usados.has(i)){
  const seed=hash(`${c.codigo}:${c.nac}:${ano}:${i}`),nomes=['Caio','Mateo','André','Davi','Rafael','Gabriel','Nicolas','Bruno','Iago','Samuel','Leo','Daniel'],sobrenomes=['Nunes','Duarte','Lemos','Monteiro','Vidal','Costa','Reis','Azevedo','Pires','Mendes','Ramos','Alves'];
  let nome=`${nomes[seed%nomes.length]} ${sobrenomes[(seed>>>8)%sobrenomes.length]}`;
  if(ativos.some(p=>p.nome===nome))nome+=` ${sobrenomes[i]}`;
  ativos.push({id:`selecao:${c.nac}:${ano}:${i}`,slot:i,posicao:funcoes[i],nome,nascimento:ano-(saidas.length?18+seed%6:20+seed%12),desde:ano,ficticio:true});
 }
 j.geracao=ativos.sort((a,b)=>a.slot-b.slot);
 return j.geracao.map(p=>({...p,idade:ano-p.nascimento}));
}
export function contextoReencontro(c,momento){
 const nome=momento?.adversario?.nome;
 if(!nome||momento.adversario.tipo==='selecao')return null;
 const passagens=(c.temporadas||[]).filter(t=>t.clube===nome);
 if(!passagens.length)return null;
 const id=`${c.ano}:${nome}`,reacao=c.jornada?.reacoesReencontro?.find(r=>r.id===id);
 return {id,clube:nome,temporadas:passagens.length,lembranca:memoriaTorcida(c,nome),reacao};
}
export function reagirReencontro(c,momento,tipo){
 const contexto=contextoReencontro(c,momento);if(!contexto||contexto.reacao||!['respeito','foco'].includes(tipo))return c;
 const novo=copiar(c),j=iniciarJornada(novo);
 const texto=tipo==='respeito'?`Você reconheceu a antiga torcida do ${contexto.clube}. +2 de carinho com esse clube.`:'Você concentrou a energia no clube atual. +2 moral.';
 if(tipo==='respeito'){novo.torcida=novo.torcida||{};novo.torcida[contexto.clube]=clamp((novo.torcida[contexto.clube]??30)+2);}else novo.moral=clamp((novo.moral??65)+2);
 j.reacoesReencontro=[...j.reacoesReencontro,{id:contexto.id,ano:c.ano,clube:contexto.clube,tipo,texto}].slice(-30);
 memorizar(novo,'reencontro','Reencontro com o antigo clube',texto,{id:`reacao:${contexto.id}`,clube:contexto.clube});return novo;
}
export function celebracaoMomento(c,momento){
 const adv=momento?.adversario?.nome,mini=momento?.mini;
 if(adv&&(c.temporadas||[]).some(t=>t.clube===adv))return{tipo:'reencontro',titulo:'Respeito pela história',texto:'Um lance decisivo diante do antigo clube.'};
 if(['defesa','reflexo'].includes(mini))return{tipo:'defesa',titulo:'Mãos que decidem',texto:'A defesa também escreve uma carreira.'};
 if(['interceptacao'].includes(mini))return{tipo:'defesa',titulo:'Leitura que decide',texto:'Você protegeu o time no lance decisivo.'};
 if(['passe','cruzamento'].includes(mini))return{tipo:'parceria',titulo:'O gol começou no seu passe',texto:'Uma decisão construída em equipe.'};
 if(!c.totais?.gols&&(momento?.ordem||1)===1)return{tipo:'estreia',titulo:'A primeira rede',texto:'O começo de uma história de gols.'};
 if(momento?.tipo&&['liga','copa','continental','mundial'].includes(momento.tipo))return{tipo:'titulo',titulo:'Um lance pela taça',texto:'A decisão ganhou a sua marca.'};
 return{tipo:'decisao',titulo:'Seu momento',texto:'Você fez a diferença.'};
}
