
const API_URL = "https://exemplosapi.evolutivasistemas.com.br/api/maiza-correa";

const campoNome = document.getElementById("campo-nome");

const notas = [
    document.getElementById("nota-1"),
    document.getElementById("nota-2"),
    document.getElementById("nota-3"),
    document.getElementById("nota-4")
];

const previaMedia = document.getElementById("previa-media");
const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoRecarregar = document.getElementById("botao-recarregar");
const listaAlunos = document.getElementById("lista-alunos");
const campoBusca = document.getElementById("campo-busca");
const filtroSituacao = document.getElementById("filtro-situacao");
const filtroOrdem = document.getElementById("filtro-ordem");
const mensagem = document.getElementById("mensagem");
const estadoVazio = document.getElementById("estado-vazio");
const resultadoFiltro = document.getElementById("resultado-filtro");

const totalAlunos = document.getElementById("total-alunos");
const mediaTurma = document.getElementById("media-turma");
const totalAprovados = document.getElementById("total-aprovados");
const totalReprovados = document.getElementById("total-reprovados");
const maiorMedia = document.getElementById("maior-media");
const menorMedia = document.getElementById("menor-media");
const percentualAprovacao = document.getElementById("percentual-aprovacao");

let alunos = [];
let alunoEditando = null;

function formatarNumero(numero) {
    return Number(numero).toFixed(1).replace(".", ",");
}

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.classList.remove("sucesso", "erro");

    if (tipo) {
        mensagem.classList.add(tipo);
    }
}

function limparMensagem() {
    mensagem.textContent = "";
    mensagem.classList.remove("sucesso", "erro");
}

function calcularMedia(notasAluno) {
    return notasAluno.reduce((soma, nota) => soma + nota, 0) / 4;
}

function obterNotas(aluno) {
    return [
        Number(aluno.nota1),
        Number(aluno.nota2),
        Number(aluno.nota3),
        Number(aluno.nota4)
    ];
}

function obterMedia(aluno) {
    if (aluno.media !== undefined && aluno.media !== null) {
        return Number(aluno.media);
    }

    return calcularMedia(obterNotas(aluno));
}

function estaAprovado(aluno) {
    return obterMedia(aluno) >= 7;
}

async function requisicaoAPI(caminho, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            ...opcoes,
            headers: {
                ...(opcoes.headers || {}),
                ...(opcoes.body ? { "Content-Type": "application/json" } : {})
            }
        });
    } catch {
        throw new Error("Falha de conexão. Verifique sua internet e tente novamente.");
    }

    if (resposta.status === 204) {
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        return null;
    }

    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = null;
        }
    }

    if (!resposta.ok) {
        const erroAPI = dados?.erro || dados?.message;
        const detalhes = dados?.detalhes;

        let mensagemErro = erroAPI || `Erro HTTP ${resposta.status}`;

        if (detalhes) {
            mensagemErro += typeof detalhes === "string"
                ? `: ${detalhes}`
                : ": " + JSON.stringify(detalhes);
        }

        throw new Error(mensagemErro);
    }

    return dados;
}

async function carregarAlunos() {
    botaoRecarregar.disabled = true;
    mostrarMensagem("Carregando alunos...");

    try {
        const dados = await requisicaoAPI("/alunos");

        if (!Array.isArray(dados)) {
            throw new Error("A API retornou um formato de dados inválido.");
        }

        alunos = dados;
        atualizarInterface();

        mostrarMensagem("Alunos carregados com sucesso!", "sucesso");
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    } finally {
        botaoRecarregar.disabled = false;
    }
}

function validarDados() {
    const nome = campoNome.value.trim();

    if (nome === "") {
        throw new Error("Informe o nome do aluno.");
    }

    if (nome.length > 100) {
        throw new Error("O nome deve ter no máximo 100 caracteres.");
    }

    const notasAluno = [];

    for (let i = 0; i < notas.length; i++) {
        const valor = notas[i].value.trim();

        if (valor === "") {
            throw new Error(`Informe a nota ${i + 1}.`);
        }

        const nota = Number(valor);

        if (!Number.isFinite(nota)) {
            throw new Error(`A nota ${i + 1} deve ser numérica.`);
        }

        if (nota < 0 || nota > 10) {
            throw new Error(`A nota ${i + 1} deve estar entre 0 e 10.`);
        }

        notasAluno.push(nota);
    }

    return {
        nome,
        nota1: notasAluno[0],
        nota2: notasAluno[1],
        nota3: notasAluno[2],
        nota4: notasAluno[3]
    };
}

