// ============================================================
// AULA 05 — EXERCÍCIOS
// ============================================================

// ============================================================
// EXERCÍCIO 01 — Consulta de DDD
//
//   https://brasilapi.com.br/api/ddd/v1/{ddd}
//   https://brasilapi.com.br/api/ibge/uf/v1/{sigla}
// ============================================================

const URL_BRASIL_API = "https://brasilapi.com.br/api";

const campoDdd = document.getElementById("dddCampo");
const botaoDdd = document.getElementById("buscarDdd");
const avisoDdd = document.getElementById("avisoDdd");
const estadoDdd = document.getElementById("estadoDdd");
const totalCidades = document.getElementById("totalCidades");
const listaCidades = document.getElementById("listaCidades");
const filtroCidade = document.getElementById("filtroCidade");

// Fonte da verdade: todas as cidades do último DDD buscado.
// A tela é só um desenho desse array.
let cidades = [];

// --------------------------------------------------------------------- //
// Função que desenha um array de cidades na tela
// --------------------------------------------------------------------- //

// Recebe qualquer array de cidades: pode ser o array cidades inteiro ou só
// uma parte dele (o filtro do próximo item vai usar isso).
function mostrarCidades(lista) {
  let html = "";

  for (const cidade of lista) {
    html = html + "<li>" + cidade + "</li>";
  }

  listaCidades.innerHTML = html;

  // lista.length: quantas estão aparecendo
  // cidades.length: quantas o DDD tem no total
  totalCidades.textContent =
    "Mostrando " + lista.length + " de " + cidades.length + " cidades";
}

// --------------------------------------------------------------------- //
// Função que só confere dados: não mexe na tela
// --------------------------------------------------------------------- //

// Devolve true se o DDD tem exatamente 2 caracteres, os dois são números e
// não começa com 0.
function dddValido(ddd) {
  if (ddd.length !== 2) {
    return false;
  }

  // O for...of também percorre uma string, um caractere por vez.
  // "0123456789".includes(caractere) só é true se o caractere for um dígito.
  for (const caractere of ddd) {
    if (!"0123456789".includes(caractere)) {
      return false;
    }
  }

  // Nenhum DDD começa com 0. Aqui já sabemos que são 2 dígitos, então
  // "01" vira 1 e "48" vira 48: abaixo de 10 é porque começa com 0.
  // (A API até recusa, mas com a mensagem confusa "DDD deve conter apenas
  // 2 dígitos".)
  if (Number(ddd) < 10) {
    return false;
  }

  return true;
}

// --------------------------------------------------------------------- //
// Desafio: segunda chamada, troca a sigla pelo nome do estado e a capital
// --------------------------------------------------------------------- //

// Quando chega aqui, a sigla já está na tela ("Estado: SC"). Se esta segunda
// chamada falhar, a sigla continua lá: o principal (as cidades) já deu certo.
async function mostrarNomeEstado(sigla) {
  try {
    const resposta = await fetch(URL_BRASIL_API + "/ibge/uf/v1/" + sigla);
    const estado = await resposta.json();

    // A resposta é um objeto assim:
    // { sigla: "SC", nome: "Santa Catarina", capital: "Florianópolis", ... }
    if (resposta.ok) {
      estadoDdd.textContent =
        sigla + " - " + estado.nome + " (capital: " + estado.capital + ")";
    }
  } catch (erro) {
    console.log(erro);
  }
}

// --------------------------------------------------------------------- //
// Função ligada ao botão Buscar
// --------------------------------------------------------------------- //

