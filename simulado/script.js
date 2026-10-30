const URL_API = "https://exemplosapi.evolutivasistemas.com.br/api/joao-pazeto";

const mensagem = document.getElementById("mensagem");
const estadoVazio = document.getElementById("estado-vazio");
const resultadoFiltro = document.getElementById("resultado-filtro");

const campoNome = document.getElementById("campo-nome");
const nota1 = document.getElementById("nota-1");
const nota2 = document.getElementById("nota-2");
const nota3 = document.getElementById("nota-3");
const nota4 = document.getElementById("nota-4");
const previaMedia = document.getElementById("previa-media");
const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");

const campoBusca = document.getElementById("campo-busca");
const filtroSituacao = document.getElementById("filtro-situacao");
const filtroOrdem = document.getElementById("filtro-ordem");
const botaoRecarregar = document.getElementById("botao-recarregar");

const listaAlunos = document.getElementById("lista-alunos");

const totalAlunos = document.getElementById("total-alunos");
const mediaTurma = document.getElementById("media-turma");
const totalAprovados = document.getElementById("total-aprovados");
const totalReprovados = document.getElementById("total-reprovados");
const maiorMedia = document.getElementById("maior-media");
const menorMedia = document.getElementById("menor-media");
const percentualAprovacao = document.getElementById("percentual-aprovacao");

let alunos = [];

let idEditando = null;

const CHAVE_FILTROS = "simulado-aula07-filtros";

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + tipo;
}

function formatarDetalhes(detalhes) {
  if (!detalhes) {
    return "";
  }

  if (Array.isArray(detalhes)) {
    return " " + detalhes.join(" ");
  }

  let texto = "";

  for (const campo in detalhes) {
    texto = texto + " " + campo + ": " + detalhes[campo];
  }

  return texto;
}

function mostrarErroDaApi(resposta, dados) {
  const motivo = dados && dados.erro ? dados.erro : "não foi possível completar a operação.";
  mostrarMensagem("Erro " + resposta.status + ": " + motivo + formatarDetalhes(dados && dados.detalhes), "erro");
}

function mostrarErroDeConexao(erro) {
  mostrarMensagem("Não foi possível falar com o servidor. Verifique sua conexão.", "erro");
  console.log(erro);
}

function procurarAluno(id) {
  for (const aluno of alunos) {
    if (aluno.id === id) {
      return aluno;
    }
  }

  return null;
}

function formatarNumero(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function lerNotasDigitadas() {
  return [nota1.value, nota2.value, nota3.value, nota4.value];
}

function validarFormulario(nome, notas) {
  const nomeLimpo = nome.trim();

  if (nomeLimpo === "") {
    return "Informe o nome do aluno.";
  }

  if (nomeLimpo.length > 100) {
    return "O nome pode ter no máximo 100 caracteres.";
  }

  for (let i = 0; i < notas.length; i++) {
    const texto = notas[i].trim();

    if (texto === "") {
      return "Informe a " + (i + 1) + "ª nota.";
    }

    const numero = Number(texto);

    if (Number.isNaN(numero) || numero < 0 || numero > 10) {
      return "A " + (i + 1) + "ª nota deve ser um número entre 0 e 10.";
    }
  }

  return null;
}

function obterAlunosFiltrados() {
  const termo = campoBusca.value.trim().toLowerCase();
  const situacao = filtroSituacao.value;
  const ordem = filtroOrdem.value;

  const lista = alunos.filter(function (aluno) {
    const nomeCorresponde = aluno.nome.toLowerCase().includes(termo);
    const situacaoCorresponde = situacao === "todos" || aluno.situacao === situacao;
    return nomeCorresponde && situacaoCorresponde;
  });

  lista.sort(function (a, b) {
    if (ordem === "maior") {
      return b.media - a.media;
    }

    if (ordem === "menor") {
      return a.media - b.media;
    }

    return a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });
  });

  return lista;
}