async function salvarAluno() {
    botaoSalvar.disabled = true;

    try {
        limparMensagem();

        const dados = validarDados();

        let caminho = "/alunos";
        let metodo = "POST";

        if (alunoEditando !== null) {
            caminho = `/alunos/${alunoEditando}`;
            metodo = "PUT";
        }

        await requisicaoAPI(caminho, {
            method: metodo,
            body: JSON.stringify(dados)
        });

        const estavaEditando = alunoEditando !== null;

        limparFormulario();

        mostrarMensagem(
            estavaEditando
                ? "Aluno atualizado com sucesso!"
                : "Aluno cadastrado com sucesso!",
            "sucesso"
        );

        await atualizarDadosDepoisDaAlteracao();
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    } finally {
        botaoSalvar.disabled = false;
    }
}

async function atualizarDadosDepoisDaAlteracao() {
    try {
        const dados = await requisicaoAPI("/alunos");

        if (!Array.isArray(dados)) {
            throw new Error("Formato de resposta inválido.");
        }

        alunos = dados;
        atualizarInterface();
    } catch (erro) {
        mostrarMensagem(
            "A operação foi realizada, mas não foi possível atualizar a lista. " + erro.message,
            "erro"
        );
    }
}

function limparFormulario() {
    campoNome.value = "";

    notas.forEach(nota => {
        nota.value = "";
    });

    previaMedia.textContent = "—";
    alunoEditando = null;

    tituloFormulario.textContent = "Cadastrar aluno";
    botaoSalvar.textContent = "Salvar";
}

function editarAluno(id) {
    const aluno = alunos.find(item => String(item.id) === String(id));

    if (!aluno) {
        mostrarMensagem("Aluno não encontrado.", "erro");
        return;
    }

    alunoEditando = aluno.id;

    campoNome.value = aluno.nome;

    notas[0].value = aluno.nota1;
    notas[1].value = aluno.nota2;
    notas[2].value = aluno.nota3;
    notas[3].value = aluno.nota4;

    tituloFormulario.textContent = "Editar aluno";
    botaoSalvar.textContent = "Atualizar";

    atualizarPreviaMedia();
    limparMensagem();

    document.getElementById("campos-aluno").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    limparMensagem();
});

async function excluirAluno(id) {
    const aluno = alunos.find(item => String(item.id) === String(id));

    if (!aluno) {
        mostrarMensagem("Aluno não encontrado.", "erro");
        return;
    }

    const confirmou = confirm(
        `Tem certeza que deseja excluir o aluno ${aluno.nome}?`
    );

    if (!confirmou) {
        return;
    }

    const linha = listaAlunos.querySelector(
        `[data-id="${CSS.escape(String(id))}"]`
    );

    const botaoExcluir = linha?.querySelector(".excluir");

    if (botaoExcluir) {
        botaoExcluir.disabled = true;
    }

    try {
        mostrarMensagem("Excluindo aluno...");

        await requisicaoAPI(`/alunos/${id}`, {
            method: "DELETE"
        });

        if (String(alunoEditando) === String(id)) {
            limparFormulario();
        }

        mostrarMensagem("Aluno excluído com sucesso!", "sucesso");

        await atualizarDadosDepoisDaAlteracao();
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    }
}

function atualizarPreviaMedia() {
    const valores = notas.map(campo => campo.value.trim());

    if (valores.some(valor => valor === "")) {
        previaMedia.textContent = "—";
        return;
    }

    const notasNumericas = valores.map(Number);

    const invalidas = notasNumericas.some(nota =>
        !Number.isFinite(nota) || nota < 0 || nota > 10
    );

    if (invalidas) {
        previaMedia.textContent = "—";
        return;
    }

    const media = calcularMedia(notasNumericas);

    previaMedia.textContent = formatarNumero(media);
}

notas.forEach(campo => {
    campo.addEventListener("input", atualizarPreviaMedia);
});

