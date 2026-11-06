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

const URL_API = "https://minimarket.evolutivasistemas.com.br/api/aluno-willyan";

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
const botaoLimparCarrinho = document.getElementById("botao-limpar-carrinho");
const mensagem = document.getElementById("mensagem");
const mensagemCompra = document.getElementById("mensagem-compra");

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("minimarket-carrinho")) || [];

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";

    if (tipo) mensagem.classList.add(tipo);
}

async function carregarProdutos() {
    try {
        botaoRecarregar.disabled = true;
        mensagem.textContent = "Carregando...";

        const resposta = await fetch(`${URL_API}/produtos`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos.");
        }

        produtos = await resposta.json();

        totalProdutos.textContent = produtos.length;

        renderizarProdutos();
        renderizarCarrinho();

        mostrarMensagem("Catálogo carregado com sucesso.", "sucesso");

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");

    } finally {
        botaoRecarregar.disabled = false;
    }
}

function renderizarProdutos() {
    listaProdutos.innerHTML = "";

    const texto = campoBusca.value.trim().toLowerCase();

    let resultado = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
    );

    if (filtroEstoque.checked) {
        resultado = resultado.filter(produto => produto.estoque > 0);
    }

    resultado.forEach(produto => {
        const li = document.createElement("li");
        li.classList.add("produto");

        const nome = document.createElement("h3");
        nome.classList.add("produto-nome");
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.classList.add("produto-preco");
        preco.textContent = `R$ ${Number(produto.preco).toFixed(2)}`;

        const estoque = document.createElement("p");
        estoque.classList.add("produto-estoque");

        const botao = document.createElement("button");
        botao.type = "button";
        botao.classList.add("botao", "primario");

        if (produto.estoque > 0) {
            estoque.textContent = `Estoque: ${produto.estoque}`;
            botao.textContent = "Adicionar ao carrinho";

            botao.addEventListener("click", () => {
                adicionarCarrinho(produto.id);
            });

        } else {
            li.classList.add("sem-estoque");
            estoque.textContent = "Sem estoque";
            botao.textContent = "Indisponível";
            botao.disabled = true;
        }

        li.appendChild(nome);
        li.appendChild(preco);
        li.appendChild(estoque);
        li.appendChild(botao);

        listaProdutos.appendChild(li);
    });

    estadoCatalogoVazio.hidden = resultado.length !== 0;
}

function salvarCarrinho() {
    localStorage.setItem("minimarket-carrinho", JSON.stringify(carrinho));
}

function adicionarCarrinho(id) {
    const produto = produtos.find(p => p.id === id);

    if (!produto || produto.estoque <= 0) return;

    const item = carrinho.find(p => p.id === id);

    if (item) {
        if (item.quantidade >= produto.estoque) {
            mostrarMensagem("Quantidade máxima em estoque atingida.", "erro");
            return;
        }

        item.quantidade++;

    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidade: 1
        });
    }

    salvarCarrinho();
    renderizarCarrinho();
    mostrarMensagem("Produto adicionado ao carrinho.", "sucesso");
}

function alterarQuantidade(id, variacao) {
    const item = carrinho.find(p => p.id === id);
    const produto = produtos.find(p => p.id === id);

    if (!item || !produto) return;

    const novaQuantidade = item.quantidade + variacao;

    if (novaQuantidade > produto.estoque) {
        mostrarMensagem("Estoque insuficiente.", "erro");
        return;
    }

    if (novaQuantidade <= 0) {
        carrinho = carrinho.filter(p => p.id !== id);
    } else {
        item.quantidade = novaQuantidade;
    }

    salvarCarrinho();
    renderizarCarrinho();
}

function removerCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);

    salvarCarrinho();
    renderizarCarrinho();
}

function limparCarrinho() {
    carrinho = [];

    salvarCarrinho();
    renderizarCarrinho();

    mostrarMensagem("Carrinho esvaziado.", "sucesso");
}

