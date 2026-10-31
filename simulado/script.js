const API_URL = "https://exemplosapi.evolutivasistemas.com.br/api/gabriel-camilo";

let alunos = [];
let idEmEdicao = null;

// Campos do formulário
const campoNome = document.getElementById("campo-nome");
const nota1 = document.getElementById("nota-1");
const nota2 = document.getElementById("nota-2");
const nota3 = document.getElementById("nota-3");
const nota4 = document.getElementById("nota-4");

// Elementos da lista
const listaAlunos = document.getElementById("lista-alunos");
const mensagem = document.getElementById("mensagem");
const estadoVazio = document.getElementById("estado-vazio");
const resultadoFiltro = document.getElementById("resultado-filtro");

// Botões e formulário
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoRecarregar = document.getElementById("botao-recarregar");
const tituloFormulario = document.getElementById("titulo-formulario");
const previaMedia = document.getElementById("previa-media");

// Filtros
const campoBusca = document.getElementById("campo-busca");
const filtroSituacao = document.getElementById("filtro-situacao");
const filtroOrdem = document.getElementById("filtro-ordem");

// Indicadores
const totalAlunos = document.getElementById("total-alunos");
const mediaTurma = document.getElementById("media-turma");
const totalAprovados = document.getElementById("total-aprovados");
const totalReprovados = document.getElementById("total-reprovados");
const maiorMedia = document.getElementById("maior-media");
const menorMedia = document.getElementById("menor-media");
const percentualAprovacao = document.getElementById("percentual-aprovacao");


// Mensagens
function exibirMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.classList.remove("erro", "sucesso");

    if (tipo !== "") {
        mensagem.classList.add(tipo);
    }
}


// Controle dos botões durante requisições
function definirCarregamento(ativo) {
    document.querySelectorAll("button").forEach(botao => {
        botao.disabled = ativo;
    });
}


// Validação dos dados
function validarDados() {

    const nome = campoNome.value.trim();

    if (nome === "") {
        exibirMensagem("Informe o nome do aluno.", "erro");
        return false;
    }

    if (nome.length > 100) {
        exibirMensagem("O nome deve ter no máximo 100 caracteres.", "erro");
        return false;
    }

    const notas = [nota1.value, nota2.value, nota3.value, nota4.value];

    if (notas.some(nota => nota.trim() === "")) {
        exibirMensagem("Preencha todas as notas.", "erro");
        return false;
    }

    const valores = notas.map(Number);

    if (valores.some(nota =>
        nota < 0 || nota > 10 || !Number.isFinite(nota)
    )) {
        exibirMensagem("As notas devem estar entre 0 e 10.", "erro");
        return false;
    }

    return true;
}


// Prévia da média
function calcularPrevia() {

    const notas = [nota1.value, nota2.value, nota3.value, nota4.value];

    if (notas.some(nota => nota.trim() === "")) {
        previaMedia.textContent = "—";
        return;
    }

    const valores = notas.map(Number);

    if (valores.some(nota =>
        !Number.isFinite(nota) || nota < 0 || nota > 10
    )) {
        previaMedia.textContent = "—";
        return;
    }

    const media = valores.reduce((total, nota) => total + nota, 0) / 4;

    previaMedia.textContent = media.toFixed(2);
}


// Preparar edição
function prepararEdicao(id) {

    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) return;

    idEmEdicao = id;

    campoNome.value = aluno.nome;
    nota1.value = aluno.nota1;
    nota2.value = aluno.nota2;
    nota3.value = aluno.nota3;
    nota4.value = aluno.nota4;

    tituloFormulario.textContent = "Editar aluno";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;

    calcularPrevia();
}


// Limpar formulário
function limparFormulario() {

    campoNome.value = "";
    nota1.value = "";
    nota2.value = "";
    nota3.value = "";
    nota4.value = "";

    previaMedia.textContent = "—";

    idEmEdicao = null;

    tituloFormulario.textContent = "Cadastrar aluno";
    botaoSalvar.textContent = "Salvar";
    botaoCancelar.hidden = true;
}


// Cancelar edição
function cancelarEdicao() {
    limparFormulario();
    exibirMensagem("");
}


// Cadastrar ou atualizar aluno
async function cadastrarAluno() {

    if (!validarDados()) {
        return;
    }

    const novoAluno = {
        nome: campoNome.value.trim(),
        nota1: Number(nota1.value),
        nota2: Number(nota2.value),
        nota3: Number(nota3.value),
        nota4: Number(nota4.value)
    };

    const editando = idEmEdicao !== null;

    try {

        definirCarregamento(true);

        const resposta = await fetch(
            editando
                ? `${API_URL}/alunos/${idEmEdicao}`
                : `${API_URL}/alunos`,
            {
                method: editando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoAluno)
            }
        );

        if (!resposta.ok) {
            throw new Error(
                editando
                    ? "Não foi possível atualizar o aluno."
                    : "Não foi possível cadastrar o aluno."
            );
        }

        limparFormulario();

        await carregarAlunos(true);

        exibirMensagem(
            editando
                ? "Aluno atualizado com sucesso!"
                : "Aluno cadastrado com sucesso!",
            "sucesso"
        );

    } catch (erro) {

        exibirMensagem(erro.message, "erro");
        console.log(erro);

    } finally {

        definirCarregamento(false);

    }
}


