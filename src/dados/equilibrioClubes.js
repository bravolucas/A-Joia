import {CLUBES,JOGADORES_REAIS_BASE} from './data.js';
import {corrigirNacionalidadeHistoricaJhonArias} from './corrigirNacionalidadeAtletasReais.js';
import {avaliarClubeNoMundo} from '../simulacao/forcaEquipe.js';

// Base antiga 76 -> 64. A primeira migração é preservada para saves antigos.
export const AJUSTE_FORTALEZA = 'fortaleza64';
// Correção independente: os 29 atletas reais ainda produziam força ~77
// apesar de a referência do clube ter sido reduzida para 64.
export const AJUSTE_ELENCO_FORTALEZA = 'fortalezaElenco2026V2';

const baseFortaleza = CLUBES.find(c=>c.nome==='Fortaleza');
const cadastroAntigo = new Map(
 JOGADORES_REAIS_BASE.filter(j=>j.time==='Fortaleza'&&Number.isFinite(j.ovrLegadoAJoia))
  .map(j=>[j.nome,j]),
);
const limitar=(n,min,max)=>Math.max(min,Math.min(max,n));

function migrarElencoFortaleza(c){
 if(c.ajustesCadastro?.[AJUSTE_ELENCO_FORTALEZA]||!Array.isArray(c.mundo?.jogadores))return c;
 if(c.mundo.calibracaoFortalezaElenco==='2026-v2')return {...c,ajustesCadastro:{...c.ajustesCadastro,[AJUSTE_ELENCO_FORTALEZA]:true}};
 const alterados=new Map();
 const jogadores=c.mundo.jogadores.map(j=>{
  // Não afetar contratados, atletas transferidos (inclusive os que retornaram),
  // jogadores genéricos ou outras equipes. Preservar nomes/IDs/histórico.
  const modelo=j.clubeNome==='Fortaleza'&&j.clubeOrigem==='Fortaleza'&&
    !(j.movimentos?.length)&&cadastroAntigo.get(j.nome);
  if(!modelo||!Number.isFinite(j.ovr))return j;
  const desconto=modelo.ovrLegadoAJoia-modelo.ovr;
  const ovr=limitar(j.ovr-desconto,10,99);
  const potencial=Number.isFinite(j.potencial)?
    limitar(Math.max(ovr,j.potencial-desconto),ovr,99):j.potencial;
  if(ovr===j.ovr&&potencial===j.potencial)return j;
  const novo={...j,ovr,...(Number.isFinite(potencial)?{potencial}:{})};
  alterados.set(String(j.id),novo);
  return novo;
 });
 const mundo={...c.mundo,jogadores,calibracaoFortalezaElenco:'2026-v2'};
 const novo={...c,mundo,ajustesCadastro:{...c.ajustesCadastro,[AJUSTE_ELENCO_FORTALEZA]:true}};
 if(!alterados.size)return novo;
 if(c.tecnico){
  const t=c.tecnico;
  const gestao=t.gestao?.clube==='Fortaleza'&&t.gestao.cadastroUnificado&&Array.isArray(t.gestao.elenco)?
   {...t.gestao,elenco:t.gestao.elenco.map(j=>{
    const p=alterados.get(String(j.mundoId??j.id));
    return p?{...j,qualidade:p.ovr,...(Number.isFinite(p.potencial)?{potencial:p.potencial}:{})}:j;
   })}:t.gestao;
  const forcasMundo=t.forcasMundo&&baseFortaleza?
   {...t.forcasMundo,Fortaleza:avaliarClubeNoMundo(novo,baseFortaleza).forca}:t.forcasMundo;
  novo.tecnico={...t,...(gestao?{gestao}:{}),...(forcasMundo?{forcasMundo}:{})};
 }
 return novo;
}

/**
 * Atualização idempotente de dados de referência: não cria jogadores, não sorteia
 * resultados, não altera temporadas já disputadas nem regrava qualquer partida.
 */
export function corrigirEquilibrioClubes(c) {
 if (!c) return c;
 let out=c;
 if(!c.ajustesCadastro?.[AJUSTE_FORTALEZA]){
  const ajustar=(valor,min=40,max=96)=>Number.isFinite(valor)?limitar(valor-12,min,max):valor;
  out={...c,ajustesCadastro:{...c.ajustesCadastro,[AJUSTE_FORTALEZA]:true}};
  if(c.clube?.nome==='Fortaleza')out.clube={...c.clube,forca:ajustar(c.clube.forca)};
  if(c.estadoClubes?.Fortaleza)out.estadoClubes={...c.estadoClubes,Fortaleza:{...c.estadoClubes.Fortaleza,forca:ajustar(c.estadoClubes.Fortaleza.forca)}};
  if(Array.isArray(c.tecnico?.temporadas)){
   out.tecnico={...c.tecnico};
   if(c.tecnico.clube==='Fortaleza'&&c.tecnico.tipoEquipe!=='selecao')out.tecnico.elenco=ajustar(c.tecnico.elenco,10,99);
   if(Array.isArray(c.tecnico.opcoesInicio))out.tecnico.opcoesInicio=c.tecnico.opcoesInicio.map(p=>p.clube==='Fortaleza'?{...p,elenco:ajustar(p.elenco,10,99)}:p);
   if(Array.isArray(c.tecnico.propostas))out.tecnico.propostas=c.tecnico.propostas.map(p=>p.nome==='Fortaleza'?{...p,elenco:ajustar(p.elenco,10,99)}:p);
  }
 }
 return corrigirNacionalidadeHistoricaJhonArias(migrarElencoFortaleza(out));
}