async function buscarDdd() {
  const ddd = campoDdd.value;

  // 1. Confere antes de chamar a API: DDD inválido nem chega no fetch
  if (!dddValido(ddd)) {
    avisoDdd.textContent = "Digite um DDD com 2 números, sem começar com 0 (ex.: 48).";
    return;
  }

  // 2. Enquanto espera: avisa e impede um segundo clique
  avisoDdd.textContent = "Buscando...";
  botaoDdd.disabled = true;

  try {
    const resposta = await fetch(URL_BRASIL_API + "/ddd/v1/" + ddd);
    const dados = await resposta.json();

    if (!resposta.ok) {
      // 3. A API respondeu, mas com erro. Teste com o DDD 10: o status é
      // 404 e a API explica o motivo no campo "message".
      avisoDdd.textContent = "Erro " + resposta.status + ": " + dados.message;

      // Apaga o resultado da busca anterior, senão ele fica na tela
      // parecendo ser do DDD que deu erro. O array também é zerado, para
      // o filtro não achar cidades do DDD anterior.
      cidades = [];
      estadoDdd.textContent = "";
      totalCidades.textContent = "";
      listaCidades.innerHTML = "";
    } else {
      // 4. Deu certo: dados é um objeto assim:
      // { state: "SC", cities: ["ORLEANS", "TUBARÃO", ...] }
      avisoDdd.textContent = "";
      estadoDdd.textContent = "Estado: " + dados.state;

      // Guarda na fonte da verdade e desenha todas as cidades. O filtro é
      // limpo porque o texto antigo era para as cidades do DDD anterior.
      cidades = dados.cities;
      filtroCidade.value = "";
      mostrarCidades(cidades);

      // Desafio: com a sigla em mãos, busca o nome do estado e a capital.
      // O await faz o botão só voltar a funcionar depois dessa chamada também.
      await mostrarNomeEstado(dados.state);
    }
  } catch (erro) {
    // Nem chegou resposta: sem internet, servidor fora do ar...
    avisoDdd.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }

  // Fora do try/catch: roda dando certo ou errado
  botaoDdd.disabled = false;
}

  // Botão pra fazer a chamada
botaoDdd.addEventListener("click", buscarDdd);

// Desafio: busca sozinho assim que o segundo dígito é digitado.
// O botão continua funcionando também (ex.: para buscar o mesmo DDD de novo).
function buscarAoDigitar() {
  if (campoDdd.value.length === 2) {
    buscarDdd();
  }
}

  //"input" faz a função assim que for digitado
campoDdd.addEventListener("input", buscarAoDigitar);

// --------------------------------------------------------------------- //
// Filtro: trabalha só com o array cidades, sem chamar a API de novo
// --------------------------------------------------------------------- //

function filtrarCidades() {
  // As cidades chegam em maiúsculas ("ORLEANS"). Passando o texto digitado
  // para maiúsculas também, "lean", "LEAN" e "Lean" encontram a mesma cidade.
  const texto = filtroCidade.value.toUpperCase();

  // Monta um array novo só com as cidades que contêm o texto.
  // O array cidades continua inteiro: ele é a fonte da verdade.
  const encontradas = [];

  for (const cidade of cidades) {
    if (cidade.includes(texto)) {
      encontradas.push(cidade);
    }
  }

  mostrarCidades(encontradas);
}

// Evento "input": roda a cada letra digitada ou apagada no campo
filtroCidade.addEventListener("input", filtrarCidades);

// ============================================================
// EXERCÍCIO 02 — Controle de estoque
//
//   Documentação: https://exemplosapi.evolutivasistemas.com.br/
//   https://exemplosapi.evolutivasistemas.com.br/api/{seu-codigo}/produtos
//   https://exemplosapi.evolutivasistemas.com.br/api/{seu-codigo}/exemplos
//   https://exemplosapi.evolutivasistemas.com.br/auth/login (desafio)
// ============================================================

// Troque "seu-codigo" pelo seu código de aluno: de 3 a 30 caracteres, com
// letras minúsculas, números, - ou _ (ex.: "maria-silva").
const URL_API_PRODUTOS =
  "https://exemplosapi.evolutivasistemas.com.br/api/victor-oliveira";

// Desafio (login): depois do login, as chamadas passam a usar /privado no
// lugar de /api/seu-codigo. Por isso o endereço usado nos fetch fica numa
// variável (let), que o login troca.
const URL_SERVIDOR = "https://exemplosapi.evolutivasistemas.com.br";
let urlProdutos = URL_API_PRODUTOS;

// Token recebido no login. Vazio = ainda não fez login.
let token = "";

const botaoExemplos = document.getElementById("inserirExemplos");
const avisoProdutos = document.getElementById("avisoProdutos");
const corpoProdutos = document.getElementById("corpoProdutos");
const botaoAnterior = document.getElementById("paginaAnterior");
const botaoProxima = document.getElementById("proximaPagina");
const textoPagina = document.getElementById("paginaProdutos");
const campoNome = document.getElementById("nomeProduto");
const campoPreco = document.getElementById("precoProduto");
const campoEstoque = document.getElementById("estoqueProduto");
const botaoCadastrar = document.getElementById("cadastrarProduto");
const campoUsuario = document.getElementById("usuarioLogin");
const campoSenha = document.getElementById("senhaLogin");
const botaoLogin = document.getElementById("fazerLogin");

