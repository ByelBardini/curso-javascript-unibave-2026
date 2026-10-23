// Exemplo 01: a página feita só com HTML, CSS e JavaScript, sem framework.
//
// Repare no padrão que se repete em todas as partes da página:
//
//   1. a função muda uma variável (os dados da página)
//   2. depois chama outra função que copia o dado para a tela, À MÃO,
//      com getElementById, textContent, createElement...
//
// Quem garante que a tela mostra o que está nas variáveis somos nós. Se
// esquecer de chamar a função de atualizar, a variável muda e a tela fica
// mostrando o valor antigo.
//
// No exemplo 02 (Angular) o passo 2 some: as funções só mudam as variáveis
// e o Angular atualiza a tela sozinho.

// --------------------------------------------------------------------- //
// Dados da página
// --------------------------------------------------------------------- //

let contador = 0;
const tarefas = [];

// --------------------------------------------------------------------- //
// Elementos da página que o JavaScript vai ler ou alterar
// --------------------------------------------------------------------- //
// No exemplo 02 esta parte inteira não existe: o HTML aponta direto para as
// variáveis e funções, então ninguém precisa procurar elemento por id.

const campoNome = document.getElementById("campo-nome");
const saudacao = document.getElementById("saudacao");

const valorContador = document.getElementById("valor-contador");
const botaoDiminuir = document.getElementById("botao-diminuir");
const botaoAumentar = document.getElementById("botao-aumentar");
const botaoZerar = document.getElementById("botao-zerar");

const campoTarefa = document.getElementById("campo-tarefa");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const semTarefas = document.getElementById("sem-tarefas");
const totalTarefas = document.getElementById("total-tarefas");

// --------------------------------------------------------------------- //
// 1. Saudação
// --------------------------------------------------------------------- //

// Lê o campo e escreve a frase na tela. No exemplo 02 esse if/else fica no
// HTML, com @if, e esta função não existe.
function atualizarSaudacao() {
  const nome = campoNome.value;

  if (nome === "") {
    saudacao.textContent = "Olá, visitante!";
  } else {
    saudacao.textContent = "Olá, " + nome + "!";
  }
}

// O evento "input" dispara a cada letra digitada.
// No exemplo 02 quem faz isso é o [(ngModel)] no HTML.
campoNome.addEventListener("input", atualizarSaudacao);

// --------------------------------------------------------------------- //
// 2. Contador
// --------------------------------------------------------------------- //

// Copia o valor da variável para a tela
function atualizarContador() {
  valorContador.textContent = contador;

  // "contador === 0" vale true ou false: o botão Zerar fica desabilitado
  // enquanto o contador está em zero
  botaoZerar.disabled = contador === 0;
}

// Toda função que muda o contador precisa terminar chamando
// atualizarContador(). No exemplo 02 essas chamadas não existem.
function diminuir() {
  contador--;
  atualizarContador();
}

function aumentar() {
  contador++;
  atualizarContador();
}

function zerar() {
  contador = 0;
  atualizarContador();
}

// No exemplo 02 cada uma destas linhas vira um (click)="..." no botão
botaoDiminuir.addEventListener("click", diminuir);
botaoAumentar.addEventListener("click", aumentar);
botaoZerar.addEventListener("click", zerar);

// --------------------------------------------------------------------- //
// 3. Lista de tarefas
// --------------------------------------------------------------------- //

// Redesenha a lista inteira a partir do array, como na aula 03.
// No exemplo 02 tudo isto vira um @for de poucas linhas no HTML.
function atualizarTarefas() {
  // Limpa o que estava na tela antes, para não duplicar os itens
  listaTarefas.innerHTML = "";

  for (let i = 0; i < tarefas.length; i++) {
    const li = document.createElement("li");
    li.textContent = tarefas[i];

    // Cada item ganha o próprio botão de remover, que sabe a sua posição (i)
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", function () {
      removerTarefa(i);
    });

    li.appendChild(botaoRemover);
    listaTarefas.appendChild(li);
  }

  // Aviso de lista vazia: mostra ou esconde com style.display
  if (tarefas.length === 0) {
    semTarefas.style.display = "block";
  } else {
    semTarefas.style.display = "none";
  }

  totalTarefas.textContent = "Total: " + tarefas.length + " tarefa(s)";
}

// Só deixa clicar em Adicionar quando tem algo digitado no campo
function atualizarBotaoAdicionar() {
  botaoAdicionar.disabled = campoTarefa.value === "";
}

function adicionarTarefa() {
  tarefas.push(campoTarefa.value);

  campoTarefa.value = "";

  // Mudaram o array e o campo: as DUAS partes da tela precisam ser
  // atualizadas. Esquecer a segunda deixaria o botão habilitado com o
  // campo vazio.
  atualizarTarefas();
  atualizarBotaoAdicionar();
}

function removerTarefa(posicao) {
  // splice(posicao, 1) remove 1 item a partir daquela posição
  tarefas.splice(posicao, 1);
  atualizarTarefas();
}

campoTarefa.addEventListener("input", atualizarBotaoAdicionar);
botaoAdicionar.addEventListener("click", adicionarTarefa);

// --------------------------------------------------------------------- //
// Primeira pintura da tela
// --------------------------------------------------------------------- //
// Quando a página abre, os textos do HTML estão vazios: alguém precisa
// escrever o valor inicial de cada parte. No exemplo 02 isso também é
// automático.

atualizarSaudacao();
atualizarContador();
atualizarTarefas();
atualizarBotaoAdicionar();
