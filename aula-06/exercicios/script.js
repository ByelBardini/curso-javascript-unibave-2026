// ============================================================
// AULA 06 — EXERCÍCIOS
// ============================================================

// ============================================================
// EXERCÍCIO 01 — Contador de visitas e tema escuro
//
//   localStorage.setItem("chave", "valor")
//   localStorage.getItem("chave")
//   localStorage.removeItem("chave")
// ============================================================

// Elementos do exercício: os parágrafos recebem as mensagens, e os
// botões vão executar as funções que ligaremos ao evento "click".
const textoVisitas = document.getElementById("textoVisitas");
const textoUltimaVisita = document.getElementById("textoUltimaVisita");
const botaoZerar = document.getElementById("zerarVisitas");
const botaoTema = document.getElementById("alternarTema");

// 1. Conta a abertura da página (inclusive quando apertamos F5).
// getItem devolve texto: "3" precisa virar o número 3 antes da soma.
// Quando a chave não existe, devolve null, e Number(null) vale 0.
// Depois de somar, setItem guarda a nova contagem como texto novamente.
let visitas = Number(localStorage.getItem("visitas"));
visitas = visitas + 1;
localStorage.setItem("visitas", visitas);

// Copia a contagem para o parágrafo. Esta função só atualiza a tela:
// chamá-la de novo não registra outra visita no localStorage.
function mostrarVisitas() {
  if (visitas === 1) {
    textoVisitas.textContent = "Primeira visita, seja bem-vindo!";
  } else {
    textoVisitas.textContent = "Você abriu esta página " + visitas + " vezes.";
  }
}

// Zerar envolve três lugares: apaga o valor salvo, zera a variável desta
// página e atualiza o parágrafo. Na próxima abertura, a contagem será 1.
botaoZerar.addEventListener("click", function () {
  localStorage.removeItem("visitas");
  visitas = 0;
  mostrarVisitas();
});

// 2. Recupera o tema escolhido na visita anterior.
// A classe "escuro" ativa as regras de body.escuro no style.css.
// Se não houver tema salvo ou ele for "claro", fica o estilo padrão do HTML.
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "escuro") {
  document.body.classList.add("escuro");
}

// A cada clique, toggle adiciona a classe se ela não existe ou a remove
// se já existe. contains consulta o resultado para salvar o tema aplicado.
botaoTema.addEventListener("click", function () {
  document.body.classList.toggle("escuro");

  if (document.body.classList.contains("escuro")) {
    localStorage.setItem("tema", "escuro");
  } else {
    localStorage.setItem("tema", "claro");
  }
});

// 3. Desafio: mostra a data da visita ANTERIOR.
// A ordem importa: se salvássemos a data de agora antes desta leitura,
// o parágrafo mostraria a visita atual e perderíamos a anterior.
const ultimaVisita = localStorage.getItem("ultimaVisita");

if (ultimaVisita) {
  textoUltimaVisita.textContent = "Sua última visita foi em " + ultimaVisita;
} else {
  textoUltimaVisita.textContent = "Nenhuma visita anterior registrada.";
}

// new Date() representa o instante atual. toLocaleString() o transforma
// em um texto com data e hora no formato configurado no navegador.
// Este valor será lido como a visita anterior na próxima abertura.
localStorage.setItem("ultimaVisita", new Date().toLocaleString());
// Preenche o parágrafo que estava vazio no HTML ao carregar a página.
mostrarVisitas();

// ============================================================
// EXERCÍCIO 02 — Lista de tarefas
//
//   JSON.stringify(array) -> texto, para salvar
//   JSON.parse(texto)     -> array, para buscar
// ============================================================

// Elementos da lista: o campo fornece o texto, os botões recebem eventos
// e a lista e o parágrafo de total serão preenchidos pelo JavaScript.
const campoTarefa = document.getElementById("textoTarefa");
const botaoAdicionar = document.getElementById("adicionarTarefa");
const botaoLimpar = document.getElementById("limparConcluidas");
const listaTarefas = document.getElementById("listaTarefas");
const totalTarefas = document.getElementById("totalTarefas");
const botaoTodas = document.getElementById("filtroTodas");
const botaoPendentes = document.getElementById("filtroPendentes");
const botaoConcluidas = document.getElementById("filtroConcluidas");

// 1. Recupera os dados ao abrir a página.
// O array tarefas é a fonte da verdade: é nele que vamos adicionar,
// concluir e excluir. O localStorage guarda uma cópia para a próxima visita.
// Exemplo do texto salvo: '[{"texto":"Estudar","feita":false}]'.
const tarefasSalvas = localStorage.getItem("tarefas");
let tarefas = [];

// Sem chave salva, tarefas continua sendo []. Quando existe texto salvo,
// JSON.parse reconstrói o array e os objetos para podermos trabalhar neles.
if (tarefasSalvas) {
  tarefas = JSON.parse(tarefasSalvas);
}

// Desafio: recupera também qual grupo deve aparecer na tela.
// Sem escolha anterior (null), usamos "todas" como filtro inicial.
let filtro = localStorage.getItem("filtro");

if (!filtro) {
  filtro = "todas";
}

