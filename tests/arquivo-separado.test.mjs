// O arquivo histórico (universo) é gravado em registro próprio; o principal guarda só a referência.
import test from 'node:test';
import assert from 'node:assert/strict';
import {_arquivoSeparado} from '../src/simulacao/armazenamentoMundo.js';
const {separarArquivos,hidratar,ehMarcador}=_arquivoSeparado;

const universo={versao:1,atletas:{a:{id:'a'}},edicoes:[{ano:2026}]};
const save=()=>({v:1,etapa:'evento',c:{nome:'X',ano:2030,universo,tecnico:{universo,ano:2030},mundo:{jogadores:[{id:1}]}}});

test('registro principal troca o universo por referência e não altera o estado do jogo',()=>{
 const s=save();
 const {registro,arquivos}=separarArquivos('ajoia_rapido_v1',s);
 assert.ok(ehMarcador(registro.c.universo));
 assert.ok(ehMarcador(registro.c.tecnico.universo));
 assert.equal(registro.c.universo.arquivoSeparado,registro.c.tecnico.universo.arquivoSeparado,'mesmo arquivo gravado uma vez');
 assert.equal(arquivos.size,1);
 assert.equal(s.c.universo,universo,'o snapshot do jogo continua com o arquivo');
 assert.equal(registro.c.mundo,s.c.mundo,'o resto é compartilhado, sem cópia');
});

test('ler junta o arquivo de volta; sem o arquivo, o save é tratado como ilegível',()=>{
 const {registro,arquivos}=separarArquivos('ajoia_rapido_v1',save());
 const lido=structuredClone(registro);
 assert.equal(hidratar(lido,new Map([...arquivos].map(([k,u])=>[k,structuredClone(u)]))),true);
 assert.deepEqual(lido.c.universo,universo);assert.deepEqual(lido.c.tecnico.universo,universo);
 assert.equal(hidratar(structuredClone(registro),new Map()),false);
});

test('save antigo com o arquivo embutido continua válido',()=>{
 const antigo=save();assert.equal(hidratar(antigo,new Map()),true);assert.equal(antigo.c.universo,universo);
});

test('modo completo (carreira) e saves sem arquivo',()=>{
 const {registro,arquivos}=separarArquivos('ajoia_save_auto',{carreira:{universo},temporadas:[]});
 assert.ok(ehMarcador(registro.carreira.universo));assert.equal([...arquivos.keys()][0],'ajoia_save_auto::carreira.universo');
 const semArquivo={v:1,c:{nome:'Y'}};assert.equal(separarArquivos('k',semArquivo).registro,semArquivo);
});
