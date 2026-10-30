const API = "https://exemplosapi.evolutivasistemas.com.br/api/gabriel-camilo";

async function listarProdutos() {
  const resposta = await fetch(`${API}/produtos`);
  const produtos = await resposta.json(); // array de objetos

  produtos.forEach((produto) => {
    console.log(produto.id, produto.nome, produto.preco);
  });}
  async function name(params) {
    
  }
    listarProdutos();