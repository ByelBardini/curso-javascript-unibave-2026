// O exemplo 01 confiava que a resposta ia chegar rápido e sem erro. Na vida
// real a internet demora e a API pode recusar o pedido, então uma página com
// AJAX precisa mostrar ao usuário o que está acontecendo:
//
//   1. antes do fetch()  -> avisa "Buscando..." e desabilita o botão
//   2. deu erro na API   -> mostra a mensagem que a API mandou
//   3. deu certo         -> desenha os dados na página
//   4. no final          -> habilita o botão de novo
//
// Para ver o "Buscando..." com calma: F12 > aba Network (Rede) > troque
// "No throttling" por "Slow 4G" e clique em Buscar.
//
// API usada: https://brasilapi.com.br/docs (a mesma da aula 04)

const URL_API = "https://brasilapi.com.br/api";

const campoAno = document.getElementById("campo-ano");
const botao = document.getElementById("botao-buscar");
const aviso = document.getElementById("aviso");
const tabela = document.getElementById("tabela-feriados");
const total = document.getElementById("total");

// --------------------------------------------------------------------- //
// Função que só transforma dados: não mexe na tela
// --------------------------------------------------------------------- //

// A API manda a data como "2026-04-21". O split("-") separa nos traços e
// devolve o array ["2026", "04", "21"], que vira "21/04/2026".
function formatarData(data) {
  const partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// --------------------------------------------------------------------- //
// Função que fala com a API e atualiza a tela
// --------------------------------------------------------------------- //

async function buscarFeriados() {
  const ano = campoAno.value;

  // 1. Antes de chamar a API: avisa e impede um segundo clique enquanto espera
  aviso.textContent = "Buscando...";
  botao.disabled = true;

  try {
    const resposta = await fetch(URL_API + "/feriados/v1/" + ano);
    const dados = await resposta.json();

    if (!resposta.ok) {
      // 2. A API respondeu, mas com erro. Teste com o ano 1800: o status é
      // 404 e a API explica o motivo no campo "message".
      aviso.textContent = "Erro " + resposta.status + ": " + dados.message;
      tabela.innerHTML = "";
      total.textContent = "";
    } else {
      // 3. Deu certo: dados é um array de feriados, um objeto por linha
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

      // Só a tabela muda: a página não recarrega
      tabela.innerHTML = html;
      total.textContent = dados.length + " feriados nacionais em " + ano;
      aviso.textContent = "";
    }
  } catch (erro) {
    // Nem chegou resposta: sem internet, endereço errado, servidor fora do ar...
    aviso.textContent = "Não foi possível falar com a API.";
    console.log(erro);
  }

  // 4. Fora do try/catch: roda dando certo ou errado
  botao.disabled = false;
}

botao.addEventListener("click", buscarFeriados);

// Já mostra os feriados do ano que está no campo quando a página abre
buscarFeriados();
