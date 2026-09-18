const produto = {
  nome: "Notebook",
  preco: 3500,
  quantidade: 4,
};

//-------------------------------------------------------------------------//
console.log("**--------- Object.keys / values / entries ---------**");
//-------------------------------------------------------------------------//

// Object.keys() devolve um ARRAY com os nomes das propriedades
console.log("Chaves:", Object.keys(produto)); // ["nome", "preco", "quantidade"]

// Object.values() devolve um ARRAY com os valores
console.log("Valores:", Object.values(produto)); // ["Notebook", 3500, 4]

// Object.entries() devolve um array de pares [chave, valor]
console.log("Pares:", Object.entries(produto));

// Como Object.keys() devolve um array, dá para percorrer com for...of
// e usar os colchetes para pegar o valor de cada chave
for (const chave of Object.keys(produto)) {
  console.log(chave + " = " + produto[chave]);
}

//-------------------------------------------------------------------------//
console.log("**--------- for...in ---------**");
//-------------------------------------------------------------------------//

// O for...in é o laço feito para objetos: ele entrega a CHAVE a cada volta
// (é o primo do for...of, que percorre arrays e entrega o VALOR)
for (const chave in produto) {
  console.log("Propriedade:", chave, "-> Valor:", produto[chave]);
}

//-------------------------------------------------------------------------//
console.log("**--------- copiando um objeto ---------**");
//-------------------------------------------------------------------------//

// CUIDADO: o = não copia o objeto, ele só dá outro nome para o MESMO objeto
const apelido = produto;
apelido.preco = 9999;

console.log("Preço do produto:", produto.preco); // 9999 -> mudou nos dois!

// Para copiar de verdade, usamos o spread ... dentro de { }
const copia = { ...produto };
copia.preco = 1000;

console.log("Preço da cópia:", copia.preco); // 1000
console.log("Preço do original:", produto.preco); // 9999 -> não mudou

// O spread também serve para copiar já trocando/adicionando propriedades
const promocao = { ...produto, preco: 2999, emPromocao: true };
console.log("Promoção:", promocao);

//-------------------------------------------------------------------------//
console.log("**--------- buscando dentro de um array de objetos ---------**");
//-------------------------------------------------------------------------//

const produtos = [
  { nome: "Notebook", preco: 3500, quantidade: 4 },
  { nome: "Mouse", preco: 80, quantidade: 20 },
  { nome: "Teclado", preco: 150, quantidade: 0 },
  { nome: "Monitor", preco: 900, quantidade: 7 },
];

// Buscar = percorrer o array comparando uma propriedade de cada objeto
const procurado = "Teclado";
let encontrado = null;

for (const item of produtos) {
  if (item.nome === procurado) {
    encontrado = item;
    // break para o laço assim que acha, não precisa continuar procurando
    break;
  }
}

if (encontrado === null) {
  console.log(procurado + " não está no estoque.");
} else {
  console.log("Encontrado:", encontrado);
  console.log("Preço:", encontrado.preco);
}

// Mesma ideia para FILTRAR: um array novo só com quem passa na condição
const emFalta = [];

for (const item of produtos) {
  if (item.quantidade === 0) {
    emFalta.push(item);
  }
}

console.log("Produtos em falta:", emFalta);

// E para SOMAR: o valor total do estoque (preço x quantidade de cada item)
let total = 0;

for (const item of produtos) {
  total = total + item.preco * item.quantidade;
}

console.log("Valor total do estoque: R$ " + total.toFixed(2));
