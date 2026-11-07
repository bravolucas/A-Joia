import Personalizacao from '../comum/Personalizacao.jsx';
import { CamisaPremium, MedalhaFeito } from '../comum/VisualFutebol.jsx';
import Icone from '../comum/Icone.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { TACAS_MUSEU, CAMISAS_MUSEU, FEITOS_MUSEU, lerMuseu, sincronizarMuseuDosSaves, importarMuseu, progressoFeitoMuseu } from './museu.js';
import { escudoDe } from '../comum/arte.js';
import { TacaCompeticao } from '../comum/trofeus.jsx';
import './Museu.css';

const ABAS = [{ id: 'tacas', nome: 'Taças', simbolo: '🏆', catalogo: TACAS_MUSEU }, { id: 'camisas', nome: 'Camisas', simbolo: '👕', catalogo: CAMISAS_MUSEU }, { id: 'feitos', nome: 'Feitos', simbolo: '✦', catalogo: FEITOS_MUSEU }];
const quantidade = item => Object.values(item?.fontes || {}).reduce((s, f) => s + f.quantidade, 0);
function Camisa({ item }) { return <span className="mu-shirt"><CamisaPremium nome={item.nome} cor={item.cor || '#176b50'} numero={item.numero||10}/></span>; }
function Ilustracao({ aba, item }) {
  if (aba === 'tacas') return <TacaCompeticao nome={item.nome} tipo={item.tipo} size={86} />;
  if (aba === 'camisas') return <Camisa item={item} />;
  return <MedalhaFeito id={item.id} />;
}
function Detalhe({ aba, item, conquista, progresso, onFechar }) {
  const dialogo = useRef(null);
  useEffect(() => {
    const anterior = document.activeElement;
    const elemento = dialogo.current;
    elemento?.showModal();
    return () => { elemento?.close(); anterior?.focus(); };
  }, []);
  return <dialog ref={dialogo} className="mu-dialog" aria-labelledby="mu-detail-title" onCancel={e => { e.preventDefault(); onFechar(); }} onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
    <button className="mu-close" onClick={onFechar} aria-label="Fechar detalhes">×</button>
    <div className={`mu-detail-art ${conquista ? '' : 'mu-locked'}`}><Ilustracao aba={aba} item={{...item,numero:Object.values(conquista?.fontes||{}).find(f=>f.historia?.numeros?.length)?.historia.numeros.at(-1)||10}} /></div>
    <span className="mu-eyebrow">{conquista ? 'FAZ PARTE DA SUA HISTÓRIA' : 'SEU PRÓXIMO OBJETIVO'}</span>
    <h2 id="mu-detail-title">{item.nome}</h2><p>{item.descricao || `Conquiste ${item.nome} em uma carreira.`}</p>
    {!conquista&&progresso&&<p className="mu-progress-detail">Progresso nesta carreira: {progresso.atual}/{progresso.meta}<progress value={progresso.atual} max={progresso.meta}/></p>}
    {aba === 'camisas' && <p className="mu-small">Camisa comemorativa do A-Joia, com as cores e o escudo do clube.</p>}
    {conquista ? <><div className="mu-detail-count"><strong>{quantidade(conquista)}</strong><span>{aba === 'tacas' ? 'títulos registrados' : aba === 'camisas' ? 'registros de idolatria' : 'carreiras que alcançaram este marco'}</span></div><h3>Quem escreveu essa história</h3><ul className="mu-sources">{Object.entries(conquista.fontes).map(([id, f]) => <li key={id}><span><strong>{f.atleta}</strong><small>{f.papel}{f.clube ? ` · ${f.clube}` : ''}{f.ano ? ` · ${f.ano}` : ''}</small>{f.historia&&<small>{f.historia.anos?.join(', ')}{f.historia.numeros?.length?` · Camisa ${f.historia.numeros.join('/')}`:''}<br/>{f.historia.feito}</small>}</span>{aba === 'tacas' && <b>×{f.quantidade}</b>}</li>)}</ul></> : <div className="mu-locked-hint">Ainda não desbloqueado. A próxima carreira pode mudar isso.</div>}
    <button className="mu-button mu-primary" onClick={onFechar}>Voltar à coleção</button>
  </dialog>;
}