function criarLinhaAluno(aluno) {
  const linha = document.createElement("tr");

  const celulaNome = document.createElement("td");
  celulaNome.textContent = aluno.nome;
  linha.appendChild(celulaNome);

  const notas = [aluno.nota1, aluno.nota2, aluno.nota3, aluno.nota4];

  for (const nota of notas) {
    const celula = document.createElement("td");
    celula.textContent = formatarNumero(nota);
    linha.appendChild(celula);
  }

  const celulaMedia = document.createElement("td");
  celulaMedia.className = "media";
  celulaMedia.textContent = formatarNumero(aluno.media);
  linha.appendChild(celulaMedia);

  const celulaSituacao = document.createElement("td");
  const selo = document.createElement("span");
  selo.className = "situacao " + aluno.situacao;
  selo.textContent = aluno.situacao === "aprovado" ? "Aprovado" : "Reprovado";
  celulaSituacao.appendChild(selo);
  linha.appendChild(celulaSituacao);

  const celulaAcoes = document.createElement("td");
  celulaAcoes.className = "acoes";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.className = "acao";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", function () {
    editarAluno(aluno.id);
  });

  const botaoExcluirLinha = document.createElement("button");
  botaoExcluirLinha.type = "button";
  botaoExcluirLinha.className = "acao excluir";
  botaoExcluirLinha.textContent = "Excluir";
  botaoExcluirLinha.addEventListener("click", function () {
    excluirAluno(aluno.id, botaoExcluirLinha);
  });

  celulaAcoes.appendChild(botaoEditar);
  celulaAcoes.appendChild(botaoExcluirLinha);
  linha.appendChild(celulaAcoes);

  return linha;
}

function mostrarAlunos(lista) {
  listaAlunos.innerHTML = "";

  for (const aluno of lista) {
    listaAlunos.appendChild(criarLinhaAluno(aluno));
  }

  estadoVazio.hidden = lista.length > 0;
  resultadoFiltro.textContent = "Exibindo " + lista.length + " de " + alunos.length + " alunos";
}

function atualizarIndicadores() {
  const totalDeAlunos = alunos.length;
  totalAlunos.textContent = totalDeAlunos;

  if (totalDeAlunos === 0) {
    mediaTurma.textContent = "—";
    totalAprovados.textContent = "0";
    totalReprovados.textContent = "0";
    maiorMedia.textContent = "—";
    menorMedia.textContent = "—";
    percentualAprovacao.textContent = "—";
    return;
  }

  let somaMedias = 0;
  let quantidadeAprovados = 0;
  let maiorValor = alunos[0].media;
  let menorValor = alunos[0].media;

  for (const aluno of alunos) {
    somaMedias = somaMedias + aluno.media;

    if (aluno.media >= 7) {
      quantidadeAprovados = quantidadeAprovados + 1;
    }

    if (aluno.media > maiorValor) {
      maiorValor = aluno.media;
    }

    if (aluno.media < menorValor) {
      menorValor = aluno.media;
    }
  }

  const quantidadeReprovados = totalDeAlunos - quantidadeAprovados;
  const percentual = (quantidadeAprovados / totalDeAlunos) * 100;

  mediaTurma.textContent = formatarNumero(somaMedias / totalDeAlunos);
  totalAprovados.textContent = quantidadeAprovados;
  totalReprovados.textContent = quantidadeReprovados;
  maiorMedia.textContent = formatarNumero(maiorValor);
  menorMedia.textContent = formatarNumero(menorValor);
  percentualAprovacao.textContent = formatarNumero(percentual) + "%";
}

function atualizarTela() {
  mostrarAlunos(obterAlunosFiltrados());
  atualizarIndicadores();
}

function calcularMediaDigitada() {
  const valores = lerNotasDigitadas();

  for (const valor of valores) {
    const texto = valor.trim();

    if (texto === "") {
      return null;
    }

    const numero = Number(texto);

    if (Number.isNaN(numero) || numero < 0 || numero > 10) {
      return null;
    }
  }

  const numeros = valores.map(Number);
  const soma = numeros[0] + numeros[1] + numeros[2] + numeros[3];
  return soma / 4;
}

function atualizarPreviaMedia() {
  const media = calcularMediaDigitada();
  previaMedia.textContent = media === null ? "—" : formatarNumero(media);
}

function limparFormulario() {
  idEditando = null;
  tituloFormulario.textContent = "Novo aluno";
  botaoSalvar.textContent = "Cadastrar aluno";

  campoNome.value = "";
  nota1.value = "";
  nota2.value = "";
  nota3.value = "";
  nota4.value = "";

  previaMedia.textContent = "—";
}