// 2. Salva o estado atual do array.
// JSON.stringify transforma o array de objetos em texto, o formato aceito
// pelo localStorage. Chamamos esta função depois de cada mudança nos dados.
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// 3. Redesenha a lista a partir dos dados e do filtro atual.
// A lista antiga é apagada para não duplicar os itens. O contador também
// recomeça em zero, pois será calculado novamente ao percorrer o array.
function mostrarTarefas() {
  listaTarefas.innerHTML = "";
  let concluidas = 0;

  for (let i = 0; i < tarefas.length; i++) {
    const tarefa = tarefas[i];

    // Conta ANTES de aplicar o filtro: o total deve considerar o array
    // inteiro, mesmo quando algumas tarefas não aparecem na tela.
    if (tarefa.feita) {
      concluidas = concluidas + 1;
    }

    // continue pula o restante desta volta do for e passa à próxima tarefa.
    // Em "pendentes", pula as feitas; em "concluidas", pula as não feitas.
    // Isso só muda a tela: nenhuma tarefa é removida do array.
    if (filtro === "pendentes" && tarefa.feita) {
      continue;
    }

    if (filtro === "concluidas" && !tarefa.feita) {
      continue;
    }

    // Cria um item ainda fora da página. textContent coloca o texto da
    // tarefa literalmente: se alguém digitar uma tag, ela aparece como texto.
    const li = document.createElement("li");
    li.textContent = tarefa.texto + " ";

    // A classe "feita" usa o CSS existente para riscar a tarefa concluída.
    if (tarefa.feita) {
      li.classList.add("feita");
    }

    // Cada botão recebe uma função para o clique. Ela só será executada
    // quando o usuário clicar, usando a posição i desta tarefa no array.
    // Com o filtro, o primeiro item visível pode estar na posição 3:
    // usar i garante que o botão altere a tarefa correta.
    const botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = "Concluir";
    botaoConcluir.addEventListener("click", function () {
      concluirTarefa(i);
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", function () {
      excluirTarefa(i);
    });

    // appendChild encaixa os elementos: primeiro os botões dentro do <li>,
    // depois o <li> dentro do <ul> da página. Agora o item aparece na tela.
    li.appendChild(botaoConcluir);
    li.appendChild(botaoExcluir);
    listaTarefas.appendChild(li);
  }

  // O numerador conta as feitas; o denominador é o total do array,
  // independentemente do filtro escolhido. Exemplo: "2 de 5 tarefas concluídas".
  totalTarefas.textContent =
    concluidas + " de " + tarefas.length + " tarefas concluídas";
}

// 4. Adiciona uma tarefa a partir do campo de texto.
function adicionarTarefa() {
  // trim tira os espaços das pontas: "  Estudar  " vira "Estudar".
  // Um texto só com espaços vira "", e o return encerra a função sem salvar.
  const texto = campoTarefa.value.trim();

  if (texto === "") {
    return;
  }

  // push coloca o objeto no fim do array. Toda tarefa nova começa pendente.
  // Depois da mudança: salva os dados, redesenha a lista e limpa o campo.
  tarefas.push({ texto: texto, feita: false });
  salvarTarefas();
  mostrarTarefas();
  campoTarefa.value = "";
}

// 5. Alterna a conclusão da tarefa indicada pelo botão.
function concluirTarefa(posicao) {
  // ! inverte o booleano: false vira true, e true vira false.
  // Assim, clicar de novo em Concluir também permite desfazer a conclusão.
  tarefas[posicao].feita = !tarefas[posicao].feita;
  salvarTarefas();
  mostrarTarefas();
}

// 6. Remove a tarefa do array e atualiza a cópia salva e a tela.
function excluirTarefa(posicao) {
  // splice(posicao, 1) remove exatamente um item a partir dessa posição.
  // Os itens seguintes mudam de posição; mostrarTarefas recria seus botões.
  tarefas.splice(posicao, 1);
  salvarTarefas();
  mostrarTarefas();
}

// 7. Remove de uma vez todas as tarefas que já foram feitas.
function limparConcluidas() {
  // filter testa cada tarefa e coloca no novo array só aquelas para as
  // quais a função devolve true. !tarefa.feita é true nas pendentes.
  // Atribuímos o resultado a tarefas para substituir o array anterior.
  tarefas = tarefas.filter(function (tarefa) {
    return !tarefa.feita;
  });

  salvarTarefas();
  mostrarTarefas();
}

// 8. Desafio: troca e salva o filtro, depois redesenha a lista.
// O array não muda aqui, então não precisamos chamar salvarTarefas().
function mudarFiltro(novoFiltro) {
  filtro = novoFiltro;
  localStorage.setItem("filtro", filtro);
  mostrarTarefas();
}

// 9. Liga os botões às ações. Passamos a função sem () para que ela rode
// no clique, em vez de executá-la agora, durante o carregamento da página.
botaoAdicionar.addEventListener("click", adicionarTarefa);
botaoLimpar.addEventListener("click", limparConcluidas);

// Nos filtros, usamos uma função intermediária para passar o nome do
// filtro como argumento quando o clique acontecer.
botaoTodas.addEventListener("click", function () {
  mudarFiltro("todas");
});

botaoPendentes.addEventListener("click", function () {
  mudarFiltro("pendentes");
});

botaoConcluidas.addEventListener("click", function () {
  mudarFiltro("concluidas");
});

// 10. Primeira exibição: os dados e o filtro já foram recuperados acima.
// Preenche a lista e o total sem esperar o usuário clicar em um botão.
mostrarTarefas();
