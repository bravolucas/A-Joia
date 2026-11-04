import React from 'react';
import { agruparConquistasTecnico } from './conquistasTecnico.js';
import { TacaCompeticao } from './trofeus.jsx';
import './ConquistasJogador.css';

// Os mesmos nomes canônicos e contadores da vitrine do treinador.
export default function ConquistasJogador({ titulos }) {
  const grupos = agruparConquistasTecnico(titulos);
  if (!grupos.length) return <span className="cj-vazia">Vitrine vazia</span>;
  return <ul className="cj-conquistas" aria-label="Conquistas por competição">
    {grupos.map(grupo => <li key={grupo.id}>
      <span className="cj-taca" aria-label={`${grupo.quantidade} ${grupo.quantidade === 1 ? 'título' : 'títulos'}`}>
        <TacaCompeticao tipo={grupo.tipo} nome={grupo.nome} size={40} />
        <b aria-hidden="true">×{grupo.quantidade}</b>
      </span>
      <span className="cj-info"><strong>{grupo.nomeCurto || grupo.nome}</strong><span aria-label="Anos das conquistas">{grupo.conquistas.map(c => c.ano || 'Ano não informado').join(' · ')}</span></span>
    </li>)}
  </ul>;
}
