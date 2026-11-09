import React from 'react';
import {createRoot} from 'react-dom/client';
import {CamisaPremium,JogadorCampo} from '../../src/comum/VisualFutebol.jsx';
import ApresentacaoOficial from '../../src/comum/ApresentacaoOficial.jsx';
import CenaPenaltis from '../../src/treinador/CenaPenaltis.jsx';
import {CLUBES} from '../../src/dados/data.js';
import '../../src/index.css';
const q=new URLSearchParams(location.search),vista=q.get('vista');
const done=()=>document.body.dataset.concluido='sim';
function Demo(){
 if(vista==='apresentacao')return <ApresentacaoOficial clube={CLUBES.find(x=>x.nome==='Flamengo')} nome="Lucas Bravo" numero={11} idade={24} posicao="MEI" fama={90} cena={q.get('cena')||'imprensa'} valor={30000} contrato={{anos:4,salario:3000}} onConcluir={done}/>;
 if(vista==='goleiros')return <main style={{maxWidth:1000,margin:'auto',display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:20}}>{[false,true].flatMap(defendeu=>[-1,1].map(direcao=><section key={defendeu+':'+direcao}><h2>{defendeu?'Defesa':'Salto'} · {direcao<0?'esquerda':'direita'}</h2><svg viewBox="-65 -95 130 115" style={{width:'100%',background:'#264830'}}><JogadorCampo goleiro esticado direcao={direcao} defendeu={defendeu}/></svg><div style={{height:220,position:'relative'}}><CenaPenaltis resultado venceu={!defendeu} lado={direcao<0?'esquerda':'direita'}/></div></section>))}</main>;
 const nomes=['Flamengo','São Paulo','Santos','Corinthians','Vasco da Gama','Grêmio','Fluminense','Palmeiras','Paysandu','Novorizontino','Vila Nova','River Plate','Boca Juniors','Juventus','Barcelona','Real Madrid'];
 return <main style={{maxWidth:1100,margin:'auto',padding:20,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:15}}>{nomes.map(nome=><article key={nome}><h3>{nome}</h3><CamisaPremium nome={nome} numero={11} sobrenome="BRAVO"/></article>)}</main>;
}
createRoot(document.getElementById('root')).render(<Demo/>);
