// ============================================================
// AULA 03 — EXERCÍCIOS
//
// O enunciado de cada exercício está no index.html.
// Escreva o código abaixo do cabeçalho correspondente.
// ============================================================

// ============================================================
// EXERCÍCIO 01 — Notas da turma (console)
//
// Este exercício não usa a página: só array e console.log.
// Abra o console do navegador com F12 para ver a saída.
// ============================================================

const notas = [8.5, 6, 9.75, 4.5, 10];

console.log("Notas:", notas);

// A última posição é sempre length - 1, seja qual for o tamanho do array
console.log(`Primeira nota: ${notas[0]}`);
console.log(`Última nota: ${notas[notas.length - 1]}`);
console.log(`Quantidade de notas: ${notas.length}`);

// O array começa no 0, mas para o aluno a contagem começa no 1: por isso i + 1
for (let i = 0; i < notas.length; i++) {
  console.log(`Nota ${i + 1}: ${notas[i]}`);
}

// A soma nasce ANTES do for, senão voltaria a zero a cada volta
let soma = 0;

for (let i = 0; i < notas.length; i++) {
  soma = soma + notas[i];
}

const media = soma / notas.length;

console.log(`Média: ${media.toFixed(2)}`);

// Desafio: o "maior" e o "menor" começam sendo a primeira nota do array.
// Começar com 0 daria errado para a menor (nenhuma nota é menor que 0).
let maior = notas[0];
let menor = notas[0];

for (let i = 1; i < notas.length; i++) {
  if (notas[i] > maior) {
    maior = notas[i];
  }

  if (notas[i] < menor) {
    menor = notas[i];
  }
}

console.log(`Maior nota: ${maior}`);
console.log(`Menor nota: ${menor}`);

// ============================================================
// EXERCÍCIO 02 — Lista de tarefas
//
// O array é a fonte da verdade: toda mudança acontece nele e
// só depois a tela é redesenhada por atualizarTela().
//
// Campos e botões desta seção:
//   tarefa, adicionarTarefa, concluirTarefa,
//   posicaoTarefa, removerTarefa,
//   avisoTarefa, listaTarefas, totalTarefas
// ============================================================

const tarefas = [];

function atualizarTela() {
  const lista = document.getElementById("listaTarefas");

  // Limpa os <li> antigos antes de criar os novos, para não duplicar
  lista.innerHTML = "";

  for (let i = 0; i < tarefas.length; i++) {
    const li = document.createElement("li");
    li.textContent = `[${i}] ${tarefas[i]}`;
    lista.appendChild(li);
  }

  // Desafio: total de tarefas ou aviso de lista vazia
  const total = document.getElementById("totalTarefas");

  if (tarefas.length === 0) {
    total.textContent = "Nenhuma tarefa por enquanto";
  } else {
    total.textContent = `Total de tarefas: ${tarefas.length}`;
  }
}

function avisarTarefa(texto) {
  document.getElementById("avisoTarefa").textContent = texto;
}

function adicionarTarefa() {
  const campo = document.getElementById("tarefa");
  const tarefa = campo.value;

  campo.value = "";

  if (tarefa === "") {
    avisarTarefa("Digite uma tarefa antes de adicionar.");
    return;
  }

  if (tarefas.includes(tarefa)) {
    avisarTarefa(`${tarefa} já está na lista.`);
    return;
  }

  tarefas.push(tarefa);
  avisarTarefa(`${tarefa} adicionada.`);
  atualizarTela();
}

function concluirTarefa() {
  if (tarefas.length === 0) {
    avisarTarefa("Não há tarefas para concluir.");
    return;
  }

  // pop() devolve o item que foi removido
  const concluida = tarefas.pop();

  avisarTarefa(`${concluida} foi concluída.`);
  atualizarTela();
}

function removerTarefa() {
  const campo = document.getElementById("posicaoTarefa");
  const digitado = campo.value;
  const posicao = Number(digitado);

  campo.value = "";

  // Só existem posições de 0 até length - 1
  if (digitado === "" || posicao < 0 || posicao >= tarefas.length) {
    avisarTarefa("Essa posição não existe na lista.");
    return;
  }

  const removidas = tarefas.splice(posicao, 1);

  avisarTarefa(`${removidas[0]} foi removida da posição ${posicao}.`);
  atualizarTela();
}

document.getElementById("adicionarTarefa").addEventListener("click", adicionarTarefa);
document.getElementById("concluirTarefa").addEventListener("click", concluirTarefa);
document.getElementById("removerTarefa").addEventListener("click", removerTarefa);

// Desenha a tela no carregamento, já mostrando "Nenhuma tarefa por enquanto"
atualizarTela();

// ============================================================
// EXERCÍCIO 03 — Ficha do produto (console)
//
// De novo sem tocar na página: objeto, for...in e cópia com spread.
// ============================================================

const produto = {
  nome: "Notebook",
  preco: 3500,
  quantidade: 4,
  disponivel: true,
};

console.log(`Nome (ponto): ${produto.nome}`);
console.log(`Preço (colchetes): ${produto["preco"]}`);
console.log(`Propriedade que não existe: ${produto.cor}`); // undefined

// Mesmo com const dá para alterar as propriedades: o que não pode é
// trocar o objeto inteiro (produto = {...})
produto.preco = produto.preco * 0.9;
produto.categoria = "Informática";

