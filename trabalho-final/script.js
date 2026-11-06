// URL da API confirmada
const URL_API = "https://minimarket.evolutivasistemas.com.br/api/aluno-gabriel";

// Chave utilizada para salvar o carrinho
const CHAVE_CARRINHO = "minimarket-carrinho";

// ============================================================
// 1. ELEMENTOS DO HTML
// ============================================================

const mensagem = document.getElementById("mensagem");
const mensagemCompra = document.getElementById("mensagem-compra");

const listaProdutos = document.getElementById("lista-produtos");
const totalProdutos = document.getElementById("total-produtos");

const campoBusca = document.getElementById("campo-busca");
const filtroEstoque = document.getElementById("filtro-estoque");
const botaoRecarregar = document.getElementById("botao-recarregar");
const estadoCatalogoVazio = document.getElementById("estado-catalogo-vazio");

const listaCarrinho = document.getElementById("lista-carrinho");
const quantidadeCarrinho = document.getElementById("quantidade-carrinho");
const estadoCarrinhoVazio = document.getElementById("estado-carrinho-vazio");

const subtotalCarrinho = document.getElementById("subtotal-carrinho");
const descontoCarrinho = document.getElementById("desconto-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

const botaoFinalizar = document.getElementById("botao-finalizar");
const botaoLimparCarrinho = document.getElementById("botao-limpar-carrinho");

// ============================================================
// 2. VARIÁVEIS
// ============================================================

let produtos = [];
let carrinho = [];

// ============================================================
// 3. MENSAGENS
// ============================================================

function mostrarMensagem(elemento, texto, tipo = "") {
    elemento.textContent = texto;

    elemento.className = "mensagem";

    if (tipo) {
        elemento.classList.add(tipo);
    }
}

function limparMensagem(elemento) {
    elemento.textContent = "";
    elemento.className = "mensagem";
}

// ============================================================
// 4. TRATAMENTO DE ERROS DA API
// ============================================================

async function obterResposta(resposta) {
    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();

    if (!texto) {
        return null;
    }

    try {
        return JSON.parse(texto);
    } catch {
        return { erro: texto };
    }
}

function obterErro(dados) {
    if (!dados) {
        return "Ocorreu um erro na operação.";
    }

    let erro = dados.erro || dados.message || "Ocorreu um erro.";

    if (dados.detalhes) {
        if (Array.isArray(dados.detalhes)) {
            erro += " " + dados.detalhes.join(", ");
        } else {
            erro += " " + dados.detalhes;
        }
    }

    return erro;
}

// ============================================================
// 5. CARREGAR O CATÁLOGO
// RF01
// ============================================================

async function carregarCatalogo() {
    botaoRecarregar.disabled = true;

    mostrarMensagem(mensagem, "Carregando...", "carregando");

    try {
        const resposta = await fetch(`${URL_API}/produtos`);

        const dados = await obterResposta(resposta);

        if (!resposta.ok) {
            throw new Error(obterErro(dados));
        }

        // A API retorna um array de produtos.
        produtos = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.produtos)
                ? dados.produtos
                : [];

        totalProdutos.textContent = produtos.length;

        // Atualiza os dados dos produtos já presentes no carrinho.
        atualizarDadosCarrinho();

        renderizarProdutos();
        renderizarCarrinho();

        limparMensagem(mensagem);

    } catch (erro) {
        mostrarMensagem(
            mensagem,
            `Não foi possível carregar o catálogo: ${erro.message}`,
            "erro"
        );

    } finally {
        botaoRecarregar.disabled = false;
    }
}

// ============================================================
// 6. ATUALIZAR DADOS DO CARRINHO
// ============================================================

function atualizarDadosCarrinho() {
    carrinho.forEach(item => {
        const produtoAtual = produtos.find(
            produto => String(produto.id) === String(item.id)
        );

        if (produtoAtual) {
            item.nome = produtoAtual.nome;
            item.preco = Number(produtoAtual.preco);
            item.estoque = Number(produtoAtual.estoque);
        }
    });

    salvarCarrinho();
}

