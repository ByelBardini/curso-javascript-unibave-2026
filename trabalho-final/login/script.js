// ============================================================
// MiniMarket — Prova final de JavaScript — ÁREA DO LOJISTA
//
// Escreva aqui o JavaScript desta página (login, sessão e cadastro
// de produtos), usando JavaScript puro. O JavaScript da loja fica no
// ../script.js. Os requisitos e os ids estão no README.md; as rotas
// da API estão no API.md. Não altere o HTML nem o CSS.
// ============================================================

// Troque SEU-CODIGO pelo seu código de aluno (o mesmo da loja). O endereço
// do servidor é informado pelo professor.
const URL_API = "https://minimarket.evolutivasistemas.com.br/api/aluno-willyan";

const estadoSessao = document.getElementById("estado-sessao");

const formLogin = document.getElementById("form-login");
const campoUsuario = document.getElementById("campo-usuario");
const campoSenha = document.getElementById("campo-senha");
const botaoLogin = document.getElementById("botao-login");
const botaoLogout = document.getElementById("botao-logout");
const areaCadastroProduto = document.getElementById("area-cadastro-produto");
const formProduto = document.getElementById("form-produto");
const produtoNome = document.getElementById("produto-nome");
const produtoPreco = document.getElementById("produto-preco");
const produtoEstoque = document.getElementById("produto-estoque");
const botaoCadastrarProduto = document.getElementById("botao-cadastrar-produto");
const mensagem = document.getElementById("mensagem");

let token = localStorage.getItem("minimarket-token");

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";

    if (tipo) mensagem.classList.add(tipo);
}

function mostrarVisitante() {
    token = null;
    localStorage.removeItem("minimarket-token");

    estadoSessao.textContent = "Visitante";
    estadoSessao.classList.remove("logado");

    formLogin.hidden = false;
    botaoLogout.hidden = true;
    areaCadastroProduto.hidden = true;
}

function mostrarLogado(usuario) {
    estadoSessao.textContent = `Conectado: ${usuario}`;
    estadoSessao.classList.add("logado");

    formLogin.hidden = true;
    botaoLogout.hidden = false;
    areaCadastroProduto.hidden = false;
}

async function fazerLogin(evento) {
    evento.preventDefault();

    try {
        botaoLogin.disabled = true;
        mostrarMensagem("Entrando...");

        const resposta = await fetch(`${URL_API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: campoUsuario.value.trim(),
                senha: campoSenha.value
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Falha no login.");
        }

        token = dados.token;

        localStorage.setItem("minimarket-token", token);

        mostrarLogado(dados.usuario);

        campoSenha.value = "";

        mostrarMensagem("Login realizado com sucesso.", "sucesso");

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");

    } finally {
        botaoLogin.disabled = false;
    }
}

async function verificarSessao() {
    if (!token) {
        mostrarVisitante();
        return;
    }

    try {
        mostrarMensagem("Verificando sessão...");

        const resposta = await fetch(`${URL_API}/auth/eu`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        if (resposta.status === 401) {
            mostrarVisitante();
            mostrarMensagem("Sessão expirada. Entre novamente.", "erro");
            return;
        }

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao verificar sessão.");
        }

        mostrarLogado(dados.usuario);
        mostrarMensagem("Sessão restaurada.", "sucesso");

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    }
}

async function fazerLogout() {
    try {
        botaoLogout.disabled = true;
        mostrarMensagem("Encerrando sessão...");

        const resposta = await fetch(`${URL_API}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resposta.ok && resposta.status !== 401) {
            const dados = await resposta.json();
            throw new Error(dados.erro || "Erro ao sair.");
        }

        mostrarVisitante();
        mostrarMensagem("Logout realizado com sucesso.", "sucesso");

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");

    } finally {
        botaoLogout.disabled = false;
    }
}

function validarProduto() {
    const nome = produtoNome.value.trim();
    const precoTexto = produtoPreco.value.trim();
    const estoqueTexto = produtoEstoque.value.trim();

    const preco = Number(precoTexto);
    const estoque = Number(estoqueTexto);

    if (nome.length < 2 || nome.length > 100) {
        return "O nome deve ter entre 2 e 100 caracteres.";
    }

    if (precoTexto === "" || !Number.isFinite(preco) || preco <= 0) {
        return "Informe um preço numérico maior que zero.";
    }

    if (estoqueTexto === "" || !Number.isInteger(estoque) || estoque < 0) {
        return "Informe um estoque inteiro maior ou igual a zero.";
    }

    if (Math.round(preco * 100) !== preco * 100) {
        return "O preço deve ter no máximo duas casas decimais.";
    }

    return {
        nome,
        preco,
        estoque
    };
}

async function cadastrarProduto(evento) {
    evento.preventDefault();

    const dados = validarProduto();

    if (typeof dados === "string") {
        mostrarMensagem(dados, "erro");
        return;
    }

    try {
        botaoCadastrarProduto.disabled = true;
        mostrarMensagem("Cadastrando produto...");

        const resposta = await fetch(`${URL_API}/produtos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.status === 401) {
            mostrarVisitante();
            mostrarMensagem("Sessão expirada. Entre novamente.", "erro");
            return;
        }

        if (!resposta.ok) {
            const detalhes = resultado.detalhes
                ? JSON.stringify(resultado.detalhes)
                : "";

            throw new Error(
                `${resultado.erro || "Erro ao cadastrar produto."} ${detalhes}`
            );
        }

        formProduto.reset();

        mostrarMensagem(
            `Produto ${resultado.nome} cadastrado com sucesso!`,
            "sucesso"
        );

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");

    } finally {
        botaoCadastrarProduto.disabled = false;
    }
}

formLogin.addEventListener("submit", fazerLogin);

botaoLogout.addEventListener("click", fazerLogout);

formProduto.addEventListener("submit", cadastrarProduto);

if (token) {
    verificarSessao();
} else {
    mostrarVisitante();
}

