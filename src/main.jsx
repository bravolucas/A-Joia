import {prepararArmazenamento} from './simulacao/armazenamentoMundo.js';
import {MovimentoProvider} from './comum/efeitos/Movimento.jsx';
import {aplicarVisualSalvo} from './comum/Personalizacao.jsx';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import LimiteDeErro from "./LimiteDeErro.jsx";
import "./index.css";
import "./comum/VisualFutebol.css";
import "./comum/FluxoResultados.css";
import "./comum/ArenaMini.css";
import "./comum/efeitos/Diamante.css";

async function iniciar(){
await prepararArmazenamento();
aplicarVisualSalvo();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LimiteDeErro>
      <MovimentoProvider><App /></MovimentoProvider>
    </LimiteDeErro>
  </React.StrictMode>
);

}
iniciar().catch(erro=>{
 const raiz=document.getElementById('root');raiz.textContent='';
 const aviso=document.createElement('p');aviso.setAttribute('role','alert');aviso.textContent=erro.message;
 const botao=document.createElement('button');botao.textContent='Tentar novamente';botao.onclick=()=>location.reload();raiz.append(aviso,botao);
});
