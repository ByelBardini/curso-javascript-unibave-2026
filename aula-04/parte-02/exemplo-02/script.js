// No exemplo 01 tudo deu certo. Aqui vemos:
//   - o que fazer quando a API responde com erro
//   - como usar a resposta de uma chamada para fazer a próxima
//   - como filtrar e calcular em cima dos dados que chegaram
//
// API usada: https://brasilapi.com.br/docs

const URL_API = "https://brasilapi.com.br/api";

// --------------------------------------------------------------------- //
// 1. Tratando erros
// --------------------------------------------------------------------- //

// resposta.ok é true quando o servidor respondeu com sucesso (status 200 a
// 299). resposta.status traz o número: 200 = ok, 400 = pedido inválido,
// 404 = não encontrado, 500 = erro no servidor...
//
// try/catch pega o erro quando nem há resposta (sem internet, endereço
// errado), para o programa não parar de funcionar.
async function buscarCepComTratamento(cep) {
  try {
    const resposta = await fetch(URL_API + "/cep/v1/" + cep);
    const dados = await resposta.json();

    console.log("CEP " + cep + " -> status " + resposta.status);

    if (!resposta.ok) {
      // Mesmo no erro a BrasilAPI manda um JSON explicando o que houve
      console.log("Erro:", dados.message);
      return null;
    }

    console.log("Encontrado:", dados.city + " - " + dados.state);
    return dados;
  } catch (erro) {
    console.log("Não foi possível falar com a API:", erro.message);
    return null;
  }
}

// --------------------------------------------------------------------- //
// 2. Uma chamada depois da outra
// --------------------------------------------------------------------- //

// A resposta do CEP traz a sigla do estado. Com ela fazemos um segundo
// GET para descobrir mais sobre esse estado.
async function detalharCep(cep) {
  const endereco = await buscarCepComTratamento(cep);

  if (endereco === null) {
    return;
  }

  const resposta = await fetch(URL_API + "/ibge/uf/v1/" + endereco.state);
  const estado = await resposta.json();

  console.log(
    endereco.city +
      " fica em " +
      estado.nome +
      ", região " +
      estado.regiao.nome +
      ", capital " +
      estado.capital +
      ".",
  );
}

// --------------------------------------------------------------------- //
// 3. Filtrando os dados que chegaram
// --------------------------------------------------------------------- //

// Depois do .json() é um array comum: dá para usar if, for, contadores...
async function feriadosNoFimDeSemana(ano) {
  const resposta = await fetch(URL_API + "/feriados/v1/" + ano);
  const feriados = await resposta.json();

  let quantidade = 0;

  for (const feriado of feriados) {
    if (feriado.weekday === "sábado" || feriado.weekday === "domingo") {
      console.log("Caiu no fim de semana: " + feriado.name + " (" + feriado.date + ")");
      quantidade = quantidade + 1;
    }
  }

  console.log(
    "Em " + ano + ", " + quantidade + " de " + feriados.length + " feriados caem no fim de semana.",
  );
}

// Procura cidades de um estado que comecem com um texto
async function procurarCidades(sigla, inicio) {
  const resposta = await fetch(URL_API + "/ibge/municipios/v1/" + sigla);
  const cidades = await resposta.json();

  const encontradas = [];

  for (const cidade of cidades) {
    if (cidade.nome.startsWith(inicio.toUpperCase())) {
      encontradas.push(cidade.nome);
    }
  }

  console.log("Cidades de " + sigla + " que começam com " + inicio + ":", encontradas);
}

// --------------------------------------------------------------------- //
// 4. Fazendo contas com o resultado: cotação do dólar
// --------------------------------------------------------------------- //

// A data vai no formato AAAA-MM-DD. Para uma data futura não existe
// cotação, então a API responde com erro.
async function converterDolar(valorEmDolar, data) {
  const resposta = await fetch(URL_API + "/cambio/v1/cotacao/USD/" + data);
  const dados = await resposta.json();

  if (!resposta.ok) {
    console.log("Sem cotação para " + data + " (status " + resposta.status + "):", dados.message);
    return;
  }

  // A API traz várias cotações do dia: pegamos a última do array
  const ultima = dados.cotacoes[dados.cotacoes.length - 1];
  const valorEmReais = valorEmDolar * ultima.cotacao_venda;

  console.log("Dólar em " + data + ": R$ " + ultima.cotacao_venda);
  console.log("US$ " + valorEmDolar + " = R$ " + valorEmReais.toFixed(2));
}

// --------------------------------------------------------------------- //
// Executando
// --------------------------------------------------------------------- //

async function executar() {
  console.log("===== 1. Tratando erros =====");
  await buscarCepComTratamento("01001000");
  await buscarCepComTratamento("00000000");
  await buscarCepComTratamento("abc");

  console.log("===== 2. Uma chamada depois da outra =====");
  await detalharCep("88750000");

  console.log("===== 3. Filtrando =====");
  await feriadosNoFimDeSemana(2026);
  await procurarCidades("SC", "São");

  console.log("===== 4. Cotação do dólar =====");
  await converterDolar(100, "2026-09-30");
  await converterDolar(100, "2030-01-10"); // data futura: erro
}

executar();
