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
const URL_API = "https://minimarket.evolutivasistemas.com.br/api/aluno-maiza";
const CHAVE_TOKEN = "minimarket-token";

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
const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = texto ? "mensagem " + (tipo || "") : "mensagem";
}

async function lerJson(resposta) {
  try {
    return await resposta.json();
  } catch (e) {
    return {};
  }
}

function cabecalhoAuth() {
  return { Authorization: "Bearer " + localStorage.getItem(CHAVE_TOKEN) };
}

function modoVisitante() {
  localStorage.removeItem(CHAVE_TOKEN);
  estadoSessao.textContent = "Visitante";
  estadoSessao.className = "sessao";
  formLogin.hidden = false;
  botaoLogout.hidden = true;
  areaCadastro.hidden = true;
}

function modoLogado(usuario) {
  estadoSessao.textContent = "Conectado como " + usuario;
  estadoSessao.className = "sessao logado";
  formLogin.hidden = true;
  botaoLogout.hidden = false;
  areaCadastro.hidden = false;
  campoSenha.value = "";
}

async function restaurarSessao() {
  if (!localStorage.getItem(CHAVE_TOKEN)) {
    modoVisitante();
    return;
  }
  try {
    const resposta = await fetch(URL_API + "/auth/eu", { headers: cabecalhoAuth() });
    if (resposta.status === 401) {
      modoVisitante();
      return;
    }
    const dados = await lerJson(resposta);
    if (!resposta.ok) throw new Error(dados.erro || "Erro ao confirmar a sessão.");
    modoLogado(dados.usuario);
  } catch (erro) {
    modoVisitante();
    mostrarMensagem(erro.message || "Falha de rede ao confirmar a sessão.", "erro");
  }
}

formLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  botaoLogin.disabled = true;
  mostrarMensagem("");
  try {
    const resposta = await fetch(URL_API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: campoUsuario.value, senha: campoSenha.value }),
    });
    const dados = await lerJson(resposta);

    if (!resposta.ok) {
      modoVisitante();
      mostrarMensagem(dados.erro || "Usuário ou senha inválidos.", "erro");
      return;
    }
    localStorage.setItem(CHAVE_TOKEN, dados.token);
    modoLogado(dados.usuario);
    mostrarMensagem("Login realizado com sucesso.", "sucesso");
  } catch (erro) {
    mostrarMensagem("Falha de rede ao fazer login.", "erro");
  } finally {
    botaoLogin.disabled = false;
  }
});

botaoLogout.addEventListener("click", async function () {
  botaoLogout.disabled = true;
  try {
    await fetch(URL_API + "/auth/logout", {
      method: "POST",
      headers: cabecalhoAuth(),
    });
    mostrarMensagem("Sessão encerrada.", "sucesso");
  } catch (erro) {
    mostrarMensagem("Falha de rede, mas a sessão foi encerrada neste navegador.", "erro");
  } finally {
    modoVisitante();
    botaoLogout.disabled = false;
  }
});

formProduto.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const nome = produtoNome.value.trim();
  const textoPreco = produtoPreco.value.trim();
  const textoEstoque = produtoEstoque.value.trim();
  const preco = Number(textoPreco);
  const estoque = Number(textoEstoque);

  if (nome.length < 2 || nome.length > 100) {
    mostrarMensagem("O nome é obrigatório e deve ter de 2 a 100 caracteres.", "erro");
    return;
  }
  if (textoPreco === "" || isNaN(preco) || preco <= 0) {
    mostrarMensagem("O preço é obrigatório e deve ser um número maior que zero.", "erro");
    return;
  }
  if (textoEstoque === "" || !Number.isInteger(estoque) || estoque < 0) {
    mostrarMensagem("O estoque é obrigatório e deve ser um inteiro maior ou igual a zero.", "erro");
    return;
  }

  botaoCadastrar.disabled = true;
  mostrarMensagem("");
  try {
    const resposta = await fetch(URL_API + "/produtos", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, cabecalhoAuth()),
      body: JSON.stringify({ nome: nome, preco: preco, estoque: estoque }),
    });
    const dados = await lerJson(resposta);

    if (resposta.status === 201) {
      produtoNome.value = "";
      produtoPreco.value = "";
      produtoEstoque.value = "";
      mostrarMensagem('Produto "' + (dados.nome || nome) + '" cadastrado com sucesso.', "sucesso");
    } else if (resposta.status === 401) {
      modoVisitante();
      mostrarMensagem("Sessão expirada. Faça login novamente.", "erro");
    } else {
      let texto = dados.erro || "Não foi possível cadastrar o produto.";
      if (dados.detalhes) texto += " " + [].concat(dados.detalhes).join(" ");
      mostrarMensagem(texto, "erro");
    }
  } catch (erro) {
    mostrarMensagem("Falha de rede ao cadastrar o produto.", "erro");
  } finally {
    botaoCadastrar.disabled = false;
  }
});

restaurarSessao();
