#!/usr/bin/env node
/**
 * Perfil não destrutivo do JSON do mundo com três seeds e 50 temporadas.
 * Não acessa dados de usuário, nem IndexedDB ou localStorage.
 */
import {performance} from 'node:perf_hooks';
import {gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {CLUBES} from '../src/dados/data.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {perfilPesoMundo} from '../src/simulacao/perfilPesoMundo.js';

const args=Object.fromEntries(process.argv.slice(2).filter(s=>s.startsWith('--')&&s.includes('=')).map(s=>s.slice(2).split(/=(.*)/s).slice(0,2)));
const anos=args.anos===undefined?50:Number(args.anos);
const sementes=(args.sementes||'2026,2027,2028').split(',').map(s=>s.trim()).filter(Boolean);
if(!Number.isInteger(anos)||anos<1||anos>80||sementes.length<1||sementes.length>5||new Set(sementes).size!==sementes.length) {
 throw Error('Use --anos=1..80 --sementes=a,b,c (1 a 5 distintas)');
}
const clubes=CLUBES.filter(c=>c?.nome&&Number.isFinite(c.forca));
const checkpoints=[0,10,20,30,50].filter(a=>a<=anos);
if(!checkpoints.includes(anos))checkpoints.push(anos);
const resultados=[];
for(const semente of sementes){
 const iniciado=performance.now();
 let mundo=gerarMundoJogadores(geradorTecnico('catalogo|'+semente));
 const etapas=[{ano:0,...perfilPesoMundo(mundo)}];
 for(let i=0;i<anos;i++){
   mundo=simularTemporadaMundo(mundo,geradorTecnico('catalogo|'+semente+'|'+i),{clubes,ano:2030+i});
   if(checkpoints.includes(i+1))etapas.push({ano:i+1,...perfilPesoMundo(mundo)});
 }
 resultados.push({seed:semente,duracaoMs:Math.round(performance.now()-iniciado),etapas});
}
const relatorio={tipo:'perfil-composicao-json-mundo',parametros:{anos,sementes,clubes:clubes.length,checkpoints},resultados,
 limitacoes:['Medição do motor anual completo para o catálogo de clubes, mas não das partidas e da economia detalhada.','Sem medição direta de IndexedDB, memória de celular, importação/exportação ou transição de carreira.','O valor em bytes é o texto JSON UTF-8 do estado mundial, não a quota real de armazenamento.']};
console.log(JSON.stringify(relatorio,null,2));
