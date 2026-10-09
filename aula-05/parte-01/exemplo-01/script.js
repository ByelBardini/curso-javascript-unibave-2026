
async function buscarCep() {
  const cep = document.getElementById("campo-cep").value;

  const resposta = await fetch("https://brasilapi.com.br/api/cep/v1/" + cep);
  const endereco = await resposta.json();

  
  document.getElementById("campo-rua").value = endereco.street;
  document.getElementById("campo-bairro").value = endereco.neighborhood;
  document.getElementById("campo-cidade").value = endereco.city;
  document.getElementById("campo-estado").value = endereco.state;
}
