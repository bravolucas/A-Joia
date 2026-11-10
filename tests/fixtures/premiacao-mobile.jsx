import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import FechamentoTemporada from '../../src/jogador/FechamentoTemporada.jsx';
import JanelaPremiacao from '../../src/comum/JanelaPremiacao.jsx';
import CerimoniaBola from '../../src/comum/CerimoniaBola.jsx';
import {MovimentoProvider} from '../../src/comum/efeitos/Movimento.jsx';
import '../../src/index.css';
import '../../src/comum/efeitos/Diamante.css';
const q=new URLSearchParams(location.search),pos=Number(q.get('pos')||1),completo=q.get('modo')==='completo';
const nome='Alexandre da Silva dos Santos',top=[1,2,3].map(i=>({nome:i===pos?nome:`Finalista ${i} com sobrenome e nome de clube extenso`,clube:i===pos?'Santos':'Clube internacional de uma carreira histórica',voce:i===pos}));
const card={ano:2030,clube:'Santos',ligaNome:'Brasileirão',posLiga:4,jogos:52,gols:40,assist:18,ovr:92,nota:8.7,titulos:pos===1?[{tipo:'bolaOuro',nome:'Bola de Ouro'}]:[],destaques:[],bola:{pos,top}},c={nome,nac:'BRA',lista:card.titulos.map(t=>({...t,ano:2030}))};
function Demo(){const[aberto,A]=useState(false),[indice,I]=useState(0);return <main style={{minHeight:1800,padding:16}}><h1>Premiação no celular</h1><button onClick={()=>{I(0);A(true);}}>Abrir premiação</button>{aberto&&(completo?<JanelaPremiacao etapa={2} onContinuar={()=>A(false)}><CerimoniaBola nome={nome} posicao={pos} finalistas={top} ano={2030}/><p>Finanças e demais prêmios registrados na temporada.</p></JanelaPremiacao>:<FechamentoTemporada c={c} card={card} celebracaoIndice={indice} onCelebracao={I} onContinuar={()=>A(false)}/>)}</main>;}
createRoot(document.getElementById('root')).render(<MovimentoProvider><Demo/></MovimentoProvider>);