function renderizarTabela() {
    listaAlunos.innerHTML = "";

    const busca = campoBusca.value.trim().toLowerCase();
    const situacao = filtroSituacao.value;
    const ordem = filtroOrdem.value;

    let alunosFiltrados = alunos.filter(aluno => {
        return aluno.nome.toLowerCase().includes(busca);
    });

    if (situacao === "aprovado") {
        alunosFiltrados = alunosFiltrados.filter(estaAprovado);
    }

    if (situacao === "reprovado") {
        alunosFiltrados = alunosFiltrados.filter(aluno => !estaAprovado(aluno));
    }

    if (ordem === "nome" || ordem === "az") {
        alunosFiltrados.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR")
        );
    }

    if (
        ordem === "maior-media" ||
        ordem === "maior" ||
        ordem === "media-desc"
    ) {
        alunosFiltrados.sort((a, b) => obterMedia(b) - obterMedia(a));
    }

    if (
        ordem === "menor-media" ||
        ordem === "menor" ||
        ordem === "media-asc"
    ) {
        alunosFiltrados.sort((a, b) => obterMedia(a) - obterMedia(b));
    }

    alunosFiltrados.forEach(aluno => {
        const tr = document.createElement("tr");

        tr.dataset.id = aluno.id;

        const valores = [
            aluno.nome,
            ...obterNotas(aluno).map(formatarNumero)
        ];

        valores.forEach(valor => {
            const td = document.createElement("td");
            td.textContent = valor;
            tr.appendChild(td);
        });

        const tdMedia = document.createElement("td");
        tdMedia.className = "media";
        tdMedia.textContent = formatarNumero(obterMedia(aluno));

        tr.appendChild(tdMedia);

        const tdSituacao = document.createElement("td");
        const spanSituacao = document.createElement("span");

        const situacaoAPI = String(aluno.situacao || "").toLowerCase();

        spanSituacao.className = `situacao ${
            situacaoAPI === "aprovado" ? "aprovado" : "reprovado"
        }`;

        spanSituacao.textContent =
            situacaoAPI === "aprovado" ? "Aprovado" : "Reprovado";

        tdSituacao.appendChild(spanSituacao);
        tr.appendChild(tdSituacao);

        const tdAcoes = document.createElement("td");
        tdAcoes.className = "acoes";

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.className = "acao";
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", () => {
            editarAluno(aluno.id);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "acao excluir";
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", () => {
            excluirAluno(aluno.id);
        });

        tdAcoes.appendChild(botaoEditar);
        tdAcoes.appendChild(botaoExcluir);

        tr.appendChild(tdAcoes);
        listaAlunos.appendChild(tr);
    });

    estadoVazio.hidden = alunosFiltrados.length > 0;

    resultadoFiltro.textContent =
        `Exibindo ${alunosFiltrados.length} de ${alunos.length} alunos`;
}

function atualizarIndicadores() {
    const quantidade = alunos.length;

    totalAlunos.textContent = quantidade;

    if (quantidade === 0) {
        mediaTurma.textContent = "—";
        maiorMedia.textContent = "—";
        menorMedia.textContent = "—";
        totalAprovados.textContent = "0";
        totalReprovados.textContent = "0";
        percentualAprovacao.textContent = "—";

        return;
    }

    let somaMedias = 0;
    let aprovados = 0;
    let reprovados = 0;

    let maior = -Infinity;
    let menor = Infinity;

    alunos.forEach(aluno => {
        const media = obterMedia(aluno);

        somaMedias += media;

        if (media >= 7) {
            aprovados++;
        } else {
            reprovados++;
        }

        if (media > maior) {
            maior = media;
        }

        if (media < menor) {
            menor = media;
        }
    });

    const mediaGeral = somaMedias / quantidade;
    const percentual = (aprovados / quantidade) * 100;

    mediaTurma.textContent = formatarNumero(mediaGeral);
    totalAprovados.textContent = aprovados;
    totalReprovados.textContent = reprovados;
    maiorMedia.textContent = formatarNumero(maior);
    menorMedia.textContent = formatarNumero(menor);

    percentualAprovacao.textContent =
        `${formatarNumero(percentual)}%`;
}

function atualizarInterface() {
    renderizarTabela();
    atualizarIndicadores();
}

function salvarFiltros() {
    const filtros = {
        busca: campoBusca.value,
        situacao: filtroSituacao.value,
        ordem: filtroOrdem.value
    };

    localStorage.setItem("filtrosPainelNotas", JSON.stringify(filtros));
}

function restaurarFiltros() {
    const dados = localStorage.getItem("filtrosPainelNotas");

    if (!dados) return;

    try {
        const filtros = JSON.parse(dados);

        if (typeof filtros.busca === "string") {
            campoBusca.value = filtros.busca;
        }

        if (
            [...filtroSituacao.options].some(o => o.value === filtros.situacao)
        ) {
            filtroSituacao.value = filtros.situacao;
        }

        if (
            [...filtroOrdem.options].some(o => o.value === filtros.ordem)
        ) {
            filtroOrdem.value = filtros.ordem;
        }
    } catch {
        localStorage.removeItem("filtrosPainelNotas");
    }
}

[campoBusca, filtroSituacao, filtroOrdem].forEach(controle => {
    controle.addEventListener("input", () => {
        salvarFiltros();
        renderizarTabela();
    });

    controle.addEventListener("change", () => {
        salvarFiltros();
        renderizarTabela();
    });
});

botaoSalvar.addEventListener("click", salvarAluno);

botaoRecarregar.addEventListener("click", carregarAlunos);

const camposAluno = document.getElementById("campos-aluno");

if (camposAluno.tagName === "FORM") {
    camposAluno.addEventListener("submit", evento => {
        evento.preventDefault();
        salvarAluno();
    });
}

restaurarFiltros();
carregarAlunos();
