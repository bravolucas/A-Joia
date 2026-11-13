import {CLUBES,LIGAS,NACIONALIDADES,ANO_INICIO,ESTADUAIS} from '../dados/data.js';
import {eventosConhecidos,nomeCanonico,acervoInicial,galeriaClube} from './historiaFutebol.js';
const nacional=nome=>/Copa do Mundo|Eurocopa|Copa América|Copa Africana|Copa da Ásia|Copa Ouro|Nações da Oceania/i.test(nome||'');
const nomeComp=nome=>/^Copa do Mundo\b/i.test(nome||'')?'Copa do Mundo':nomeCanonico(nome);
/** Consulta os resultados já registrados, sem sortear campeões para lacunas do save. */
export function campeoesRegistrados(c={},temporadas=c.temporadas||[]){
 const pendentes=new Set();
 for(const a of [...temporadas,...(Array.isArray(c.tecnico?.temporadas)?c.tecnico.temporadas:[])])for(const t of a.torneios||[])if(t.finalPendente)pendentes.add(`${a.ano}|${nomeComp(t.nome)}`);
 for(const cp of c.tecnico?.copasEmJogo?.campeonatos||[])if(cp.fase!=='fim'||cp.resultado)pendentes.add(`${cp.ano}|${nomeComp(cp.nome)}`);
 const mapa=new Map(),inserir=e=>{if(!e?.clube||!e.nome||!Number.isFinite(e.ano)||e.pendente||/bola.?ouro|bota.?ouro|premio|yashin|artilheiro|revelacao|melhor/i.test(e.tipo||'')||/^(Bola de Ouro|Bota de Ouro|Yashin)$/i.test(e.nome))return;const nome=nomeComp(e.nome),id=`${e.ano}|${nome}`;mapa.set(id,{...e,nome,selecao:nacional(nome)});};
 for(const e of eventosConhecidos(c,temporadas))inserir(e);
 const nacao=NACIONALIDADES.find(n=>n.id===(c.nac||c.nacionalidade))?.label||c.nac||c.nacionalidade;
 for(const a of [...temporadas,...(Array.isArray(c.tecnico?.temporadas)?c.tecnico.temporadas:[])]){
  const ano=a.ano??(Number.isFinite(a.idade)?ANO_INICIO+a.idade-16:null),eu=a.tipoEquipe==='selecao'?a.clube:nacao;
  for(const copa of a.torneios||[])if(copa.campeao&&!copa.finalPendente)inserir({ano,nome:copa.nome,clube:copa.campeao,tipo:copa.tipo,voce:copa.campeao===(copa.selecao||a.clube)});
  for(const t of a.titulos||[])if(typeof t==='object'&&['copaMundo','continentalSelecao'].includes(t.tipo))inserir({ano,nome:t.nome,clube:eu,tipo:t.tipo,voce:true});
  if(a.tipoEquipe==='selecao')for(const nome of a.titulosConquistados||[])inserir({ano,nome,clube:eu,voce:true});
  for(const r of [a.copaResultado,a.continentalSelecaoResultado,a.copa])if(r?.titulo||r?.campeao===true)inserir({ano,nome:r.nome||'Copa do Mundo',clube:eu,tipo:r.tipo||'copaMundo',voce:true});
 }
 for(const t of c.lista||[])if(t.clube&&t.clube!=='Individual'&&(nacional(t.nome)||CLUBES.some(cl=>cl.nome===t.clube)))inserir({...t,voce:true});
 return [...mapa.entries()].filter(([id])=>!pendentes.has(id)).map(([,e])=>e).sort((a,b)=>b.ano-a.ano||a.nome.localeCompare(b.nome));
}
export function competicoesDisponiveis(c={},temporadas){
 const nomes=new Set(['Champions League','Libertadores','Copa do Mundo','Eurocopa','Copa América','Copa Africana de Nações','Copa da Ásia','Copa Ouro','Copa das Nações da Oceania']);
 for(const estadual of Object.values(ESTADUAIS)){const nome=typeof estadual==='string'?estadual:estadual.nome;if(nome)nomes.add(nome);}
 for(const liga of Object.values(LIGAS))if(!liga.naoJogavel&&liga.nome)nomes.add(nomeComp(liga.nome));
 for(const clube of CLUBES)for(const t of acervoInicial(clube.nome).tacas)if(t.nome)nomes.add(nomeComp(t.nome));
 for(const e of campeoesRegistrados(c,temporadas))nomes.add(e.nome);
 return [...nomes].filter(n=>n&&n!=='Títulos continentais').sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
export function galeriaCompeticao(c={},nome,temporadas){
 nome=nomeComp(nome);const edicoes=campeoesRegistrados(c,temporadas).filter(e=>e.nome===nome),selecao=nacional(nome),times=new Set(edicoes.map(e=>e.clube));
 if(!selecao)for(const clube of CLUBES){const a=acervoInicial(clube.nome);if(a.conhecido&&a.tacas.some(t=>nomeComp(t.nome)===nome&&t.inicial>0))times.add(clube.nome);}
 const ranking=[...times].map(clube=>{const a=acervoInicial(clube),g=!selecao?galeriaClube(c,clube,temporadas):null,t=g?.tacas.find(t=>nomeComp(t.nome)===nome),simulacao=edicoes.filter(e=>e.clube===clube).length,inicial=a.conhecido?(t?.inicial||0):0,legado=t?.legado||0;return {clube,inicial,simulacao,legado,total:inicial+simulacao+legado,anos:edicoes.filter(e=>e.clube===clube).map(e=>e.ano)};}).filter(t=>t.total>0).sort((a,b)=>b.total-a.total||a.clube.localeCompare(b.clube,'pt-BR'));
 return {nome,selecao,edicoes,ranking,ultima:edicoes[0]||null,primeiroAno:edicoes.at(-1)?.ano??null};
}
