const URL_API = "https://brasilapi.com.br/api";
const campoAno = document.getElementById("campo-ano");
const botao = document.getElementById("botao-buscar");
const aviso = document.getElementById("aviso");
const tabela = document.getElementById("tabela-feriados");
const total = document.getElementById("total");

function formatarData(data) {
  const partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}
async function buscarFeriados() {
  const ano = campoAno.value;

  aviso.textContent = "Buscando...";
  botao.disabled = true;

  try {
    const resposta = await fetch(URL_API + "/feriados/v1/" + ano);
    const dados = await resposta.json();

    if (!resposta.ok) {

      aviso.textContent = "Erro " + resposta.status + ": " + dados.message;
      tabela.innerHTML = "";
      total.textContent = "";
    } else {
     
      let html = "";

      for (const feriado of dados) {
        html =
          html +
          "<tr>" +
          "<td>" + formatarData(feriado.date) + "</td>" +
          "<td>" + feriado.weekday + "</td>" +
          "<td>" + feriado.name + "</td>" +
          "</tr>";
      }
      tabela.innerHTML = html;
      total.textContent = dados.length + " feriados nacionais em " + ano;
      aviso.textContent = "";
    }
  } catch (erro) {
    aviso.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }
  botao.disabled = false;
}
botao.addEventListener("click", buscarFeriados);
buscarFeriados();