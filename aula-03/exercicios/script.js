// ============================================================
// AULA 03 — EXERCÍCIOS
//
// O enunciado de cada exercício está no index.html.
// Escreva o código abaixo do cabeçalho correspondente.
// ============================================================

// ============================================================
// EXERCÍCIO 01 — Notas da turma (console)
//
// Este exercício não usa a página: só array e console.log.
// Abra o console do navegador com F12 para ver a saída.
// ============================================================

// ============================================================
// EXERCÍCIO 02 — Lista de tarefas
//
// O array é a fonte da verdade: toda mudança acontece nele e
// só depois a tela é redesenhada por atualizarTela().
//
// Campos e botões desta seção:
//   tarefa, adicionarTarefa, concluirTarefa,
//   posicaoTarefa, removerTarefa,
//   avisoTarefa, listaTarefas, totalTarefas
// ============================================================

// ============================================================
// EXERCÍCIO 03 — Ficha do produto (console)
//
// De novo sem tocar na página: objeto, for...in e cópia com spread.
// ============================================================

// ============================================================
// EXERCÍCIO 04 — Cadastro de filmes
//
// Array de objetos na tela. procurarPorTitulo() é função de
// LÓGICA: ela não pode usar document, getElementById nem
// innerHTML — só percorrer o array e devolver o que achou.
//
// Campos e botões desta seção:
//   titulo, ano, nota, cadastrarFilme,
//   buscaFilme, buscarFilme, removerFilme,
//   avisoFilme, corpoFilmes, resumoFilmes
// ============================================================

// ============================================================
// EXERCÍCIO 05 — Boletim em JSON
//
// ATENÇÃO: abra a página pelo Live Server, senão o fetch do
// alunos.json é bloqueado pelo navegador.
//
// Campos e botões desta seção:
//   carregarAlunos, alunoNome, corrigirNota, baixarBoletim,
//   avisoAluno, listaAlunos, resumoAlunos
//
// Lembrete do download (o navegador não grava por cima do
// arquivo original, ele só oferece um arquivo novo):
//
//   const texto = JSON.stringify(alunos, null, 2);
//   const arquivo = new Blob([texto], { type: "application/json" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(arquivo);
//   link.download = "alunos.json";
//   link.click();
// ============================================================
