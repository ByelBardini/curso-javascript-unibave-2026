// Meus Produtos: uma página inteira falando com a API de Produtos.
//
// Junta tudo o que foi visto até aqui:
//
//   - o array produtos é a fonte da verdade (aula 03): a lista na tela é
//     sempre desenhada a partir dele, pela função mostrarProdutos()
//   - o array vem da API com fetch() + async/await (aula 04)
//   - cada ação fala com a API sem recarregar a página (AJAX, parte 01):
//
//       GET    /produtos       -> listar (com busca, filtro e ordenação)
//       POST   /produtos       -> cadastrar
//       PUT    /produtos/{id}  -> editar
//       DELETE /produtos/{id}  -> excluir
//       POST   /exemplos       -> inserir produtos de exemplo
//
// Documentação da API: https://exemplosapi.evolutivasistemas.com.br/

// Troque "victor-oliveira" pelo seu código de aluno: de 3 a 30 caracteres,
// com letras minúsculas, números, - ou _ (ex.: "maria-silva").
const URL_API =
  "https://exemplosapi.evolutivasistemas.com.br/api/victor-oliveira";

// --------------------------------------------------------------------- //
// Elementos da página (os ids estão no guia do index.html)
// --------------------------------------------------------------------- //

const botaoExemplos = document.getElementById("botao-exemplos");
const mensagem = document.getElementById("mensagem");

const formProdutos = document.getElementById("form-produtos");
const tituloFormulario = document.getElementById("titulo-formulario");
const campoNome = document.getElementById("campo-nome");
const campoDescricao = document.getElementById("campo-descricao");
const campoPreco = document.getElementById("campo-preco");
const campoEstoque = document.getElementById("campo-estoque");
const campoCategoria = document.getElementById("campo-categoria");
const campoAtivo = document.getElementById("campo-ativo");
const botaoCancelar = document.getElementById("botao-cancelar");

const formFiltros = document.getElementById("form-filtros");
const campoBusca = document.getElementById("campo-busca");
const filtroAtivo = document.getElementById("filtro-ativo");
const filtroOrdenar = document.getElementById("filtro-ordenar");
const botaoRecarregar = document.getElementById("botao-recarregar");

const listaProdutos = document.getElementById("lista-produtos");
const totalProdutos = document.getElementById("total-produtos");

// --------------------------------------------------------------------- //
// Dados da página
// --------------------------------------------------------------------- //

// Fonte da verdade: os produtos que estão na tela (já filtrados pela API)
let produtos = [];

// id do produto que está no formulário sendo editado.
// null = o formulário está cadastrando um produto novo.
let idEditando = null;

// --------------------------------------------------------------------- //
// Mensagens para o usuário
// --------------------------------------------------------------------- //

// tipo é "sucesso" ou "erro": a classe muda a cor da mensagem (style.css)
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + tipo;
}

// Sem texto a mensagem some sozinha (.mensagem:empty no style.css)
function limparMensagem() {
  mensagem.textContent = "";
  mensagem.className = "mensagem";
}

// Toda resposta de erro desta API tem o campo "erro" (não é "message" como
// na BrasilAPI) e, às vezes, "detalhes" com o problema de cada campo. Ex.:
// { erro: "Dados inválidos", detalhes: { preco: "Campo obrigatório" } }
function mostrarErroDaApi(resposta, dados) {
  let html = "Erro " + resposta.status + ": " + dados.erro;

  // O for...in percorre as CHAVES do objeto: "nome", "preco"...
  // e detalhes[campo] é a mensagem daquele campo
  for (const campo in dados.detalhes) {
    html = html + "<br>" + campo + ": " + dados.detalhes[campo];
  }

  // innerHTML para o <br> virar quebra de linha
  mensagem.innerHTML = html;
  mensagem.className = "mensagem erro";
}

// Nem chegou resposta: sem internet, endereço errado, servidor fora do ar...
function mostrarErroDeConexao(erro) {
  mostrarMensagem("Não foi possível falar com a API.", "erro");
  console.log(erro);
}

// --------------------------------------------------------------------- //
// Funções que só trabalham com dados: não mexem na tela
// --------------------------------------------------------------------- //

// Percorre o array e devolve o OBJETO com aquele id, ou null se não achar
function procurarProduto(id) {
  for (const produto of produtos) {
    if (produto.id === id) {
      return produto;
    }
  }

  return null;
}

// Monta o endereço do GET com o que está escolhido nos filtros.
// Tudo depois do ? são parâmetros da busca, separados por &:
//   ordenar=preco&ordem=desc -> o value de cada opção do select já vem assim
//   q=teclado                -> busca no nome, na descrição e na categoria
//   ativo=true               -> só os ativos (false: só os inativos)
function montarEnderecoLista() {
  let endereco = URL_API + "/produtos?" + filtroOrdenar.value;

  // Campo vazio é "sem filtro": nem coloca o parâmetro na URL
  if (campoBusca.value !== "") {
    endereco = endereco + "&q=" + campoBusca.value;
  }

  if (filtroAtivo.value !== "") {
    endereco = endereco + "&ativo=" + filtroAtivo.value;
  }

  return endereco;
}

