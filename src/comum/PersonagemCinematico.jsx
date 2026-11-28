import React,{useEffect,useState} from 'react';
import personagem from '../../arte/jornada/convocacao-personagem.webp';
import {escolherPose} from './posesCinematicas.js';
import {escudoDe} from './arte.js';
import {marcasDaPose,limparEscudoApresentacao} from './marcasCinematicas.js';
import {uniformeDe,tintaUniforme} from '../dados/uniformes.js';
import {camadaUniforme,roupaAdaptavel} from './uniformeCinematico.js';
import {camadaAparencia,combinarCamadas,normalizarAparencia} from './aparenciaCinematica.js';

const ARQUIVOS=Object.fromEntries(Object.entries(import.meta.glob('../../arte/jornada/personagens/*.webp',{eager:true,query:'?url',import:'default'})).map(([path,url])=>[path.split('/').at(-1).replace(/\.webp$/,''),url]));
const IDS=Object.fromEntries(Object.entries(ARQUIVOS).map(([id,url])=>[url,id]));
const POSICOES={apresentacao:'0% 50%',comemoracao:'50% 50%',decepcao:'100% 50%'};
export const imagemPose=(pose,semente)=>escolherPose(pose,ARQUIVOS,semente);
const cache=new Map();
function prepararRetrato(imagem,id,u,aparencia,limparEscudo=false){
 const chave=[id,u?.base,u?.secundaria,u?.detalhe,u?.padrao,aparencia.tom,limparEscudo].join('|');
 if(cache.has(chave))return cache.get(chave);
 const promessa=new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>{try{
   const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Canvas indisponível');
   ctx.drawImage(img,0,0);const dados=ctx.getImageData(0,0,canvas.width,canvas.height);
   const tecido=u?camadaUniforme(dados.data,canvas.width,canvas.height,id,u):new Uint8ClampedArray(dados.data.length);
   const pele=camadaAparencia(dados.data,canvas.width,canvas.height,id,aparencia);
   const camada=combinarCamadas(tecido,pele);
   if(limparEscudo&&id==='apresentacao-camisa')limparEscudoApresentacao(dados.data,camada,canvas.width,canvas.height);
   dados.data.set(camada);
   ctx.putImageData(dados,0,0);resolve(canvas.toDataURL('image/png'));
  }catch(e){reject(e)}};img.onerror=reject;img.src=imagem;
 });
 cache.set(chave,promessa);promessa.catch(()=>cache.delete(chave));
 while(cache.size>12)cache.delete(cache.keys().next().value);
 return promessa;
}
export function useRetratoCinematico(imagem,clube,visual,limparEscudo=false){
 const id=IDS[imagem],u=clube&&roupaAdaptavel(id)?uniformeDe(clube.nome,clube.cor):null;
 const aparencia=normalizarAparencia(visual),personalizar=!!id&&aparencia.tom!=='original'&&!id.endsWith('-b');
 const chave=(u||personalizar||limparEscudo)?[imagem,u?.base,u?.secundaria,u?.detalhe,u?.padrao,aparencia.tom,limparEscudo].join('|'):'';
 const [resultado,S]=useState(null);
 useEffect(()=>{let ativo=true;if(chave)prepararRetrato(imagem,id,u,aparencia,limparEscudo).then(url=>{if(ativo)S({chave,url})}).catch(()=>{if(ativo)S({chave,url:null})});return()=>{ativo=false}},[chave]);
 const status=!chave?'original':resultado?.chave===chave?(resultado.url?'adaptado':'fallback'):'carregando';
 return {url:resultado?.chave===chave?resultado.url:null,status:u?status:'original',statusAparencia:personalizar?status:'original',uniforme:u,tom:aparencia.tom};
}
export default function PersonagemCinematico({pose='apresentacao',semente='',className='',style={},permitirLegado=true,clube,aparencia,numero}){
 const imagem=imagemPose(pose,semente),legado=!imagem&&permitirLegado&&POSICOES[pose];
 const escudo=clube?.nome?escudoDe(clube.nome):null;
 const marcas=marcasDaPose(IDS[imagem],numero,!!escudo);
 const {url,status,uniforme,statusAparencia,tom}=useRetratoCinematico(imagem,clube,aparencia,marcas.limparEscudo);
 const mostrarEscudo=marcas.escudo&&(!marcas.limparEscudo||!!url);
 const mostrarNumero=marcas.numero&&!!uniforme;
 if(!imagem&&!legado)return null;
 return <div aria-hidden="true" className={className} data-pose={pose} data-tom-pele={tom} data-aparencia-status={statusAparencia} data-uniforme-status={status} data-cor-uniforme={uniforme?.base} data-padrao-uniforme={uniforme?.padrao} style={{
  filter:'drop-shadow(0 10px 18px #000b)',pointerEvents:'none',...style,
  backgroundImage:url?`url(${url}), url(${imagem})`:`url(${imagem||personagem})`,backgroundRepeat:'no-repeat',
  backgroundSize:imagem?'contain':'300% 100%',backgroundPosition:imagem?'center bottom':legado
 }}>{(mostrarEscudo||mostrarNumero)&&<svg data-marcas-uniforme="" viewBox="0 0 720 768" preserveAspectRatio="xMidYMax meet" width="100%" height="100%" style={{display:'block',pointerEvents:'none'}} aria-hidden="true">
 {mostrarEscudo&&<image data-escudo-uniforme={clube.nome} href={escudo} x={marcas.escudo[0]-marcas.escudo[2]/2} y={marcas.escudo[1]-marcas.escudo[3]/2} width={marcas.escudo[2]} height={marcas.escudo[3]} preserveAspectRatio="xMidYMid meet"/>}
 {mostrarNumero&&<text data-numero-uniforme={marcas.numero.valor} x={marcas.numero.coordenadas[0]} y={marcas.numero.coordenadas[1]} fontSize={marcas.numero.coordenadas[2]} fill={tintaUniforme(uniforme)} stroke={tintaUniforme(uniforme)==='#19232b'?'#ffffff77':'#00000088'} strokeWidth="1" paintOrder="stroke" textAnchor="middle" fontWeight="700" fontFamily="Oswald, sans-serif">{marcas.numero.valor}</text>}
 </svg>}</div>;
}
