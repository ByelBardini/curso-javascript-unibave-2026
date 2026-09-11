// textContent troca apenas o TEXTO que aparece dentro do elemento
function trocaTexto() {
  const novoTitulo = document.getElementById("campo").value;
  document.getElementById("titulo").textContent = novoTitulo;
}

// style permite mudar o CSS do elemento direto pelo JavaScript
function trocaCor() {
  const titulo = document.getElementById("titulo");
  titulo.style.color = "blue";
  titulo.style.fontStyle = "italic";
}

// innerHTML troca o conteúdo interpretando as tags HTML
function trocaHtml() {
  const paragrafo = document.getElementById("paragrafo");
  paragrafo.innerHTML = "Agora com <b>negrito</b> e <i>itálico</i>!";
}

// display "none" some com o elemento, "block" mostra de novo
function esconde() {
  const paragrafo = document.getElementById("paragrafo");

  if (paragrafo.style.display === "none") {
    paragrafo.style.display = "block";
  } else {
    paragrafo.style.display = "none";
  }
}
