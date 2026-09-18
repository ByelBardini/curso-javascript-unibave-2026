// O array é a "fonte da verdade": a tela é sempre desenhada a partir dele
const itens = [];

// --------------------------------------------------------------------- //
// Funções que só mexem na tela
// --------------------------------------------------------------------- //

// Percorre o array e redesenha a lista inteira na página
function atualizarTela() {
  const lista = document.getElementById("lista");

  // Limpa o que estava na tela antes, para não duplicar os itens
  lista.innerHTML = "";

  for (let i = 0; i < itens.length; i++) {
    const li = document.createElement("li");
    li.textContent = "[" + i + "] " + itens[i];
    lista.appendChild(li);
  }

  document.getElementById("total").textContent =
    "Total de itens: " + itens.length;

  console.log("Array atual:", itens);
}

function mostrarMensagem(texto) {
  document.getElementById("mensagem").textContent = texto;
}

// Lê o campo de texto e já apaga o que foi digitado
function lerItemDigitado() {
  const campo = document.getElementById("campo-item");
  const valor = campo.value;

  campo.value = "";

  return valor;
}

// --------------------------------------------------------------------- //
// Funções ligadas aos botões
// --------------------------------------------------------------------- //

function adicionarNoFim() {
  const item = lerItemDigitado();

  if (item === "") {
    mostrarMensagem("Digite um item antes de adicionar.");
    return;
  }

  // includes() evita adicionar o mesmo item duas vezes
  if (itens.includes(item)) {
    mostrarMensagem(item + " já está na lista.");
    return;
  }

  itens.push(item);
  mostrarMensagem(item + " adicionado no fim da lista.");
  atualizarTela();
}

function adicionarNoComeco() {
  const item = lerItemDigitado();

  if (item === "") {
    mostrarMensagem("Digite um item antes de adicionar.");
    return;
  }

  if (itens.includes(item)) {
    mostrarMensagem(item + " já está na lista.");
    return;
  }

  itens.unshift(item);
  mostrarMensagem(item + " adicionado no começo da lista.");
  atualizarTela();
}

function removerDoFim() {
  if (itens.length === 0) {
    mostrarMensagem("A lista já está vazia.");
    return;
  }

  // pop() devolve o item que foi removido
  const removido = itens.pop();

  mostrarMensagem(removido + " foi removido do fim.");
  atualizarTela();
}

function removerDoComeco() {
  if (itens.length === 0) {
    mostrarMensagem("A lista já está vazia.");
    return;
  }

  const removido = itens.shift();

  mostrarMensagem(removido + " foi removido do começo.");
  atualizarTela();
}

function removerPorPosicao() {
  const campo = document.getElementById("campo-posicao");
  const digitado = campo.value;
  const posicao = Number(digitado);

  campo.value = "";

  // Só existem posições de 0 até length - 1
  if (digitado === "" || posicao < 0 || posicao >= itens.length) {
    mostrarMensagem("Posição inválida. Use um número entre 0 e " + (itens.length - 1) + ".");
    return;
  }

  // splice(posicao, 1) remove 1 item a partir daquela posição
  const removidos = itens.splice(posicao, 1);

  mostrarMensagem(removidos[0] + " foi removido da posição " + posicao + ".");
  atualizarTela();
}

function verificarItem() {
  const item = lerItemDigitado();

  if (itens.includes(item)) {
    mostrarMensagem("Sim, " + item + " está na lista.");
  } else {
    mostrarMensagem("Não, " + item + " não está na lista.");
  }
}

function limparLista() {
  // length = 0 esvazia o array sem criar um array novo
  itens.length = 0;

  mostrarMensagem("Lista esvaziada.");
  atualizarTela();
}

// Desenha a tela já no carregamento da página, com a lista vazia
atualizarTela();
