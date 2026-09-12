// ============================================================
// AULA 02 — EXERCÍCIOS
// ============================================================

// ============================================================
// EXERCÍCIO 01 — Ficha do aluno (console)
//
// Este exercício não usa a página: só variáveis e console.log.
// Abra o console do navegador com F12 para ver a saída.
// ============================================================

const nome = 'Willyan'
let idade = 19
let matriculado = true

console.log(`${nome} tem ${idade} anos e ${matriculado} matriculado`)

idade = idade + 1

console.log(`${nome} tem ${idade} anos e ${matriculado} matriculado`)

console.log(typeof nome, typeof idade, typeof matriculado)
// ============================================================
// EXERCÍCIO 02 — Preço com desconto
// ============================================================

function calcularDesconto() {
    const ahua = Number(document.getElementById("desconto").value) / 100
    const desconto = ahua * Number(document.getElementById("preco").value)
}

document.getElementById("calcularDesconto").addEventListener("click", calcularDesconto);

// ============================================================
// EXERCÍCIO 03 — Contador de curtidas
// ============================================================

function curtir() {
}

function descurtir() {
}

document.getElementById("curtir").addEventListener("click", curtir);
document.getElementById("descurtir").addEventListener("click", descurtir);

// ============================================================
// EXERCÍCIO 04 — Lista de convidados
// ============================================================

function adicionarConvidado() {
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
}

function situacao(media) {
}

function mostrarResultado() {
}

document.getElementById("calcular").addEventListener("click", mostrarResultado);
