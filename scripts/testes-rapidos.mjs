// Roda os testes de lógica sem as quatro carreiras massivas (as mesmas que o CI
// separa em jobs paralelos). Uso: npm run test:rapido
import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const MASSIVOS = new Set([
  'integracao-jogador-tecnico.test.mjs',
  'jogador-melhorias.test.mjs',
  'treinador-expresso.test.mjs',
  'simulacao-massiva-tecnico.test.mjs',
]);
const arquivos = readdirSync('tests').filter(f => f.endsWith('.test.mjs') && !MASSIVOS.has(f)).map(f => `tests/${f}`);
const r = spawnSync(process.execPath, ['--test', ...arquivos], {stdio: 'inherit'});
process.exit(r.status ?? 1);
