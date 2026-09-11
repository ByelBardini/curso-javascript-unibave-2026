// ============================================================
// Funções de lógica: recebem um texto e devolvem a mensagem de erro.
// Se devolvem "" (vazio), significa que o campo está válido.
// Nenhuma delas toca no HTML — teste no console: validaNome("Ana")
// ============================================================

function validaNome(nome) {
  if (nome === "") {
    return "O nome é obrigatório.";
  }

  if (nome.length < 3) {
    return "O nome precisa ter pelo menos 3 letras.";
  }

  return "";
}

function validaEmail(email) {
  if (email === "") {
    return "O e-mail é obrigatório.";
  }

  // validação simplificada: só verifica se tem @ e ponto.
  // Na prática se usa uma verificação mais completa, mas a ideia é a mesma.
  if (!email.includes("@") || !email.includes(".")) {
    return "E-mail inválido.";
  }

  return "";
}

function validaSenha(senha) {
  if (senha.length < 6) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }

  return "";
}

// Só decide: recebe as três mensagens e responde se pode cadastrar.
// O && significa "e": todas as três precisam estar vazias.
function podeCadastrar(erroNome, erroEmail, erroSenha) {
  return erroNome === "" && erroEmail === "" && erroSenha === "";
}

// ============================================================
// Funções de tela: só escrevem na página. Não decidem nada,
// não validam nada, e por isso não precisam de "return".
// ============================================================

function mostraErro(idDoSpan, mensagem) {
  const span = document.getElementById(idDoSpan);

  span.textContent = mensagem;
  span.style.color = "red";
}

function mostraResultado(mensagem, cor) {
  const resultado = document.getElementById("resultado");

  resultado.textContent = mensagem;
  resultado.style.color = cor;
}

// ============================================================
// Função principal: não valida e não escreve nada por conta própria.
// Ela só organiza a ordem das coisas, chamando as outras funções.
// ============================================================

function validarFormulario(evento) {
  // sem isso o navegador recarrega a página e apaga tudo
  evento.preventDefault();

  // 1. lê os dados da tela
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // 2. valida: cada função devolve a mensagem de erro do seu campo
  const erroNome = validaNome(nome);
  const erroEmail = validaEmail(email);
  const erroSenha = validaSenha(senha);

  // 3. mostra os erros na tela
  mostraErro("erro-nome", erroNome);
  mostraErro("erro-email", erroEmail);
  mostraErro("erro-senha", erroSenha);

  // 4. decide o que fazer
  if (podeCadastrar(erroNome, erroEmail, erroSenha)) {
    mostraResultado("Cadastro realizado com sucesso, " + nome + "!", "green");
  } else {
    mostraResultado("Corrija os campos marcados acima.", "red");
  }
}

document.getElementById("formulario").addEventListener("submit", validarFormulario);
