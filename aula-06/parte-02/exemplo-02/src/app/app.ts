// Exemplo 02: a MESMA página do exemplo 01, agora com Angular.
//
// Este arquivo faz o papel do script.js do exemplo 01. Abra os dois lado a
// lado e repare no que SUMIU daqui:
//
//   - getElementById: o app.html aponta direto para as variáveis e funções
//     desta classe, então ninguém precisa procurar elemento por id.
//   - addEventListener: os eventos ficam no próprio app.html, com (click).
//   - as funções de atualizar a tela (atualizarContador, atualizarTarefas...):
//     as funções daqui só mudam as variáveis. O Angular percebe a mudança e
//     redesenha sozinho as partes da página que usam aquela variável.
//
// Sobrou só o que importa: os dados e o que cada botão faz com eles.
//
// O arquivo termina em .ts porque é TypeScript: JavaScript com tipos. O
// navegador não entende TypeScript, então o "npm start" converte tudo para
// JavaScript antes de abrir a página.

import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

// O @Component transforma a classe logo abaixo em um componente: um pedaço
// da página com o seu próprio HTML e o seu próprio CSS.
@Component({
  // A tag que mostra este componente na página. Ela está no src/index.html.
  selector: "app-root",

  // O FormsModule traz o [(ngModel)], usado nos campos de texto do app.html
  imports: [FormsModule],

  // O HTML e o CSS deste componente: o index.html e o style.css do exemplo 01
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  // ------------------------------------------------------------------- //
  // Dados da página
  // ------------------------------------------------------------------- //
  // As mesmas variáveis do script.js, mais as duas que guardam o que foi
  // digitado nos campos (lá isso era lido direto do campo com .value).
  //
  // Como estão dentro de uma classe, não levam let nem const, e as funções
  // abaixo usam "this." para acessá-las.
  //
  // Cada variável está ligada a algum lugar do app.html: mudou aqui, a tela
  // muda junto.

  // Ligada ao campo de nome pelo [(ngModel)]
  nome = "";

  contador = 0;

  // Ligada ao campo de nova tarefa pelo [(ngModel)]
  novaTarefa = "";

  // ": string[]" é um tipo do TypeScript e quer dizer "array de textos"
  tarefas: string[] = [];

  // ------------------------------------------------------------------- //
  // 1. Saudação
  // ------------------------------------------------------------------- //
  // Não precisa de nenhuma função! No exemplo 01 eram o atualizarSaudacao()
  // e um addEventListener("input", ...). Aqui o [(ngModel)] já guarda o que
  // foi digitado em "nome" e o @if do app.html escolhe a frase.

  // ------------------------------------------------------------------- //
  // 2. Contador
  // ------------------------------------------------------------------- //
  // Dentro de uma classe as funções são escritas sem a palavra "function".
  //
  // No exemplo 01 toda função terminava chamando atualizarContador(). Aqui
  // basta mudar a variável.

  diminuir() {
    this.contador--;
  }

  aumentar() {
    this.contador++;
  }

  zerar() {
    this.contador = 0;
  }

  // ------------------------------------------------------------------- //
  // 3. Lista de tarefas
  // ------------------------------------------------------------------- //

  adicionarTarefa() {
    this.tarefas.push(this.novaTarefa);

    // Limpar a variável já limpa o campo na tela, por causa do [(ngModel)].
    // E com o campo vazio o [disabled] desabilita o botão Adicionar sozinho:
    // não existe um atualizarBotaoAdicionar() para esquecer de chamar.
    this.novaTarefa = "";
  }

  // ": number" diz que posicao é um número. O valor vem do $index do @for.
  removerTarefa(posicao: number) {
    // splice(posicao, 1) remove 1 item a partir daquela posição
    this.tarefas.splice(posicao, 1);
  }
}
