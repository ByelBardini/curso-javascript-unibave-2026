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

**Parte 01 — JavaScript no navegador** — _em breve_

**Parte 02 — DOM**

Como o JavaScript enxerga e altera a página. Cada exemplo tem um `index.html` e um
`script.js`.

- [Exemplo 01 — Lendo um campo](aula-02/parte-02/exemplo-01/index.html) — primeiro contato
  com `document.getElementById`, a propriedade `value` de um `input` e o `console.log`.
- [Exemplo 02 — Alterando a página](aula-02/parte-02/exemplo-02/index.html) — trocar o
  conteúdo com `textContent` e `innerHTML`, mudar a aparência com `style` e esconder
  elementos com `display`.
- [Exemplo 03 — Eventos](aula-02/parte-02/exemplo-03/index.html) — `addEventListener` no
  lugar do `onclick` no HTML, com os eventos `click`, `input` e `change`.
- [Exemplo 04 — Criando e removendo elementos](aula-02/parte-02/exemplo-04/index.html) —
  uma lista de tarefas montada com `createElement`, `appendChild` e `remove`.

**Parte 03 — Funções e lógica**

Onde as duas primeiras partes se encontram: funções que chamam outras funções, com a
lógica separada do que mexe na tela.

- [Validação de cadastro](aula-02/parte-03/index.html) — uma função de validação para cada
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