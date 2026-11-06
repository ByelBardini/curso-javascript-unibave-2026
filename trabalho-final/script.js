// ============================================================
// MiniMarket — Prova final de JavaScript — LOJA
//
// Escreva aqui o JavaScript desta página (catálogo, pesquisa, carrinho
// e finalização da compra), usando JavaScript puro. O JavaScript da
// área do lojista fica no login/script.js. Os requisitos e os ids estão
// no README.md; as rotas da API estão no API.md.
// Não altere o HTML nem o CSS.
// ============================================================

// Troque SEU-CODIGO pelo seu código de aluno. O endereço do servidor é
// informado pelo professor.
const URL_API = "https://minimarket.evolutivasistemas.com.br/api/aluno-joao";

const CHAVE_CARRINHO = "minimarket-carrinho";

const mensagemEl = document.getElementById("mensagem");
const mensagemCompraEl = document.getElementById("mensagem-compra");

const listaProdutosEl = document.getElementById("lista-produtos");
const estadoCatalogoVazioEl = document.getElementById("estado-catalogo-vazio");
const totalProdutosEl = document.getElementById("total-produtos");
const botaoRecarregar = document.getElementById("botao-recarregar");
const campoBusca = document.getElementById("campo-busca");
const filtroEstoque = document.getElementById("filtro-estoque");

const listaCarrinhoEl = document.getElementById("lista-carrinho");
const estadoCarrinhoVazioEl = document.getElementById("estado-carrinho-vazio");
const quantidadeCarrinhoEl = document.getElementById("quantidade-carrinho");
const subtotalCarrinhoEl = document.getElementById("subtotal-carrinho");
const descontoCarrinhoEl = document.getElementById("desconto-carrinho");
const totalCarrinhoEl = document.getElementById("total-carrinho");
const botaoFinalizar = document.getElementById("botao-finalizar");
const botaoLimparCarrinho = document.getElementById("botao-limpar-carrinho");

let produtos = [];
let carrinho = [];