// Fonte da verdade da tabela: os produtos da página que está na tela
let produtos = [];

// Paginação
const PRODUTOS_POR_PAGINA = 5;
let paginaAtual = 1;
let totalPaginas = 1; 

// --------------------------------------------------------------------- //
// Desafio (login): headers e resposta 401, usados em todas as chamadas
// --------------------------------------------------------------------- //

// Monta os headers de qualquer chamada. Depois do login, inclui também o
// token: "Authorization: Bearer abc123..." (a palavra Bearer, um espaço e
// o token). Antes do login vai sem ele, como na parte 1 da API.
function montarHeaders() {
  const headers = { "Content-Type": "application/json" };

  if (token !== "") {
    headers.Authorization = "Bearer " + token;
  }

  return headers;
}

// 401: sem token, token expirado ou trocado por um login mais novo.
// A mensagem da API já está no aviso; aqui só pede o login de novo.
function pedirLoginDeNovo() {
  token = "";
  avisoProdutos.textContent =
    avisoProdutos.textContent + " (preencha usuário e senha e clique em Entrar)";
  campoUsuario.focus();
}

// --------------------------------------------------------------------- //
// Função que desenha o array produtos na tabela
// --------------------------------------------------------------------- //

function mostrarProdutos() {
  let html = "";

  for (const produto of produtos) {
    html =
      html +
      "<tr>" +
      "<td>" + produto.nome + "</td>" +
      "<td>" + produto.categoria + "</td>" +
      "<td>R$ " + produto.preco.toFixed(2) + "</td>" +
      "<td>" + produto.estoque + "</td>" +
      // O id do produto vai escrito dentro do onclick: cada botão sabe
      // qual produto alterar. Ex.: alterarEstoque(131, -1)
      "<td>" +
      "<button onclick='alterarEstoque(" + produto.id + ", -1)'>-1</button> " +
      "<button onclick='alterarEstoque(" + produto.id + ", 1)'>+1</button> " +
      "<button onclick='excluirProduto(" + produto.id + ")'>Excluir</button>" +
      "</td>" +
      "</tr>";
  }

  corpoProdutos.innerHTML = html;
}

// --------------------------------------------------------------------- //
// GET /produtos: busca a página atual e redesenha a tabela
// --------------------------------------------------------------------- //

