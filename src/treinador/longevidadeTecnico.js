export const IDADE_MAXIMA_TECNICO = 85;
export const idadeTecnico = t => Number.isFinite(t?.idade)?t.idade:(t?.idadeInicio??40)+Math.max(0,(t?.ano??0)-(t?.anoInicio??t?.temporadas?.[0]?.ano??t?.ano??0));
export const carreiraTecnicoEncerrada = (t,idade=idadeTecnico(t)) => !!t?.aposentado||(idade>=IDADE_MAXIMA_TECNICO&&!t?.copasEmJogo&&!t?.finaisPendentes?.length);