function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2)}`;
}

function definirMensagem(elemento, texto, tipo) {
  elemento.textContent = texto || "";
  elemento.className = tipo ? `mensagem ${tipo}` : "mensagem";
}

// ---------- Catálogo ----------

async function carregarCatalogo() {
  botaoRecarregar.disabled = true;
  definirMensagem(mensagemEl, "Carregando...", "carregando");
  try {
    const resposta = await fetch(`${URL_API}/produtos`);
    if (!resposta.ok) {
      throw new Error("Falha ao consultar o catálogo");
    }
    produtos = await resposta.json();
    definirMensagem(mensagemEl, "", "");
    aplicarFiltros();
  } catch (erro) {
    definirMensagem(mensagemEl, "Não foi possível carregar o catálogo. Tente novamente.", "erro");
  } finally {
    botaoRecarregar.disabled = false;
  }
}

function aplicarFiltros() {
  const termo = campoBusca.value.trim().toLowerCase();
  let visiveis = produtos.filter((produto) => produto.nome.toLowerCase().includes(termo));
  if (filtroEstoque.checked) {
    visiveis = visiveis.filter((produto) => produto.estoque > 0);
  }
  renderizarProdutos(visiveis);
}

function renderizarProdutos(visiveis) {
  totalProdutosEl.textContent = produtos.length;
  listaProdutosEl.innerHTML = "";

  if (visiveis.length === 0) {
    estadoCatalogoVazioEl.hidden = false;
    return;
  }
  estadoCatalogoVazioEl.hidden = true;

  visiveis.forEach((produto) => {
    const semEstoque = produto.estoque === 0;

    const item = document.createElement("li");
    item.className = semEstoque ? "produto sem-estoque" : "produto";

    const nome = document.createElement("h3");
    nome.className = "produto-nome";
    nome.textContent = produto.nome;

    const preco = document.createElement("p");
    preco.className = "produto-preco";
    preco.textContent = formatarMoeda(produto.preco);

    const estoque = document.createElement("p");
    estoque.className = "produto-estoque";
    estoque.textContent = semEstoque ? "Sem estoque" : `Estoque: ${produto.estoque}`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao primario";
    botao.textContent = semEstoque ? "Indisponível" : "Adicionar ao carrinho";
    botao.disabled = semEstoque;
    botao.dataset.id = produto.id;

    item.append(nome, preco, estoque, botao);
    listaProdutosEl.appendChild(item);
  });
}

listaProdutosEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-id]");
  if (!botao || botao.disabled) return;
  adicionarAoCarrinho(Number(botao.dataset.id));
});

campoBusca.addEventListener("input", aplicarFiltros);
filtroEstoque.addEventListener("change", aplicarFiltros);
botaoRecarregar.addEventListener("click", carregarCatalogo);

// ---------- Carrinho ----------

function carregarCarrinhoSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE_CARRINHO);
    carrinho = salvo ? JSON.parse(salvo) : [];
  } catch (erro) {
    carrinho = [];
  }
}

function salvarCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find((produto) => produto.id === id);
  if (!produto || produto.estoque === 0) return;

  const item = carrinho.find((item) => item.id === id);
  if (item) {
    if (item.quantidade >= produto.estoque) {
      definirMensagem(mensagemEl, `Quantidade máxima em estoque para "${produto.nome}" já está no carrinho.`, "erro");
      return;
    }
    item.quantidade += 1;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }

  salvarCarrinho();
  renderizarCarrinho();
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find((item) => item.id === id);
  if (!item) return;

  if (delta > 0) {
    const produto = produtos.find((produto) => produto.id === id);
    if (produto && item.quantidade >= produto.estoque) {
      definirMensagem(mensagemEl, `Quantidade máxima em estoque para "${item.nome}" já está no carrinho.`, "erro");
      return;
    }
    item.quantidade += 1;
  } else {
    item.quantidade -= 1;
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter((item) => item.id !== id);
    }
  }

  salvarCarrinho();
  renderizarCarrinho();
}

function removerItem(id) {
  carrinho = carrinho.filter((item) => item.id !== id);
  salvarCarrinho();
  renderizarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();
}

botaoLimparCarrinho.addEventListener("click", limparCarrinho);

function renderizarCarrinho() {
  listaCarrinhoEl.innerHTML = "";

  if (carrinho.length === 0) {
    estadoCarrinhoVazioEl.hidden = false;
  } else {
    estadoCarrinhoVazioEl.hidden = true;

    carrinho.forEach((item) => {
      const linha = document.createElement("li");
      linha.className = "item-carrinho";

      const dados = document.createElement("div");
      dados.className = "item-dados";
      const nome = document.createElement("strong");
      nome.className = "item-nome";
      nome.textContent = item.nome;
      const preco = document.createElement("span");
      preco.className = "item-preco";
      preco.textContent = `${formatarMoeda(item.preco)} cada`;
      dados.append(nome, preco);

      const controles = document.createElement("div");
      controles.className = "item-controles";
      const botaoMenos = document.createElement("button");
      botaoMenos.type = "button";
      botaoMenos.className = "botao-quantidade";
      botaoMenos.textContent = "-1";
      botaoMenos.dataset.id = item.id;
      botaoMenos.dataset.acao = "menos";
      const quantidade = document.createElement("span");
      quantidade.className = "item-quantidade";
      quantidade.textContent = item.quantidade;
      const botaoMais = document.createElement("button");
      botaoMais.type = "button";
      botaoMais.className = "botao-quantidade";
      botaoMais.textContent = "+1";
      botaoMais.dataset.id = item.id;
      botaoMais.dataset.acao = "mais";
      controles.append(botaoMenos, quantidade, botaoMais);

      const subtotal = document.createElement("span");
      subtotal.className = "item-subtotal";
      subtotal.textContent = formatarMoeda(item.preco * item.quantidade);

      const botaoRemover = document.createElement("button");
      botaoRemover.type = "button";
      botaoRemover.className = "botao-remover";
      botaoRemover.textContent = "Remover";
      botaoRemover.dataset.id = item.id;
      botaoRemover.dataset.acao = "remover";

      linha.append(dados, controles, subtotal, botaoRemover);
      listaCarrinhoEl.appendChild(linha);
    });
  }

  const totalUnidades = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  quantidadeCarrinhoEl.textContent = totalUnidades;

  calcularTotais();
}

listaCarrinhoEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-id]");
  if (!botao) return;
  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === "mais") alterarQuantidade(id, 1);
  else if (botao.dataset.acao === "menos") alterarQuantidade(id, -1);
  else if (botao.dataset.acao === "remover") removerItem(id);
});

function calcularTotais() {
  const subtotal = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const desconto = subtotal >= 200 ? subtotal * 0.1 : 0;
  const total = subtotal - desconto;

  subtotalCarrinhoEl.textContent = formatarMoeda(subtotal);
  descontoCarrinhoEl.textContent = formatarMoeda(desconto);
  totalCarrinhoEl.textContent = formatarMoeda(total);
}

// ---------- Finalização da compra ----------

async function finalizarCompra() {
  if (carrinho.length === 0) {
    definirMensagem(mensagemCompraEl, "Seu carrinho está vazio.", "erro");
    return;
  }

  botaoFinalizar.disabled = true;
  definirMensagem(mensagemCompraEl, "Finalizando compra...", "carregando");

  try {
    const resposta = await fetch(`${URL_API}/compras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itens: carrinho.map((item) => ({ produtoId: item.id, quantidade: item.quantidade })),
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      definirMensagem(mensagemCompraEl, dados.erro || "Não foi possível finalizar a compra.", "erro");
      return;
    }

    definirMensagem(mensagemCompraEl, `Compra #${dados.id} realizada! Total: ${formatarMoeda(dados.total)}`, "sucesso");
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    carregarCatalogo();
  } catch (erro) {
    definirMensagem(mensagemCompraEl, "Erro de conexão ao finalizar a compra. Tente novamente.", "erro");
  } finally {
    botaoFinalizar.disabled = false;
  }
}

botaoFinalizar.addEventListener("click", finalizarCompra);

// ---------- Inicialização ----------

carregarCarrinhoSalvo();
renderizarCarrinho();
carregarCatalogo();
