// API (Application Programming Interface) é um sistema que fica em outro
// computador e responde pedidos pela internet, devolvendo dados em JSON.
//
// É o mesmo fetch() da parte 01, só que em vez de "produtos.json" da pasta
// passamos o endereço (URL) de um servidor.
//
// API usada: https://brasilapi.com.br/docs
// Ela junta várias informações públicas do Brasil: CEP, DDD, feriados,
// bancos, CNPJ, cidades do IBGE...

const URL_API = "https://brasilapi.com.br/api";

// --------------------------------------------------------------------- //
// 1. Buscar um endereço pelo CEP
// --------------------------------------------------------------------- //

// Quando o fetch() recebe só o endereço, ele faz um GET: o método HTTP
// usado para BUSCAR dados. O CEP vai no final da URL.
async function buscarCep(cep) {
  const resposta = await fetch(URL_API + "/cep/v1/" + cep);
  const endereco = await resposta.json();

  console.log("Resposta completa:", endereco);
  console.log("Rua:", endereco.street);
  console.log("Bairro:", endereco.neighborhood);
  console.log("Cidade:", endereco.city + " - " + endereco.state);
}

// --------------------------------------------------------------------- //
// 2. Cidades de um DDD
// --------------------------------------------------------------------- //

async function buscarDdd(ddd) {
  const resposta = await fetch(URL_API + "/ddd/v1/" + ddd);
  const dados = await resposta.json();

  // dados.cities é um array de textos
  console.log("DDD " + ddd + " é do estado:", dados.state);
  console.log("Quantidade de cidades:", dados.cities.length);
  console.log("Usa o DDD " + ddd + " em Tubarão?", dados.cities.includes("TUBARÃO"));
}

// --------------------------------------------------------------------- //
// 3. Feriados nacionais de um ano
// --------------------------------------------------------------------- //

// Aqui a API devolve um array de objetos: dá para percorrer com for...of
async function buscarFeriados(ano) {
  const resposta = await fetch(URL_API + "/feriados/v1/" + ano);
  const feriados = await resposta.json();

  console.log("Feriados de " + ano + ":", feriados);

  for (const feriado of feriados) {
    console.log(feriado.date + " (" + feriado.weekday + ") - " + feriado.name);
  }
}

// --------------------------------------------------------------------- //
// 4. Dados de um estado e suas cidades (IBGE)
// --------------------------------------------------------------------- //

async function buscarEstado(sigla) {
  const resposta = await fetch(URL_API + "/ibge/uf/v1/" + sigla);
  const estado = await resposta.json();

  console.log("Estado:", estado);
  console.log("Capital:", estado.capital);

  // Objetos podem ter outros objetos dentro
  console.log("Região:", estado.regiao.nome);
}

async function buscarCidades(sigla) {
  const resposta = await fetch(URL_API + "/ibge/municipios/v1/" + sigla);
  const cidades = await resposta.json();

  console.log(sigla + " tem " + cidades.length + " cidades.");
  console.log("As 5 primeiras:", cidades.slice(0, 5));
}

// --------------------------------------------------------------------- //
// 5. Banco pelo código e empresa pelo CNPJ
// --------------------------------------------------------------------- //

async function buscarBanco(codigo) {
  const resposta = await fetch(URL_API + "/banks/v1/" + codigo);
  const banco = await resposta.json();

  console.log("Banco " + codigo + ":", banco.fullName);
}

// O CNPJ vai só com números, sem pontos, barra e traço
async function buscarCnpj(cnpj) {
  const resposta = await fetch(URL_API + "/cnpj/v1/" + cnpj);
  const empresa = await resposta.json();

  console.log("Empresa:", empresa);
  console.log("Razão social:", empresa.razao_social);
  console.log("Cidade:", empresa.municipio + " - " + empresa.uf);
  console.log("Atividade:", empresa.cnae_fiscal_descricao);
}

// --------------------------------------------------------------------- //
// Executando
// --------------------------------------------------------------------- //

// Cada await espera a função anterior terminar, assim os resultados
// aparecem no console na ordem certa.
async function executar() {
  console.log("===== 1. CEP =====");
  await buscarCep("88811500");

  console.log("===== 2. DDD =====");
  await buscarDdd(48);

  console.log("===== 3. Feriados =====");
  await buscarFeriados(2026);

  console.log("===== 4. Estado e cidades =====");
  await buscarEstado("SC");
  await buscarCidades("SC");

  console.log("===== 5. Banco e CNPJ =====");
  await buscarBanco(1);
  await buscarCnpj("00000000000191");
}

executar();

// As funções também podem ser chamadas direto no console, por exemplo:
//   buscarCep("01001000")
//   buscarDdd(11)
//   buscarEstado("RS")
