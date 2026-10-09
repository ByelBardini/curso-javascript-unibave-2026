# Curso JavaScript - Unibave 2026

Repositório com os exercícios e exemplos desenvolvidos durante o curso de JavaScript da Unibave.

## Professores

| Nome                      | GitHub                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Gabryel Bagio Bardini     | [<img src="https://github.com/favicon.ico" width="16"/> ByelBardini](https://github.com/ByelBardini)           |
| Victor Oliveira Rodrigues | [<img src="https://github.com/favicon.ico" width="16"/> victolirodrigues](https://github.com/victolirodrigues) |

## "Estrutura"

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
  converter e `textContent` para escrever o resultado no console.
- [Exemplo 03 — Calculadora](aula-02/parte-02/exemplo-03/index.html) — quatro funções
  (somar, subtrair, multiplicar, dividir), cada uma ligada a um botão, lendo dois campos
  numéricos e escrevendo o resultado no console.

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
  com o código a ser escrito em [script.js](aula-02/exercicios/script.js). O 01 fica só no
  `console.log` (variáveis, tipos e template string), o 02 faz o ciclo completo de ler um
  campo, converter com `Number()` e escrever com `textContent`, o 03 e o 04 praticam DOM e
  o 05 cobra a separação entre as funções de cálculo e a função que escreve na página.

### Aula 03 — Arrays, objetos e JSON

**Parte 01 — Arrays**

Do primeiro `console.log` de um array até uma lista interativa na página. Cada exemplo tem
um `index.html` e um `script.js` separado.

- [Exemplo 01 — Arrays no console](aula-03/parte-01/exemplo-01/index.html) — o que é um
  array, acesso por índice (começando em 0), `length`, o último item com `length - 1`,
  `typeof` devolvendo `object` e `Array.isArray()` para confirmar.
- [Exemplo 02 — Percorrendo e escrevendo na página](aula-03/parte-01/exemplo-02/index.html) —
  três formas de percorrer e exibir: `for` com índice montando `<li>` com
  `createElement`/`appendChild`, `for...of` no console e uma string de HTML jogada de uma
  vez no `innerHTML`.
- [Exemplo 03 — Métodos de array](aula-03/parte-01/exemplo-03/index.html) — `push()`,
  `pop()`, `shift()`, `unshift()`, `splice()` (removendo, trocando e inserindo) e
  `includes()`, com o valor de retorno de cada um e a observação de que um array `const`
  tem o conteúdo alterado do mesmo jeito.
- [Exemplo 04 — Lista de compras interativa](aula-03/parte-01/exemplo-04/index.html) —
  os métodos da aula ligados a botões: o array é a fonte da verdade e uma função
  `atualizarTela()` redesenha a lista a cada mudança, com `includes()` barrando itens
  repetidos e validação de posição antes do `splice()`.

**Parte 02 — Objetos**

Do objeto solto no console até um estoque interativo. Os exemplos partem dos mesmos da
parte 01, agora guardando mais de uma informação por item. Cada exemplo tem um
`index.html` e um `script.js` separado.

- [Exemplo 01 — Objetos no console](aula-03/parte-02/exemplo-01/index.html) — o que é um
  objeto, acesso por ponto e por colchetes, propriedade inexistente devolvendo `undefined`,
  alterar/criar/`delete` de propriedades, `typeof` devolvendo `object` igual ao array e
  objetos com array e outro objeto dentro.
- [Exemplo 02 — Array de objetos na página](aula-03/parte-02/exemplo-02/index.html) — a
  lista de alunos da parte 01 com nome, idade e nota em cada item: `for` com índice
  montando `<li>`, `for...of` calculando a média da turma e uma tabela montada com
  `innerHTML`, com a situação calculada a partir da nota.
- [Exemplo 03 — Percorrer, copiar e buscar](aula-03/parte-02/exemplo-03/index.html) —
  `Object.keys()`, `Object.values()`, `Object.entries()`, o laço `for...in`, a diferença
  entre o `=` (que dá outro nome ao mesmo objeto) e a cópia com spread `{ ... }`, e busca,
  filtro e soma dentro de um array de objetos.
- [Exemplo 04 — Estoque de produtos](aula-03/parte-02/exemplo-04/index.html) — a lista
  interativa da parte 01 virando um cadastro: o array de objetos é a fonte da verdade,
  `atualizarTela()` redesenha a tabela a cada mudança e a busca passa a ser por uma
  propriedade (`procurarPorNome()`) no lugar do `includes()`.

**Exercícios**

- [Exercícios da aula](aula-03/exercicios/index.html) — quatro exercícios em um arquivo só,
  com o código a ser escrito em [script.js](aula-03/exercicios/script.js). Os dois
  primeiros são de array: o 01 fica só no `console.log` (índices, `length`, média com
  `for`) e o 02 monta uma lista de tarefas com o array como fonte da verdade. Os dois
  seguintes são de objeto: o 03 volta ao console (ponto vs. colchetes, `for...in`, cópia
  com spread) e o 04 junta tudo em um cadastro de filmes com array de objetos e busca por
  propriedade.

### Aula 04 — JSON e APIs

**Parte 01 — Lendo e alterando um arquivo JSON**

O estoque da aula 03 agora vem de um arquivo. Precisa ser aberta pelo _Live Server_ do
VS Code: abrindo com dois cliques (`file://`) o navegador bloqueia a leitura do JSON.

- [Estoque vindo de um arquivo JSON](aula-04/parte-01/index.html) — as regras do formato
  JSON (chaves e textos com aspas duplas, sem vírgula sobrando, sem comentários), leitura do
  [produtos.json](aula-04/parte-01/produtos.json) com `fetch()` + `async`/`await` e
  `.json()`, alteração do array na memória com o mesmo `procurarPorNome()` da aula 03 e o
  caminho de volta com `JSON.stringify()`, gerando um download com `Blob` (o navegador não
  deixa o JavaScript gravar por cima do arquivo). Fecha com `JSON.parse()` no console.

**Parte 02 — Consumindo APIs**

O mesmo `fetch()` da parte 01, agora apontando para um servidor. Os exemplos não mexem na
página: tudo é observado no console. Cada exemplo tem um `index.html` e um `script.js`
separado.

- [Exemplo 01 — Buscando dados de uma API (GET)](aula-04/parte-02/exemplo-01/index.html) —
  o que é uma API e o GET como padrão do `fetch()`, usando a
  [BrasilAPI](https://brasilapi.com.br/docs): CEP, cidades de um DDD, feriados nacionais
  percorridos com `for...of`, estado e municípios do IBGE (objeto dentro de objeto), banco
  pelo código e empresa pelo CNPJ.
- [Exemplo 02 — Tratando erros e trabalhando com as respostas](aula-04/parte-02/exemplo-02/index.html) —
  `resposta.ok` e `resposta.status` (200, 400, 404, 500), `try`/`catch` para quando não há
  resposta, uma chamada usando o resultado da anterior (CEP → estado), filtros e contadores
  em cima dos dados recebidos e conversão de dólar com a cotação do dia.
- [Exemplo 03 — CRUD completo com uma API que salva de verdade](aula-04/parte-02/exemplo-03/index.html) —
  os métodos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) com a
  [restful-api.dev](https://restful-api.dev): o segundo parâmetro do `fetch()` com
  `method`, `headers` e `body` com `JSON.stringify()`, o `id` gerado pelo servidor, a
  diferença entre `PUT` (substitui tudo) e `PATCH` (só os campos enviados) e um GET depois
  de cada passo para conferir o que foi salvo.

**Exercícios**

- [Exercícios da aula](aula-04/exercicios/index.html) — dois exercícios em um arquivo só,
  um para cada parte, com o código a ser escrito em [script.js](aula-04/exercicios/script.js).
  Precisa ser aberto pelo _Live Server_. O 01 lê o [livros.json](aula-04/exercicios/livros.json)
  com `fetch()`, controla empréstimos e cadastro em cima do array e baixa o arquivo alterado,
  com o desafio de importar um JSON colado na página usando `JSON.parse()` e `try`/`catch`.
  O 02 fica no console: uma função auxiliar de GET com tratamento de erro, consultas na
  BrasilAPI (bancos e feriados) e um CRUD completo na restful-api.dev.

### Aula 05 — AJAX e a API de Produtos

**Parte 01 — AJAX**

Buscar dados no servidor e mostrar na página sem recarregar: o `fetch()` da aula 04 junto
com o DOM da aula 02. Cada exemplo tem um `index.html` e um `script.js` separado.

- [Exemplo 01 — Buscando um CEP](aula-05/parte-01/exemplo-01/index.html) — o primeiro
  AJAX: o botão chama `buscarCep()`, o `fetch()` consulta a
  [BrasilAPI](https://brasilapi.com.br/docs) e só os campos de rua, bairro, cidade e
  estado mudam na página (campos `readonly`, que só o JavaScript preenche).
- [Exemplo 02 — Feriados do ano](aula-05/parte-01/exemplo-02/index.html) — o que uma
  página com AJAX precisa mostrar enquanto espera: `Buscando...` e o botão desabilitado
  antes do `fetch()`, a `message` da API quando `resposta.ok` é falso (teste o ano 1800),
  o `catch` quando nem há resposta e a tabela montada com `for...of`, com a data
  convertida para dd/mm/aaaa usando `split("-")`.

**Parte 02 — API de Produtos**

Uma API feita para o curso, com um CRUD de produtos que salva de verdade. Cada aluno usa
um código próprio na URL (`/api/{seu-codigo}/produtos`), então um não vê os dados do outro.

- [Documentação da API](https://exemplosapi.evolutivasistemas.com.br/) — campos do
  produto, rotas, exemplos com `fetch()` para cada método HTTP, filtros, busca e
  paginação, as mensagens de erro e um console _Experimente_ para testar sem escrever
  código. Também traz a parte 2, com login e token no header `Authorization`.
- [Swagger](https://exemplosapi.evolutivasistemas.com.br/swagger) — todas as rotas da API
  em uma página, prontas para executar.
- [Meus Produtos](aula-05/parte-02/index.html) — o HTML e o
  [CSS](aula-05/parte-02/style.css) já vêm prontos, o JavaScript é com o aluno: crie o
  `script.js` na mesma pasta e siga o guia comentado no topo do `index.html` (ids da
  página, o HTML de cada produto e dicas). Listar, cadastrar, editar, excluir e filtrar
  falando com a API.

**Exercícios**

- [Exercícios da aula](aula-05/exercicios/index.html) — dois exercícios em um arquivo só,
  um para cada parte, com o código a ser escrito em [script.js](aula-05/exercicios/script.js).
  O 01 é uma consulta de DDD com AJAX na BrasilAPI: o DDD é validado antes do `fetch()`, a
  página mostra `Buscando...`, os erros da API e as cidades, e o filtro trabalha em cima
  do array `cidades` com o evento `input`, sem chamar a API de novo. O 02 é um controle de
  estoque na [API de Produtos](https://exemplosapi.evolutivasistemas.com.br/): tabela
  paginada com o total do header `X-Total-Count` e `?atraso` para ver o `Carregando...`,
  `+1`/`-1` no estoque com `PATCH`, cadastro mostrando os `detalhes` de erro da API e
  `DELETE` com resposta 204. O desafio usa a parte 2 da API, com login e token no header
  `Authorization`.

### Aula 06 — _em breve_

### Aula 07 — _em breve_

### Aula 08 — _em breve_