// --------------------------------------------------------------------- //
// Função que desenha o array produtos na tela
// --------------------------------------------------------------------- //

function mostrarProdutos() {
  totalProdutos.textContent = produtos.length;

  if (produtos.length === 0) {
    listaProdutos.innerHTML = "<li class='vazio'>Nenhum produto encontrado.</li>";
    return;
  }

  let html = "";

  for (const produto of produtos) {
    // Classes extras mudam o visual do cartão (style.css)
    let classes = "item cartao";

    if (!produto.ativo) {
      classes = classes + " inativo";
    }

    if (produto.estoque === 0) {
      classes = classes + " sem-estoque";
    }

    // Categoria e descrição vazias somem sozinhas (:empty no style.css).
    // O id do produto vai escrito dentro do onclick: cada botão sabe qual
    // produto editar ou excluir. Ex.: excluirProduto(131)
    html =
      html +
      "<li class='" + classes + "'>" +
      "<div class='item-info'>" +
      "<span class='tag'>" + produto.categoria + "</span>" +
      "<h3 class='item-titulo'>" + produto.nome + "</h3>" +
      "<p class='item-descricao'>" + produto.descricao + "</p>" +
      "<p class='item-preco'>R$ " + produto.preco.toFixed(2) + "</p>" +
      "<p class='item-estoque'>Estoque: " + produto.estoque + "</p>" +
      "</div>" +
      "<div class='item-acoes'>" +
      "<button class='btn btn-pequeno btn-secundario' onclick='editarProduto(" + produto.id + ")'>Editar</button>" +
      "<button class='btn btn-pequeno btn-perigo' onclick='excluirProduto(" + produto.id + ")'>Excluir</button>" +
      "</div>" +
      "</li>";
  }

  listaProdutos.innerHTML = html;
}

// --------------------------------------------------------------------- //
// GET /produtos: busca a lista com os filtros e redesenha
// --------------------------------------------------------------------- //

