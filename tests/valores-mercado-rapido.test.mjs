// Valores do jogador principal no Modo Rápido na mesma régua do mundo (economia.js)
// e dentro de faixas do mercado real 2025/26.
import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,valorAtual,valorTransferencia,ovrDe} from '../src/jogador/rapido.js';
import {valorMercadoEuro} from '../src/simulacao/economia.js';

function atleta(ovr,idade,clube,{fama=40,forma=1,teto=0}={}){
 const c=criarJogador({nome:'Preço Real',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'PRECO-REAL'});
 for(const a of Object.keys(c.attrs))c.attrs[a]=ovr;let g=0;
 while(ovrDe(c)<ovr&&g++<60)c.attrs.finalizacao++;while(ovrDe(c)>ovr&&g++<120)c.attrs.defesa--;
 c.potencial=Object.fromEntries(Object.keys(c.attrs).map(a=>[a,Math.min(99,c.attrs[a]+teto)]));
 Object.assign(c,{idade,clubeNome:clube,fama,formaMercado:forma});c.contrato={...c.contrato,restantes:4,anos:5,multa:9e9};
 return c;
}
const mi=v=>v/1000;
const entre=(v,a,b,msg)=>assert.ok(mi(v)>=a&&mi(v)<=b,`${msg}: € ${mi(v).toFixed(1)} mi fora de € ${a}–${b} mi`);

test('mesmo atleta, mesma régua do mundo: sem fama nem fase, valor = valorMercadoEuro',()=>{
 const c=atleta(82,26,'Chelsea',{fama:0});
 assert.equal(valorAtual(c),valorMercadoEuro({ovr:82,idade:26,liga:'inglaterra',potencial:82,contrato:4}));
});

test('faixas realistas de valor e de transferência',()=>{
 entre(valorTransferencia(atleta(80,24,'Flamengo'),'Palmeiras'),5,20,'titular do Brasileirão entre grandes do Brasil');
 entre(valorTransferencia(atleta(76,20,'Flamengo',{forma:1.2,teto:12}),'Chelsea'),15,60,'joia brasileira para a Premier League');
 entre(valorTransferencia(atleta(86,22,'Benfica',{fama:65,forma:1.2,teto:6}),'Manchester City'),50,130,'craque jovem para gigante');
 entre(valorAtual(atleta(95,25,'Chelsea',{fama:100,forma:1.4})),100,230,'melhor do mundo no auge');
});

test('ninguém dobra o recorde mundial (€ 222 mi), nem no extremo',()=>{
 const c=atleta(99,24,'Real Madrid',{fama:100,forma:1.4});
 assert.ok(mi(valorAtual(c))<=260);assert.ok(mi(valorTransferencia(c,'PSG'))<=260);
});

test('liga e idade pesam: Brasileirão vale menos que Premier; veterano vale menos que jovem',()=>{
 assert.ok(valorAtual(atleta(82,25,'Flamengo'))<valorAtual(atleta(82,25,'Chelsea'))*0.6);
 assert.ok(valorAtual(atleta(84,32,'Chelsea'))<valorAtual(atleta(84,24,'Chelsea'))*0.5);
});

test('comprar do Brasil custa mais para a Premier que para um vizinho; sem contrato é de graça',()=>{
 const c=atleta(78,21,'Santos',{teto:8});
 assert.ok(valorTransferencia(c,'Arsenal')>valorTransferencia(c,'Corinthians'));
 c.contrato={...c.contrato,restantes:0};assert.equal(valorTransferencia(c,'Arsenal'),0);
});
