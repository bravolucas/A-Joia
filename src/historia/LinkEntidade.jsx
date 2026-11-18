import React from 'react';
import {abrirEntidade,normalizarEntidade} from './navegacaoEntidades.js';
import './NavegacaoEntidades.css';

/** Componente único para nomes navegáveis em tabelas, listas, perfis e resultados. */
export default function LinkEntidade({tipo,nome,id,children,className='',title='',onClick,...props}) {
 const destino=normalizarEntidade({tipo,nome,id});
 const rotulo=children??nome;
 if(!destino)return <span className={className}>{rotulo}</span>;
 return <button type="button" {...props} className={['ajoia-entity-link',className].filter(Boolean).join(' ')}
   title={title||'Ver histórico de '+(nome||tipo)}
   onClick={e=>{e.stopPropagation();onClick?.(e);if(!e.defaultPrevented)abrirEntidade(destino);}}>{rotulo}</button>;
}
