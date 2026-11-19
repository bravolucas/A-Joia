import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import ConvocacaoSelecaoCinema from '../../src/jogador/ConvocacaoSelecaoCinema.jsx';
import {NACIONALIDADES} from '../../src/dados/data.js';
import '../../src/index.css';
const q=new URLSearchParams(location.search);
const nac=q.get('nac')||'BRA',venceu=q.get('venceu')!=='false';
const jogador={nome:'Atleta Internacional',nac,posicao:'ATA'};
const copa={ano:2030,tipo:'copaMundo',nome:'Copa do Mundo',nac,
 label:NACIONALIDADES.find(x=>x.id===nac)?.label||nac,
 elenco:{jogadores:['Primeiro Goleiro','Primeiro Zagueiro','Primeiro Meia','Primeiro Atacante','Último Atacante'].map((nome,i)=>({id:'f'+i,nome,posicao:['GOL','ZAG','MEI','ATA','ATA'][i]}))}};
function App(){
 const [revelado,R]=useState(false);
 return <main style={{margin:'auto',maxWidth:900,padding:10,background:'#0a1320'}}>
 <ConvocacaoSelecaoCinema jogador={jogador} copa={copa} resultado={{venceu,texto:venceu?'Você vai disputar a Copa.':'Você ficou fora da Copa.'}} revelado={revelado} onRevelar={()=>R(true)}/>
 <button onClick={()=>R(true)} style={{padding:14,color:'#fff',background:'#21344c'}}>Pular cerimônia</button>
 </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
