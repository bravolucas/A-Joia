import React,{useState} from 'react';
import {logoCompeticao} from './arte.js';
import {imagemEstadualCommons} from './arteCompeticoes.js';

/**
 * Exibe apenas a imagem cadastrada da taça ou do prêmio.
 * Quando não existe fotografia/arte específica, não mostra uma taça genérica
 * que poderia ser confundida com o troféu verdadeiro.
 */
export default function MiniaturaConquista({nome,categoria='titulo',size=40}){
 const [imagemComErro,marcarErro]=useState(null);
 const url=logoCompeticao(nome)|| (categoria==='titulo'?imagemEstadualCommons(nome):null);
 const disponivel=url&&imagemComErro!==url;
 return disponivel
  ? <img src={url} onError={()=>marcarErro(url)} alt={`Imagem de ${nome}`} title={nome} loading="lazy" decoding="async" draggable="false" className="miniatura-conquista" style={{width:size,height:size,objectFit:'contain',flexShrink:0}}/>
  : <span role="img" aria-label={`Imagem de ${nome} ainda não cadastrada`} title={`Imagem de ${nome} ainda não cadastrada`} className="miniatura-conquista-indisponivel" style={{width:size,height:size,display:'inline-grid',placeItems:'center',flexShrink:0,fontSize:Math.max(10,size/3),color:'#9cacc1'}}>—</span>;
}
