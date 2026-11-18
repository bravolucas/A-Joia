import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const ci=readFileSync(new URL('../.github/workflows/ci.yml',import.meta.url),'utf8');
const bloco=ci.split('\n  navegador:\n')[1]||'';

test('CI executa dois shards Playwright complementares no mesmo conjunto de testes',()=>{
 assert.match(bloco,/name: navegador \(\$\{\{ matrix\.parte \}\}-de-2\)/);
 assert.match(bloco,/fail-fast: false/);
 assert.match(bloco,/matrix:\s*\n\s*parte: \[1, 2\]/);
 assert.match(bloco,/npx playwright test tests\/\*\.spec\.mjs --shard="\$\{PARTE\}\/2" --reporter=line/);
 assert.doesNotMatch(bloco,/--grep\b|--grep-invert\b|test\.skip\b/);
});

test('não descarta o pré-teste de copas e não sobrescreve artefatos de outro shard',()=>{
 assert.match(bloco,/if \[ "\$PARTE" = "1" \]/);
 assert.match(bloco,/npx playwright test tests\/completo-copas-persistentes\.spec\.mjs --reporter=line/);
 assert.match(bloco,/name: capturas-navegador-\$\{\{ matrix\.parte \}\}-de-2/);
});
