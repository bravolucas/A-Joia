import React from 'react';
import { detalharOvr } from './detalheOvr.js';

/* Gaveta do OVR (Modo Rápido): composição do número, peso de cada atributo
   na posição, o que é passageiro e onde vale mais a pena evoluir. */
const num = (v, casas = 2) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: casas });
const sinal = (v) => (v > 0 ? `+${v}` : `${v}`);
const COR_RELEVANCIA = { Essencial: '#EBC557', Importante: '#BCEAFF', Secundário: '#9EB5C9', 'Pouco relevante': '#6B8296' };

function Linha({ rotulo, valor, cor = '#F2F5F3', detalhe }) {
  return (
    <li className="flex items-baseline justify-between gap-3 text-[15px]">
      <span className="text-[#C9D9E8]">{rotulo}{detalhe && <small className="block text-[12px] text-[#9EB5C9]">{detalhe}</small>}</span>
      <span className="font-stat shrink-0" style={{ color: cor }}>{valor}</span>
    </li>
  );
}

export default function PainelOvr({ c, motivos = [] }) {
  const d = detalharOvr(c);
  const maxContrib = Math.max(...d.atributos.map((a) => a.contribuicao));
  const foco = d.prioridades.filter((a) => a.faltaTeto !== 0).slice(0, 2);
  const corFase = d.fase.pontos > 0 ? '#BCEAFF' : '#E36B5B';
  return (
    <div className="flex flex-col gap-3" data-testid="painel-ovr">
      <section className="rp-painel px-4 py-3" aria-label="Próximo ponto de OVR">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold tracking-wider text-[#9EB5C9]">OVERALL · {d.posicao.toUpperCase()}</div>
            <div className="font-stat text-[40px] leading-none text-[#F2F5F3]">{d.ovr}<small className="text-[15px] text-[#9EB5C9] ml-1.5">({num(d.exato)})</small></div>
          </div>
          {d.ovr < 99 && <div className="text-right text-[13px] text-[#C9D9E8]">Faltam <b className="font-stat text-[#EBC557]">{num(d.proximo.falta)}</b><br />para chegar a {d.proximo.ovr}</div>}
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-label={`Progresso até ${d.proximo.ovr} de OVR`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(d.proximo.progresso * 100)}>
          <div className="h-full rounded-full bg-[#EBC557]" style={{ width: `${d.proximo.progresso * 100}%` }} />
        </div>
        <p className="text-[12px] text-[#9EB5C9] mt-1.5">O número do topo é arredondado: pequenos ganhos de treino também contam, mesmo quando o OVR não muda.</p>
      </section>

      <section className="rp-painel px-4 py-3" aria-label="Composição do OVR">
        <div className="text-[10px] font-bold tracking-wider text-[#9EB5C9] mb-1.5">DO QUE É FEITO SEU OVR</div>
        <ul className="flex flex-col gap-1.5">
          <Linha rotulo="Nível dos atributos" valor={d.base} detalhe="Evolução de longo prazo, limitada pelo seu teto" />
          {d.fase.pontos !== 0 && <Linha rotulo={d.fase.pontos > 0 ? 'Boa fase' : 'Má fase'} valor={sinal(d.fase.pontos)} cor={corFase} detalhe={`Passageira: vem do rendimento recente${d.fase.proxima !== d.fase.nivel ? ` e perde força na próxima temporada` : ''}.`} />}
          {d.penalidade > 0 && <Linha rotulo="Adaptação à nova posição" valor={`-${d.penalidade}`} cor="#E36B5B" detalhe={d.transicao?.restantes ? `Some em ${d.transicao.restantes} temporada(s).` : 'Some ao fim da adaptação.'} />}
          <li className="border-t border-white/10 pt-1.5 flex justify-between text-[15px] font-bold"><span className="text-[#F2F5F3]">OVR</span><span className="font-stat text-[#EBC557]">{d.ovr}</span></li>
        </ul>
      </section>

      <section className="rp-painel px-4 py-3" aria-label="Peso de cada atributo">
        <div className="text-[10px] font-bold tracking-wider text-[#9EB5C9] mb-0.5">PESO DE CADA ATRIBUTO NA POSIÇÃO</div>
        <p className="text-[12px] text-[#9EB5C9] mb-2">Quanto cada +1 no atributo soma ao seu OVR.</p>
        <ul className="flex flex-col gap-2.5">
          {d.prioridades.map((a) => (
            <li key={a.id}>
              <div className="flex items-baseline justify-between gap-2 text-[14px]">
                <span className="text-[#F2F5F3] font-bold">{a.nome} <span className="font-stat text-[#C9D9E8]">{a.valor}</span>{a.fase !== 0 && <small className="ml-1 text-[11px]" style={{ color: a.fase > 0 ? '#BCEAFF' : '#E36B5B' }}>({sinal(a.fase)} fase)</small>}</span>
                <span className="font-stat text-[13px] text-[#EBC557] shrink-0">+{num(a.porPonto)} por ponto</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(a.contribuicao / maxContrib) * 100}%`, background: COR_RELEVANCIA[a.relevancia] }} /></div>
              <div className="flex justify-between text-[11px] mt-0.5">
                <span style={{ color: COR_RELEVANCIA[a.relevancia] }}>{a.relevancia}</span>
                <span className="text-[#9EB5C9]">{a.faltaTeto == null ? '' : a.faltaTeto === 0 ? 'No teto: só treino passa do limite' : `${a.faltaTeto} até o teto`}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {foco.length > 0 && (
        <section className="rp-painel px-4 py-3" aria-label="Onde evoluir">
          <div className="text-[10px] font-bold tracking-wider text-[#9EB5C9] mb-1.5">ONDE VALE MAIS EVOLUIR</div>
          <p className="text-[15px] text-[#C9D9E8]">
            Priorize <b className="text-[#EBC557]">{foco[0].nome}</b>{foco[1] && <> e <b className="text-[#EBC557]">{foco[1].nome}</b></>}.
            {' '}Cada ponto em {foco[0].nome} vale {num(foco[0].porPonto / Math.max(0.001, d.prioridades.at(-1).porPonto), 0)}× um ponto em {d.prioridades.at(-1).nome}.
          </p>
          <p className="text-[12px] text-[#9EB5C9] mt-1">Nas cartas de pré-temporada, o selo “+OVR” já mostra o efeito de cada treino no seu número.</p>
        </section>
      )}

      <section className="rp-painel px-4 py-3" aria-label="Momento da carreira">
        <div className="text-[10px] font-bold tracking-wider text-[#9EB5C9] mb-1">MOMENTO DA CARREIRA · {c.idade} ANOS</div>
        <p className="text-[15px] text-[#C9D9E8]">{d.carreira.txt}</p>
      </section>

      {motivos.length > 0 && (
        <section className="rp-painel px-4 py-3" aria-label="Última temporada">
          <div className="text-[10px] font-bold tracking-wider text-[#9EB5C9] mb-1.5">O QUE MEXEU NO OVR NA ÚLTIMA TEMPORADA</div>
          <ul className="flex flex-col gap-1">
            {motivos.map((m, i) => <Linha key={i} rotulo={m.txt} valor={sinal(m.d)} cor={m.d > 0 ? '#BCEAFF' : '#E36B5B'} />)}
          </ul>
        </section>
      )}
    </div>
  );
}
