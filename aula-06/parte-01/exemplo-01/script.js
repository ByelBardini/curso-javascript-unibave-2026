// O localStorage é um "cantinho" do navegador onde podemos guardar textos.
// Diferente de uma variável, o que fica nele NÃO some quando a página é
// recarregada ou fechada.
//
// Ele funciona com pares de chave e valor:
//   localStorage.setItem("chave", "valor")  -> guarda
//   localStorage.getItem("chave")           -> busca (ou null se não existir)
//   localStorage.removeItem("chave")        -> apaga

const mensagem = document.getElementById("mensagem");
const inputNome = document.getElementById("nome");
const botaoSalvar = document.getElementById("salvar");
const botaoApagar = document.getElementById("apagar");

function mostrarNome() {
  const nome = localStorage.getItem("nome");

  if (nome) {
    mensagem.textContent = "Olá, " + nome + "!";
  } else {
    mensagem.textContent = "Nenhum nome salvo.";
  }
}

botaoSalvar.addEventListener("click", function () {
  localStorage.setItem("nome", inputNome.value);
  inputNome.value = "";
  mostrarNome();
});

botaoApagar.addEventListener("click", function () {
  localStorage.removeItem("nome");
  mostrarNome();
});

// Assim que a página abre, já mostra o nome que estava salvo
mostrarNome();

// Dá para ver o que está salvo em: F12 > Application > Local Storage
