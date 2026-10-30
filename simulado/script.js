const CODIGO = "meu-painel-123";
const BASE = "https://exemplosapi.evolutivasistemas.com.br/api/marcela-tezza" + CODIGO;
 

const campoNome = document.getElementById("campo-nome");
const campoNotas = [
  document.getElementById("nota-1"),
  document.getElementById("nota-2"),
  document.getElementById("nota-3"),
  document.getElementById("nota-4"),
];
const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoRecarregar = document.getElementById("botao-recarregar");
const previaMedia = document.getElementById("previa-media");
 
const listaAlunos = document.getElementById("lista-alunos");
const campoBusca = document.getElementById("campo-busca");
const filtroSituacao = document.getElementById("filtro-situacao");
const filtroOrdem = document.getElementById("filtro-ordem");
 
const mensagem = document.getElementById("mensagem");
const estadoVazio = document.getElementById("estado-vazio");
const resultadoFiltro = document.getElementById("resultado-filtro");
 
const tituloInicial = tituloFormulario.textContent;
const textoBotaoInicial = botaoSalvar.textContent;
 

let alunos = [];
let editandoId = null;
 

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo || "";
}
 
function formatar(numero) {
  return numero.toFixed(2).replace(".", ",");
}
 
function calcularMedia(aluno) {
  const soma =
    Number(aluno.nota1) + Number(aluno.nota2) + Number(aluno.nota3) + Number(aluno.nota4);
  return soma / 4;
}
 
function lerNota(campo) {
  const texto = campo.value.trim().replace(",", ".");
  if (texto === "") return null;
  const numero = Number(texto);
  if (isNaN(numero) || numero < 0 || numero > 10) return null;
  return numero;
}

async function chamarApi(caminho, opcoes) {
  const resposta = await fetch(BASE + caminho, opcoes);
 
  if (resposta.status === 204) return null;
 
  let dados = null;
  try {
    dados = await resposta.json();
  } catch (e) {
    dados = null;
  }
 
  if (!resposta.ok) {
    let texto = (dados && dados.erro) || "Erro " + resposta.status;
    if (dados && dados.detalhes) {
      texto += ": " + JSON.stringify(dados.detalhes);
    }
    throw new Error(texto);
  }
  return dados;
}
 
function textoDoErro(erro) {
  if (erro instanceof TypeError) {
    return "Falha de rede. Verifique sua conexão e tente de novo.";
  }
  return erro.message;
}
 
async function carregarAlunos() {
  mostrarMensagem("Carregando...", "");
  botaoRecarregar.disabled = true;
  try {
    alunos = await chamarApi("/alunos");
    mostrarMensagem("", "");
    atualizarTela();
  } catch (erro) {
    mostrarMensagem(textoDoErro(erro), "erro");
  } finally {
    botaoRecarregar.disabled = false; 
  }
}
 

function atualizarPrevia() {
  const notas = campoNotas.map(lerNota);
  if (notas.includes(null)) {
    previaMedia.textContent = "—";
    return;
  }
  const media = (notas[0] + notas[1] + notas[2] + notas[3]) / 4;
  previaMedia.textContent = formatar(media);
}
 
campoNotas.forEach(function (campo) {
  campo.addEventListener("input", atualizarPrevia);
});

