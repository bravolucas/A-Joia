import React,{useEffect,useState} from 'react';
import personagem from '../../arte/jornada/convocacao-personagem.webp';
import {escolherPose} from './posesCinematicas.js';
import {uniformeDe} from '../dados/uniformes.js';
import {camadaUniforme,roupaAdaptavel} from './uniformeCinematico.js';
import {camadaAparencia,combinarCamadas,normalizarAparencia} from './aparenciaCinematica.js';

const ARQUIVOS=Object.fromEntries(Object.entries(import.meta.glob('../../arte/jornada/personagens/*.webp',{eager:true,query:'?url',import:'default'})).map(([path,url])=>[path.split('/').at(-1).replace(/\.webp$/,''),url]));
const IDS=Object.fromEntries(Object.entries(ARQUIVOS).map(([id,url])=>[url,id]));
const POSICOES={apresentacao:'0% 50%',comemoracao:'50% 50%',decepcao:'100% 50%'};
export const imagemPose=(pose,semente)=>escolherPose(pose,ARQUIVOS,semente);
const cache=new Map();
function prepararRetrato(imagem,id,u,aparencia){
 const chave=[id,u?.base,u?.secundaria,u?.detalhe,u?.padrao,aparencia.tom].join('|');
 if(cache.has(chave))return cache.get(chave);
 const promessa=new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>{try{
   const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Canvas indisponível');
   ctx.drawImage(img,0,0);const dados=ctx.getImageData(0,0,canvas.width,canvas.height);
   const tecido=u?camadaUniforme(dados.data,canvas.width,canvas.height,id,u):new Uint8ClampedArray(dados.data.length);
   const pele=camadaAparencia(dados.data,canvas.width,canvas.height,id,aparencia);
   dados.data.set(combinarCamadas(tecido,pele));
   ctx.putImageData(dados,0,0);resolve(canvas.toDataURL('image/png'));
  }catch(e){reject(e)}};img.onerror=reject;img.src=imagem;
 });
 cache.set(chave,promessa);promessa.catch(()=>cache.delete(chave));
 while(cache.size>12)cache.delete(cache.keys().next().value);
 return promessa;
}
export function useRetratoCinematico(imagem,clube,visual){
 const id=IDS[imagem],u=clube&&roupaAdaptavel(id)?uniformeDe(clube.nome,clube.cor):null;
 const aparencia=normalizarAparencia(visual),personalizar=!!id&&aparencia.tom!=='original'&&!id.endsWith('-b');
 const chave=(u||personalizar)?[imagem,u?.base,u?.secundaria,u?.detalhe,u?.padrao,aparencia.tom].join('|'):'';
 const [resultado,S]=useState(null);
 useEffect(()=>{let ativo=true;if(chave)prepararRetrato(imagem,id,u,aparencia).then(url=>{if(ativo)S({chave,url})}).catch(()=>{if(ativo)S({chave,url:null})});return()=>{ativo=false}},[chave]);
 const status=!chave?'original':resultado?.chave===chave?(resultado.url?'adaptado':'fallback'):'carregando';
 return {url:resultado?.chave===chave?resultado.url:null,status:u?status:'original',statusAparencia:personalizar?status:'original',uniforme:u,tom:aparencia.tom};
}
export default function PersonagemCinematico({pose='apresentacao',semente='',className='',style={},permitirLegado=true,clube,aparencia}){
 const imagem=imagemPose(pose,semente),legado=!imagem&&permitirLegado&&POSICOES[pose];
 const {url,status,uniforme,statusAparencia,tom}=useRetratoCinematico(imagem,clube,aparencia);
 if(!imagem&&!legado)return null;
 return <div aria-hidden="true" className={className} data-pose={pose} data-tom-pele={tom} data-aparencia-status={statusAparencia} data-uniforme-status={status} data-cor-uniforme={uniforme?.base} data-padrao-uniforme={uniforme?.padrao} style={{
  filter:'drop-shadow(0 10px 18px #000b)',pointerEvents:'none',...style,
  backgroundImage:url?`url(${url}), url(${imagem})`:`url(${imagem||personagem})`,backgroundRepeat:'no-repeat',
  backgroundSize:imagem?'contain':'300% 100%',backgroundPosition:imagem?'center bottom':legado
 }}/>;
}