console.log("Produto com desconto e categoria:", produto);

// for...in entrega a CHAVE; o valor vem pelos colchetes
for (const chave in produto) {
  console.log(`${chave} = ${produto[chave]}`);
}

// O spread cria um objeto NOVO; com = seria só outro nome para o mesmo
const copiaProduto = { ...produto };
copiaProduto.preco = 2000;

console.log("Original:", produto);
console.log("Cópia:", copiaProduto);

// Desafio: um objeto dentro de outro objeto
produto.fabricante = {
  nome: "Positivo",
  cidade: "Curitiba",
};

console.log(`Cidade do fabricante: ${produto.fabricante.cidade}`);

// ============================================================
// EXERCÍCIO 04 — Cadastro de filmes
//
// Array de objetos na tela. procurarPorTitulo() é função de
// LÓGICA: ela não pode usar document, getElementById nem
// innerHTML — só percorrer o array e devolver o que achou.
//
// Campos e botões desta seção:
//   titulo, ano, nota, cadastrarFilme,
//   buscaFilme, buscarFilme, removerFilme,
//   avisoFilme, corpoFilmes, resumoFilmes
// ============================================================

const filmes = [
  { titulo: "Matrix", ano: 1999, nota: 8.7 },
  { titulo: "Cats", ano: 2019, nota: 2.8 },
];

function atualizarTabela() {
  let html = "";

  for (const filme of filmes) {
    // A situação não fica guardada no objeto: é calculada na hora
    let situacao = "Ruim";

    if (filme.nota >= 7) {
      situacao = "Bom";
    }

    html =
      html +
      "<tr>" +
      `<td>${filme.titulo}</td>` +
      `<td>${filme.ano}</td>` +
      `<td>${filme.nota}</td>` +
      `<td>${situacao}</td>` +
      "</tr>";
  }

  document.getElementById("corpoFilmes").innerHTML = html;

  mostrarResumo();
}

// Desafio: média das notas e filme com a maior nota
function mostrarResumo() {
  const resumo = document.getElementById("resumoFilmes");

  if (filmes.length === 0) {
    resumo.textContent = "Nenhum filme cadastrado.";
    return;
  }

  let somaNotas = 0;
  let melhor = filmes[0];

  for (const filme of filmes) {
    somaNotas = somaNotas + filme.nota;

    if (filme.nota > melhor.nota) {
      melhor = filme;
    }
  }

  const mediaNotas = somaNotas / filmes.length;

  resumo.textContent = `Média das notas: ${mediaNotas.toFixed(2)} | Maior nota: ${melhor.titulo}`;
}

function avisarFilme(texto) {
  document.getElementById("avisoFilme").textContent = texto;
}

// Devolve o OBJETO com aquele título, ou null se não achar
function procurarPorTitulo(titulo) {
  for (const filme of filmes) {
    if (filme.titulo === titulo) {
      return filme;
    }
  }

  return null;
}

// O splice pede a POSIÇÃO, então aqui devolvemos o índice (ou -1)
function procurarPosicaoFilme(titulo) {
  for (let i = 0; i < filmes.length; i++) {
    if (filmes[i].titulo === titulo) {
      return i;
    }
  }

  return -1;
}

function cadastrarFilme() {
  const campoTitulo = document.getElementById("titulo");
  const campoAno = document.getElementById("ano");
  const campoNota = document.getElementById("nota");

  const novo = {
    titulo: campoTitulo.value,
    ano: Number(campoAno.value),
    nota: Number(campoNota.value),
  };

  if (novo.titulo === "") {
    avisarFilme("Digite o título do filme.");
    return;
  }

  // includes() não serve: compara a PROPRIEDADE titulo de cada objeto
  if (procurarPorTitulo(novo.titulo) !== null) {
    avisarFilme(`${novo.titulo} já está cadastrado.`);
    return;
  }

  campoTitulo.value = "";
  campoAno.value = "";
  campoNota.value = "";

  filmes.push(novo);
  avisarFilme(`${novo.titulo} cadastrado.`);
  atualizarTabela();
}

function buscarFilme() {
  const titulo = document.getElementById("buscaFilme").value;
  const filme = procurarPorTitulo(titulo);

  if (filme === null) {
    avisarFilme(`${titulo} não foi encontrado.`);
    return;
  }

  avisarFilme(`${filme.titulo} (${filme.ano}) - nota ${filme.nota}`);
}

function removerFilme() {
  const campo = document.getElementById("buscaFilme");
  const titulo = campo.value;
  const posicao = procurarPosicaoFilme(titulo);

  if (posicao === -1) {
    avisarFilme(`${titulo} não foi encontrado.`);
    return;
  }

  campo.value = "";

  const removidos = filmes.splice(posicao, 1);

  avisarFilme(`${removidos[0].titulo} foi removido.`);
  atualizarTabela();
}

document.getElementById("cadastrarFilme").addEventListener("click", cadastrarFilme);
document.getElementById("buscarFilme").addEventListener("click", buscarFilme);
document.getElementById("removerFilme").addEventListener("click", removerFilme);

// Desenha a tabela no carregamento, já com os dois filmes iniciais
atualizarTabela();
