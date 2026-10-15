// O localStorage só guarda TEXTO. Se tentarmos salvar um array direto,
// ele vira algo como "Arroz,Feijão" e perdemos o formato de array.
//
// Para resolver isso usamos o JSON:
//   JSON.stringify(array) -> transforma o array em texto  (para SALVAR)
//   JSON.parse(texto)     -> transforma o texto em array  (para BUSCAR)

const inputItem = document.getElementById("item");
const botaoAdicionar = document.getElementById("adicionar");
const botaoLimpar = document.getElementById("limpar");
const lista = document.getElementById("lista");

// Busca o que já estava salvo. Na primeira vez não existe nada (null),
// então começamos com um array vazio.
const textoSalvo = localStorage.getItem("itens");
let itens = [];

if (textoSalvo) {
  itens = JSON.parse(textoSalvo);
}

function salvar() {
  localStorage.setItem("itens", JSON.stringify(itens));
}

function mostrarLista() {
  lista.innerHTML = "";

  for (const item of itens) {
    const li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  }
}

botaoAdicionar.addEventListener("click", function () {
  if (inputItem.value === "") {
    return;
  }

  itens.push(inputItem.value);
  salvar();
  mostrarLista();

  inputItem.value = "";
});

botaoLimpar.addEventListener("click", function () {
  itens = [];
  localStorage.removeItem("itens");
  mostrarLista();
});

// Assim que a página abre, já mostra os itens que estavam salvos
mostrarLista();

// Em F12 > Application > Local Storage dá para ver o array salvo como texto:
//   ["Arroz","Feijão","Café"]
