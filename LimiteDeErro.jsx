import React from "react";

/* Quando algo quebra durante a renderização, o React apaga a tela inteira e
   não diz nada. Este componente intercepta o erro e mostra o que aconteceu,
   com opção de voltar pro último save em vez de perder a carreira. */
export default class LimiteDeErro extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null, pilha: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    this.setState({ pilha: info?.componentStack || null });
    // deixa registrado no console pra quem quiser investigar (F12)
    console.error("A JOIA — erro capturado:", erro, info);
  }

  copiarRelatorio = () => {
    const txt = [
      "=== A JOIA — relatório de erro ===",
      "Mensagem: " + (this.state.erro?.message || "desconhecida"),
      "",
      "Pilha do erro:",
      this.state.erro?.stack || "(sem pilha)",
      "",
      "Componentes:",
      this.state.pilha || "(sem informação)",
    ].join("\n");
    try {
      navigator.clipboard.writeText(txt);
      alert("Relatório copiado. Cole aqui na conversa que eu resolvo.");
    } catch {
      alert(txt);
    }
  };

  render() {
    if (!this.state.erro) return this.props.children;
    const msg = this.state.erro?.message || "erro desconhecido";
    return (
      <div style={{ minHeight: "100vh", background: "#09090b", color: "#e4e4e7", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 640, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(214,72,63,0.4)", borderRadius: 10, padding: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#D6483F", marginBottom: 8 }}>⚠️ O jogo travou</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 12px" }}>Alguma coisa quebrou na hora de desenhar a tela</h1>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "#a1a1aa", margin: "0 0 16px" }}>
            Sua carreira salva <strong style={{ color: "#12A876" }}>não foi perdida</strong>. Você pode recarregar e continuar do último save.
          </p>

          <div style={{ background: "#0a0a0a", border: "1px solid #27272a", borderRadius: 6, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", marginBottom: 6 }}>Erro</div>
            <code style={{ fontSize: 12, color: "#ff9d97", wordBreak: "break-word" }}>{msg}</code>
            {this.state.erro?.stack && (
              <>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", margin: "10px 0 6px" }}>Onde aconteceu</div>
                <pre style={{ fontSize: 10.5, color: "#a1a1aa", whiteSpace: "pre-wrap", margin: 0, maxHeight: 160, overflow: "auto" }}>
                  {this.state.erro.stack.split("\n").slice(0, 6).join("\n")}
                </pre>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => window.location.reload()} style={{ flex: 1, minWidth: 150, padding: "10px 16px", background: "#12A876", color: "#0a0a0a", fontWeight: 800, border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
              ↻ Recarregar e continuar
            </button>
            <button onClick={this.copiarRelatorio} style={{ flex: 1, minWidth: 150, padding: "10px 16px", background: "transparent", color: "#e4e4e7", border: "1px solid #3f3f46", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
              📋 Copiar relatório
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#52525b", marginTop: 14, marginBottom: 0 }}>
            Se puder, copie o relatório e me mande — com ele dá pra corrigir a causa exata.
          </p>
        </div>
      </div>
    );
  }
}
