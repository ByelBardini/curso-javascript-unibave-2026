// ============================================================
// AULA 02 — EXERCÍCIOS
// ============================================================

// ============================================================
// EXERCÍCIO 01 — Ficha do aluno (console)
//
// Este exercício não usa a página: só variáveis e console.log.
// Abra o console do navegador com F12 para ver a saída.
// ============================================================

const nome = "Ana";
const matriculado = true;
let idade = 20;

console.log(`${nome} tem ${idade} anos e está matriculada: ${matriculado}`);

idade = idade + 1;

console.log(`${nome} tem ${idade} anos e está matriculada: ${matriculado}`);

// Desafio: conferir o tipo de cada variável
console.log(`typeof nome: ${typeof nome}`);
console.log(`typeof idade: ${typeof idade}`);
console.log(`typeof matriculado: ${typeof matriculado}`);

// ============================================================
// EXERCÍCIO 02 — Preço com desconto
// ============================================================

function calcularDesconto() {
  const preco = Number(document.getElementById("preco").value);
  const desconto = Number(document.getElementById("desconto").value);

  const resultado = document.getElementById("resultadoDesconto");

  // Desafio: desconto acima de 100% não faz sentido (a loja pagaria o cliente).
  if (desconto > 100) {
    resultado.textContent = "Desconto inválido: não pode passar de 100%.";
    return;
  }

  const valorDoDesconto = (preco * desconto) / 100;
  const precoFinal = preco - valorDoDesconto;

  resultado.textContent = `De R$ ${preco} por R$ ${precoFinal} (você economiza R$ ${valorDoDesconto})`;
}

document.getElementById("calcularDesconto").addEventListener("click", calcularDesconto);

// ============================================================
// EXERCÍCIO 03 — Contador de curtidas
// ============================================================

let curtidas = 0;

function mostrarCurtidas() {
  const saida = document.getElementById("curtidas");

  saida.textContent = `Curtidas: ${curtidas}`;

  if (curtidas > 10) {
    saida.style.color = "green";
  } else {
    saida.style.color = "black";
  }
}

function curtir() {
  curtidas = curtidas + 1;

  mostrarCurtidas();
}

function descurtir() {
  if (curtidas > 0) {
    curtidas = curtidas - 1;
  }

  mostrarCurtidas();
}

document.getElementById("curtir").addEventListener("click", curtir);
document.getElementById("descurtir").addEventListener("click", descurtir);

// ============================================================
// EXERCÍCIO 04 — Lista de convidados
// ============================================================

function adicionarConvidado() {
  const campo = document.getElementById("convidado");
  const aviso = document.getElementById("aviso");
  const lista = document.getElementById("lista");

  // .trim() tira os espaços das pontas: só espaço também é nome vazio.
  const nomeDigitado = campo.value.trim();

  if (nomeDigitado === "") {
    aviso.textContent = "Digite um nome antes de adicionar.";
    return;
  }

  aviso.textContent = "";

  const item = document.createElement("li");
  item.textContent = nomeDigitado;

  // Desafio: um botão de remover dentro de cada item.
  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";

  botaoRemover.addEventListener("click", function () {
    item.remove();
  });

  item.appendChild(botaoRemover);
  lista.appendChild(item);

  campo.value = "";
  campo.focus();
}

document.getElementById("adicionar").addEventListener("click", adicionarConvidado);

// ============================================================
// EXERCÍCIO 05 — Média do semestre
//
// As duas primeiras funções são de LÓGICA: elas não podem usar
// document, getElementById, textContent ou nada de HTML.
// Só a terceira mexe na tela.
// ============================================================

function calculaMedia(nota1, nota2, nota3) {
  return (nota1 + nota2 + nota3) / 3;
}

function situacao(media) {
  if (media >= 7) {
    return "Aprovado";
  }

  if (media >= 5) {
    return "Recuperação";
  }

  return "Reprovado";
}

function mostrarResultado() {
  const nota1 = Number(document.getElementById("nota1").value);
  const nota2 = Number(document.getElementById("nota2").value);
  const nota3 = Number(document.getElementById("nota3").value);

  const media = calculaMedia(nota1, nota2, nota3);
  const situacaoDoAluno = situacao(media);

  // toFixed(2) deixa a média com duas casas: 7.333333... vira 7.33
  let texto = `Média: ${media.toFixed(2)} - ${situacaoDoAluno}`;

  // Desafio: quantos pontos faltam para chegar no 7.
  if (situacaoDoAluno === "Recuperação") {
    const pontosQueFaltam = 7 - media;

    texto = `${texto} (faltaram ${pontosQueFaltam.toFixed(2)} pontos para a aprovação)`;
  }

  document.getElementById("resultado").textContent = texto;
}

document.getElementById("calcular").addEventListener("click", mostrarResultado);
