/*// ============================================================
// MiniMarket — Prova final de JavaScript — ÁREA DO LOJISTA
//
// Escreva aqui o JavaScript desta página (login, sessão e cadastro
// de produtos), usando JavaScript puro. O JavaScript da loja fica no
// ../script.js. Os requisitos e os ids estão no README.md; as rotas
// da API estão no API.md. Não altere o HTML nem o CSS.
// ============================================================

// Troque SEU-CODIGO pelo seu código de aluno (o mesmo da loja). O endereço
// do servidor é informado pelo professor.
const URL_API = "http://localhost:3000/api/SEU-CODIGO";*/

// ==========================================
// MINIMARKET - ÁREA DO LOJISTA
// Gabriel Jacinto Camilo
// Aula 08 - Prova Final de JavaScript
// ==========================================

// ENDEREÇO DA API
const API_URL = "https://minimarket.evolutivasistemas.com.br/api/aluno-gabriel";
// CHAVE DO TOKEN
const CHAVE_TOKEN = "minimarket-token";

// ELEMENTOS DO HTML
const mensagem = document.getElementById("mensagem");
const estadoSessao = document.getElementById("estado-sessao");

const formLogin = document.getElementById("form-login");
const campoUsuario = document.getElementById("campo-usuario");
const campoSenha = document.getElementById("campo-senha");
const botaoLogin = document.getElementById("botao-login");

const botaoLogout = document.getElementById("botao-logout");

const areaCadastro = document.getElementById("area-cadastro-produto");
const formProduto = document.getElementById("form-produto");

const produtoNome = document.getElementById("produto-nome");
const produtoPreco = document.getElementById("produto-preco");
const produtoEstoque = document.getElementById("produto-estoque");

const botaoCadastrar = document.getElementById("botao-cadastrar-produto");


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// MOSTRAR MENSAGENS NA TELA
function mostrarMensagem(texto, tipo = "") {

    mensagem.textContent = texto;

    mensagem.className = tipo
        ? `mensagem ${tipo}`
        : "mensagem";

}


// BUSCAR MENSAGEM DE ERRO DA API
async function obterErro(resposta) {

    try {

        const dados = await resposta.json();

        let texto = dados.erro || "Ocorreu um erro.";

        if (dados.detalhes) {

            const detalhes = Object.entries(dados.detalhes)
                .map(([campo, problema]) => `${campo}: ${problema}`)
                .join(" | ");

            texto += " " + detalhes;

        }

        return texto;

    } catch {

        return "Não foi possível interpretar a resposta do servidor.";

    }

}


// ATUALIZAR A INTERFACE
function atualizarInterface(usuario = null) {

    if (usuario) {

        estadoSessao.textContent = `Conectado como: ${usuario}`;

        estadoSessao.className = "sessao logado";

        formLogin.hidden = true;

        botaoLogout.hidden = false;

        areaCadastro.hidden = false;

    } else {

        estadoSessao.textContent = "Visitante: você não está conectado.";

        estadoSessao.className = "sessao";

        formLogin.hidden = false;

        botaoLogout.hidden = true;

        areaCadastro.hidden = true;

    }

}


// ENCERRAR A SESSÃO LOCALMENTE
function encerrarSessao() {

    localStorage.removeItem(CHAVE_TOKEN);

    atualizarInterface();

}


// ==========================================
// RF06 - LOGIN
// ==========================================

formLogin.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;

    // VALIDAR CAMPOS
    if (usuario === "" || senha === "") {

        mostrarMensagem("Preencha o usuário e a senha.", "erro");

        return;

    }

    botaoLogin.disabled = true;

    mostrarMensagem("Realizando login...", "carregando");

    try {

        const resposta = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                usuario: usuario,
                senha: senha
            })

        });

        if (!resposta.ok) {

            const erro = await obterErro(resposta);

            throw new Error(erro);

        }

        const dados = await resposta.json();

        // VERIFICAR SE A API RETORNOU O TOKEN
        if (!dados.token || !dados.usuario) {

            throw new Error("A API não retornou os dados da sessão.");

        }

        // SALVAR TOKEN
        localStorage.setItem(CHAVE_TOKEN, dados.token);

        // ATUALIZAR INTERFACE
        atualizarInterface(dados.usuario);

        // LIMPAR SENHA
        campoSenha.value = "";

        mostrarMensagem("Login realizado com sucesso!", "sucesso");

    } catch (erro) {

        mostrarMensagem(erro.message, "erro");

    } finally {

        botaoLogin.disabled = false;

    }

});


// ==========================================
// RESTAURAR SESSÃO AO ABRIR A PÁGINA
// ==========================================

