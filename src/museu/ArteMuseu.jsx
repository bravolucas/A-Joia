import camisaBrasilMini from '../../arte/museu/mini/camisa-brasil-2024.png';
import camisaBrasil from '../../arte/museu/camisa-brasil-2024.png';
import bolaOuroExposicao from '../../arte/museu/bola-ouro-exposicao.png';
import {uniformeSelecao} from '../dados/uniformesSelecoes.js';
import React from 'react';
import {CamisaPremium} from '../comum/VisualFutebol.jsx';
import {TacaCompeticao} from '../comum/trofeus.jsx';
import {bandeiraDe} from '../comum/arte.js';
import {artesMuseu} from './arteMuseu.js';
const foto=id=><img className="mp-object-photo" src={artesMuseu[id].mini} srcSet={`${artesMuseu[id].mini} 512w, ${artesMuseu[id].original} 1024w`} sizes="(max-width: 600px) 220px, 240px" alt="" loading="lazy" decoding="async" width="1024" height="1024"/>;
function arteDe(o){
 const tipos={contrato:'contrato',ingresso:'ingressos',passagem:'passaporte',carta:'carta',convocacao:'carta',bracadeira:'bracadeira',placa:'homenagem',prancheta:'prancheta',convite:'convite-gala',apito:'apito-tecnico'};
 if(tipos[o.tipo])return tipos[o.tipo];
 if(o.tipo==='retrato')return o.retratoArte||(/rival/i.test(o.papel)?'retrato-rival':/parceiro|dupla/i.test(o.papel)?'retrato-parceiro':'retrato-mentor');
 if(o.tipo==='bola')return o.id==='primeiros-gols'?'bola-moderna':'bola-couro';
 const texto=`${o.nome||''} ${o.texto||''}`;
 if(/lesão|recupera|superação|reabilita/i.test(texto))return 'diario';
 if(/defesa|goleiro|paredão/i.test(texto))return 'luvas';
 if(/assist|passe|cruzamento/i.test(texto))return 'chuteiras';
 return 'jornal';
}
export default function ObjetoArte({o,nome}){
 if(!o)return null;
 if(o.tipo==='camisa'||o.tipo==='selecao')return <div className="mp-shirt-art mp-shirt-framed" data-arte-museu="moldura-camisa">{foto('moldura-camisa')}{o.tipo==='camisa'?<CamisaPremium nome={o.clube} cor={o.cor} numero={o.numero??''} sobrenome={nome?.split(/\s+/).at(-1)}/>:<div className="mp-national-keepsake" data-selecao={o.nac}>{o.nac==='BRA'?<img className="mp-national-photo" src={camisaBrasilMini} srcSet={`${camisaBrasilMini} 512w, ${camisaBrasil} 1024w`} sizes="240px" alt="" loading="lazy" decoding="async"/>:<CamisaPremium nome={`Seleção ${o.nac}`} uniforme={uniformeSelecao(o.nac)} numero={o.numero??''} emblema={bandeiraDe(o.nac)}/>}</div>}{o.idolo&&<span className="mp-idolo">ÍDOLO</span>}</div>;
 if(o.tipo==='taca'||o.tipo==='premio')return <div className={`mp-trophy-art mp-cup-case ${/bola de ouro/i.test(o.nome)?'mp-award-case':''}`} data-arte-museu="vitrine-taca">{foto('vitrine-taca')}{/bola de ouro/i.test(o.nome)&&<span className="mp-award-foot"/>}<div className="mp-cup-object">{/bola de ouro/i.test(o.nome)?<img className="mp-ballondor-photo" src={bolaOuroExposicao} alt="" loading="lazy" decoding="async"/>:<TacaCompeticao nome={o.nome} tipo={o.tipoTaca||'bolaOuro'} size={110}/>}</div>{o.quantidade>1&&<b className="mp-edition-count">{o.quantidade} edições</b>}</div>;
 const id=arteDe(o);return <div className={`mp-photo-art${o.tipo==='retrato'?' mp-portrait-art':''}`} data-arte-museu={id} data-retrato-papel={o.tipo==='retrato'?o.papel:undefined}>{foto(id)}{o.tipo==='retrato'&&<span>{o.papel}</span>}</div>;
}
