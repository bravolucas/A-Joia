import React from 'react';
import copas from '../../arte/colecoes/copas.webp';
import origens from '../../arte/colecoes/origens.webp';
import treinos from '../../arte/colecoes/treinos.webp';
import {ARTE} from './arte.js';
import './CenaFotografica.css';
const grupos={copas,origens,treinos};
const focos={'origem-varzea':'xMaxYMid','origem-futsal':'xMinYMid','origem-base':'xMinYMid','origem-escola':'xMinYMid'};
const cenas={
 'copa-regional':['copas',0],'copa-tunel':['copas',1],'copa-semifinal':['copas',2],'copa-final-sul':['copas',3],'copa-final-europa':['copas',4],'copa-mundial':['copas',5],
 'origem-varzea':['origens',0],'origem-futsal':['origens',1],'origem-base':['origens',2],'origem-escola':['origens',3],'origem-praia':['origens',4],'origem-familia':['origens',5],
 'treino-nutricao':['treinos',0],'treino-analise':['treinos',1],'treino-forca':['treinos',2],'treino-velocidade':['treinos',3],'treino-bola':['treinos',4],'treino-goleiro':['treinos',5]
};
/** One image download supplies six independent scenes. SVG crops without stretching. */
export default function CenaFotografica({cena,className=''}){
 const arte=cenas[cena];
 if(!arte)return <img className={`cena-fotografica ${className}`} data-cena={cena} src={ARTE[cena]||ARTE.treino} alt="" loading="lazy" decoding="async"/>;
 const [grupo,indice]=arte,x=indice%2*3,y=Math.floor(indice/2)*2;
 return <svg className={`cena-fotografica ${className}`} data-cena={cena} aria-hidden="true" focusable="false" viewBox={`${x+.008} ${y+.008} 2.984 1.984`} preserveAspectRatio={`${focos[cena]||'xMidYMid'} slice`}><image href={grupos[grupo]} width="6" height="6" preserveAspectRatio="none"/></svg>;
}
