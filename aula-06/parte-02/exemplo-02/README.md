# Exemplo 02 — A mesma página com Angular

A página do [exemplo 01](../exemplo-01/index.html) feita de novo com
[Angular](https://angular.dev). O visual e as funções são os mesmos: saudação,
contador e lista de tarefas. O que muda é o código.

## Como rodar

Diferente do exemplo 01, esta página não abre com dois cliques nem com o
_Live Server_: o navegador não entende TypeScript nem as sintaxes do Angular
no HTML. Antes de abrir, o Angular converte tudo para HTML, CSS e JavaScript
comuns.

1. Instale o [Node.js](https://nodejs.org) (versão 20.19, 22.12, 24 ou mais
   nova). Pelo terminal, do mesmo jeito que o Git na aula 01:

   ```
   winget install OpenJS.NodeJS.LTS
   ```

2. Abra o terminal **nesta pasta** (`aula-06/parte-02/exemplo-02`) e instale
   as dependências. Só precisa fazer isso uma vez: o comando baixa o Angular
   para a pasta `node_modules`.

   ```
   npm install
   ```

3. Rode a página:

   ```
   npm start
   ```

   O navegador abre em http://localhost:4200. Deixe o terminal aberto: a cada
   arquivo salvo, a página atualiza sozinha. Para parar, `Ctrl + C`.

## Quais arquivos comparar

Só três arquivos têm o código da página, um para cada arquivo do exemplo 01:

| Exemplo 01   | Exemplo 02                                   | O que tem                   |
| ------------ | -------------------------------------------- | --------------------------- |
| `index.html` | [src/app/app.html](src/app/app.html)         | o HTML da página            |
| `style.css`  | [src/app/app.css](src/app/app.css)           | o CSS da página             |
| `script.js`  | [src/app/app.ts](src/app/app.ts)             | as variáveis e as funções   |

O resto é a estrutura que todo projeto Angular tem. Ela é criada junto com o
projeto e quase nunca é alterada:

- [src/index.html](src/index.html) — a página "casca": o `<body>` só tem a
  tag `<app-root>`, onde o Angular desenha o `app.html`.
- [src/main.ts](src/main.ts) — o primeiro arquivo que roda: liga o Angular.
- [src/styles.css](src/styles.css) — o CSS que vale para a página toda (o
  `body`). O `app.css` só vale para o `app.html`.
- `package.json` — a lista de pacotes que o `npm install` baixa e o comando
  que o `npm start` executa.
- `angular.json` — configuração do Angular: qual arquivo inicia o projeto,
  onde está o CSS global...
- `tsconfig.json` — configuração do TypeScript.
- `.gitignore` — impede que `node_modules` e as pastas geradas vão para o Git.

## Exemplo 01 x Exemplo 02

| Para...                                   | Exemplo 01 (JavaScript puro)                        | Exemplo 02 (Angular)                     |
| ----------------------------------------- | --------------------------------------------------- | ---------------------------------------- |
| achar um elemento da página               | `document.getElementById("valor-contador")`         | não precisa                              |
| mostrar uma variável                      | `valorContador.textContent = contador`              | `{{ contador }}`                         |
| chamar uma função no clique               | `botao.addEventListener("click", aumentar)`         | `(click)="aumentar()"`                   |
| ler um campo enquanto o usuário digita    | `addEventListener("input", ...)` + `campo.value`    | `[(ngModel)]="nome"`                     |
| habilitar e desabilitar um botão          | `botaoZerar.disabled = contador === 0`              | `[disabled]="contador === 0"`            |
| mostrar e esconder um elemento            | `semTarefas.style.display = "none"`                 | `@if (tarefas.length === 0) { ... }`     |
| repetir um elemento para cada item        | `for` + `createElement` + `appendChild`             | `@for (tarefa of tarefas; track $index)` |
| atualizar a tela depois de mudar um dado  | chamar `atualizarContador()`, `atualizarTarefas()`… | automático                               |

## Como este projeto foi criado

Com o comando abaixo, que cria um projeto Angular novo em uma pasta
`nome-do-projeto`:

```
npx @angular/cli@21 new nome-do-projeto --style=css --ssr=false --skip-tests
```

Depois foram apagados os arquivos que este exemplo não usa (testes,
`app.config.ts`, configurações do VS Code e do Prettier, ícone...) e o
conteúdo de exemplo do `app.html` foi trocado pela página da aula. O Angular
21 foi escolhido porque roda no Node.js 20.19, 22.12 ou em qualquer versão
24; o Angular 22 exige a 24.15 ou mais nova.