function editarAluno(id) {
  const aluno = procurarAluno(id);

  if (!aluno) {
    return;
  }

  idEditando = aluno.id;
  tituloFormulario.textContent = "Editando: " + aluno.nome;
  botaoSalvar.textContent = "Salvar edição";

  campoNome.value = aluno.nome;
  nota1.value = aluno.nota1;
  nota2.value = aluno.nota2;
  nota3.value = aluno.nota3;
  nota4.value = aluno.nota4;

  atualizarPreviaMedia();
}

async function salvarAluno() {
  const notas = lerNotasDigitadas();
  const erro = validarFormulario(campoNome.value, notas);

  if (erro) {
    mostrarMensagem(erro, "erro");
    return;
  }

  const corpo = {
    nome: campoNome.value.trim(),
    nota1: Number(notas[0]),
    nota2: Number(notas[1]),
    nota3: Number(notas[2]),
    nota4: Number(notas[3]),
  };

  let metodo = "POST";
  let endereco = URL_API + "/alunos";

  if (idEditando !== null) {
    metodo = "PUT";
    endereco = URL_API + "/alunos/" + idEditando;
  }

  botaoSalvar.disabled = true;

  try {
    const resposta = await fetch(endereco, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarErroDaApi(resposta, dados);
    } else {
      mostrarMensagem(metodo === "POST" ? dados.nome + " cadastrado." : dados.nome + " atualizado.", "sucesso");
      limparFormulario();

      await carregarAlunos(false);
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
  }

  botaoSalvar.disabled = false;
}

async function excluirAluno(id, botao) {
  const confirmou = window.confirm("Deseja realmente excluir este aluno?");

  if (!confirmou) {
    return;
  }

  botao.disabled = true;

  try {
    const resposta = await fetch(URL_API + "/alunos/" + id, { method: "DELETE" });

    if (resposta.status === 204) {
      mostrarMensagem("Aluno excluído.", "sucesso");

      if (idEditando === id) {
        limparFormulario();
      }

      await carregarAlunos(false);
    } else {
      const dados = await resposta.json();
      mostrarErroDaApi(resposta, dados);
      botao.disabled = false;
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
    botao.disabled = false;
  }
}

async function carregarAlunos(mostrarAvisos) {
  botaoRecarregar.disabled = true;

  if (mostrarAvisos) {
    mostrarMensagem("Carregando turma...", "");
  }

  try {
    const resposta = await fetch(URL_API + "/alunos");
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarErroDaApi(resposta, dados);
      alunos = [];
    } else {
      alunos = dados;

      if (mostrarAvisos) {
        mostrarMensagem("Turma carregada.", "sucesso");
      }
    }
  } catch (erro) {
    mostrarErroDeConexao(erro);
    alunos = [];
  }

  atualizarTela();
  botaoRecarregar.disabled = false;
}

function salvarFiltros() {
  const filtros = {
    busca: campoBusca.value,
    situacao: filtroSituacao.value,
    ordem: filtroOrdem.value,
  };

  localStorage.setItem(CHAVE_FILTROS, JSON.stringify(filtros));
}

function restaurarFiltros() {
  const salvo = localStorage.getItem(CHAVE_FILTROS);

  if (!salvo) {
    return;
  }

  const filtros = JSON.parse(salvo);
  campoBusca.value = filtros.busca || "";
  filtroSituacao.value = filtros.situacao || "todos";
  filtroOrdem.value = filtros.ordem || "nome";
}

function aplicarFiltros() {
  salvarFiltros();
  atualizarTela();
}

[nota1, nota2, nota3, nota4].forEach(function (campo) {
  campo.addEventListener("input", atualizarPreviaMedia);
});

botaoSalvar.addEventListener("click", salvarAluno);
botaoCancelar.addEventListener("click", limparFormulario);

botaoRecarregar.addEventListener("click", function () {
  carregarAlunos(true);
});

campoBusca.addEventListener("input", aplicarFiltros);
filtroSituacao.addEventListener("change", aplicarFiltros);
filtroOrdem.addEventListener("change", aplicarFiltros);

restaurarFiltros();
carregarAlunos(true);
