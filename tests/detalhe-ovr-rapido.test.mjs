import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,ovrDe,opcoesPretemporada,escolherPretemporada,cartaDe} from '../src/jogador/rapido.js';
import {detalharOvr,impactoCartaOvr,ovrExato} from '../src/jogador/detalheOvr.js';

const atleta=(posicao='ATA',codigo='OVR-DETALHE')=>{const c=criarJogador({nome:'Raio X',nac:'BRA',posicao,origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo});c.clubeNome='Santos';c.flags.baseEscolhida=true;return c;};

test('valor exato do OVR arredonda para o mesmo número exibido no topo',()=>{
 for(const pos of ['ATA','ZAG','GOL','MEI','LD']){
  const c=atleta(pos,'OVR-'+pos);
  for(let i=0;i<30;i++){
   c.attrs={velocidade:40+i*2,finalizacao:90-i,passe:55+i,drible:60,defesa:45+i,fisico:70-i};
   assert.equal(Math.round(ovrExato(c)),ovrDe(c),`${pos} ${i}`);
  }
 }
});

test('composição fecha: nível + fase − adaptação = OVR exibido',()=>{
 const c=atleta();
 c.attrs={velocidade:70,finalizacao:80,passe:60,drible:72,defesa:40,fisico:68};
 c.formaAttrs={finalizacao:2,fisico:1};c.formaNivel=1;
 c.jornada={transicao:{restantes:1,penalidade:2}};
 const d=detalharOvr(c);
 assert.equal(d.penalidade,2);
 assert.equal(d.base+d.fase.pontos-d.penalidade,d.ovr);
 assert.ok(d.fase.pontos>0);
 assert.ok(d.proximo.falta>0&&d.proximo.falta<=1);
});

test('centroavante: finalização pesa mais e defesa quase nada',()=>{
 const d=detalharOvr(atleta());
 const por=Object.fromEntries(d.atributos.map(a=>[a.id,a]));
 assert.equal(d.prioridades[0].id,'finalizacao');
 assert.equal(por.finalizacao.relevancia,'Essencial');
 assert.equal(por.defesa.relevancia,'Pouco relevante');
 const soma=d.atributos.reduce((s,a)=>s+a.porPonto,0);
 assert.ok(Math.abs(soma-1)<1e-9);
});

test('prévia +OVR da carta bate com o que a temporada aplica',()=>{
 let c=atleta('ATA','OVR-CARTA');
 for(const carta of opcoesPretemporada(c)){
  const prev=impactoCartaOvr(c,carta);
  const depois={...c.attrs};Object.entries(prev.aplicados).forEach(([a,d])=>{depois[a]+=d;});
  assert.equal(Math.round(ovrExato(c,depois))-ovrDe(c),prev.ovr);
 }
 const id=opcoesPretemporada(c)[0].id,prev=impactoCartaOvr(c,id);
 c=escolherPretemporada(c,id);
 const {card}=jogarTemporada(c);
 assert.equal(card.pretemporada?.deltaOvr??0,prev.ovr);
 assert.ok(cartaDe(id));
});
