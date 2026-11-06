import {aplicarVisualSalvo} from './Personalizacao.jsx';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import LimiteDeErro from "./LimiteDeErro.jsx";
import "./index.css";
import "./VisualFutebol.css";

aplicarVisualSalvo();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LimiteDeErro>
      <App />
    </LimiteDeErro>
  </React.StrictMode>
);
