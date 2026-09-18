// Um array é uma lista de valores guardada em uma única variável
const frutas = ["maçã", "banana", "uva", "laranja"];

console.log("O array inteiro:", frutas);

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// Cada valor fica em uma POSIÇÃO (índice), e a contagem começa no 0
console.log("Posição 0:", frutas[0]); // maçã
console.log("Posição 1:", frutas[1]); // banana
console.log("Posição 2:", frutas[2]); // uva
console.log("Posição 3:", frutas[3]); // laranja

// Uma posição que não existe devolve undefined
console.log("Posição 10:", frutas[10]); // undefined

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// length é a quantidade de itens do array
console.log("Quantidade de frutas:", frutas.length); // 4

// Como o índice começa em 0, o último item fica em length - 1
console.log("Última fruta:", frutas[frutas.length - 1]); // laranja

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// Para o typeof, um array é um "object" (não existe typeof "array")
console.log("Tipo de frutas:", typeof frutas); // object

// Para saber se é realmente um array, usamos Array.isArray()
console.log("frutas é um array?", Array.isArray(frutas)); // true

//-------------------------------------------------------------------------//
console.log("**---------------------------**");
//-------------------------------------------------------------------------//

// Um array pode guardar qualquer tipo de valor, inclusive tipos misturados
const numeros = [10, 20, 30];
const misturado = ["Ana", 20, true, null];

console.log("Números:", numeros);
console.log("Misturado:", misturado);
