// A base antiga do Fortaleza era 76. A migração conserva os ganhos/perdas
// acumulados na carreira e não toca nas temporadas e partidas já registradas.
export const AJUSTE_FORTALEZA = 'fortaleza64';
export function corrigirEquilibrioClubes(c) {
 if (!c || c.ajustesCadastro?.[AJUSTE_FORTALEZA]) return c;
 const ajustar=(valor,min=40,max=96)=>Number.isFinite(valor)?Math.max(min,Math.min(max,valor-12)):valor;
 const out={...c,ajustesCadastro:{...c.ajustesCadastro,[AJUSTE_FORTALEZA]:true}};
 if(c.clube?.nome==='Fortaleza')out.clube={...c.clube,forca:ajustar(c.clube.forca)};
 if(c.estadoClubes?.Fortaleza)out.estadoClubes={...c.estadoClubes,Fortaleza:{...c.estadoClubes.Fortaleza,forca:ajustar(c.estadoClubes.Fortaleza.forca)}};
 if(Array.isArray(c.tecnico?.temporadas)){
  out.tecnico={...c.tecnico};
  if(c.tecnico.clube==='Fortaleza'&&c.tecnico.tipoEquipe!=='selecao')out.tecnico.elenco=ajustar(c.tecnico.elenco,10,99);
  if(Array.isArray(c.tecnico.opcoesInicio))out.tecnico.opcoesInicio=c.tecnico.opcoesInicio.map(p=>p.clube==='Fortaleza'?{...p,elenco:ajustar(p.elenco,10,99)}:p);
  if(Array.isArray(c.tecnico.propostas))out.tecnico.propostas=c.tecnico.propostas.map(p=>p.nome==='Fortaleza'?{...p,elenco:ajustar(p.elenco,10,99)}:p);
 }
 return out;
}
