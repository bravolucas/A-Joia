export default function SumulaLiga({jogo, atletas}) {
  if (!jogo.sumula) return null;
  const nome = id => atletas.get(String(id)) || String(id);
  return <details className="col-span-full">
    <summary className="cursor-pointer">Súmula e escalações</summary>
    <div className="grid gap-2 sm:grid-cols-2">
      {jogo.sumula.map((ficha, lado) => {
        if (!ficha) return null;
        const participantes = [];
        for (let i = 0; i < ficha.minutos.length; i += 2) {
          const [id, minutos] = ficha.minutos.slice(i, i + 2);
          participantes.push(<li key={id}>{nome(id)} · {minutos} min · {i < ficha.titulares * 2 ? 'Titular' : `Entrou aos ${90 - minutos} min`}</li>);
        }
        const ausencias = [];
        for (let i = 0; i < ficha.ausencias.length; i += 2) {
          const [id, motivo] = ficha.ausencias.slice(i, i + 2);
          ausencias.push(<li key={id}>{nome(id)} · {motivo}</li>);
        }
        return <div key={lado}>
          <strong>{lado === 0 ? jogo.casa : jogo.fora}</strong>
          <ul>{participantes}</ul>
          {ausencias.length > 0 && <><strong>Desfalques e rotação</strong><ul>{ausencias}</ul></>}
        </div>;
      })}
    </div>
  </details>;
}
