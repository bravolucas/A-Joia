import React from "react";
import ReactDOM from "react-dom/client";
import AJoiaGame from "./AJoiaGame.jsx";
import LimiteDeErro from "./LimiteDeErro.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LimiteDeErro>
      <AJoiaGame />
    </LimiteDeErro>
  </React.StrictMode>
);