// ============================================================
// 7. PESQUISAR E FILTRAR PRODUTOS
// RF02
// ============================================================

function filtrarProdutos() {
    const pesquisa = campoBusca.value.trim().toLowerCase();

    let resultado = produtos.filter(produto => {
        return String(produto.nome).toLowerCase().includes(pesquisa);
    });

    // Desafio opcional: somente produtos com estoque.
    if (filtroEstoque.checked) {
        resultado = resultado.filter(produto => {
            return Number(produto.estoque) > 0;
        });
    }

    return resultado;
}

// ============================================================
// 8. EXIBIR PRODUTOS
// RF01 e RF02
// ============================================================

function renderizarProdutos() {
    listaProdutos.innerHTML = "";

    const produtosFiltrados = filtrarProdutos();

    estadoCatalogoVazio.hidden = produtosFiltrados.length > 0;

    produtosFiltrados.forEach(produto => {
        const item = document.createElement("li");

        const nome = document.createElement("h3");
        nome.className = "produto-nome";
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.className = "produto-preco";
        preco.textContent = formatarDinheiro(Number(produto.preco));

        const estoque = document.createElement("p");
        estoque.className = "produto-estoque";

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botao primario";

        const semEstoque = Number(produto.estoque) <= 0;

        if (semEstoque) {
            item.className = "produto sem-estoque";

            estoque.textContent = "Sem estoque";

            botao.textContent = "Indisponível";
            botao.disabled = true;

        } else {
            item.className = "produto";

            estoque.textContent = `Estoque: ${produto.estoque}`;

            botao.textContent = "Adicionar ao carrinho";

            botao.addEventListener("click", () => {
                adicionarCarrinho(produto.id);
            });
        }

        item.appendChild(nome);
        item.appendChild(preco);
        item.appendChild(estoque);
        item.appendChild(botao);

        listaProdutos.appendChild(item);
    });
}

// ============================================================
// 9. LOCALSTORAGE
// RF03
// ============================================================

function salvarCarrinho() {
    localStorage.setItem(
        CHAVE_CARRINHO,
        JSON.stringify(carrinho)
    );
}

function recuperarCarrinho() {
    try {
        const dados = localStorage.getItem(CHAVE_CARRINHO);

        if (dados) {
            const itens = JSON.parse(dados);

            if (Array.isArray(itens)) {
                carrinho = itens.filter(item => {
                    return (
                        item.id !== undefined &&
                        Number.isFinite(Number(item.preco)) &&
                        Number.isInteger(Number(item.quantidade)) &&
                        Number(item.quantidade) > 0
                    );
                });
            }
        }

    } catch (erro) {
        console.error("Erro ao recuperar carrinho:", erro);

        carrinho = [];
    }

    renderizarCarrinho();
}

// ============================================================
// 10. ADICIONAR PRODUTO AO CARRINHO
// RF03
// ============================================================

function adicionarCarrinho(id) {
    const produto = produtos.find(
        item => String(item.id) === String(id)
    );

    if (!produto) {
        mostrarMensagem(mensagem, "Produto não encontrado.", "erro");
        return;
    }

    const estoque = Number(produto.estoque);

    if (estoque <= 0) {
        mostrarMensagem(mensagem, "Produto sem estoque.", "erro");
        return;
    }

    const itemExistente = carrinho.find(
        item => String(item.id) === String(id)
    );

    if (itemExistente) {

        if (itemExistente.quantidade >= estoque) {
            mostrarMensagem(
                mensagem,
                "Você atingiu o limite de estoque deste produto.",
                "erro"
            );

            return;
        }

        itemExistente.quantidade++;

    } else {

        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidade: 1,
            estoque: estoque
        });
    }

    salvarCarrinho();
    renderizarCarrinho();

    mostrarMensagem(
        mensagem,
        `${produto.nome} adicionado ao carrinho.`,
        "sucesso"
    );
}

