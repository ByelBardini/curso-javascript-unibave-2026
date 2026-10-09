// No array, cada valor fica em uma POSIÇÃO (0, 1, 2...).
// No objeto, cada valor fica em um NOME (chamado de chave ou propriedade).
const aluno = {
  nome: "Ana",
  idade: 20,
  nota: 8.5,
  aprovado: true,
};

console.log("O objeto inteiro:", aluno);

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// Forma mais comum de acessar um valor: ponto + nome da propriedade
console.log("Nome:", aluno.nome); // Ana
console.log("Idade:", aluno.idade); // 20
console.log("Nota:", aluno.nota); // 8.5

// Também dá para acessar com colchetes e o nome entre aspas
console.log("Nome (colchetes):", aluno["nome"]); // Ana

// A vantagem dos colchetes é poder usar uma variável no lugar do nome fixo
const propriedade = "idade";
console.log("Usando variável:", aluno[propriedade]); // 20

// Uma propriedade que não existe devolve undefined (não dá erro)
console.log("Telefone:", aluno.telefone); // undefined

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// Para ALTERAR, basta atribuir um novo valor à propriedade
aluno.nota = 9.5;
console.log("Nota alterada:", aluno.nota); // 9.5

// Atribuir em uma propriedade que ainda não existe CRIA a propriedade
aluno.cidade = "Orleans";
console.log("Depois de criar cidade:", aluno);

// delete remove a propriedade do objeto
delete aluno.aprovado;
console.log("Depois do delete:", aluno);

// Assim como no array, o objeto é const e mesmo assim muda: const impede
// trocar o objeto inteiro por outro, mas não impede mexer no conteúdo dele.

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// Para o typeof, um objeto é "object" (igual ao array)
console.log("Tipo de aluno:", typeof aluno); // object

// Array.isArray() continua sendo a forma de diferenciar os dois
console.log("aluno é array?", Array.isArray(aluno)); // false
console.log("[1, 2] é array?", Array.isArray([1, 2])); // true

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// O valor de uma propriedade pode ser qualquer coisa:
// número, texto, booleano, array e até outro objeto
const produto = {
  nome: "Notebook",
  preco: 3500,
  disponivel: true,
  tags: ["informática", "promoção"],
  fabricante: {
    nome: "Acme",
    pais: "Brasil",
  },
};

console.log("Produto:", produto);

// Array dentro de objeto: acessa a propriedade e depois a posição
console.log("Primeira tag:", produto.tags[0]); // informática
console.log("Quantas tags:", produto.tags.length); // 2

// Objeto dentro de objeto: um ponto para cada nível
console.log("Fabricante:", produto.fabricante.nome); // Acme
console.log("País:", produto.fabricante.pais); // Brasil
