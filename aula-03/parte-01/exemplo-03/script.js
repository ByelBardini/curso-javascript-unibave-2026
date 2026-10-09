// ATENÇÃO: todos os métodos abaixo (menos o includes) ALTERAM o array original.
// Repare que a lista é const e mesmo assim muda: const impede trocar o array
// inteiro por outro, mas não impede mexer no conteúdo dele.
const lista = ["banana", "uva", "laranja"];

console.log("Array inicial:", lista); // banana, uva, laranja

//-------------------------------------------------------------------------//
console.log("**--------- push() ---------**");
//-------------------------------------------------------------------------//

// push() adiciona no FINAL
lista.push("melancia");

console.log("Depois do push:", lista); // banana, uva, laranja, melancia

// push() aceita mais de um valor por vez
lista.push("abacaxi", "manga");
console.log("Depois do push com 2 valores:", lista);

//-------------------------------------------------------------------------//
console.log("**--------- pop() ---------**");
//-------------------------------------------------------------------------//

// pop() remove o ÚLTIMO item e devolve o item removido
const removidoDoFim = lista.pop();

console.log("Item removido:", removidoDoFim); // manga
console.log("Depois do pop:", lista);

//-------------------------------------------------------------------------//
console.log("**--------- shift() ---------**");
//-------------------------------------------------------------------------//

// shift() remove o PRIMEIRO item e devolve o item removido
const removidoDoComeco = lista.shift();

console.log("Item removido:", removidoDoComeco); // banana
console.log("Depois do shift:", lista);

//-------------------------------------------------------------------------//
console.log("**--------- unshift() ---------**");
//-------------------------------------------------------------------------//

// unshift() adiciona no COMEÇO
lista.unshift("morango");

console.log("Depois do unshift:", lista); // morango primeiro

//-------------------------------------------------------------------------//
console.log("**--------- splice() ---------**");
//-------------------------------------------------------------------------//

// splice(posição, quantos) remove a partir de uma posição do meio
// e devolve um array com o que foi removido
const removidos = lista.splice(1, 1);

console.log("Removidos pelo splice:", removidos);
console.log("Depois do splice removendo:", lista);

// splice(posição, quantos, novoValor) remove e coloca outro no lugar
lista.splice(0, 1, "kiwi");
console.log("Depois do splice trocando a posição 0:", lista);

// Com 0 no segundo parâmetro, ele não remove nada: só INSERE na posição
lista.splice(1, 0, "pera");
console.log("Depois do splice inserindo na posição 1:", lista);

//-------------------------------------------------------------------------//
console.log("**--------- includes() ---------**");
//-------------------------------------------------------------------------//

// includes() só CONSULTA: devolve true ou false e não altera o array
console.log("Tem 'pera'?", lista.includes("pera")); // true
console.log("Tem 'banana'?", lista.includes("banana")); // false

// É o método usado para evitar itens repetidos
const nome = "kiwi";

if (lista.includes(nome)) {
  console.log(nome + " já está na lista, não vou adicionar de novo");
} else {
  lista.push(nome);
  console.log(nome + " adicionado");
}

console.log("Array final:", lista);
