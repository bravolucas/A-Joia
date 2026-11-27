import React from 'react';
import personagem from '../../arte/jornada/convocacao-personagem.webp';

const POSICOES={apresentacao:'0% 50%',comemoracao:'50% 50%',decepcao:'100% 50%'};

/** Reaproveita o atleta isolado da convocação sobre qualquer cenário da carreira. */
export default function PersonagemCinematico({pose='apresentacao',className='',style={}}){
 return <div aria-hidden="true" className={className} style={{
  backgroundImage:`url(${personagem})`,backgroundRepeat:'no-repeat',backgroundSize:'300% 100%',
  backgroundPosition:POSICOES[pose]||POSICOES.apresentacao,
  filter:'drop-shadow(0 10px 18px #000b)',pointerEvents:'none',...style
 }}/>;
}