async function carregarProdutos() {
  // O "Carregando..." vai no lugar do texto da página, entre os botões que
  // ficam desabilitados. Assim o aviso de cima fica livre para outras
  // mensagens (ex.: "Dados de exemplo inseridos").
  textoPagina.textContent = "Carregando...";
  botaoAnterior.disabled = true;
  botaoProxima.disabled = true;

  // Tudo depois do ? são parâmetros da busca, separados por &:
  //   ordenar=nome  -> em ordem alfabética
  //   limite=5      -> 5 produtos por página
  //   pagina=...    -> qual página
  //   atraso=1000   -> a API espera 1 segundo para responder (só para ver o
  //                    "Carregando..." na tela)
  const endereco =
    urlProdutos +
    "/produtos?ordenar=nome" +
    "&limite=" + PRODUTOS_POR_PAGINA +
    "&pagina=" + paginaAtual +
    "&atraso=1000";

  try {
    const resposta = await fetch(endereco, {
      headers: montarHeaders(),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      avisoProdutos.textContent = "Erro " + resposta.status + ": " + dados.erro;

      if (resposta.status === 401) {
        pedirLoginDeNovo();
      }
      produtos = [];
      mostrarProdutos();
      textoPagina.textContent = "";
    } else {
      // dados é um array só com os produtos DESTA página (no máximo 5)
      produtos = dados;
      mostrarProdutos();

      // O total de produtos (de todas as páginas) não vem no corpo, vem no
      // header X-Total-Count. Header é sempre texto: "12" vira 12.
      const totalProdutos = Number(resposta.headers.get("X-Total-Count"));

      // Math.ceil arredonda para CIMA: 12 produtos / 5 = 2.4 -> 3 páginas
      // (a terceira página tem só os 2 que sobraram)
      totalPaginas = Math.ceil(totalProdutos / PRODUTOS_POR_PAGINA);

      // Sem nenhum produto ainda existe uma página (vazia)
      if (totalPaginas === 0) {
        totalPaginas = 1;
      }

      textoPagina.textContent =
        "Página " + paginaAtual + " de " + totalPaginas +
        " (" + totalProdutos + " produtos)";
    }
  } catch (erro) {
    avisoProdutos.textContent = "Não foi possível falar com a API.";
    produtos = [];
    mostrarProdutos();
    textoPagina.textContent = "";
    console.log(erro);
  }

  // Na primeira página não existe anterior, na última não existe próxima.
  // A comparação já dá true ou false, que é o que o disabled espera.
  botaoAnterior.disabled = paginaAtual <= 1;
  botaoProxima.disabled = paginaAtual >= totalPaginas;
}

// --------------------------------------------------------------------- //
// Botões de página: só mudam a página atual e carregam de novo
// --------------------------------------------------------------------- //

function irParaPaginaAnterior() {
  paginaAtual = paginaAtual - 1;
  carregarProdutos();
}

function irParaProximaPagina() {
  paginaAtual = paginaAtual + 1;
  carregarProdutos();
}

botaoAnterior.addEventListener("click", irParaPaginaAnterior);
botaoProxima.addEventListener("click", irParaProximaPagina);

// --------------------------------------------------------------------- //
// Botões -1 e +1: PATCH /produtos/{id}
// --------------------------------------------------------------------- //

// quantidade é -1 ou 1, conforme o botão clicado
async function alterarEstoque(id, quantidade) {
  // Procura no array a POSIÇÃO do produto com esse id. Precisamos da posição
  // (e não só do produto) para depois trocar o objeto no array.
  let posicao = -1;

  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === id) {
      posicao = i;
    }
  }

  const novoValor = produtos[posicao].estoque + quantidade;

  // Estoque negativo não existe: avisa e nem chama a API
  if (novoValor < 0) {
    avisoProdutos.textContent =
      produtos[posicao].nome + " já está sem estoque.";
    return;
  }

  try {
    // PATCH altera SÓ os campos enviados: o resto do produto fica igual
    const resposta = await fetch(urlProdutos + "/produtos/" + id, {
      method: "PATCH",
      headers: montarHeaders(),
      body: JSON.stringify({ estoque: novoValor }),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      avisoProdutos.textContent = "Erro " + resposta.status + ": " + dados.erro;

      if (resposta.status === 401) {
        pedirLoginDeNovo();
      }
    } else {
      // A resposta já é o produto inteiro, atualizado. Troca o objeto antigo
      // pelo novo e redesenha: não precisa de outro GET
      produtos[posicao] = dados;
      mostrarProdutos();
      avisoProdutos.textContent = "";
    }
  } catch (erro) {
    avisoProdutos.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }
}

// --------------------------------------------------------------------- //
// Botão Cadastrar: POST /produtos
// --------------------------------------------------------------------- //

