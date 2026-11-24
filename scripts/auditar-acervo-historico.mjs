#!/usr/bin/env node
/**
 * Inventário de pesquisa do acervo histórico.
 * node scripts/auditar-acervo-historico.mjs [--pendentes] [--json]
 */
import {INVENTARIO_CLUBES_HISTORICOS,INVENTARIO_SELECOES_HISTORICAS,
 TOTAL_ENTIDADES_HISTORICAS} from '../src/dados/coberturaAcervoHistorico.js';
import {REFERENCIAS_RECORDES_CLUBES} from '../src/dados/acervoClubesHistoricos.js';
import {REFERENCIAS_RECORDES_SELECOES} from '../src/dados/acervoSelecoesHistoricas.js';
import {CLUBES,LIGAS} from '../src/dados/data.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
const grupos=[...INVENTARIO_CLUBES_HISTORICOS,...INVENTARIO_SELECOES_HISTORICAS];
const pendentes=grupos.filter(x=>x.cobertura==='pendente_apuracao');
// Percentual apenas do cadastro principal: clubes adicionais de copas e estaduais
// constam separadamente no inventário global, sem inflar a cobertura por liga.
const gruposLiga=new Map();
for(const clube of CLUBES){
 const id=clube.liga||'sem-liga';
 if(!gruposLiga.has(id))gruposLiga.set(id,{id,nome:LIGAS[id]?.nome||id,total:0,comFicha:0,pendentes:0});
 const g=gruposLiga.get(id);
 g.total++;
 if(coberturaHistoricaDe('clube',clube.nome)?.cobertura==='parcial_documentado')g.comFicha++;
 else g.pendentes++;
}
const ligas=[...gruposLiga.values()].map(x=>({...x,percentual:Math.round(100*x.comFicha/x.total)}))
 .sort((a,b)=>a.id.localeCompare(b.id));
const principais={total:CLUBES.length,comFicha:ligas.reduce((n,x)=>n+x.comFicha,0),
 pendentes:ligas.reduce((n,x)=>n+x.pendentes,0)};
principais.percentual=Math.round(principais.comFicha*100/principais.total);
const relatorio={
 versao:'2026-11-24',entidades:TOTAL_ENTIDADES_HISTORICAS,
 catalogoPrincipal:principais,ligas,
 recordesAuditados:{clubes:REFERENCIAS_RECORDES_CLUBES.length,
  selecoes:REFERENCIAS_RECORDES_SELECOES.length},
 pendentes:{clubes:pendentes.filter(x=>x.tipo==='clube').length,
  selecoes:pendentes.filter(x=>x.tipo==='selecao').length},
 ...(process.argv.includes('--pendentes')?{listaPendente:pendentes.map(x=>({tipo:x.tipo,nome:x.nome,origem:x.origem||null}))}:{}),
};
if(process.argv.includes('--json'))console.log(JSON.stringify(relatorio,null,2));
else{
 console.log('ACERVO HISTÓRICO A JOIA — diagnóstico de cobertura');
 console.log(JSON.stringify({entidades:relatorio.entidades,catalogoPrincipal:relatorio.catalogoPrincipal,
 ligas:relatorio.ligas,recordesAuditados:relatorio.recordesAuditados,
 pendentes:relatorio.pendentes},null,2));
 if(relatorio.listaPendente)for(const x of relatorio.listaPendente)
  console.log(x.tipo+' — '+x.nome+(x.origem?' ('+x.origem+')':''));
}