// Consultar alunos
async function carregarAlunos(silencioso = false) {

    try {

        definirCarregamento(true);

        if (!silencioso) {
            exibirMensagem("Carregando alunos...");
        }

        const resposta = await fetch(`${API_URL}/alunos`);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar alunos.");
        }

        alunos = await resposta.json();

        atualizarIndicadores();
        aplicarFiltros();

        if (!silencioso) {
            exibirMensagem("Alunos carregados com sucesso.", "sucesso");
        }

        console.log(alunos);

    } catch (erro) {

        exibirMensagem(erro.message, "erro");
        console.log("Erro:", erro);

    } finally {

        definirCarregamento(false);

    }
}


// Excluir aluno
async function excluirAluno(id) {

    const confirmado = confirm("Deseja realmente excluir este aluno?");

    if (!confirmado) {
        return;
    }

    try {

        definirCarregamento(true);

        const resposta = await fetch(`${API_URL}/alunos/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o aluno.");
        }

        await carregarAlunos(true);

        exibirMensagem("Aluno excluído com sucesso!", "sucesso");

    } catch (erro) {

        exibirMensagem(erro.message, "erro");
        console.log(erro);

    } finally {

        definirCarregamento(false);

    }
}


// Renderizar alunos na tabela
function renderizarAlunos(lista = alunos) {

    listaAlunos.innerHTML = "";

    lista.forEach(aluno => {

        const linha = document.createElement("tr");

        const nome = document.createElement("td");
        nome.textContent = aluno.nome;

        const n1 = document.createElement("td");
        n1.textContent = aluno.nota1;

        const n2 = document.createElement("td");
        n2.textContent = aluno.nota2;

        const n3 = document.createElement("td");
        n3.textContent = aluno.nota3;

        const n4 = document.createElement("td");
        n4.textContent = aluno.nota4;

        const media = document.createElement("td");
        media.textContent = Number(aluno.media).toFixed(2);
        media.classList.add("media");

        const situacao = document.createElement("td");
        const etiqueta = document.createElement("span");

        etiqueta.textContent = aluno.situacao;
        etiqueta.classList.add("situacao", aluno.situacao);

        situacao.appendChild(etiqueta);

        // Botões de ação
        const acoes = document.createElement("td");

        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.classList.add("acao");

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.classList.add("acao", "excluir");

        editar.addEventListener("click", () => prepararEdicao(aluno.id));
        excluir.addEventListener("click", () => excluirAluno(aluno.id));

        acoes.append(editar, excluir);

        linha.append(
            nome, n1, n2, n3, n4, media, situacao, acoes
        );

        listaAlunos.appendChild(linha);
    });
}


// Busca, filtros e ordenação
function aplicarFiltros() {

    let resultado = [...alunos];

    const busca = campoBusca.value.toLowerCase().trim();

    // Busca por nome
    if (busca !== "") {
        resultado = resultado.filter(aluno =>
            aluno.nome.toLowerCase().includes(busca)
        );
    }

    // Filtro por situação
    if (filtroSituacao.value !== "") {
        resultado = resultado.filter(aluno =>
            aluno.situacao === filtroSituacao.value
        );
    }

    // Ordenação por nome
    if (filtroOrdem.value === "nome") {
        resultado.sort((a, b) =>
            a.nome.localeCompare(b.nome)
        );
    }

    // Ordenação por maior média
    if (filtroOrdem.value === "maior-media") {
        resultado.sort((a, b) =>
            b.media - a.media
        );
    }

    // Ordenação por menor média
    if (filtroOrdem.value === "menor-media") {
        resultado.sort((a, b) =>
            a.media - b.media
        );
    }

    renderizarAlunos(resultado);

    resultadoFiltro.textContent =
        `${resultado.length} aluno(s) encontrado(s).`;

    estadoVazio.hidden = resultado.length !== 0;
}


// Indicadores da turma
function atualizarIndicadores() {

    const quantidade = alunos.length;

    totalAlunos.textContent = quantidade;

    if (quantidade === 0) {

        mediaTurma.textContent = "—";
        totalAprovados.textContent = 0;
        totalReprovados.textContent = 0;
        maiorMedia.textContent = "—";
        menorMedia.textContent = "—";
        percentualAprovacao.textContent = "0%";

        return;
    }

    const medias = alunos.map(aluno => Number(aluno.media));

    const soma = medias.reduce((total, media) => total + media, 0);

    const mediaGeral = soma / quantidade;

    const aprovados = alunos.filter(aluno =>
        aluno.situacao === "aprovado"
    ).length;

    const reprovados = alunos.filter(aluno =>
        aluno.situacao === "reprovado"
    ).length;

    const maior = Math.max(...medias);
    const menor = Math.min(...medias);

    const percentual = (aprovados / quantidade) * 100;

    mediaTurma.textContent = mediaGeral.toFixed(2);
    totalAprovados.textContent = aprovados;
    totalReprovados.textContent = reprovados;
    maiorMedia.textContent = maior.toFixed(2);
    menorMedia.textContent = menor.toFixed(2);
    percentualAprovacao.textContent = percentual.toFixed(1) + "%";
}


// Eventos
botaoSalvar.addEventListener("click", cadastrarAluno);

botaoCancelar.addEventListener("click", cancelarEdicao);

botaoRecarregar.addEventListener("click", carregarAlunos);

[nota1, nota2, nota3, nota4].forEach(campo => {
    campo.addEventListener("input", calcularPrevia);
});

campoBusca.addEventListener("input", aplicarFiltros);

filtroSituacao.addEventListener("change", aplicarFiltros);

filtroOrdem.addEventListener("change", aplicarFiltros);


// Inicialização
carregarAlunos();