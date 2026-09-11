// Aqui o HTML não conhece o JavaScript: quem conecta os dois é o addEventListener

const botao = document.getElementById("botao");
const contador = document.getElementById("contador");

let cliques = 0;

// evento "click": acontece quando o usuário clica no elemento
botao.addEventListener("click", function () {
  cliques = cliques + 1;
  contador.textContent = "Cliques: " + cliques;
});

const campo = document.getElementById("campo");
const espelho = document.getElementById("espelho");

// evento "input": acontece a cada tecla digitada no campo
campo.addEventListener("input", function () {
  espelho.textContent = "Você digitou: " + campo.value;
});

const cor = document.getElementById("cor");
const amostra = document.getElementById("amostra");

// evento "change": acontece quando o valor do select muda
cor.addEventListener("change", function () {
  amostra.style.color = cor.value;
});
