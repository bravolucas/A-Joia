import {readFileSync,readdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const TOTAL_INTEGRACAO=32;

/**
 * Verifica TODOS os 32 índices e os limites globais originais; nunca aprova
 * apenas por um runner passar individualmente ou por encontrar um subconjunto.
 */
export function validarIntegracao32(relatorios){
 if(!Array.isArray(relatorios)||relatorios.length===0)throw new Error('Nenhum relatório de integração recebido.');
 const partes=relatorios[0]?.partes;
 if(!Number.isInteger(partes)||partes<1||TOTAL_INTEGRACAO%partes!==0)
  throw new Error('Número de partições inválido.');
 if(relatorios.length!==partes)throw new Error('Quantidade de relatórios de integração diferente da planejada.');
 const vistosPartes=new Set(),vistosIndices=new Set();
 let totalTemporadas=0,totalJogosTecnico=0;
 for(const r of relatorios){
  if(r?.tipo!=='integracao-jogador-tecnico-v1'||r.total!==TOTAL_INTEGRACAO||
    r.partes!==partes||!Number.isInteger(r.parte)||r.parte<1||r.parte>partes||
    vistosPartes.has(r.parte))throw new Error('Partição repetida, ausente ou incompatível.');
  vistosPartes.add(r.parte);
  if(!Array.isArray(r.indices)||r.indices.length!==TOTAL_INTEGRACAO/partes)
   throw new Error('Relatório sem todos os índices atribuídos.');
  for(const i of r.indices){
   if(!Number.isInteger(i)||i<0||i>=TOTAL_INTEGRACAO||i%partes!==r.parte-1||
     vistosIndices.has(i))throw new Error('Índice de carreira ausente, duplicado ou na partição errada.');
   vistosIndices.add(i);
  }
  if(!Number.isInteger(r.temporadas)||r.temporadas<0||
    !Number.isInteger(r.jogosTecnico)||r.jogosTecnico<0)
   throw new Error('Métricas de integração inválidas.');
  totalTemporadas+=r.temporadas;
  totalJogosTecnico+=r.jogosTecnico;
 }
 for(let i=0;i<TOTAL_INTEGRACAO;i++)if(!vistosIndices.has(i))
  throw new Error('Carreira de integração faltante: '+i);
 if(totalTemporadas<=300)throw new Error('Temporadas abaixo do limite global original: '+totalTemporadas);
 if(totalJogosTecnico<320)throw new Error('Partidas abaixo do limite global original: '+totalJogosTecnico);
 return {total:TOTAL_INTEGRACAO,partes,temporadas:totalTemporadas,jogosTecnico:totalJogosTecnico,
   indices:[...vistosIndices].sort((a,b)=>a-b)};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const diretorio=resolve(process.argv[2]||'resultados-auditoria');
 const nomes=readdirSync(diretorio).filter(x=>/^integracao-parte-\d+\.json$/.test(x));
 const r=validarIntegracao32(nomes.map(n=>JSON.parse(readFileSync(resolve(diretorio,n),'utf8'))));
 writeFileSync(resolve(diretorio,'integracao-32-validada.json'),JSON.stringify(r,null,2));
 console.log(JSON.stringify(r,null,2));
 if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  ['### Integração completa Jogador → Treinador',
   `- Carreiras únicas testadas: ${r.total}`,
   `- Partições: ${r.partes}`,
   `- Temporadas de jogador: ${r.temporadas} (>300)`,
   `- Jogos de treinador: ${r.jogosTecnico} (≥320)`,
  ].join('\n')+'\n');
}
