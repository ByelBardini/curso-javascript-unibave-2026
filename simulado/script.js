const API_URL = "https://exemplosapi.evolutivasistemas.com.br/api/willyan";

const campoNome = document.getElementById("campo-nome");
const nota1 = document.getElementById("nota-1");
const nota2 = document.getElementById("nota-2");
const nota3 = document.getElementById("nota-3");
const nota4 = document.getElementById("nota-4");
const previaMedia = document.getElementById("previa-media");
const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const listaAlunos = document.getElementById("lista-alunos");
const campoBusca = document.getElementById("campo-busca");
const filtroSituacao = document.getElementById("filtro-situacao");
const filtroOrdem = document.getElementById("filtro-ordem");
const botaoRecarregar = document.getElementById("botao-recarregar");
const estadoVazio = document.getElementById("estado-vazio");
const resultadoFiltro = document.getElementById("resultado-filtro");
const mensagem = document.getElementById("mensagem");
const totalAlunos = document.getElementById("total-alunos");
const mediaTurma = document.getElementById("media-turma");
const totalAprovados = document.getElementById("total-aprovados");
const totalReprovados = document.getElementById("total-reprovados");
const maiorMedia = document.getElementById("maior-media");
const menorMedia = document.getElementById("menor-media");
const percentualAprovacao = document.getElementById("percentual-aprovacao");

let alunos = [];
let idEmEdicao = null;

function formatarNumero(numero) {
    return Number(numero).toFixed(1).replace(".", ",");
}

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";

    if (tipo) {
        mensagem.classList.add(tipo);
    }
}

function criarCelula(valor) {
    const celula = document.createElement("td");
    celula.textContent = valor;
    return celula;
}

function obterNotas() {
    return [
        nota1.value,
        nota2.value,
        nota3.value,
        nota4.value
    ];
}

function calcularMediaDasNotas(notas) {
    return notas.reduce((soma, nota) => soma + nota, 0) / 4;
}

function formatarErroAPI(dados, mensagemPadrao) {
    if (dados && dados.erro) {
        if (dados.detalhes) {
            return `${dados.erro}: ${dados.detalhes}`;
        }

        return dados.erro;
    }

    return mensagemPadrao;
}

function atualizarPreviaMedia() {
    const valores = obterNotas();

    if (valores.some(valor => valor.trim() === "")) {
        previaMedia.textContent = "—";
        return;
    }

    const notas = valores.map(Number);

    if (notas.some(nota => !Number.isFinite(nota) || nota < 0 || nota > 10)) {
        previaMedia.textContent = "—";
        return;
    }

    const media = calcularMediaDasNotas(notas);

    previaMedia.textContent = formatarNumero(media);
}

function validarFormulario() {
    const nome = campoNome.value.trim();

    if (nome === "") {
        return {
            valido: false,
            mensagem: "Informe o nome do aluno."
        };
    }

    if (nome.length > 100) {
        return {
            valido: false,
            mensagem: "O nome deve ter no máximo 100 caracteres."
        };
    }

    const valores = obterNotas();

    for (let i = 0; i < valores.length; i++) {
        if (valores[i].trim() === "") {
            return {
                valido: false,
                mensagem: `Informe a nota da ${i + 1}ª avaliação.`
            };
        }

        const nota = Number(valores[i]);

        if (!Number.isFinite(nota)) {
            return {
                valido: false,
                mensagem: `A nota da ${i + 1}ª avaliação deve ser numérica.`
            };
        }

        if (nota < 0 || nota > 10) {
            return {
                valido: false,
                mensagem: `A nota da ${i + 1}ª avaliação deve estar entre 0 e 10.`
            };
        }
    }

    return {
        valido: true,
        dados: {
            nome: nome,
            nota1: Number(valores[0]),
            nota2: Number(valores[1]),
            nota3: Number(valores[2]),
            nota4: Number(valores[3])
        }
    };
}

function limparFormulario() {
    campoNome.value = "";
    nota1.value = "";
    nota2.value = "";
    nota3.value = "";
    nota4.value = "";

    previaMedia.textContent = "—";

    idEmEdicao = null;

    tituloFormulario.textContent = "Novo aluno";
    botaoSalvar.textContent = "Cadastrar aluno";
}

