// DOMContentLoaded: dispara quando o HTML terminou de ser lido pelo navegador.
// É o evento que garante que os elementos já existem quando o JS procura por eles.
document.addEventListener("DOMContentLoaded", function () {
  console.log("A página terminou de carregar!");
});

// 1. dblclick: só dispara no clique duplo (o click normal não é afetado)
const textoDuplo = document.getElementById("texto-duplo");

textoDuplo.addEventListener("dblclick", function () {
  textoDuplo.textContent = "Você deu um clique duplo!";
  textoDuplo.style.color = "green";
});

// 2. keydown: dispara a cada tecla pressionada.
// Repare no parâmetro "evento": é um objeto que o navegador entrega
// para a função, com as informações do que aconteceu.
const campoTecla = document.getElementById("campo-tecla");
const tecla = document.getElementById("tecla");
const enter = document.getElementById("enter");

campoTecla.addEventListener("keydown", function (evento) {
  // evento.key é o nome da tecla: "a", "Enter", "ArrowUp", "Shift"...
  tecla.textContent = "Tecla pressionada: " + evento.key;

  if (evento.key === "Enter") {
    enter.textContent = "Você apertou Enter! Valor do campo: " + campoTecla.value;
  }
});

// 3. focus e blur: o campo ganhou ou perdeu o foco
const campoFoco = document.getElementById("campo-foco");
const estadoFoco = document.getElementById("estado-foco");

campoFoco.addEventListener("focus", function () {
  estadoFoco.textContent = "O campo está com foco (você pode digitar).";
  campoFoco.style.backgroundColor = "lightyellow";
});

campoFoco.addEventListener("blur", function () {
  estadoFoco.textContent = "O campo perdeu o foco.";
  campoFoco.style.backgroundColor = "white";
});

// 4. mouseover e mouseout: o mouse entrou ou saiu do elemento
const caixa = document.getElementById("caixa");

caixa.addEventListener("mouseover", function () {
  caixa.style.backgroundColor = "lightblue";
  caixa.textContent = "O mouse está aqui!";
});

caixa.addEventListener("mouseout", function () {
  caixa.style.backgroundColor = "white";
  caixa.textContent = "Passe o mouse aqui";
});

// 5. mousemove: dispara muitas vezes por segundo enquanto o mouse se move.
// evento.offsetX e evento.offsetY são a posição do mouse dentro do elemento.
const area = document.getElementById("area");
const posicao = document.getElementById("posicao");

area.addEventListener("mousemove", function (evento) {
  posicao.textContent = "x: " + evento.offsetX + " / y: " + evento.offsetY;
});

// 6. submit: dispara ao enviar o formulário.
// Sem o preventDefault() o navegador recarrega a página e perde tudo.
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value;
  resultado.textContent = "Formulário enviado por: " + nome;
});

// 7. contextmenu: o menu do botão direito.
// Aqui também usamos preventDefault() para o menu do navegador não aparecer.
const direito = document.getElementById("direito");

direito.addEventListener("contextmenu", function (evento) {
  evento.preventDefault();
  direito.textContent = "Menu do navegador bloqueado pelo JavaScript!";
});
