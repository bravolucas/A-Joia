import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../rapido.js", import.meta.url), "utf8");
const begin = source.indexOf("const LIGAS_ELITE_EUROPA_RAPIDO");
const end = source.indexOf("export function gerarOfertas", begin);
assert.ok(begin >= 0 && end > begin, "Mercado rápido deve estar presente");
const snippet = source.slice(begin, end) + "\n globalThis.pesoMercadoRapido = pesoMercadoRapido;";
const context = { hashTexto(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }, afinidade: () => 1 };
vm.runInNewContext(snippet, context);
const peso = context.pesoMercadoRapido;
const base = { idade: 27, nac: "brasil", codigo: "ABC123", ano: 2035, temporadas: [{ jogos: 30, nota: 7.5 }] };
const atual = { liga: "inglaterra", forca: 89 };
const brasil = { nome: "Flamengo", liga: "brasileirao", forca: 85 };
const europa = { nome: "Milan", liga: "italia", forca: 87 };
test("Auge europeu privilegia propostas europeias", () => {
  assert.ok(peso(base, atual, brasil, 88, {}) < peso(base, atual, europa, 88, {}) * 0.1);
});
test("Pedido expresso ao empresário libera mercado brasileiro", () => {
  assert.ok(peso(base, atual, brasil, 88, { ligas: ["brasileirao"] }) > peso(base, atual, brasil, 88, {}) * 10);
});
test("Veteranos têm mais oportunidades no Brasil", () => {
  assert.ok(peso({ ...base, idade: 35 }, atual, brasil, 83, {}) > peso(base, atual, brasil, 83, {}) * 5);
});
test("Clubes distintos têm pesos diferentes e reproduzíveis", () => {
  const clubes = ["Flamengo","Palmeiras","Corinthians","São Paulo","Botafogo","Bahia","Cruzeiro","Grêmio","Internacional","Fluminense"];
  const valores = clubes.map(nome => peso({ ...base, idade: 33 }, atual, { ...brasil, nome }, 83, { ligas: ["brasileirao"] }));
  assert.equal(new Set(valores).size, clubes.length);
  assert.deepEqual(valores, clubes.map(nome => peso({ ...base, idade: 33 }, atual, { ...brasil, nome }, 83, { ligas: ["brasileirao"] })));
});
test("Não modifica o formato do save", () => {
  assert.match(source, /export const VERSAO_RAPIDO = 1;/);
  assert.match(source, /export const CHAVE_SAVE_RAPIDO = "ajoia_rapido_v1";/);
});
