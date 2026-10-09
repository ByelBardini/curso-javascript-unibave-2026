// AJAX é buscar dados no servidor e mostrar na página SEM RECARREGAR.
//
//   1. o usuário clica no botão
//   2. o fetch() busca os dados na API
//   3. o resultado é colocado na página pelo DOM
//
// Ou seja: AJAX = fetch() da parte 02 + DOM.
//
// API usada: https://brasilapi.com.br/docs

async function buscarCep() {
  const cep = document.getElementById("campo-cep").value;

  const resposta = await fetch("https://brasilapi.com.br/api/cep/v1/" + cep);
  const endereco = await resposta.json();

  // Só os campos mudam, o resto da página continua igual
  document.getElementById("campo-rua").value = endereco.street;
  document.getElementById("campo-bairro").value = endereco.neighborhood;
  document.getElementById("campo-cidade").value = endereco.city;
  document.getElementById("campo-estado").value = endereco.state;
}
