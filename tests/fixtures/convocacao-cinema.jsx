import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {NACIONALIDADES} from '../../src/dados/data.js';
import ConvocacaoCinematografica from '../../src/jogador/ConvocacaoCinematografica.jsx';
import '../../src/index.css';
const p=new URLSearchParams(location.search);
const nac=p.get('nac')||'BRA',convocado=p.get('convocado')!=='false';
const label=NACIONALIDADES.find(n=>n.id===nac)?.label||nac;
const jogador={nome:'A Joia',nac,posicao:'ATA'};
const nomes=['Primeiro Goleiro','Primeiro Zagueiro','Primeiro Meia','Primeiro Atacante','Último Atacante'];
const pos=['GOL','ZAG','MEI','ATA','ATA'];
const copa={nac,label,ano:2030,nome:'Copa do Mundo',elenco:{jogadores:nomes.map((nome,i)=>({nome,posicao:pos[i],id:'j'+i}))}};
function Demo(){
 const [revelado,R]=useState(false);
 return <main style={{padding:12,maxWidth:1040,margin:'auto'}}><ConvocacaoCinematografica jogador={jogador} copa={copa} resultado={{venceu:convocado,texto:convocado?'Você vai à Copa!':'Você ficou fora da lista.'}} revelado={revelado} onRevelar={()=>R(true)}/><button onClick={()=>R(true)}>Pular cerimônia</button></main>;
}
createRoot(document.getElementById('root')).render(<Demo/>);