async function carregarAlunos() {
    botaoRecarregar.disabled = true;

    mostrarMensagem("Carregando turma...");

    try {
        const resposta = await fetch(`${API_URL}/alunos`);

        let dados = null;

        if (resposta.status !== 204) {
            dados = await resposta.json();
        }

        if (!resposta.ok) {
            throw new Error(
                formatarErroAPI(dados, "Não foi possível carregar a turma.")
            );
        }

        alunos = Array.isArray(dados) ? dados : [];

        renderizar();

        mostrarMensagem("Turma carregada com sucesso.", "sucesso");

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(
            erro.message || "Falha de conexão com o servidor.",
            "erro"
        );

    } finally {
        botaoRecarregar.disabled = false;
    }
}

function renderizar() {
    renderizarTabela();
    renderizarIndicadores();
}

function obterAlunosVisiveis() {
    let resultado = [...alunos];

    const busca = campoBusca.value.trim().toLowerCase();
    const situacao = filtroSituacao.value;
    const ordem = filtroOrdem.value;

    if (busca !== "") {
        resultado = resultado.filter(aluno =>
            aluno.nome.toLowerCase().includes(busca)
        );
    }

    if (situacao !== "todos") {
        resultado = resultado.filter(aluno =>
            aluno.situacao === situacao
        );
    }

    if (ordem === "nome") {
        resultado.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR")
        );
    }

    if (ordem === "maior") {
        resultado.sort((a, b) => b.media - a.media);
    }

    if (ordem === "menor") {
        resultado.sort((a, b) => a.media - b.media);
    }

    return resultado;
}

function renderizarTabela() {
    listaAlunos.innerHTML = "";

    const alunosVisiveis = obterAlunosVisiveis();

    alunosVisiveis.forEach(aluno => {
        const linha = document.createElement("tr");

        linha.appendChild(criarCelula(aluno.nome));

        linha.appendChild(
            criarCelula(formatarNumero(aluno.nota1))
        );

        linha.appendChild(
            criarCelula(formatarNumero(aluno.nota2))
        );

        linha.appendChild(
            criarCelula(formatarNumero(aluno.nota3))
        );

        linha.appendChild(
            criarCelula(formatarNumero(aluno.nota4))
        );

        const celulaMedia = criarCelula(
            formatarNumero(aluno.media)
        );

        celulaMedia.classList.add("media");
        linha.appendChild(celulaMedia);

        const celulaSituacao = document.createElement("td");

        const spanSituacao = document.createElement("span");

        spanSituacao.classList.add(
            "situacao",
            aluno.situacao
        );

        spanSituacao.textContent =
            aluno.situacao === "aprovado"
                ? "Aprovado"
                : "Reprovado";

        celulaSituacao.appendChild(spanSituacao);
        linha.appendChild(celulaSituacao);

        const celulaAcoes = document.createElement("td");
        celulaAcoes.classList.add("acoes");

        const botaoEditar = document.createElement("button");

        botaoEditar.type = "button";
        botaoEditar.classList.add("acao");
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", () => {
            iniciarEdicao(aluno.id);
        });

        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.classList.add("acao", "excluir");
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", () => {
            excluirAluno(aluno.id);
        });

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoExcluir);

        linha.appendChild(celulaAcoes);

        listaAlunos.appendChild(linha);
    });

    estadoVazio.hidden = alunosVisiveis.length !== 0;

    resultadoFiltro.textContent =
        `Exibindo ${alunosVisiveis.length} de ${alunos.length} alunos`;
}

function renderizarIndicadores() {
    const total = alunos.length;

    totalAlunos.textContent = total;

    if (total === 0) {
        mediaTurma.textContent = "—";
        totalAprovados.textContent = "0";
        totalReprovados.textContent = "0";
        maiorMedia.textContent = "—";
        menorMedia.textContent = "—";
        percentualAprovacao.textContent = "—";
        return;
    }

    const medias = alunos.map(aluno => Number(aluno.media));

    const aprovados = alunos.filter(
        aluno => aluno.media >= 7
    );

    const reprovados = alunos.filter(
        aluno => aluno.media < 7
    );

    const somaMedias = medias.reduce(
        (soma, media) => soma + media,
        0
    );

    const media = somaMedias / total;

    const maior = Math.max(...medias);
    const menor = Math.min(...medias);

    const percentual = (aprovados.length / total) * 100;

    mediaTurma.textContent = formatarNumero(media);

    totalAprovados.textContent = aprovados.length;

    totalReprovados.textContent = reprovados.length;

    maiorMedia.textContent = formatarNumero(maior);

    menorMedia.textContent = formatarNumero(menor);

    percentualAprovacao.textContent =
        `${formatarNumero(percentual)}%`;
}