export default function Museu({ onVoltar }) {
  const [carreiraAtual]=useState(()=>{try{return JSON.parse(localStorage.getItem('ajoia_rapido_v1'))?.c||null;}catch{return null;}});
  const [museu, setMuseu] = useState(() => lerMuseu());
  const [aba, setAba] = useState('tacas');
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [limite, setLimite] = useState(48);
  useEffect(() => setLimite(48), [aba, filtro, busca]);
  const [detalhe, setDetalhe] = useState(null);
  const [aviso, setAviso] = useState('');
  const arquivo = useRef(null);
  useEffect(() => {
    if (!sincronizarMuseuDosSaves()) setAviso('Não foi possível atualizar parte da coleção. Verifique o armazenamento do navegador.');
    setMuseu(lerMuseu());
    window.scrollTo({ top: 0 });
  }, []);
  const catalogo = ABAS.find(a => a.id === aba).catalogo;
  const extras = Object.values(museu[aba]).filter(i => !catalogo.some(c => c.id === i.id));
  const itens = [...catalogo, ...extras];
  const desbloqueados = Object.keys(museu[aba]).length;
  const total = ABAS.reduce((n, a) => n + Object.keys(museu[a.id]).length, 0);
  const visiveis = itens.filter(i => (!busca || i.nome.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'))) && (filtro === 'todos' || (filtro === 'obtidos' ? !!museu[aba][i.id] : !museu[aba][i.id])));
  const exportar = () => {
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(museu, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'a-joia-museu.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setAviso('Backup da coleção exportado.');
    } catch { setAviso('Não foi possível exportar a coleção.'); }
  };
  const importar = async e => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('O arquivo é muito grande. Escolha um backup do museu de até 5 MB.');
      setMuseu(importarMuseu(JSON.parse(await file.text()))); setAviso('Coleção importada. Suas conquistas anteriores foram preservadas.');
    } catch (erro) { setAviso(erro instanceof SyntaxError ? 'Arquivo inválido. Escolha um backup JSON do museu.' : erro.message || 'Não foi possível importar.'); }
  };
  return <main className="mu">
    <header className="mu-top"><button onClick={onVoltar} className="mu-back">← Voltar ao menu</button><span>A JOIA · COLEÇÃO PERMANENTE</span></header>
    <section className="mu-hero"><div><span className="mu-eyebrow">O FUTEBOL PASSA. A HISTÓRIA FICA.</span><h1>Seu museu.</h1><p>Cada carreira escreve um capítulo. Aqui, todas as suas conquistas se encontram.</p></div><div className="mu-hero-total"><strong>{total}</strong><span>PEÇAS NA COLEÇÃO</span></div></section>
    <Personalizacao/>
    <div className="mu-categories" role="tablist" aria-label="Categorias do museu">{ABAS.map(a => <button key={a.id} role="tab" id={`mu-tab-${a.id}`} aria-selected={aba === a.id} tabIndex={aba === a.id ? 0 : -1} onKeyDown={e => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const i = ABAS.findIndex(b => b.id === a.id);
      const proxima = ABAS[e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3].id;
      setAba(proxima); setDetalhe(null); document.getElementById(`mu-tab-${proxima}`)?.focus();
    }} aria-controls="mu-panel" onClick={() => { setAba(a.id); setDetalhe(null); }}><span aria-hidden="true"><Icone e={a.simbolo} size={23}/></span><span>{a.nome}<small>{Object.keys(museu[a.id]).length} na coleção</small></span></button>)}</div>
    <section role="tabpanel" id="mu-panel" aria-labelledby={`mu-tab-${aba}`} tabIndex={0}>
      <div className="mu-progress-heading"><h2>{ABAS.find(a => a.id === aba).nome} da sua história</h2><span>{desbloqueados} / {itens.length}</span></div><progress aria-label={`Progresso de ${aba}`} value={desbloqueados} max={itens.length || 1} />
      <div className="mu-toolbar"><label className="mu-search"><span className="sr-only">Buscar na coleção</span><input type="search" placeholder="Buscar na coleção…" value={busca} onChange={e => setBusca(e.target.value)} /></label><div className="mu-filters" aria-label="Filtrar coleção">{[['todos', 'Todos'], ['obtidos', 'Obtidos'], ['faltam', 'Faltam']].map(([id, nome]) => <button key={id} aria-pressed={filtro === id} onClick={() => setFiltro(id)}>{nome}</button>)}</div></div>
      {!desbloqueados && <div className="mu-intro"><strong>Uma coleção começa com uma história.</strong><p>{aba === 'tacas' ? 'Ganhe títulos como jogador ou treinador. As taças ficam aqui mesmo quando você começa outra carreira.' : aba === 'camisas' ? 'Dispute uma temporada pelo clube e alcance 75 de aprovação da torcida para eternizar sua camisa.' : 'Alcance os objetivos abaixo em suas carreiras e complete sua coleção de feitos.'}</p></div>}
      <div className="mu-grid">{visiveis.slice(0, limite).map(item => { const registro = museu[aba][item.id]; return <button key={item.id} className={`mu-card ${registro ? 'mu-earned' : 'mu-unearned'}`} onClick={() => setDetalhe(item)} aria-label={`${item.nome}, ${registro ? 'desbloqueado' : 'bloqueado'}`}><span className="mu-card-top">{registro ? '◆ DESBLOQUEADO' : '◇ A CONQUISTAR'}{registro && aba === 'tacas' && <b>×{quantidade(registro)}</b>}</span><span className={`mu-art ${registro ? '' : 'mu-locked'}`}><Ilustracao aba={aba} item={item} /></span><strong>{item.nome}</strong><span className="mu-card-sub">{registro ? Object.values(registro.fontes)[0]?.atleta : aba === 'camisas' ? 'Torne-se ídolo do clube' : 'Ver como desbloquear'}</span></button>; })}</div>
      {visiveis.length > limite && <button className="mu-button mu-more" onClick={() => setLimite(l => l + 48)}>Mostrar mais peças ({visiveis.length - limite} restantes)</button>}
      {!visiveis.length && <p className="mu-no-results">Nenhuma peça com esse filtro. Experimente outra busca.</p>}
    </section>
    <footer className="mu-footer"><div><strong>Sua história continua na próxima carreira.</strong><p>A coleção fica neste navegador, separada dos saves. Exporte um backup antes de limpar os dados ou trocar de dispositivo.</p></div><div className="mu-backup"><button className="mu-button" onClick={exportar}>Exportar coleção</button><button className="mu-button" onClick={() => arquivo.current?.click()}>Importar coleção</button><input ref={arquivo} type="file" accept="application/json,.json" onChange={importar} hidden /></div></footer>
    {aviso && <p role="status" className="mu-notice">{aviso}</p>}
    {detalhe && <Detalhe key={detalhe.id} aba={aba} item={detalhe} conquista={museu[aba][detalhe.id]} progresso={progressoFeitoMuseu(carreiraAtual,detalhe.id)} onFechar={() => setDetalhe(null)} />}
  </main>;
}