async function salvar() {
  const nome = campoNome.value.trim();
  if (nome === "") {
    mostrarMensagem("Informe o nome do aluno.", "erro");
    return;
  }
  if (nome.length > 100) {
    mostrarMensagem("O nome deve ter no máximo 100 caracteres.", "erro");
    return;
  }
 
  const notas = campoNotas.map(lerNota);
  if (notas.includes(null)) {
    mostrarMensagem(
      "Preencha as 4 notas com números entre 0 e 10.",
      "erro"
    );
    return;
  }
 
  const dados = {
    nome: nome,
    nota1: notas[0],
    nota2: notas[1],
    nota3: notas[2],
    nota4: notas[3],
  };
 
  const editando = editandoId !== null;
  const caminho = editando ? "/alunos/" + editandoId : "/alunos";
  const metodo = editando ? "PUT" : "POST";
 
  botaoSalvar.disabled = true;
  mostrarMensagem("Salvando...", "");
  try {
    await chamarApi(caminho, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    limparFormulario();
    await carregarAlunos();
    mostrarMensagem(
      editando ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!",
      "sucesso"
    );
  } catch (erro) {
    mostrarMensagem(textoDoErro(erro), "erro");
  } finally {
    botaoSalvar.disabled = false;
  }
}
 
function limparFormulario() {
  campoNome.value = "";
  campoNotas.forEach(function (campo) {
    campo.value = "";
  });
  previaMedia.textContent = "—";
  editandoId = null;
  tituloFormulario.textContent = tituloInicial;
  botaoSalvar.textContent = textoBotaoInicial;
}
 

function iniciarEdicao(aluno) {
  editandoId = aluno.id;
  campoNome.value = aluno.nome;
  campoNotas[0].value = aluno.nota1;
  campoNotas[1].value = aluno.nota2;
  campoNotas[2].value = aluno.nota3;
  campoNotas[3].value = aluno.nota4;
  tituloFormulario.textContent = "Editar aluno";
  botaoSalvar.textContent = "Salvar alterações";
  atualizarPrevia();
  campoNome.focus();
}
 
async function excluir(aluno, botao) {
  if (!confirm("Deseja excluir " + aluno.nome + "?")) return; 
 
  botao.disabled = true;
  mostrarMensagem("Excluindo...", "");
  try {
    await chamarApi("/alunos/" + aluno.id, { method: "DELETE" });
    if (editandoId === aluno.id) limparFormulario();
    await carregarAlunos();
    mostrarMensagem("Aluno excluído com sucesso!", "sucesso");
  } catch (erro) {
    mostrarMensagem(textoDoErro(erro), "erro");
    botao.disabled = false;
  }
}
 
function textoDoSelect(select) {
  const opcao = select.options[select.selectedIndex];
  return (select.value + " " + (opcao ? opcao.textContent : "")).toLowerCase();
}
 
function obterListaFiltrada() {
  let lista = alunos.slice();
 
  const busca = campoBusca.value.trim().toLowerCase();
  if (busca !== "") {
    lista = lista.filter(function (a) {
      return a.nome.toLowerCase().includes(busca);
    });
  }
 
  const sit = textoDoSelect(filtroSituacao);
  if (sit.includes("reprov")) {
    lista = lista.filter(function (a) { return a.situacao === "reprovado"; });
  } else if (sit.includes("aprov")) {
    lista = lista.filter(function (a) { return a.situacao === "aprovado"; });
  }
 
  const ordem = textoDoSelect(filtroOrdem);
  if (ordem.includes("maior")) {
    lista.sort(function (a, b) { return calcularMedia(b) - calcularMedia(a); });
  } else if (ordem.includes("menor")) {
    lista.sort(function (a, b) { return calcularMedia(a) - calcularMedia(b); });
  } else {
    lista.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  }
 
  return lista;
}
 
campoBusca.addEventListener("input", atualizarTela);
filtroSituacao.addEventListener("change", atualizarTela);
filtroOrdem.addEventListener("change", atualizarTela);
 
function atualizarIndicadores() {
  const total = alunos.length;
  let somaMedias = 0;
  let aprovados = 0;
  let reprovados = 0;
  let maior = null;
  let menor = null;
 
  for (let i = 0; i < alunos.length; i++) {
    const media = calcularMedia(alunos[i]);
    somaMedias += media;
    if (media >= 7) aprovados++;
    else reprovados++;
    if (maior === null || media > maior) maior = media;
    if (menor === null || media < menor) menor = media;
  }
 
  document.getElementById("total-alunos").textContent = total;
  document.getElementById("total-aprovados").textContent = aprovados;
  document.getElementById("total-reprovados").textContent = reprovados;
 
  if (total === 0) {
    document.getElementById("media-turma").textContent = "—";
    document.getElementById("maior-media").textContent = "—";
    document.getElementById("menor-media").textContent = "—";
    document.getElementById("percentual-aprovacao").textContent = "—";
  } else {
    document.getElementById("media-turma").textContent = formatar(somaMedias / total);
    document.getElementById("maior-media").textContent = formatar(maior);
    document.getElementById("menor-media").textContent = formatar(menor);
    const percentual = (aprovados / total) * 100;
    document.getElementById("percentual-aprovacao").textContent =
      formatar(percentual) + "%";
  }
}
 
function criarCelula(texto, classe) {
  const td = document.createElement("td");
  td.textContent = texto;
  if (classe) td.className = classe;
  return td;
}
 
function desenharTabela(lista) {
  listaAlunos.innerHTML = "";
 
  lista.forEach(function (aluno) {
    const tr = document.createElement("tr");
 
    tr.appendChild(criarCelula(aluno.nome));
    tr.appendChild(criarCelula(formatar(Number(aluno.nota1))));
    tr.appendChild(criarCelula(formatar(Number(aluno.nota2))));
    tr.appendChild(criarCelula(formatar(Number(aluno.nota3))));
    tr.appendChild(criarCelula(formatar(Number(aluno.nota4))));
    tr.appendChild(criarCelula(formatar(calcularMedia(aluno)), "media"));
 
    const tdSituacao = document.createElement("td");
    const span = document.createElement("span");
    span.className = "situacao " + aluno.situacao;
    span.textContent = aluno.situacao === "aprovado" ? "Aprovado" : "Reprovado";
    tdSituacao.appendChild(span);
    tr.appendChild(tdSituacao);
 
    const tdAcoes = document.createElement("td");
    tdAcoes.className = "acoes";
 
    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "acao";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
      iniciarEdicao(aluno);
    });
 
    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.className = "acao excluir";
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", function () {
      excluir(aluno, btnExcluir);
    });
 
    tdAcoes.appendChild(btnEditar);
    tdAcoes.appendChild(btnExcluir);
    tr.appendChild(tdAcoes);
 
    listaAlunos.appendChild(tr);
  });
}
 
function atualizarTela() {
  const lista = obterListaFiltrada();
  desenharTabela(lista);
  atualizarIndicadores();
 
  estadoVazio.hidden = lista.length > 0;
  resultadoFiltro.textContent =
    "Exibindo " + lista.length + " de " + alunos.length + " alunos";
}
 
botaoSalvar.addEventListener("click", salvar);
botaoCancelar.addEventListener("click", limparFormulario);
botaoRecarregar.addEventListener("click", carregarAlunos);
 
carregarAlunos();