import React,{useEffect,useState} from 'react';
import personagem from '../../arte/jornada/convocacao-personagem.webp';
import {escolherPose} from './posesCinematicas.js';
import {uniformeDe} from '../dados/uniformes.js';
import {camadaUniforme,roupaAdaptavel} from './uniformeCinematico.js';

const ARQUIVOS=Object.fromEntries(Object.entries(import.meta.glob('../../arte/jornada/personagens/*.webp',{eager:true,query:'?url',import:'default'})).map(([path,url])=>[path.split('/').at(-1).replace(/\.webp$/,''),url]));
const IDS=Object.fromEntries(Object.entries(ARQUIVOS).map(([id,url])=>[url,id]));
const POSICOES={apresentacao:'0% 50%',comemoracao:'50% 50%',decepcao:'100% 50%'};
export const imagemPose=(pose,semente)=>escolherPose(pose,ARQUIVOS,semente);
const cache=new Map();
function prepararUniforme(imagem,id,u){
 const chave=[id,u.base,u.secundaria,u.detalhe,u.padrao].join('|');
 if(cache.has(chave))return cache.get(chave);
 const promessa=new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>{try{
   const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Canvas indisponível');
   ctx.drawImage(img,0,0);const dados=ctx.getImageData(0,0,canvas.width,canvas.height);
   dados.data.set(camadaUniforme(dados.data,canvas.width,canvas.height,id,u));
   ctx.putImageData(dados,0,0);resolve(canvas.toDataURL('image/png'));
  }catch(e){reject(e)}};img.onerror=reject;img.src=imagem;
 });
 cache.set(chave,promessa);promessa.catch(()=>cache.delete(chave));
 while(cache.size>12)cache.delete(cache.keys().next().value);
 return promessa;
}
function useUniforme(imagem,clube){
 const id=IDS[imagem],u=clube&&roupaAdaptavel(id)?uniformeDe(clube.nome,clube.cor):null;
 const chave=u?[imagem,u.base,u.secundaria,u.detalhe,u.padrao].join('|'):'';
 const [resultado,S]=useState(null);
 useEffect(()=>{let ativo=true;if(chave)prepararUniforme(imagem,id,u).then(url=>{if(ativo)S({chave,url})}).catch(()=>{if(ativo)S({chave,url:null})});return()=>{ativo=false}},[chave]);
 return {url:resultado?.chave===chave?resultado.url:null,status:!chave?'original':resultado?.chave===chave?(resultado.url?'adaptado':'fallback'):'carregando',uniforme:u};
}
export default function PersonagemCinematico({pose='apresentacao',semente='',className='',style={},permitirLegado=true,clube}){
 const imagem=imagemPose(pose,semente),legado=!imagem&&permitirLegado&&POSICOES[pose];
 const {url,status,uniforme}=useUniforme(imagem,clube);
 if(!imagem&&!legado)return null;
 return <div aria-hidden="true" className={className} data-pose={pose} data-uniforme-status={status} data-cor-uniforme={uniforme?.base} data-padrao-uniforme={uniforme?.padrao} style={{
  filter:'drop-shadow(0 10px 18px #000b)',pointerEvents:'none',...style,
  backgroundImage:url?`url(${url}), url(${imagem})`:`url(${imagem||personagem})`,backgroundRepeat:'no-repeat',
  backgroundSize:imagem?'contain':'300% 100%',backgroundPosition:imagem?'center bottom':legado
 }}/>;
}
