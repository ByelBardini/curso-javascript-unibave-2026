// Na aula passada o array guardava textos soltos: ["Ana", "Bruno"].
// O problema é que cada aluno tem mais de uma informação.
// A solução é um ARRAY DE OBJETOS: uma lista onde cada item é um objeto.
const alunos = [
  { nome: "Ana", idade: 20, nota: 8.5 },
  { nome: "Bruno", idade: 22, nota: 6 },
  { nome: "Carla", idade: 19, nota: 9.75 },
  { nome: "Daniel", idade: 25, nota: 4.5 },
  { nome: "Eduarda", idade: 21, nota: 10 },
];

// Primeiro o índice do array, depois o nome da propriedade
console.log("Primeiro aluno:", alunos[0]); // o objeto inteiro
console.log("Nome do primeiro:", alunos[0].nome); // Ana
console.log("Nota do último:", alunos[alunos.length - 1].nota); // 10

//-------------------------------------------------------------------------//

const lista = document.getElementById("lista-alunos");

// O for percorre as POSIÇÕES do array, como já fizemos na parte 01
for (let i = 0; i < alunos.length; i++) {
  // Guardar o objeto da vez em uma variável deixa o código mais curto
  const aluno = alunos[i];

  console.log("Índice", i, "->", aluno.nome, "nota", aluno.nota);

  const item = document.createElement("li");
  item.textContent = aluno.nome + " (" + aluno.idade + " anos) - nota " + aluno.nota;

  lista.appendChild(item);
}

//-------------------------------------------------------------------------//

// O for...of entrega o OBJETO direto, sem falar de índice.
// Aqui ele é usado só para somar as notas e calcular a média.
let soma = 0;

for (const aluno of alunos) {
  soma = soma + aluno.nota;
}

const media = soma / alunos.length;

document.getElementById("media").textContent =
  "Média da turma: " + media.toFixed(2);

//-------------------------------------------------------------------------//

// Montando o HTML em uma string, agora com uma <tr> por objeto
let html = "";

for (const aluno of alunos) {
  // A situação não está guardada no objeto: ela é CALCULADA a partir da nota
  let situacao = "Reprovado";

  if (aluno.nota >= 7) {
    situacao = "Aprovado";
  }

  html =
    html +
    "<tr>" +
    "<td>" + aluno.nome + "</td>" +
    "<td>" + aluno.idade + "</td>" +
    "<td>" + aluno.nota + "</td>" +
    "<td>" + situacao + "</td>" +
    "</tr>";
}

document.getElementById("corpo-tabela").innerHTML = html;