function renderizarCarrinho() {
    listaCarrinho.innerHTML = "";

    carrinho.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("item-carrinho");

        const dados = document.createElement("div");
        dados.classList.add("item-dados");

        const nome = document.createElement("strong");
        nome.classList.add("item-nome");
        nome.textContent = item.nome;

        const preco = document.createElement("span");
        preco.classList.add("item-preco");
        preco.textContent = `R$ ${item.preco.toFixed(2)} cada`;

        dados.appendChild(nome);
        dados.appendChild(preco);

        const controles = document.createElement("div");
        controles.classList.add("item-controles");

        const menos = document.createElement("button");
        menos.type = "button";
        menos.classList.add("botao-quantidade");
        menos.textContent = "-1";

        menos.addEventListener("click", () => {
            alterarQuantidade(item.id, -1);
        });

        const quantidade = document.createElement("span");
        quantidade.classList.add("item-quantidade");
        quantidade.textContent = item.quantidade;

        const mais = document.createElement("button");
        mais.type = "button";
        mais.classList.add("botao-quantidade");
        mais.textContent = "+1";

        mais.addEventListener("click", () => {
            alterarQuantidade(item.id, 1);
        });

        controles.appendChild(menos);
        controles.appendChild(quantidade);
        controles.appendChild(mais);

        const subtotalItem = document.createElement("span");
        subtotalItem.classList.add("item-subtotal");
        subtotalItem.textContent =
            `R$ ${(item.preco * item.quantidade).toFixed(2)}`;

        const remover = document.createElement("button");
        remover.type = "button";
        remover.classList.add("botao-remover");
        remover.textContent = "Remover";

        remover.addEventListener("click", () => {
            removerCarrinho(item.id);
        });

        li.appendChild(dados);
        li.appendChild(controles);
        li.appendChild(subtotalItem);
        li.appendChild(remover);

        listaCarrinho.appendChild(li);
    });

    estadoCarrinhoVazio.hidden = carrinho.length !== 0;

    const quantidadeTotal = carrinho.reduce(
        (soma, item) => soma + item.quantidade, 0
    );

    quantidadeCarrinho.textContent = quantidadeTotal;

    calcularTotais();
}

function calcularTotais() {
    const subtotal = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade, 0
    );

    const desconto = subtotal >= 200 ? subtotal * 0.10 : 0;
    const total = subtotal - desconto;

    subtotalCarrinho.textContent = `R$ ${subtotal.toFixed(2)}`;
    descontoCarrinho.textContent = `R$ ${desconto.toFixed(2)}`;
    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

async function finalizarCompra() {
    if (carrinho.length === 0) {
        mensagemCompra.textContent = "O carrinho está vazio.";
        return;
    }

    try {
        botaoFinalizar.disabled = true;
        mensagemCompra.textContent = "Finalizando compra...";

        const itens = carrinho.map(item => ({
            produtoId: item.id,
            quantidade: item.quantidade
        }));

        const resposta = await fetch(`${URL_API}/compras`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ itens })
        });

        const dados = resposta.status === 204
            ? null
            : await resposta.json();

        if (!resposta.ok) {
            const erro = dados?.erro || "Erro ao finalizar compra.";
            throw new Error(erro);
        }

        mensagemCompra.textContent =
            `Compra #${dados.id} realizada! Total: R$ ${Number(dados.total).toFixed(2)}`;

        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();

        await carregarProdutos();

    } catch (erro) {
        mensagemCompra.textContent = erro.message;

    } finally {
        botaoFinalizar.disabled = false;
    }
}

botaoRecarregar.addEventListener("click", carregarProdutos);

campoBusca.addEventListener("input", renderizarProdutos);

filtroEstoque.addEventListener("change", renderizarProdutos);

botaoLimparCarrinho.addEventListener("click", limparCarrinho);

botaoFinalizar.addEventListener("click", finalizarCompra);

renderizarCarrinho();
carregarProdutos();
