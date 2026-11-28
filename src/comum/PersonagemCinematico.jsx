import React from 'react';
import personagem from '../../arte/jornada/convocacao-personagem.webp';
import {escolherPose} from './posesCinematicas.js';

// Vite inclui apenas imagens presentes no repositório e respeita o base do GitHub Pages.
const ARQUIVOS=Object.fromEntries(Object.entries(import.meta.glob('../../arte/personagens-cinematicos/*.webp',{eager:true,query:'?url',import:'default'})).map(([path,url])=>[path.split('/').at(-1).replace(/\.webp$/,''),url]));
const POSICOES={apresentacao:'0% 50%',comemoracao:'50% 50%',decepcao:'100% 50%'};
export const imagemPose=(pose,semente)=>escolherPose(pose,ARQUIVOS,semente);

/** Sem fundo incorporado; premiações nunca reutilizam a pose esportiva. */
export default function PersonagemCinematico({pose='apresentacao',semente='',className='',style={},permitirLegado=true}){
 const imagem=imagemPose(pose,semente),legado=!imagem&&permitirLegado&&POSICOES[pose];
 if(!imagem&&!legado)return null;
 return <div aria-hidden="true" className={className} data-pose={pose} style={{
  filter:'drop-shadow(0 10px 18px #000b)',pointerEvents:'none',...style,
  backgroundImage:`url(${imagem||personagem})`,backgroundRepeat:'no-repeat',
  backgroundSize:imagem?'contain':'300% 100%',backgroundPosition:imagem?'center bottom':legado
 }}/>;
}