async function salvarAluno() {
    const validacao = validarFormulario();

    if (!validacao.valido) {
        mostrarMensagem(validacao.mensagem, "erro");
        return;
    }

    const dados = validacao.dados;

    botaoSalvar.disabled = true;

    const estaEditando = idEmEdicao !== null;

    mostrarMensagem(
        estaEditando
            ? "Atualizando aluno..."
            : "Cadastrando aluno..."
    );

    try {
        const url = estaEditando
            ? `${API_URL}/alunos/${idEmEdicao}`
            : `${API_URL}/alunos`;

        const metodo = estaEditando ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        let respostaDados = null;

        if (resposta.status !== 204) {
            respostaDados = await resposta.json();
        }

        if (!resposta.ok) {
            throw new Error(
                formatarErroAPI(
                    respostaDados,
                    "Não foi possível salvar o aluno."
                )
            );
        }

        limparFormulario();

        await carregarAlunos();

        mostrarMensagem(
            estaEditando
                ? "Aluno atualizado com sucesso."
                : "Aluno cadastrado com sucesso.",
            "sucesso"
        );

    } catch (erro) {
        console.error(erro);

        mostrarMensagem(
            erro.message || "Falha de conexão com o servidor.",
            "erro"
        );

    } finally {
        botaoSalvar.disabled = false;
    }
}

function iniciarEdicao(id) {
    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) {
        mostrarMensagem("Aluno não encontrado.", "erro");
        return;
    }

    idEmEdicao = aluno.id;

    campoNome.value = aluno.nome;
    nota1.value = aluno.nota1;
    nota2.value = aluno.nota2;
    nota3.value = aluno.nota3;
    nota4.value = aluno.nota4;

    tituloFormulario.textContent = "Editar aluno";
    botaoSalvar.textContent = "Salvar alterações";

    atualizarPreviaMedia();

    campoNome.focus();
}

function cancelarEdicao() {
    limparFormulario();

    mostrarMensagem("Formulário limpo.");
}

async function excluirAluno(id) {
    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) {
        mostrarMensagem("Aluno não encontrado.", "erro");
        return;
    }

    const confirmou = confirm(
        `Deseja realmente excluir o aluno "${aluno.nome}"?`
    );

    if (!confirmou) {
        return;
    }

    const botao = event?.currentTarget;

    if (botao) {
        botao.disabled = true;
    }

    mostrarMensagem("Excluindo aluno...");

    try {
        const resposta = await fetch(
            `${API_URL}/alunos/${id}`,
            {
                method: "DELETE"
            }
        );

        let dados = null;

        if (resposta.status !== 204) {
            dados = await resposta.json();
        }

        if (!resposta.ok) {
            throw new Error(
                formatarErroAPI(
                    dados,
                    "Não foi possível excluir o aluno."
                )
            );
        }

        if (idEmEdicao === id) {
            limparFormulario();
        }

        await carregarAlunos();

        mostrarMensagem(
            "Aluno excluído com sucesso.",
            "sucesso"
        );

    } catch (erro) {
        console.error(erro);

        mostrarMensagem(
            erro.message || "Falha de conexão com o servidor.",
            "erro"
        );
    }
}

botaoSalvar.addEventListener("click", salvarAluno);

botaoCancelar.addEventListener("click", cancelarEdicao);

botaoRecarregar.addEventListener("click", carregarAlunos);

nota1.addEventListener("input", atualizarPreviaMedia);
nota2.addEventListener("input", atualizarPreviaMedia);
nota3.addEventListener("input", atualizarPreviaMedia);
nota4.addEventListener("input", atualizarPreviaMedia);

campoBusca.addEventListener("input", renderizarTabela);

filtroSituacao.addEventListener("change", renderizarTabela);

filtroOrdem.addEventListener("change", renderizarTabela);

carregarAlunos();