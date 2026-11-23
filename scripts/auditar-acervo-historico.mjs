#!/usr/bin/env node
/**
 * Inventário de pesquisa do acervo histórico.
 * node scripts/auditar-acervo-historico.mjs [--pendentes] [--json]
 */
import {INVENTARIO_CLUBES_HISTORICOS,INVENTARIO_SELECOES_HISTORICAS,
 TOTAL_ENTIDADES_HISTORICAS} from '../src/dados/coberturaAcervoHistorico.js';
import {REFERENCIAS_RECORDES_CLUBES} from '../src/dados/acervoClubesHistoricos.js';
import {REFERENCIAS_RECORDES_SELECOES} from '../src/dados/acervoSelecoesHistoricas.js';
const grupos=[...INVENTARIO_CLUBES_HISTORICOS,...INVENTARIO_SELECOES_HISTORICAS];
const pendentes=grupos.filter(x=>x.cobertura==='pendente_apuracao');
const relatorio={
 versao:'2026-11-23',entidades:TOTAL_ENTIDADES_HISTORICAS,
 recordesAuditados:{clubes:REFERENCIAS_RECORDES_CLUBES.length,
  selecoes:REFERENCIAS_RECORDES_SELECOES.length},
 pendentes:{clubes:pendentes.filter(x=>x.tipo==='clube').length,
  selecoes:pendentes.filter(x=>x.tipo==='selecao').length},
 ...(process.argv.includes('--pendentes')?{listaPendente:pendentes.map(x=>({tipo:x.tipo,nome:x.nome,origem:x.origem||null}))}:{}),
};
if(process.argv.includes('--json'))console.log(JSON.stringify(relatorio,null,2));
else{
 console.log('ACERVO HISTÓRICO A JOIA — diagnóstico de cobertura');
 console.log(JSON.stringify({entidades:relatorio.entidades,recordesAuditados:relatorio.recordesAuditados,
 pendentes:relatorio.pendentes},null,2));
 if(relatorio.listaPendente)for(const x of relatorio.listaPendente)
  console.log(x.tipo+' — '+x.nome+(x.origem?' ('+x.origem+')':''));
}
