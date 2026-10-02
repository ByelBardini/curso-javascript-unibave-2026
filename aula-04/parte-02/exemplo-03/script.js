// A BrasilAPI só deixa CONSULTAR. Além de buscar, uma API também pode
// deixar CRIAR, ALTERAR e APAGAR dados. Quem diz o que queremos fazer é o
// MÉTODO HTTP:
//
//   GET    -> buscar     (é o padrão do fetch, usado nos exemplos 01 e 02)
//   POST   -> criar
//   PUT    -> alterar (substitui tudo)
//   PATCH  -> alterar (só os campos enviados)
//   DELETE -> apagar
//
// Aqui usamos uma API que grava de verdade, para ver o GET trazendo o que
// mudou depois de cada POST, PUT, PATCH e DELETE.
//
// API usada: https://restful-api.dev
// Ela guarda "objetos" com um nome e um campo "data" livre, onde cabe
// qualquer coisa. O que você criar fica salvo no servidor dela.
//
// O fluxo completo de criar, ler, alterar e apagar tem nome: CRUD
//   Create (POST) - Read (GET) - Update (PUT) - Delete (DELETE)

const URL_API = "https://api.restful-api.dev/objects";

// Função auxiliar: faz o GET de um objeto e mostra no console.
// Será chamada depois de cada alteração, para conferir o que foi salvo.
async function conferir(id) {
  const resposta = await fetch(URL_API + "/" + id);
  const dados = await resposta.json();

  console.log("   GET /objects/" + id + " -> status " + resposta.status, dados);
  return dados;
}

// --------------------------------------------------------------------- //
// C - CREATE (POST)
// --------------------------------------------------------------------- //

async function criar(nome, preco, quantidade) {
  // O fetch recebe um segundo parâmetro: um objeto com as configurações
  const resposta = await fetch(URL_API, {
    method: "POST",

    // Avisa o servidor que o corpo da requisição é um JSON
    headers: { "Content-Type": "application/json" },

    // O corpo precisa ser TEXTO: JSON.stringify() transforma o objeto
    body: JSON.stringify({
      name: nome,
      data: { preco: preco, quantidade: quantidade },
    }),
  });

  const criado = await resposta.json();
  console.log("POST -> criado com o id " + criado.id, criado);

  // Precisamos guardar o id: é ele que identifica o objeto nas próximas
  // chamadas (o id é gerado pelo servidor, não por nós)
  return criado.id;
}

// --------------------------------------------------------------------- //
// U - UPDATE (PUT e PATCH)
// --------------------------------------------------------------------- //

// PUT SUBSTITUI o objeto inteiro: o que não for enviado é perdido
async function substituir(id, nome, preco, quantidade) {
  const resposta = await fetch(URL_API + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nome,
      data: { preco: preco, quantidade: quantidade },
    }),
  });

  console.log("PUT -> resposta da API:", await resposta.json());
}

// PATCH altera só os campos enviados, o resto fica como estava
async function renomear(id, novoNome) {
  const resposta = await fetch(URL_API + "/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: novoNome }),
  });

  console.log("PATCH -> resposta da API:", await resposta.json());
}

// --------------------------------------------------------------------- //
// D - DELETE
// --------------------------------------------------------------------- //

// O DELETE não precisa de body: o endereço já diz qual objeto apagar
async function apagar(id) {
  const resposta = await fetch(URL_API + "/" + id, { method: "DELETE" });

  console.log("DELETE -> resposta da API:", await resposta.json());
}

// --------------------------------------------------------------------- //
// Executando o CRUD completo, com um GET depois de cada passo
// --------------------------------------------------------------------- //

async function executar() {
  try {
    console.log("===== 1. Criando =====");
    const id = await criar("Teclado Mecânico", 250, 10);
    await conferir(id);

    console.log("===== 2. Alterando preço e estoque com PUT =====");
    await substituir(id, "Teclado Mecânico", 199.9, 8);
    const depoisDoPut = await conferir(id);
    console.log("   Preço agora:", depoisDoPut.data.preco); // 199.9

    console.log("===== 3. Trocando só o nome com PATCH =====");
    await renomear(id, "Teclado Mecânico RGB");
    const depoisDoPatch = await conferir(id);
    console.log("   O preço continuou?", depoisDoPatch.data.preco); // 199.9

    console.log("===== 4. Apagando =====");
    await apagar(id);
    await conferir(id); // agora o status é 404: não existe mais
  } catch (erro) {
    console.log("Não foi possível falar com a API:", erro.message);
  }
}

executar();

// Também dá para testar passo a passo pelo console:
//   const id = await criar("Monitor", 900, 3)
//   await conferir(id)
//   await substituir(id, "Monitor 24 polegadas", 850, 3)
//   await conferir(id)
//   await apagar(id)