async function carregarProdutos() {
  // 1. Antes de chamar a API: avisa na lista e impede um segundo clique
  listaProdutos.innerHTML = "<li class='vazio'>Carregando...</li>";
  botaoRecarregar.disabled = true;

  try {
    const resposta = await fetch(montarEnderecoLista());
    const dados = await resposta.json();

    if (!resposta.ok) {
      // 2. A API respondeu, mas com erro. Teste com um código de aluno
      // inválido na URL_API, ex.: "X"
      mostrarErroDaApi(resposta, dados);
      produtos = [];
    } else {
      // 3. Deu certo: dados é o array de produtos, já filtrado e ordenado
      produtos = dados;
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
    produtos = [];
  }

  // 4. Fora do try/catch: desenha o array (cheio ou vazio) e libera o botão
  mostrarProdutos();
  botaoRecarregar.disabled = false;
}

// --------------------------------------------------------------------- //
// Formulário: ler, preencher e limpar
// --------------------------------------------------------------------- //

// Lê os campos e devolve um OBJETO já no formato que a API espera
function lerFormulario() {
  // O value é sempre TEXTO, até no type="number": o Number() converte.
  // O checkbox usa .checked, que já é true ou false.
  const produto = {
    nome: campoNome.value,
    descricao: campoDescricao.value,
    preco: Number(campoPreco.value),
    estoque: Number(campoEstoque.value),
    categoria: campoCategoria.value,
    ativo: campoAtivo.checked,
  };

  return produto;
}

// Volta o formulário para "Novo produto", com os valores iniciais do HTML
function limparFormulario() {
  idEditando = null;
  tituloFormulario.textContent = "Novo produto";

  campoNome.value = "";
  campoDescricao.value = "";
  campoPreco.value = "";
  campoEstoque.value = 0;
  campoCategoria.value = "";
  campoAtivo.checked = true;
}

botaoCancelar.addEventListener("click", limparFormulario);

// --------------------------------------------------------------------- //
// Botão Editar: só preenche o formulário
// --------------------------------------------------------------------- //

// Não precisa chamar a API aqui: o produto já está no array. Ela só é
// chamada quando o usuário clicar em Salvar.
function editarProduto(id) {
  const produto = procurarProduto(id);

  // A partir daqui o Salvar sabe que é uma edição, e de qual produto
  idEditando = id;
  tituloFormulario.textContent = "Editando: " + produto.nome;

  campoNome.value = produto.nome;
  campoDescricao.value = produto.descricao;
  campoPreco.value = produto.preco;
  campoEstoque.value = produto.estoque;
  campoCategoria.value = produto.categoria;
  campoAtivo.checked = produto.ativo;

  // Leva o cursor (e a tela, no celular) até o formulário
  campoNome.focus();
}

// --------------------------------------------------------------------- //
// Botão Salvar: POST /produtos (novo) ou PUT /produtos/{id} (edição)
// --------------------------------------------------------------------- //

async function salvarProduto(evento) {
  // Sem o preventDefault() o navegador recarrega a página e perde tudo
  evento.preventDefault();

  const produto = lerFormulario();

  // Sem idEditando: cadastra um produto novo com POST.
  // Com idEditando: substitui o produto inteiro com PUT. O formulário tem
  // TODOS os campos, então nada se perde (o PATCH seria para mandar só
  // alguns campos, como o +1/-1 de estoque nos exercícios).
  let metodo = "POST";
  let endereco = URL_API + "/produtos";

  if (idEditando !== null) {
    metodo = "PUT";
    endereco = URL_API + "/produtos/" + idEditando;
  }

  try {
    const resposta = await fetch(endereco, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      // Teste tirando o Number() do preço em lerFormulario(): a API recusa
      // e explica o motivo em detalhes.preco
      mostrarErroDaApi(resposta, dados);
    } else {
      // Deu certo (201 no POST, 200 no PUT): dados é o produto salvo
      if (metodo === "POST") {
        mostrarMensagem(dados.nome + " cadastrado.", "sucesso");
      } else {
        mostrarMensagem(dados.nome + " atualizado.", "sucesso");
      }

      limparFormulario();

      // Carrega de novo em vez de mexer no array: com a ordenação e os
      // filtros, o produto pode ter mudado de lugar ou nem aparecer mais
      // (ex.: ficou inativo com o filtro "Ativos")
      await carregarProdutos();
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
  }
}

formProdutos.addEventListener("submit", salvarProduto);

// --------------------------------------------------------------------- //
// Botão Excluir: DELETE /produtos/{id}
// --------------------------------------------------------------------- //

async function excluirProduto(id) {
  // Guarda o produto antes de apagar, para usar o nome na mensagem
  const produto = procurarProduto(id);

  try {
    const resposta = await fetch(URL_API + "/produtos/" + id, {
      method: "DELETE",
    });

    // O DELETE que dá certo responde 204 SEM CORPO: não tem JSON para ler,
    // e o .json() daria erro. Por isso confere o status antes.
    if (resposta.status === 204) {
      mostrarMensagem(produto.nome + " excluído.", "sucesso");

      // Se ele estava aberto no formulário, o formulário volta para "Novo
      // produto": não dá para salvar um produto que não existe mais
      if (idEditando === id) {
        limparFormulario();
      }

      await carregarProdutos();
    } else {
      // Erro (ex.: 404, produto já apagado): aí a API manda corpo com "erro"
      const dados = await resposta.json();
      mostrarErroDaApi(resposta, dados);
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
  }
}

// --------------------------------------------------------------------- //
// Botão Inserir exemplos: POST /exemplos
// --------------------------------------------------------------------- //

async function inserirExemplos() {
  botaoExemplos.disabled = true;
  botaoExemplos.textContent = "Inserindo...";

  try {
    // Esta rota não precisa de corpo: a API já sabe quais produtos inserir
    const resposta = await fetch(URL_API + "/exemplos", { method: "POST" });
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarErroDaApi(resposta, dados);
    } else {
      // Deu certo (status 201). A resposta é um resumo assim:
      // { mensagem: "Dados de exemplo inseridos", inseridos: { produtos: 8 } }
      mostrarMensagem(
        dados.mensagem + " (" + dados.inseridos.produtos + " produtos).",
        "sucesso"
      );

      // Os produtos novos estão no servidor, mas a lista ainda não sabe:
      // carrega de novo para eles aparecerem
      await carregarProdutos();
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
  }

  botaoExemplos.disabled = false;
  botaoExemplos.textContent = "Inserir exemplos";
}

botaoExemplos.addEventListener("click", inserirExemplos);

// --------------------------------------------------------------------- //
// Recarregar e filtros: buscam a lista de novo na API
// --------------------------------------------------------------------- //

// A mensagem antiga (de um cadastro, de um erro...) é apagada: ela não tem
// mais a ver com a lista nova
function recarregarLista() {
  limparMensagem();
  carregarProdutos();
}

botaoRecarregar.addEventListener("click", recarregarLista);

// "input": roda a cada letra digitada ou apagada na busca
campoBusca.addEventListener("input", recarregarLista);

// "change": roda quando outra opção é escolhida no select
filtroAtivo.addEventListener("change", recarregarLista);
filtroOrdenar.addEventListener("change", recarregarLista);

// Apertar Enter na busca envia o formulário de filtros. A busca já foi
// feita pelo "input", então aqui só impede a página de recarregar.
formFiltros.addEventListener("submit", function (evento) {
  evento.preventDefault();
});

// A lista já aparece quando a página abre
carregarProdutos();