// ============================================================
// 11. ALTERAR QUANTIDADE
// RF03
// ============================================================

function alterarQuantidade(id, operacao) {
    const item = carrinho.find(
        produto => String(produto.id) === String(id)
    );

    if (!item) {
        return;
    }

    if (operacao === "mais") {

        const produtoAtual = produtos.find(
            produto => String(produto.id) === String(id)
        );

        const estoque = produtoAtual
            ? Number(produtoAtual.estoque)
            : Number(item.estoque);

        if (item.quantidade >= estoque) {
            mostrarMensagem(
                mensagem,
                "Não há estoque suficiente para aumentar a quantidade.",
                "erro"
            );

            return;
        }

        item.quantidade++;

    } else if (operacao === "menos") {

        if (item.quantidade === 1) {
            removerItem(id);
            return;
        }

        item.quantidade--;
    }

    salvarCarrinho();
    renderizarCarrinho();

    limparMensagem(mensagem);
}

// ============================================================
// 12. REMOVER ITEM
// RF03
// ============================================================

function removerItem(id) {
    carrinho = carrinho.filter(
        item => String(item.id) !== String(id)
    );

    salvarCarrinho();
    renderizarCarrinho();

    limparMensagem(mensagem);
}

// ============================================================
// 13. ESVAZIAR CARRINHO
// RF03
// ============================================================

function limparCarrinho() {
    carrinho = [];

    salvarCarrinho();
    renderizarCarrinho();

    limparMensagem(mensagem);
}

// ============================================================
// 14. EXIBIR CARRINHO
// RF03
// ============================================================

function renderizarCarrinho() {
    listaCarrinho.innerHTML = "";

    estadoCarrinhoVazio.hidden = carrinho.length > 0;

    let quantidadeTotal = 0;
    let subtotal = 0;

    carrinho.forEach(item => {

        const quantidade = Number(item.quantidade);
        const preco = Number(item.preco);

        quantidadeTotal += quantidade;

        subtotal += preco * quantidade;

        const linha = document.createElement("li");
        linha.className = "item-carrinho";

        const dados = document.createElement("div");
        dados.className = "item-dados";

        const nome = document.createElement("strong");
        nome.className = "item-nome";
        nome.textContent = item.nome;

        const precoUnitario = document.createElement("span");
        precoUnitario.className = "item-preco";
        precoUnitario.textContent = `${formatarDinheiro(preco)} cada`;

        dados.appendChild(nome);
        dados.appendChild(precoUnitario);

        const controles = document.createElement("div");
        controles.className = "item-controles";

        const botaoMenos = document.createElement("button");
        botaoMenos.type = "button";
        botaoMenos.className = "botao-quantidade";
        botaoMenos.textContent = "-1";

        botaoMenos.addEventListener("click", () => {
            alterarQuantidade(item.id, "menos");
        });

        const quantidadeItem = document.createElement("span");
        quantidadeItem.className = "item-quantidade";
        quantidadeItem.textContent = quantidade;

        const botaoMais = document.createElement("button");
        botaoMais.type = "button";
        botaoMais.className = "botao-quantidade";
        botaoMais.textContent = "+1";

        botaoMais.addEventListener("click", () => {
            alterarQuantidade(item.id, "mais");
        });

        controles.appendChild(botaoMenos);
        controles.appendChild(quantidadeItem);
        controles.appendChild(botaoMais);

        const subtotalItem = document.createElement("span");
        subtotalItem.className = "item-subtotal";
        subtotalItem.textContent = formatarDinheiro(preco * quantidade);

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.className = "botao-remover";
        botaoRemover.textContent = "Remover";

        botaoRemover.addEventListener("click", () => {
            removerItem(item.id);
        });

        linha.appendChild(dados);
        linha.appendChild(controles);
        linha.appendChild(subtotalItem);
        linha.appendChild(botaoRemover);

        listaCarrinho.appendChild(linha);
    });

    // Atualiza quantidade total.
    quantidadeCarrinho.textContent = quantidadeTotal;

    // Calcula desconto de 10% a partir de R$ 200.
    const desconto = subtotal >= 200
        ? subtotal * 0.10
        : 0;

    const total = subtotal - desconto;

    // Atualiza os valores na tela.
    subtotalCarrinho.textContent = formatarDinheiro(subtotal);
    descontoCarrinho.textContent = formatarDinheiro(desconto);
    totalCarrinho.textContent = formatarDinheiro(total);
}

