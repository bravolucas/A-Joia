import {CLUBES} from '../dados/data.js';
import {calcOVR} from '../comum/lib.js';
import {penalidadePosicao} from './posicoesCarreira.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=s=>[...String(s)].reduce((n,v)=>Math.imul(n^v.charCodeAt(0),16777619)>>>0,2166136261);
const atual=c=>c.emprestimo?.destino||c.clubeNome;
const clube=n=>CLUBES.find(c=>c.nome===n)||{nome:n,forca:65};
export const PLANOS_ESPACO=[
 {id:'competir',nome:'Conquistar a titularidade',texto:'Busque minutos agora. +4 pontos de participação; confiança depende do desempenho.',share:.04,evolucao:1},
 {id:'aprender',nome:'Aceitar rotação e evoluir',texto:'Menos minutos no início (−3 pontos), com evolução até 8% maior.',share:-.03,evolucao:1.08},
 {id:'responsabilidade',nome:'Pedir responsabilidade',texto:'Até +7 pontos de participação, mas uma temporada abaixo de 6,5 reduz mais a confiança.',share:.07,evolucao:.98}
];
const PROJETOS=[
 {id:'base',nome:'Geração da base',texto:'O clube abre espaço para jovens e aceita uma curva de aprendizado.',vantagem:'Mais oportunidade até os 23 anos.',limite:'A equipe ainda busca regularidade.'},
 {id:'experiencia',nome:'Elenco experiente',texto:'Um núcleo consolidado cobra leitura e consistência.',vantagem:'Veteranos encontram apoio para render.',limite:'O jovem precisa disputar espaço.'},
 {id:'reconstrucao',nome:'Reconstrução',texto:'O clube procura novas referências para um ciclo de três anos.',vantagem:'Existe espaço para assumir responsabilidade.',limite:'A confiança oscila mais com resultados ruins.'},
 {id:'titulos',nome:'Cobrança por títulos',texto:'O resultado imediato pesa; a concorrência por minutos é maior.',vantagem:'Chance de disputar grandes objetivos.',limite:'Pouca tolerância a desempenho baixo.'}
];
export function projetoDoClube(nome,ano){
 const x=clube(nome),ciclo=Math.floor((Number(ano)||2026)/3);let id=hash(`${nome}:${ciclo}`)%3;if(x.forca>=82&&hash(nome+ciclo)%3!==0)id=3;
 return {...PROJETOS[id],clube:nome,inicio:ciclo*3,fim:ciclo*3+2};
}
export function patamarCarreira(c){
 const temporadas=c.temporadas||[],jogos=c.totais?.jogos||temporadas.reduce((n,t)=>n+(t.jogos||0),0);
 if(c.idade>=32)return{id:'veterano',nome:'Veterano',texto:'Experiência, liderança e reinvenção passam a marcar sua carreira.'};
 if((c.fama||0)>=70&&jogos>=100)return{id:'estrela',nome:'Estrela',texto:'Seu nome atrai expectativa e responsabilidade.'};
 if(jogos>=100)return{id:'consolidado',nome:'Consolidado',texto:'Você já tem uma trajetória; agora busca deixar sua marca.'};
 if(jogos>=25||temporadas.length>=2)return{id:'ascensao',nome:'Em ascensão',texto:'Cada oportunidade pode ampliar seu espaço.'};
 return{id:'primeiro',nome:'Primeiro contrato',texto:'Do primeiro armário ao primeiro jogo: sua história está começando.'};
}
export function iniciarProjetoChegada(c,{renovar=false,nome=atual(c)}={}){
 c.jornada=c.jornada||{};const j=c.jornada;j.espacoClubes=j.espacoClubes||{};
 if(!j.espacoClubes[nome])j.espacoClubes[nome]={clube:nome,confianca:50,plano:null,desde:c.ano};
 const e=j.espacoClubes[nome];if(renovar)e.plano=null;
 return e;
}
export function definirPlanoEspaco(c0,id){
 const plano=PLANOS_ESPACO.find(p=>p.id===id);if(!plano)throw Error('Escolha uma postura válida para disputar espaço.');
 const c=structuredClone(c0),e=iniciarProjetoChegada(c);if(e.plano)throw Error('A postura desta chegada já foi escolhida.');
 if(c.lojaAnoEmCurso===c.ano)throw Error('Escolha sua postura antes de iniciar a temporada.');
 e.plano=id;e.escolhidoEm=c.ano;e.confianca=clamp(e.confianca??50,25,80);
 const j=c.jornada;j.ecos=j.ecos||[];const eco={id:`espaco:${c.ano}:${atual(c)}`,origem:c.ano,ano:c.ano+1,clube:atual(c),titulo:plano.nome,escolha:plano.nome,eixo:'vinculo'};
 if(!j.ecos.some(x=>x.origem===c.ano))j.ecos.push(eco);
 return c;
}
export function prepararProjetoTemporada(c){
 const j=c.jornada||(c.jornada={});if(j.projetoPreparado===c.ano)return;j.projetoPreparado=c.ano;
 const e=iniciarProjetoChegada(c),p=PLANOS_ESPACO.find(p=>p.id===e.plano),contexto=projetoDoClube(atual(c),c.ano);c.mod=c.mod||{};
 const bonusConfianca=clamp(((e.confianca??50)-50)*.001,-.04,.04);
 let extra=p?.share||0,evolucao=p?.evolucao||1;
 if(contexto.id==='base'&&c.idade<=23){extra+=.025;evolucao*=1.03;}
 if(contexto.id==='experiencia')extra+=c.idade>=30?.025:c.idade<=21?-.015:0;
 if(contexto.id==='reconstrucao'&&p?.id==='responsabilidade')extra+=.01;
 if(contexto.id==='titulos'&&(e.confianca??50)<40)extra-=.025;
 c.mod.shareAdd=(c.mod.shareAdd||0)+clamp(extra+bonusConfianca,-.07,.1);
 c.mod.evolucao=(c.mod.evolucao??1)*clamp(evolucao,.96,1.12);
 j.projetoAtual=contexto;
}
export function quadroTitularidade(c){
 const nome=atual(c),e=c.jornada?.espacoClubes?.[nome],ovr=c._ovrProjeto??Math.max(40,calcOVR({...c.attrs,fintas:3,pernaRuim:3},c.posicao)-penalidadePosicao(c)),dif=ovr-clube(nome).forca;
 const confianca=e?.confianca??50,share=dif>=6?.95:dif>=0?.86:dif>=-4?.6:dif>=-9?.32:.12;
 const plano=PLANOS_ESPACO.find(p=>p.id===e?.plano);
 return {clube:nome,confianca,papel:confianca>=75&&dif>=0?'Referência':dif>=0?'Briga pela titularidade':dif>=-4?'Rotação':'Busca por espaço',plano:plano?.nome||'Ainda sem postura definida',projecao:Math.round(48*clamp(share+(plano?.share||0)+clamp((confianca-50)*.001,-.04,.04),.04,1)),projeto:projetoDoClube(nome,c.ano)};
}
const REPUTACOES={decisivo:'Decisivo',criador:'Criador',lider:'Líder',defensor:'Especialista defensivo',grandes:'Jogador de grandes jogos'};
export function reputacaoDeEstilo(c){
 const r=c.jornada?.reputacaoEstilo||{};return Object.entries(REPUTACOES).map(([id,nome])=>({id,nome,pontos:Math.min(100,r[id]||0)})).sort((a,b)=>b.pontos-a.pontos).filter(x=>x.pontos>0);
}
export function fecharProjetoTemporada(c,card){
 const j=c.jornada||(c.jornada={});if(j.projetoFechado===card.ano)return;j.projetoFechado=card.ano;
 const e=iniciarProjetoChegada(c),antes=e.confianca??50,boa=card.jogos>=15&&card.nota>=7,ruim=card.jogos>=8&&card.nota<6.5;
 const delta=boa?8:ruim?(e.plano==='responsabilidade'?-12:-7):card.jogos>=10?2:0;e.confianca=clamp(antes+delta,0,100);
 card.protagonismo={...quadroTitularidade(c),confiancaAntes:antes,confiancaDepois:e.confianca,delta,projeto:projetoDoClube(card.clube,card.ano)};
 const r=j.reputacaoEstilo||(j.reputacaoEstilo={}),momentos=card.momentos||[],decisoes=momentos.filter(m=>m.acertou),finais=decisoes.filter(m=>['copa','continental','mundial','selecao'].includes(m.tipo));
 const ganhos={decisivo:(card.gols>=10?4:0)+decisoes.filter(m=>['finalizar','driblar'].includes(m.decisaoJogo?.acao)||['falta','cabeceio','penalti'].includes(m.mini)).length*3,criador:(card.assist>=5?4:0)+decisoes.filter(m=>m.decisaoJogo?.acao==='passe'||['passe','cruzamento'].includes(m.mini)).length*3,lider:j.capitao?.clube===card.clube?6:card.jogos>=20&&card.nota>=7?1:0,defensor:(['GOL','ZAG','VOL','LD','LE','ALE','ALD'].includes(card.posicao)&&card.nota>=7?4:0)+decisoes.filter(m=>m.decisaoJogo?.acao==='defender'||['defesa','reflexo','interceptacao'].includes(m.mini)).length*3,grandes:Math.min(9,finais.length*3)};
 for(const [id,n]of Object.entries(ganhos))r[id]=clamp((r[id]||0)+n,0,100);
 card.reputacaoEstilo=reputacaoDeEstilo(c);const patamar=patamarCarreira(c);
 j.capitulos=j.capitulos||[];if(!j.capitulos.some(x=>x.id===patamar.id)){const cap={...patamar,ano:card.ano,clube:card.clube};j.capitulos.push(cap);card.novoPatamar=cap;}
 card.patamar=patamar;
 if(!j.ecos?.some(x=>x.origem===card.ano)){
  const decisiva=momentos.find(m=>m.decisaoJogo);const pre=card.pretemporada;
  if(decisiva||pre){j.ecos=j.ecos||[];j.ecos.push({id:`eco-jogo:${card.ano}:${card.clube}`,origem:card.ano,ano:card.ano+1+(hash(c.codigo+card.ano)%2),clube:card.clube,titulo:decisiva?.decisaoJogo.nome||pre.nome,escolha:decisiva?.decisaoJogo.nome||pre.nome,eixo:decisiva?'trajetoria':'preparo'});j.ecos=j.ecos.slice(-12);}
 }
}
export function retrospectivaCarreira(c){
 const ts=c.temporadas||[];if(!ts.length)return[];
 const primeiro=ts[0],ultimo=ts.at(-1),porClube=new Map();for(const t of ts){const p=porClube.get(t.clube)||{clube:t.clube,jogos:0,titulos:0,anos:[]};p.jogos+=t.jogos||0;p.titulos+=(t.titulos||[]).filter(x=>!['bolaOuro','botaOuro','copaMundo','continentalSelecao'].includes(x.tipo)).length;p.anos.push(t.ano);porClube.set(t.clube,p);}
 const marco=[...porClube.values()].sort((a,b)=>(b.titulos*30+b.jogos*.25+(c.torcida?.[b.clube]||0))-(a.titulos*30+a.jogos*.25+(c.torcida?.[a.clube]||0)))[0];
 return [{id:'origem',titulo:'Onde tudo começou',clube:primeiro.clube,ano:primeiro.ano,texto:`${primeiro.jogos||0} jogos na primeira temporada registrada. Camisa ${primeiro.numero||'não registrado'}.`},{id:'marca',titulo:'Onde deixou sua marca',clube:marco.clube,ano:marco.anos[0],texto:`${marco.anos.length} temporada(s), ${marco.jogos} jogos e ${marco.titulos} título(s) pelo clube.`},{id:'despedida',titulo:'Como encerrou a história',clube:ultimo.clube,ano:ultimo.ano,texto:`${ultimo.idade||c.idade} anos na última temporada. ${c.jornada?.trocas?.length?'Uma carreira que também soube se reinventar.':'A última camisa fecha uma trajetória própria.'}`}];
}