async function cadastrarProduto() {
  // Os campos devolvem TEXTO, até o type="number". O Number() converte.
  // Teste tirando o Number() do preço: a API recusa e explica o motivo em
  // detalhes.preco ("Deve ser um número (recebido: o texto ...)").
  const novo = {
    nome: campoNome.value,
    preco: Number(campoPreco.value),
    estoque: Number(campoEstoque.value),
  };

  botaoCadastrar.disabled = true;

  try {
    const resposta = await fetch(urlProdutos + "/produtos", {
      method: "POST",
      headers: montarHeaders(),
      body: JSON.stringify(novo),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      // A API manda o erro geral e, em "detalhes", um objeto com o problema
      // de cada campo. Ex.:
      // { erro: "Dados inválidos", detalhes: { nome: "Não pode ser vazio" } }
      let html = "Erro " + resposta.status + ": " + dados.erro;

      // O for...in percorre as CHAVES do objeto: "nome", "preco"...
      // e detalhes[campo] é a mensagem daquele campo
      for (const campo in dados.detalhes) {
        html = html + "<br>" + campo + ": " + dados.detalhes[campo];
      }

      // innerHTML para o <br> virar quebra de linha
      avisoProdutos.innerHTML = html;

      if (resposta.status === 401) {
        pedirLoginDeNovo();
      }
    } else {
      // Deu certo (status 201): dados é o produto criado, já com o id
      avisoProdutos.textContent = dados.nome + " cadastrado.";

      campoNome.value = "";
      campoPreco.value = "";
      campoEstoque.value = "";

      // Aqui o GET é necessário: em ordem de nome, o produto novo pode cair
      // em qualquer página, e o total de produtos mudou
      await carregarProdutos();
    }
  } catch (erro) {
    avisoProdutos.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }

  botaoCadastrar.disabled = false;
}

botaoCadastrar.addEventListener("click", cadastrarProduto);

// --------------------------------------------------------------------- //
// Botão Excluir: DELETE /produtos/{id}
// --------------------------------------------------------------------- //

async function excluirProduto(id) {
  try {
    const resposta = await fetch(urlProdutos + "/produtos/" + id, {
      method: "DELETE",
      headers: montarHeaders(),
    });

    // O DELETE que dá certo responde 204 SEM CORPO: não tem JSON para ler,
    // e o .json() daria erro. Por isso confere o status antes.
    if (resposta.status === 204) {
      avisoProdutos.textContent = "Produto excluído.";

      // Se era o último produto da página (e não é a primeira), essa página
      // deixou de existir: volta uma
      if (produtos.length === 1 && paginaAtual > 1) {
        paginaAtual = paginaAtual - 1;
      }

      // Recarrega: os produtos da página seguinte "sobem" e o total mudou
      await carregarProdutos();
    } else {
      // Erro (ex.: 404, produto já apagado): aí a API manda corpo com "erro"
      const dados = await resposta.json();
      avisoProdutos.textContent = "Erro " + resposta.status + ": " + dados.erro;

      if (resposta.status === 401) {
        pedirLoginDeNovo();
      }
    }
  } catch (erro) {
    avisoProdutos.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }
}

// --------------------------------------------------------------------- //
// Botão Inserir exemplos: POST /exemplos
// --------------------------------------------------------------------- //

async function inserirExemplos() {
  avisoProdutos.textContent = "Inserindo exemplos...";
  botaoExemplos.disabled = true;

  try {
    // Sem o segundo parâmetro o fetch faz GET. Para outro método, passamos
    // um objeto dizendo qual: aqui é POST, que CRIA coisas no servidor.
    // Esta rota não precisa de corpo: a API já sabe quais produtos inserir.
    const resposta = await fetch(urlProdutos + "/exemplos", {
      method: "POST",
      headers: montarHeaders(),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      // Esta API explica o problema no campo "erro" (não é "message" como
      // na BrasilAPI). Teste com um código inválido, ex.: "X".
      avisoProdutos.textContent = "Erro " + resposta.status + ": " + dados.erro;

      if (resposta.status === 401) {
        pedirLoginDeNovo();
      }
    } else {
      // Deu certo (status 201). A resposta é um resumo assim:
      // { mensagem: "Dados de exemplo inseridos", inseridos: { produtos: 8 } }
      avisoProdutos.textContent =
        dados.mensagem + " (" + dados.inseridos.produtos + " produtos)";

      // Os produtos novos estão no servidor, mas a tabela ainda não sabe:
      // carrega de novo para eles aparecerem
      await carregarProdutos();
    }
  } catch (erro) {
    avisoProdutos.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }

  botaoExemplos.disabled = false;
}

botaoExemplos.addEventListener("click", inserirExemplos);

// --------------------------------------------------------------------- //
// Desafio: botão Entrar, POST /auth/login
// --------------------------------------------------------------------- //

async function fazerLogin() {
  botaoLogin.disabled = true;

  try {
    // O login fica fora do /api e do /privado: é no endereço do servidor
    const resposta = await fetch(URL_SERVIDOR + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: campoUsuario.value,
        senha: campoSenha.value,
      }),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      // 401 aqui é usuário ou senha errados (o usuário é sempre minúsculo)
      avisoProdutos.textContent = "Erro " + resposta.status + ": " + dados.erro;
    } else {
      // Deu certo: dados é um objeto assim:
      // { token: "abc123...", tipo: "Bearer", expiraEm: ..., usuario: ... }
      // Guarda o token: o montarHeaders() passa a mandar ele em toda chamada
      token = dados.token;

      // A partir de agora, os produtos são os da parte 2 (/privado)
      urlProdutos = URL_SERVIDOR + "/privado";

      avisoProdutos.textContent = "Login feito como " + campoUsuario.value + ".";
      campoSenha.value = "";

      // Outra lista de produtos: começa da primeira página
      paginaAtual = 1;
      await carregarProdutos();
    }
  } catch (erro) {
    avisoProdutos.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }

  botaoLogin.disabled = false;
}

botaoLogin.addEventListener("click", fazerLogin);

// A tabela já aparece quando a página abre
carregarProdutos();
