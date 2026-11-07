// Custos em R$ mil. Contrato de uma temporada, pago antecipadamente.
export const CARGOS_COMISSAO_TECNICO=[
 {id:'auxiliar',nome:'Auxiliar técnico',taxa:.06,descricao:'+1 de força nos jogos da liga e das copas.'},
 {id:'preparador',nome:'Preparador de desenvolvimento',taxa:.05,descricao:'+1 de qualidade na virada para atletas com menos de 30 anos após envelhecer, respeitando o potencial.'},
 {id:'olheiro',nome:'Olheiro da base',taxa:.04,descricao:'+2 de qualidade nos jovens que repõem o elenco na próxima virada.'}
];
export const comissaoAtivaGestao=g=>(g?.comissao||[]).filter(p=>p.ano===g.ano);
export function propostaComissaoTecnico(g,id){
 const cargo=CARGOS_COMISSAO_TECNICO.find(c=>c.id===id);
 if(!cargo)throw new Error('Cargo de comissão inválido.');
 const salario=Math.max(2,Math.ceil(g.elenco.reduce((n,j)=>n+j.salario,0)*cargo.taxa));
 return {...cargo,salario,custo:salario*12};
}
export function bonusAuxiliarTecnico(t){
 const g=t?.gestao;
 return !t?.modoTreinadorRapido&&g&&g.clube===t.clube&&g.ano===t.ano&&comissaoAtivaGestao(g).some(p=>p.id==='auxiliar')?1:0;
}
