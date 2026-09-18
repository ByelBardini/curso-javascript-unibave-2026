const nome = "Alerrandro";
let idade = 23;
const matricula = true;

console.log(`${nome} tem ${idade} e possui matricula: ${matricula}`);
console.log(`${nome} agora tem `, idade += 1);
console.log(typeof nome);
console.log(typeof idade);
console.log(typeof matricula);
//========================================================================================//





































function mostrarFuncao(){
    const preco = document.getElementById("preco").value;
    const desconto = document.getElementById("desconto").value;

     console.log("Preço:", preco);
    console.log("Desconto:", desconto);
}
const botao = document.getElementById("calcularDesconto");

botao.addEventListener("onclik", mostrarFuncao());



























// ============================================================
// EXERCÍCIO 03 — Contador de curtidas
// ============================================================

let contador = 0;
const campo = document.getElementById("curtidas");

function funcaoCurtir() {
    contador += 1;
    campo.textContent = "Curtidas: " + contador;
    if(contador >= 10){
        campo.style.color = "green";
    }
}

function descurtir(){
    contador -= 1;
    campo.textContent = "Curtidas: " + contador;
}





























// ============================================================
// EXERCÍCIO 04 — Lista de convidados
// ============================================================

function adicionarConvidado() {
    const convidado = document.getElementById("convidado").value;//Input da DOM
    const adicionar = document.getElementById("adicionar");//button da DOM
     const lista = document.getElementById("lista-convidados");

    if (convidado === "") {
        console.log("O nome foi: null");
        return; 
    }

   
}









































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







