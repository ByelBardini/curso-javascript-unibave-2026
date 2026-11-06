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
const URL_API = " https://minimarket.evolutivasistemas.com.br/api/aluno-marcela";
const CHAVE_CARRINHO = "minimarket-carrinho";

let produtos = [];
let carrinho = lerCarrinho();

const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("campo-busca");
const botaoRecarregar = document.getElementById("botao-recarregar");
const totalProdutos = document.getElementById("total-produtos");
const estadoCatalogoVazio = document.getElementById("estado-catalogo-vazio");
const filtroEstoque = document.getElementById("filtro-estoque");

const listaCarrinho = document.getElementById("lista-carrinho");
const quantidadeCarrinho = document.getElementById("quantidade-carrinho");
const estadoCarrinhoVazio = document.getElementById("estado-carrinho-vazio");
const subtotalCarrinho = document.getElementById("subtotal-carrinho");
const descontoCarrinho = document.getElementById("desconto-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const botaoFinalizar = document.getElementById("botao-finalizar");
const botaoLimpar = document.getElementById("botao-limpar-carrinho");

const mensagem = document.getElementById("mensagem");
const mensagemCompra = document.getElementById("mensagem-compra");

function lerCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
  } catch (e) {
    return [];
  }
}

function salvarCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function dinheiro(valor) {
  return "R$ " + valor.toFixed(2);
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = texto ? "mensagem " + (tipo || "") : "mensagem";
}

function mostrarMensagemCompra(texto, tipo) {
  mensagemCompra.textContent = texto;
  mensagemCompra.className = texto ? "mensagem " + (tipo || "") : "mensagem";
}

async function lerJson(resposta) {
  try {
    return await resposta.json();
  } catch (e) {
    return {};
  }
}

async function carregarProdutos() {
  mostrarMensagem("Carregando...", "carregando");
  botaoRecarregar.disabled = true;
  try {
    const resposta = await fetch(URL_API + "/produtos");
    if (!resposta.ok) {
      const dados = await lerJson(resposta);
      throw new Error(dados.erro || "Erro ao carregar produtos (" + resposta.status + ")");
    }
    produtos = await resposta.json();
    totalProdutos.textContent = produtos.length;
    mostrarMensagem("");
    mostrarProdutos();
    mostrarCarrinho();
  } catch (erro) {
    mostrarMensagem(erro.message || "Falha de rede ao carregar o catálogo.", "erro");
  } finally {
    botaoRecarregar.disabled = false;
  }
}

function mostrarProdutos() {
  const texto = campoBusca.value.trim().toLowerCase();
  const so_com_estoque = filtroEstoque && filtroEstoque.checked;

  const filtrados = produtos.filter(function (p) {
    if (!p.nome.toLowerCase().includes(texto)) return false;
    if (so_com_estoque && p.estoque <= 0) return false;
    return true;
  });

  listaProdutos.innerHTML = "";
  estadoCatalogoVazio.hidden = filtrados.length > 0;

  filtrados.forEach(function (p) {
    const li = document.createElement("li");
    li.className = "produto";

    const nome = document.createElement("h3");
    nome.className = "produto-nome";
    nome.textContent = p.nome;

    const preco = document.createElement("p");
    preco.className = "produto-preco";
    preco.textContent = dinheiro(p.preco);

    const estoque = document.createElement("p");
    estoque.className = "produto-estoque";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao primario";

    if (p.estoque <= 0) {
      li.classList.add("sem-estoque");
      estoque.textContent = "Sem estoque";
      botao.textContent = "Indisponível";
      botao.disabled = true;
    } else {
      estoque.textContent = "Estoque: " + p.estoque;
      botao.textContent = "Adicionar ao carrinho";
      botao.addEventListener("click", function () {
        adicionar(p.id);
      });
    }

    li.append(nome, preco, estoque, botao);
    listaProdutos.appendChild(li);
  });
}

campoBusca.addEventListener("input", mostrarProdutos);
if (filtroEstoque) filtroEstoque.addEventListener("change", mostrarProdutos);
botaoRecarregar.addEventListener("click", carregarProdutos);

function adicionar(id) {
  const produto = produtos.find(function (p) { return p.id === id; });
  if (!produto) return;

  const item = carrinho.find(function (i) { return i.id === id; });
  if (item) {
    if (item.quantidade >= produto.estoque) {
      mostrarMensagem("Estoque máximo atingido para " + produto.nome + ".", "erro");
      return;
    }
    item.quantidade++;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }
  mostrarMensagem("");
  salvarCarrinho();
  mostrarCarrinho();
}

