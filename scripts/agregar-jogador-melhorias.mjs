import {readFileSync,readdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const TOTAL_CARREIRAS_MELHORIAS=24;

/** Confere o MESMO critério global do teste antigo, sem checar medianas parciais. */
export function validarResultadosMelhorias(relatorios) {
 if(!Array.isArray(relatorios)||!relatorios.length)throw Error('Nenhum resultado de carreira recebido.');
 const partes=relatorios[0]?.partes;
 if(!Number.isInteger(partes)||partes<1||TOTAL_CARREIRAS_MELHORIAS%partes)
   throw Error('Número inválido de partições de melhorias.');
 if(relatorios.length!==partes)throw Error('Número de relatórios menor/maior que as partições.');
 const indicesPartes=new Set();
 const todos=[];
 for(const relatorio of relatorios) {
   const {parte,resultados,total,tipo}=relatorio||{};
   if(tipo!=='jogador-melhorias-v1'||total!==TOTAL_CARREIRAS_MELHORIAS||
     relatorio.partes!==partes||!Number.isInteger(parte)||parte<1||parte>partes||
     indicesPartes.has(parte))throw Error('Relatório de partição ausente, repetido ou incompatível.');
   indicesPartes.add(parte);
   if(!Array.isArray(resultados)||resultados.length!==TOTAL_CARREIRAS_MELHORIAS/partes)
     throw Error('Partição não contém todas as carreiras atribuídas.');
   for(const linha of resultados) {
     if(!Number.isInteger(linha?.indice)||linha.indice<0||
       linha.indice>=TOTAL_CARREIRAS_MELHORIAS||
       linha.indice%partes!==parte-1||
       linha.codigo!==`MELHORIAS${linha.indice}`||
       !Number.isFinite(linha.pico)||linha.pico<0||
       !Number.isInteger(linha.classicos)||linha.classicos<0||
       !Number.isInteger(linha.fieis)||linha.fieis<0)
       throw Error('Carreira com índice, código ou métricas inválidas.');
     todos.push(linha);
   }
 }
 const unicidade=new Set(todos.map(x=>x.indice));
 if(todos.length!==TOTAL_CARREIRAS_MELHORIAS||unicidade.size!==TOTAL_CARREIRAS_MELHORIAS)
   throw Error('Carreiras duplicadas ou faltando no conjunto global de 24.');
 for(let i=0;i<TOTAL_CARREIRAS_MELHORIAS;i++)if(!unicidade.has(i))
   throw Error(`Carreira MELHORIAS${i} não executada.`);
 const picos=todos.map(x=>x.pico).sort((a,b)=>a-b);
 const mediana=picos[picos.length>>1]; // exatamente como o teste de origem
 const classicos=todos.reduce((n,x)=>n+x.classicos,0);
 const fieis=todos.reduce((n,x)=>n+x.fieis,0);
 if(mediana>90)throw Error(`Mediana acima do limite histórico: ${mediana} > 90`);
 if(classicos<=0||fieis<=0)throw Error(`Regressão de clássicos/fidelidade: ${classicos} clássicos; ${fieis} anos fiéis`);
 return {total:TOTAL_CARREIRAS_MELHORIAS,partes,mediana,classicos,fieis,
   codigos:todos.sort((a,b)=>a.indice-b.indice).map(x=>x.codigo)};
}

const executado=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(executado){
 const diretorio=resolve(process.argv[2]||'resultados-auditoria');
 const nomes=readdirSync(diretorio).filter(n=>/^jogador-melhorias-parte-\d+\.json$/.test(n));
 const relatorios=nomes.map(n=>JSON.parse(readFileSync(resolve(diretorio,n),'utf8')));
 const resultado=validarResultadosMelhorias(relatorios);
 writeFileSync(resolve(diretorio,'jogador-melhorias-24-agregado.json'),JSON.stringify(resultado,null,2));
 console.log(JSON.stringify(resultado,null,2));
 if(process.env.GITHUB_STEP_SUMMARY){
   appendFileSync(process.env.GITHUB_STEP_SUMMARY,[
     '### 24 carreiras de jogador — critérios originais preservados',
     `- Runners: ${resultado.partes}`,
     `- Carreiras únicas: ${resultado.total} (MELHORIAS0..23)`,
     `- Mediana de pico OVR (24 atletas): ${resultado.mediana} (limite 90)`,
     `- Temporadas com clássico: ${resultado.classicos} (exigência >0)`,
     `- Temporadas com fidelidade: ${resultado.fieis} (exigência >0)`,
   ].join('\n')+'\n');
 }
}