// ============================================================
// 15. FORMATAR DINHEIRO
// RF04
// ============================================================

function formatarDinheiro(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero < 0) {
        return "R$ 0.00";
    }

    return `R$ ${numero.toFixed(2)}`;
}

// ============================================================
// 16. FINALIZAR COMPRA
// RF05
// ============================================================

async function finalizarCompra() {

    if (carrinho.length === 0) {
        mostrarMensagem(
            mensagemCompra,
            "Adicione produtos ao carrinho antes de finalizar.",
            "erro"
        );

        return;
    }

    botaoFinalizar.disabled = true;

    mostrarMensagem(
        mensagemCompra,
        "Finalizando compra...",
        "carregando"
    );

    try {

        // Envia somente o ID e a quantidade.
        const itensCompra = carrinho.map(item => ({
            produtoId: item.id,
            quantidade: item.quantidade
        }));

        const resposta = await fetch(`${URL_API}/compras`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                itens: itensCompra
            })
        });

        const dados = await obterResposta(resposta);

        if (!resposta.ok) {
            throw new Error(obterErro(dados));
        }

        // A compra só é limpa após sucesso da API.
        const numeroCompra = dados.id;
        const totalCompra = dados.total;

        carrinho = [];

        salvarCarrinho();
        renderizarCarrinho();

        mostrarMensagem(
            mensagemCompra,
            `Compra nº ${numeroCompra} realizada com sucesso! Total: ${formatarDinheiro(totalCompra)}.`,
            "sucesso"
        );

        // Atualiza o estoque consultando novamente a API.
        await atualizarCatalogoAposCompra();

    } catch (erro) {

        mostrarMensagem(
            mensagemCompra,
            `Não foi possível finalizar a compra: ${erro.message}`,
            "erro"
        );

    } finally {

        botaoFinalizar.disabled = false;
    }
}

// ============================================================
// 17. ATUALIZAR CATÁLOGO APÓS A COMPRA
// ============================================================

async function atualizarCatalogoAposCompra() {

    try {

        const resposta = await fetch(`${URL_API}/produtos`);

        const dados = await obterResposta(resposta);

        if (!resposta.ok) {
            throw new Error(obterErro(dados));
        }

        produtos = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.produtos)
                ? dados.produtos
                : [];

        totalProdutos.textContent = produtos.length;

        renderizarProdutos();

    } catch (erro) {

        mostrarMensagem(
            mensagem,
            `Compra realizada, mas não foi possível atualizar o catálogo: ${erro.message}`,
            "erro"
        );
    }
}

// ============================================================
// 18. EVENTOS
// ============================================================

// Pesquisa enquanto o usuário digita.
campoBusca.addEventListener("input", () => {
    renderizarProdutos();
});

// Filtro opcional de estoque.
filtroEstoque.addEventListener("change", () => {
    renderizarProdutos();
});

// Atualizar catálogo.
botaoRecarregar.addEventListener("click", () => {
    carregarCatalogo();
});

// Limpar carrinho.
botaoLimparCarrinho.addEventListener("click", () => {
    limparCarrinho();
});

// Finalizar compra.
botaoFinalizar.addEventListener("click", () => {
    finalizarCompra();
});

// ============================================================
// 19. INICIALIZAÇÃO
// ============================================================

// Recupera o carrinho salvo.
recuperarCarrinho();

// Carrega os produtos da API.
carregarCatalogo();
