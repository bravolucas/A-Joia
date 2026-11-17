export const IDADE_MAXIMA_TECNICO = 85;
export const LIMITE_TEMPORADAS_TECNICO = 30;

// Conta anos efetivamente decorridos, inclusive desemprego, sem apagar ou
// recontar temporadas. Em saves legados usa também o histórico disponível.
export const anosCarreiraTecnico = (t, idade = idadeTecnico(t)) => Math.max(
  Array.isArray(t?.temporadas) ? t.temporadas.length : 0,
  Number.isFinite(t?.ano) && Number.isFinite(t?.anoInicio) ? Math.max(0, t.ano - t.anoInicio) : 0,
  Number.isFinite(idade) && Number.isFinite(t?.idadeInicio) ? Math.max(0, idade - t.idadeInicio) : 0
);
export const idadeTecnico = t => Number.isFinite(t?.idade)?t.idade:(t?.idadeInicio??40)+Math.max(0,(t?.ano??0)-(t?.anoInicio??t?.temporadas?.[0]?.ano??t?.ano??0));
export const carreiraTecnicoEncerrada = (t,idade=idadeTecnico(t)) => !!t?.aposentado ||
  ((idade>=IDADE_MAXIMA_TECNICO || anosCarreiraTecnico(t,idade)>=LIMITE_TEMPORADAS_TECNICO) &&
    !t?.copasEmJogo && !t?.finaisPendentes?.length);
