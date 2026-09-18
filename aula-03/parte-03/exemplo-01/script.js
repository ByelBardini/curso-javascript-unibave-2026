// JSON é só um TEXTO escrito no formato de objeto/array do JavaScript.
// É assim que os dados viajam entre sistemas e ficam salvos em arquivo.
//
// Regras do JSON que são diferentes do objeto JavaScript:
//   - toda chave vai entre aspas duplas: "nome": "Mouse"
//   - só aspas duplas, nunca simples
//   - não existe vírgula sobrando no último item
//   - não existem comentários dentro do arquivo

// Começa vazio: quem preenche é a leitura do arquivo
let produtos = [];

// --------------------------------------------------------------------- //
// 1. LER o arquivo
// --------------------------------------------------------------------- //

// async/await: ler um arquivo demora, então o await espera a resposta
// chegar antes de seguir para a próxima linha.
async function carregarArquivo() {
  // fetch() busca o arquivo, como o navegador faz com uma imagem ou um CSS
  const resposta = await fetch("produtos.json");

  // .json() pega o TEXTO que veio e transforma em array/objeto de verdade
  produtos = await resposta.json();

  console.log("Conteúdo lido do arquivo:", produtos);
  console.log("É um array?", Array.isArray(produtos)); // true
  console.log("Primeiro produto:", produtos[0].nome);

  mostrarMensagem("Arquivo carregado: " + produtos.length + " produtos.");
  atualizarTela();
}

// --------------------------------------------------------------------- //
// 2. ALTERAR os dados (na memória)
// --------------------------------------------------------------------- //

// Depois do fetch, produtos é um array de objetos comum: tudo o que foi
// visto na parte 02 vale aqui do mesmo jeito.
function procurarPorNome(nome) {
  for (const produto of produtos) {
    if (produto.nome === nome) {
      return produto;
    }
  }

  return null;
}

function alterarPreco() {
  const nome = document.getElementById("campo-nome").value;
  const novoPreco = Number(document.getElementById("campo-preco").value);

  const produto = procurarPorNome(nome);

  if (produto === null) {
    mostrarMensagem(nome + " não foi encontrado. Carregou o arquivo?");
    return;
  }

  if (novoPreco <= 0) {
    mostrarMensagem("Digite um preço maior que zero.");
    return;
  }

  const precoAntigo = produto.preco;
  produto.preco = novoPreco;

  mostrarMensagem(
    produto.nome + ": preço alterado de R$ " + precoAntigo + " para R$ " + novoPreco + "."
  );
  atualizarTela();
}

function aumentarEstoque() {
  const nome = document.getElementById("campo-nome").value;
  const produto = procurarPorNome(nome);

  if (produto === null) {
    mostrarMensagem(nome + " não foi encontrado. Carregou o arquivo?");
    return;
  }

  produto.quantidade = produto.quantidade + 10;

  mostrarMensagem(produto.nome + " agora tem " + produto.quantidade + " unidades.");
  atualizarTela();
}

// --------------------------------------------------------------------- //
// 3. SALVAR o arquivo alterado
// --------------------------------------------------------------------- //

// IMPORTANTE: por segurança, o navegador NÃO deixa o JavaScript gravar por
// cima de um arquivo do seu computador. O que dá para fazer é gerar o
// arquivo novo e oferecer o download. Quem grava no disco é o usuário.
function baixarArquivo() {
  if (produtos.length === 0) {
    mostrarMensagem("Carregue o arquivo antes de baixar.");
    return;
  }

  // JSON.stringify() faz o caminho contrário do .json(): transforma o
  // array/objeto de volta em TEXTO. O null e o 2 servem para indentar
  // com 2 espaços, deixando o arquivo legível para uma pessoa.
  const texto = JSON.stringify(produtos, null, 2);

  // Blob é o "arquivo em memória" que será entregue ao download
  const arquivo = new Blob([texto], { type: "application/json" });

  // Criamos um link invisível apontando para esse arquivo e clicamos nele
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "produtos.json";
  link.click();

  mostrarMensagem("Arquivo gerado. Substitua o produtos.json da pasta pelo baixado.");
}

// --------------------------------------------------------------------- //
// Funções que só mexem na tela
// --------------------------------------------------------------------- //

function atualizarTela() {
  let html = "";

  for (const produto of produtos) {
    html =
      html +
      "<tr>" +
      "<td>" + produto.nome + "</td>" +
      "<td>R$ " + produto.preco.toFixed(2) + "</td>" +
      "<td>" + produto.quantidade + "</td>" +
      "</tr>";
  }

  document.getElementById("corpo-tabela").innerHTML = html;

  // Mostra na página exatamente o texto que será salvo no arquivo
  document.getElementById("json").textContent = JSON.stringify(produtos, null, 2);
}

function mostrarMensagem(texto) {
  document.getElementById("mensagem").textContent = texto;
}

//-------------------------------------------------------------------------//

// JSON.parse() é o par do JSON.stringify(): texto -> objeto.
// É o que o .json() do fetch faz por baixo dos panos.
const textoDeExemplo = '{ "nome": "Mouse", "preco": 80 }';
const objetoDeExemplo = JSON.parse(textoDeExemplo);

console.log("Texto JSON:", textoDeExemplo, typeof textoDeExemplo); // string
console.log("Objeto:", objetoDeExemplo, typeof objetoDeExemplo); // object
console.log("Acessando:", objetoDeExemplo.nome); // Mouse
