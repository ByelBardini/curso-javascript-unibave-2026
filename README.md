# Curso JavaScript - Unibave 2026

Repositório com os exercícios e exemplos desenvolvidos durante o curso de JavaScript da Unibave.

## Professores

| Nome | GitHub |
|------|--------|
| Gabryel Bagio Bardini | [<img src="https://github.com/favicon.ico" width="16"/> ByelBardini](https://github.com/ByelBardini) |
| Victor Oliveira Rodrigues | [<img src="https://github.com/favicon.ico" width="16"/> victolirodrigues](https://github.com/victolirodrigues) |

## Estrutura

O repositório é organizado por aula, uma pasta por encontro:

```
aula-01/  aula-02/  aula-03/  aula-04/
aula-05/  aula-06/  aula-07/  aula-08/
```

## Conteúdo

### Aula 01 — Introdução

**Parte 01 — HTML**

Primeiro contato com HTML puro, sem CSS e sem JavaScript.

- [Página base em HTML](aula-01/parte-01/index.html) — estrutura de um documento HTML
  (`<!doctype>`, `<head>` com charset e viewport, `<body>`), tags semânticas
  (`header`, `main`, `section`, `footer`) e as tags mais comuns: títulos (`h1` a `h6`),
  parágrafos (`p`), listas (`ul`/`li`), links (`a`) e imagens (`img`).
- [Arquivo para exercício](aula-01/parte-01/exercicio.html) — esqueleto vazio para o
  aluno montar a própria página.
- [HTML Tutorial — W3Schools](https://www.w3schools.com/html/) — material de apoio para
  consultar as tags e testar exemplos fora da aula.

**Parte 02 — Git e GitHub**

Como instalar o Git, baixar o repositório e enviar os exercícios.

- [Clonando o repositório](aula-01/parte-02/01-clonando-o-repositorio.md) — instalação do
  Git pelo `winget`, `git clone`, `git fetch` e criação da branch pessoal
  (`nome-sobrenome`) com `git checkout -b` e o primeiro `git push -u`.
- [Enviando alterações para o GitHub](aula-01/parte-02/02-enviando-para-o-github.md) —
  o ciclo do dia a dia: `git branch`, `git checkout`, `git add .`, `git status`,
  `git commit -m` e `git push`.

### Aula 02 — JavaScript e DOM

**Parte 01 — JavaScript no navegador**

Primeiro contato com a linguagem, sem nenhuma manipulação de página: tudo roda no
`<script>` e é observado pelo `console.log`. Cada exemplo tem só um `index.html`.

- [Exemplo 01 — Olá, mundo](aula-02/parte-01/exemplo-01/index.html) — primeiro script da
  aula, um único `console.log` para ver a saída no console do navegador.
- [Exemplo 02 — Variáveis e tipos de dados](aula-02/parte-01/exemplo-02/index.html) —
  diferença entre `const` e `let`, e os tipos primitivos (`string`, `number`, `boolean`,
  `undefined`, `null`) verificados com `typeof`.
- [Exemplo 03 — Operadores](aula-02/parte-01/exemplo-03/index.html) — operadores
  aritméticos, de atribuição composta (`+= -= *=`...), lógicos (`&& || !`) e de
  incremento/decremento (`++`/`--`).
- [Exemplo 04 — Concatenação e template strings](aula-02/parte-01/exemplo-04/index.html) —
  concatenar com `+` versus usar template strings com crase e `${}`.
- [Exemplo 05 — Conversão de tipos com Number()](aula-02/parte-01/exemplo-05/index.html) —
  o erro clássico de somar strings numéricas (`"10" + "10"`) e a correção com `Number()`.
- [Exemplo 06 — Funções com e sem parâmetro](aula-02/parte-01/exemplo-06/index.html) —
  compara uma função que depende de uma variável externa com uma que recebe parâmetro.
- [Exemplo 07 — Retorno de função](aula-02/parte-01/exemplo-07/index.html) — o `return`
  para devolver um valor utilizável fora da função.

**Parte 02 — Manipulação da página**

Primeiro contato com o DOM: ler valores digitados pelo usuário e escrever resultados na
página, disparando as funções com `onclick` no próprio HTML. Cada exemplo tem só um
`index.html`, com o script embutido no fim do arquivo.

- [Exemplo 01 — Primeira função ligada a um botão](aula-02/parte-02/exemplo-01/index.html) —
  um botão chamando uma função que faz `console.log`, ainda sem ler nada da página.
- [Exemplo 02 — Saudação com cálculo de idade](aula-02/parte-02/exemplo-02/index.html) —
  `document.getElementById(...).value` para ler nome e ano de nascimento, `Number()` para
  converter e `textContent` para escrever o resultado.
- [Exemplo 03 — Calculadora](aula-02/parte-02/exemplo-03/index.html) — quatro funções
  (somar, subtrair, multiplicar, dividir), cada uma ligada a um botão, lendo dois campos
  numéricos e escrevendo o resultado na tela.

**Parte 03 — DOM: eventos**

Aprofunda o DOM da parte 02, agora com `script.js` separado do HTML. Troca o `onclick`
por `addEventListener` e fecha com um catálogo de outros eventos do navegador.

- [Exemplo 01 — Exibir nome no console](aula-02/parte-03/exemplo-01/index.html) — dois
  botões lendo o mesmo campo com `document.getElementById(...).value` e imprimindo com
  `console.log`, primeiro exemplo já com `script.js` externo.
- [Exemplo 02 — Alterando a página](aula-02/parte-03/exemplo-02/index.html) — quatro formas
  de alterar o DOM: `textContent`, `style`, `innerHTML` e `style.display` para
  esconder/mostrar um elemento.
- [Exemplo 03 — Eventos](aula-02/parte-03/exemplo-03/index.html) — `addEventListener` no
  lugar do `onclick` no HTML, com os eventos `click`, `input` e `change`.
- [Exemplo 04 — Outros eventos](aula-02/parte-03/exemplo-04/index.html) — catálogo mais
  amplo de eventos do DOM: `dblclick`, `keydown`, `focus`/`blur`, `mouseover`/`mouseout`,
  `mousemove`, `submit` (com `preventDefault()`) e `contextmenu`.

**Parte 04 — Funções e lógica**

Onde as partes anteriores se encontram: funções que chamam outras funções, com a lógica
separada do que mexe na tela.

- [Validação de cadastro](aula-02/parte-04/index.html) — uma função de validação para cada
  campo, todas devolvendo a mensagem de erro com `return` e nenhuma delas tocando no HTML.
  A função principal só organiza a ordem: ler, validar, mostrar e decidir.

**Exercícios**

- [Exercícios da aula](aula-02/exercicios/index.html) — cinco exercícios em um arquivo só,
  com o código a ser escrito em [script.js](aula-02/exercicios/script.js). Os dois
  primeiros são livres, o 03 e o 04 praticam DOM e o 05 cobra a separação entre as funções
  de cálculo e a função que escreve na página.

### Aula 03 — _em breve_
### Aula 04 — _em breve_
### Aula 05 — _em breve_
### Aula 06 — _em breve_
### Aula 07 — _em breve_
### Aula 08 — _em breve_