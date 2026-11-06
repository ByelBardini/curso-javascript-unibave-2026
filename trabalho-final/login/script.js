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
const URL_API = "https://minimarket.evolutivasistemas.com.br/api/aluno-joao";

const CHAVE_TOKEN = "minimarket-token";

const mensagemEl = document.getElementById("mensagem");

const estadoSessaoEl = document.getElementById("estado-sessao");
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

let token = null;

function definirMensagem(texto, tipo) {
  mensagemEl.textContent = texto || "";
  mensagemEl.className = tipo ? `mensagem ${tipo}` : "mensagem";
}

function mostrarLogado(usuario) {
  estadoSessaoEl.textContent = `Conectado como ${usuario}.`;
  estadoSessaoEl.className = "sessao logado";
  formLogin.hidden = true;
  botaoLogout.hidden = false;
  areaCadastroProduto.hidden = false;
}

function mostrarVisitante() {
  token = null;
  localStorage.removeItem(CHAVE_TOKEN);
  estadoSessaoEl.textContent = "Visitante: você não está conectado.";
  estadoSessaoEl.className = "sessao";
  formLogin.hidden = false;
  botaoLogout.hidden = true;
  areaCadastroProduto.hidden = true;
}

// ---------- Sessão ----------

async function confirmarSessao() {
  const tokenSalvo = localStorage.getItem(CHAVE_TOKEN);
  if (!tokenSalvo) {
    mostrarVisitante();
    return;
  }

  try {
    const resposta = await fetch(`${URL_API}/auth/eu`, {
      headers: { Authorization: `Bearer ${tokenSalvo}` },
    });

    if (!resposta.ok) {
      mostrarVisitante();
      return;
    }

    const dados = await resposta.json();
    token = tokenSalvo;
    mostrarLogado(dados.usuario);
  } catch (erro) {
    mostrarVisitante();
  }
}

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const usuario = campoUsuario.value.trim();
  const senha = campoSenha.value;
  if (!usuario || !senha) {
    definirMensagem("Informe usuário e senha.", "erro");
    return;
  }

  botaoLogin.disabled = true;
  definirMensagem("Entrando...", "carregando");

  try {
    const resposta = await fetch(`${URL_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      definirMensagem(dados.erro || "Usuário ou senha inválidos.", "erro");
      return;
    }

    token = dados.token;
    localStorage.setItem(CHAVE_TOKEN, token);
    campoSenha.value = "";
    definirMensagem(`Bem-vindo, ${dados.usuario}!`, "sucesso");
    mostrarLogado(dados.usuario);
  } catch (erro) {
    definirMensagem("Erro de conexão ao entrar.", "erro");
  } finally {
    botaoLogin.disabled = false;
  }
});

botaoLogout.addEventListener("click", async () => {
  botaoLogout.disabled = true;

  try {
    await fetch(`${URL_API}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (erro) {
    // Mesmo sem resposta do servidor, a sessão é encerrada localmente.
  } finally {
    botaoLogout.disabled = false;
  }

  definirMensagem("Você saiu da conta.", "sucesso");
  mostrarVisitante();
});

// ---------- Cadastro de produto ----------

formProduto.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = produtoNome.value.trim();
  const precoTexto = produtoPreco.value.trim();
  const estoqueTexto = produtoEstoque.value.trim();

  if (nome.length < 2 || nome.length > 100) {
    definirMensagem("O nome deve ter de 2 a 100 caracteres.", "erro");
    return;
  }

  if (precoTexto === "") {
    definirMensagem("Informe o preço.", "erro");
    return;
  }
  const preco = Number(precoTexto);
  if (!Number.isFinite(preco) || preco <= 0) {
    definirMensagem("O preço deve ser um número maior que zero.", "erro");
    return;
  }

  if (estoqueTexto === "") {
    definirMensagem("Informe o estoque.", "erro");
    return;
  }
  const estoque = Number(estoqueTexto);
  if (!Number.isInteger(estoque) || estoque < 0) {
    definirMensagem("O estoque deve ser um número inteiro maior ou igual a zero.", "erro");
    return;
  }

  botaoCadastrarProduto.disabled = true;
  definirMensagem("Cadastrando...", "carregando");

  try {
    const resposta = await fetch(`${URL_API}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, preco, estoque }),
    });

    if (resposta.status === 401) {
      definirMensagem("Sessão expirada. Entre novamente.", "erro");
      mostrarVisitante();
      return;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
      const detalhes = dados.detalhes ? Object.values(dados.detalhes).join(" ") : "";
      definirMensagem(`${dados.erro}${detalhes ? ": " + detalhes : ""}`, "erro");
      return;
    }

    formProduto.reset();
    definirMensagem(`Produto "${dados.nome}" cadastrado com sucesso.`, "sucesso");
  } catch (erro) {
    definirMensagem("Erro de conexão ao cadastrar produto.", "erro");
  } finally {
    botaoCadastrarProduto.disabled = false;
  }
});

// ---------- Inicialização ----------

confirmarSessao();