async function verificarSessao() {

    const token = localStorage.getItem(CHAVE_TOKEN);

    // SE NÃO EXISTIR TOKEN
    if (!token) {

        atualizarInterface();

        return;

    }

    mostrarMensagem("Verificando sessão...", "carregando");

    try {

        const resposta = await fetch(`${API_URL}/auth/eu`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        if (resposta.status === 401) {

            encerrarSessao();

            mostrarMensagem("Sua sessão expirou. Entre novamente.", "erro");

            return;

        }

        if (!resposta.ok) {

            throw new Error("Não foi possível verificar sua sessão.");

        }

        const dados = await resposta.json();

        atualizarInterface(dados.usuario);

        mostrarMensagem("Sessão restaurada com sucesso!", "sucesso");

    } catch (erro) {

        atualizarInterface();

        mostrarMensagem("Erro ao verificar sessão: " + erro.message, "erro");

    }

}


// ==========================================
// RF06 - LOGOUT
// ==========================================

botaoLogout.addEventListener("click", async function () {

    const token = localStorage.getItem(CHAVE_TOKEN);

    botaoLogout.disabled = true;

    mostrarMensagem("Encerrando sessão...", "carregando");

    try {

        if (token) {

            const resposta = await fetch(`${API_URL}/auth/logout`, {

                method: "POST",

                headers: {
                    "Authorization": `Bearer ${token}`
                }

            });

            if (!resposta.ok && resposta.status !== 401) {

                const erro = await obterErro(resposta);

                throw new Error(erro);

            }

        }

        encerrarSessao();

        mostrarMensagem("Você saiu da sua conta.", "sucesso");

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível encerrar a sessão no servidor: " + erro.message,
            "erro"
        );

    } finally {

        botaoLogout.disabled = false;

    }

});


// ==========================================
// RF07 - CADASTRAR PRODUTO
// ==========================================

formProduto.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    // RECUPERAR OS VALORES
    const nome = produtoNome.value.trim();

    const precoTexto = produtoPreco.value.trim();

    const estoqueTexto = produtoEstoque.value.trim();


    // ======================================
    // VALIDAÇÕES
    // ======================================

    // VALIDAR NOME
    if (nome.length < 2 || nome.length > 100) {

        mostrarMensagem(
            "O nome deve possuir entre 2 e 100 caracteres.",
            "erro"
        );

        return;

    }


    // VALIDAR PREÇO VAZIO
    if (precoTexto === "") {

        mostrarMensagem("Informe o preço do produto.", "erro");

        return;

    }


    // VALIDAR PREÇO
    const preco = Number(precoTexto);

    if (
        !Number.isFinite(preco) ||
        preco <= 0 ||
        !/^\d+(\.\d{1,2})?$/.test(precoTexto)
    ) {

        mostrarMensagem(
            "O preço deve ser maior que zero e possuir no máximo duas casas decimais.",
            "erro"
        );

        return;

    }


    // VALIDAR ESTOQUE VAZIO
    if (estoqueTexto === "") {

        mostrarMensagem("Informe o estoque do produto.", "erro");

        return;

    }


    // VALIDAR ESTOQUE
    const estoque = Number(estoqueTexto);

    if (
        !Number.isInteger(estoque) ||
        estoque < 0
    ) {

        mostrarMensagem(
            "O estoque deve ser um número inteiro igual ou maior que zero.",
            "erro"
        );

        return;

    }


    // ======================================
    // ENVIAR PRODUTO PARA A API
    // ======================================

    const token = localStorage.getItem(CHAVE_TOKEN);

    if (!token) {

        encerrarSessao();

        mostrarMensagem("Faça login para cadastrar produtos.", "erro");

        return;

    }

    botaoCadastrar.disabled = true;

    mostrarMensagem("Cadastrando produto...", "carregando");

    try {

        const resposta = await fetch(`${API_URL}/produtos`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify({

                nome: nome,

                preco: preco,

                estoque: estoque

            })

        });


        // VERIFICAR AUTENTICAÇÃO
        if (resposta.status === 401) {

            encerrarSessao();

            mostrarMensagem(
                "Sua sessão expirou. Faça login novamente.",
                "erro"
            );

            return;

        }


        // VERIFICAR ERROS
        if (!resposta.ok) {

            const erro = await obterErro(resposta);

            throw new Error(erro);

        }


        // PRODUTO CADASTRADO
        const dados = await resposta.json();

        formProduto.reset();

        mostrarMensagem(
            `Produto "${dados.nome}" cadastrado com sucesso!`,
            "sucesso"
        );

    } catch (erro) {

        mostrarMensagem(erro.message, "erro");

    } finally {

        botaoCadastrar.disabled = false;

    }

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

verificarSessao();