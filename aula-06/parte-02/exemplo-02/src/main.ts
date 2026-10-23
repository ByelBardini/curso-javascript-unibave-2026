// Ponto de partida: é o primeiro arquivo que roda quando a página abre.
//
// Ele liga o Angular e manda desenhar o componente App (src/app/app.ts) na
// tag <app-root> do src/index.html. No exemplo 01 não existe nada parecido:
// o navegador lê o index.html e executa o script.js direto.
//
// Este arquivo é criado junto com o projeto e quase nunca é alterado.

import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";

bootstrapApplication(App).catch(function (erro) {
  console.error(erro);
});
