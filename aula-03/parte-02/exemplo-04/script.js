// O array de objetos é a "fonte da verdade": a tela é sempre desenhada a
// partir dele. Cada item da lista é um objeto com três propriedades.
const produtos = [
  { nome: "Notebook", preco: 3500, quantidade: 4 },
  { nome: "Mouse", preco: 80, quantidade: 20 },
];

// --------------------------------------------------------------------- //
// Funções que só mexem na tela
// --------------------------------------------------------------------- //

function atualizarTela() {
  let html = "";
  let total = 0;

  for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i];

    // O subtotal não fica guardado no objeto: ele é calculado na hora
    const subtotal = produto.preco * produto.quantidade;
    total = total + subtotal;

    html =
      html +
      "<tr>" +
      "<td>" + i + "</td>" +
      "<td>" + produto.nome + "</td>" +
      "<td>R$ " + produto.preco.toFixed(2) + "</td>" +
      "<td>" + produto.quantidade + "</td>" +
      "<td>R$ " + subtotal.toFixed(2) + "</td>" +
      "</tr>";
  }

  document.getElementById("corpo-tabela").innerHTML = html;

  document.getElementById("total").textContent =
    "Produtos cadastrados: " + produtos.length + " | Valor total: R$ " + total.toFixed(2);

  console.log("Array atual:", produtos);
}

function mostrarMensagem(texto) {
  document.getElementById("mensagem").textContent = texto;
}

// --------------------------------------------------------------------- //
// Funções de lógica: nenhuma delas mexe na tela
// --------------------------------------------------------------------- //

// Percorre o array e devolve o OBJETO com aquele nome, ou null se não achar
function procurarPorNome(nome) {
  for (const produto of produtos) {
    if (produto.nome === nome) {
      return produto;
    }
  }

  return null;
}

// Aqui precisamos da POSIÇÃO, e não do objeto, porque o splice pede o índice
function procurarPosicao(nome) {
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].nome === nome) {
      return i;
    }
  }

  return -1;
}

// Lê os três campos do cadastro e devolve um OBJETO já montado
function lerFormulario() {
  const campoNome = document.getElementById("campo-nome");
  const campoPreco = document.getElementById("campo-preco");
  const campoQuantidade = document.getElementById("campo-quantidade");

  const produto = {
    nome: campoNome.value,
    preco: Number(campoPreco.value),
    quantidade: Number(campoQuantidade.value),
  };

  campoNome.value = "";
  campoPreco.value = "";
  campoQuantidade.value = "";

  return produto;
}

function lerBusca() {
  const campo = document.getElementById("campo-busca");
  const valor = campo.value;

  campo.value = "";

  return valor;
}

// --------------------------------------------------------------------- //
// Funções ligadas aos botões
// --------------------------------------------------------------------- //

function cadastrarProduto() {
  const novo = lerFormulario();

  if (novo.nome === "") {
    mostrarMensagem("Digite o nome do produto.");
    return;
  }

  if (novo.preco <= 0) {
    mostrarMensagem("O preço precisa ser maior que zero.");
    return;
  }

  // Em vez do includes(), aqui a busca é por uma PROPRIEDADE do objeto
  if (procurarPorNome(novo.nome) !== null) {
    mostrarMensagem(novo.nome + " já está cadastrado.");
    return;
  }

  produtos.push(novo);
  mostrarMensagem(novo.nome + " cadastrado com sucesso.");
  atualizarTela();
}

function buscarProduto() {
  const nome = lerBusca();
  const produto = procurarPorNome(nome);

  if (produto === null) {
    mostrarMensagem(nome + " não está no estoque.");
    return;
  }

  mostrarMensagem(
    produto.nome + " - R$ " + produto.preco.toFixed(2) + " - " + produto.quantidade + " em estoque."
  );
}

function venderProduto() {
  const nome = lerBusca();
  const produto = procurarPorNome(nome);

  if (produto === null) {
    mostrarMensagem(nome + " não está no estoque.");
    return;
  }

  if (produto.quantidade === 0) {
    mostrarMensagem(produto.nome + " está sem estoque.");
    return;
  }

  // Alterar a propriedade do objeto já altera o item que está no array,
  // porque procurarPorNome() devolveu o próprio objeto, não uma cópia
  produto.quantidade = produto.quantidade - 1;

  mostrarMensagem("Vendida 1 unidade de " + produto.nome + ".");
  atualizarTela();
}

function reporProduto() {
  const nome = lerBusca();
  const produto = procurarPorNome(nome);

  if (produto === null) {
    mostrarMensagem(nome + " não está no estoque.");
    return;
  }

  produto.quantidade = produto.quantidade + 1;

  mostrarMensagem("Reposta 1 unidade de " + produto.nome + ".");
  atualizarTela();
}

function removerProduto() {
  const nome = lerBusca();
  const posicao = procurarPosicao(nome);

  if (posicao === -1) {
    mostrarMensagem(nome + " não está no estoque.");
    return;
  }

  // splice(posicao, 1) remove 1 item a partir daquela posição
  const removidos = produtos.splice(posicao, 1);

  mostrarMensagem(removidos[0].nome + " foi removido do estoque.");
  atualizarTela();
}

// Desenha a tela já no carregamento da página, com os produtos iniciais
atualizarTela();