function mudarQuantidade(id, delta) {
  const item = carrinho.find(function (i) { return i.id === id; });
  if (!item) return;

  const nova = item.quantidade + delta;
  if (nova <= 0) {
    remover(id);
    return;
  }

  const produto = produtos.find(function (p) { return p.id === id; });
  if (delta > 0 && produto && nova > produto.estoque) {
    mostrarMensagem("Estoque máximo atingido para " + item.nome + ".", "erro");
    return;
  }

  item.quantidade = nova;
  mostrarMensagem("");
  salvarCarrinho();
  mostrarCarrinho();
}

function remover(id) {
  carrinho = carrinho.filter(function (i) { return i.id !== id; });
  salvarCarrinho();
  mostrarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  mostrarCarrinho();
}

botaoLimpar.addEventListener("click", limparCarrinho);

function mostrarCarrinho() {
  listaCarrinho.innerHTML = "";
  let subtotal = 0;
  let unidades = 0;

  carrinho.forEach(function (item) {
    subtotal += item.preco * item.quantidade;
    unidades += item.quantidade;

    const li = document.createElement("li");
    li.className = "item-carrinho";

    const dados = document.createElement("div");
    dados.className = "item-dados";
    const nome = document.createElement("strong");
    nome.className = "item-nome";
    nome.textContent = item.nome;
    const preco = document.createElement("span");
    preco.className = "item-preco";
    preco.textContent = dinheiro(item.preco) + " cada";
    dados.append(nome, preco);

    const controles = document.createElement("div");
    controles.className = "item-controles";
    const menos = document.createElement("button");
    menos.type = "button";
    menos.className = "botao-quantidade";
    menos.textContent = "-1";
    menos.addEventListener("click", function () { mudarQuantidade(item.id, -1); });
    const qtd = document.createElement("span");
    qtd.className = "item-quantidade";
    qtd.textContent = item.quantidade;
    const mais = document.createElement("button");
    mais.type = "button";
    mais.className = "botao-quantidade";
    mais.textContent = "+1";
    mais.addEventListener("click", function () { mudarQuantidade(item.id, 1); });
    controles.append(menos, qtd, mais);

    const sub = document.createElement("span");
    sub.className = "item-subtotal";
    sub.textContent = dinheiro(item.preco * item.quantidade);

    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "botao-remover";
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", function () { remover(item.id); });

    li.append(dados, controles, sub, botaoRemover);
    listaCarrinho.appendChild(li);
  });

  subtotal = Math.round(subtotal * 100) / 100;
  const desconto = subtotal >= 200 ? Math.round(subtotal * 10) / 100 : 0;
  const total = subtotal - desconto;

  quantidadeCarrinho.textContent = unidades;
  estadoCarrinhoVazio.hidden = carrinho.length > 0;
  subtotalCarrinho.textContent = dinheiro(subtotal);
  descontoCarrinho.textContent = dinheiro(desconto);
  totalCarrinho.textContent = dinheiro(total);
}

async function finalizarCompra() {
  if (carrinho.length === 0) {
    mostrarMensagemCompra("O carrinho está vazio.", "erro");
    return;
  }

  const itens = carrinho.map(function (i) {
    return { produtoId: i.id, quantidade: i.quantidade };
  });

  botaoFinalizar.disabled = true;
  mostrarMensagemCompra("");
  try {
    const resposta = await fetch(URL_API + "/compras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itens: itens }),
    });
    const dados = await lerJson(resposta);

    if (resposta.status === 201) {
      mostrarMensagemCompra(
        "Compra nº " + dados.id + " realizada! Total: " + dinheiro(Number(dados.total)),
        "sucesso"
      );
      limparCarrinho();
      await carregarProdutos();
    } else {
      let texto = dados.erro || "Não foi possível finalizar a compra.";
      if (dados.detalhes) texto += " " + [].concat(dados.detalhes).join(" ");
      mostrarMensagemCompra(texto, "erro");
    }
  } catch (erro) {
    mostrarMensagemCompra("Falha de rede ao finalizar a compra.", "erro");
  } finally {
    botaoFinalizar.disabled = false;
  }
}

botaoFinalizar.addEventListener("click", finalizarCompra);

mostrarCarrinho();
carregarProdutos();
