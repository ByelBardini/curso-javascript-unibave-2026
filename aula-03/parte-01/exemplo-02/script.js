const alunos = ["Ana", "Bruno", "Carla", "Daniel", "Eduarda"];

// Pegamos o elemento da página uma única vez, antes do laço
const lista = document.getElementById("lista-alunos");

// O for vai do índice 0 até o último, somando 1 por volta
for (let i = 0; i < alunos.length; i++) {
  console.log("Índice", i, "->", alunos[i]);

  // createElement cria uma tag nova, que ainda não está na página
  const item = document.createElement("li");

  // textContent coloca o texto dentro do <li>
  item.textContent = i + 1 + "º - " + alunos[i];

  // appendChild é o que realmente joga o <li> dentro do <ul>
  lista.appendChild(item);
}

document.getElementById("total").textContent =
  "Total de alunos: " + alunos.length;

//-------------------------------------------------------------------------//

// Outra forma de percorrer: o for...of entrega o VALOR, sem falar de índice
for (const aluno of alunos) {
  console.log("Aluno:", aluno);
}

//-------------------------------------------------------------------------//

// Terceira forma de escrever na página: montar o HTML em uma string
const notas = [8.5, 6, 9.75, 4.5, 10];
let html = "";

for (let i = 0; i < notas.length; i++) {
  html = html + "<li>" + alunos[i] + ": nota " + notas[i] + "</li>";
}

// Aqui o innerHTML recebe tudo de uma vez, já com as tags <li>
document.getElementById("lista-notas").innerHTML = html;
