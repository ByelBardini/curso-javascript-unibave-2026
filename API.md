# API MiniMarket

API da prova final. Ela guarda o **catálogo**, registra as **compras simuladas** e faz o **login**. O carrinho **não** fica na API: ele é responsabilidade do seu `script.js` e do `localStorage`.

## Endereço base

```text
ENDERECO-DO-SERVIDOR/api/SEU-CODIGO
```

- `ENDERECO-DO-SERVIDOR` é informado pelo professor (ex.: `http://localhost:3000`).
- `SEU-CODIGO` é o seu código de aluno: de 3 a 30 caracteres, só **letras minúsculas, números, `-` ou `_`** (ex.: `aluno-maria`).
- Catálogo, estoque, compras, conta e token pertencem **somente** ao seu código. O que você fizer não afeta os colegas.

Todos os caminhos abaixo vêm depois da base. Exemplo completo: `http://localhost:3000/api/aluno-maria/produtos`.

## Resumo das rotas

| Método | Caminho | Precisa de login? | Sucesso | Para quê |
| --- | --- | :---: | --- | --- |
| `GET` | `/produtos` | Não | `200` | Lista o catálogo |
| `POST` | `/produtos` | **Sim** | `201` | Cadastra um produto |
| `POST` | `/compras` | Não | `201` | Finaliza a compra simulada |
| `POST` | `/auth/login` | Não | `200` | Entra com usuário e senha e recebe o token |
| `GET` | `/auth/eu` | **Sim** | `200` | Confirma se o token salvo ainda vale |
| `POST` | `/auth/logout` | **Sim** | `204` | Sai: o token deixa de valer |

**Atenção:** `POST /compras` **não** exige login; `POST /produtos` **exige**. A proteção do cadastro é feita pelo servidor: sem um token válido o produto nunca é criado, mesmo que a chamada venha do console do navegador.

## Formato de um produto

```json
{
  "id": 1,
  "nome": "Café torrado 500 g",
  "preco": 22.9,
  "estoque": 12
}
```

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | número | Gerado pelo servidor |
| `nome` | texto | De 2 a 100 caracteres |
| `preco` | número | Em reais, maior que zero. Chega como número: `22.9`, `25`, `99.99` |
| `estoque` | número | Inteiro, zero ou mais. `0` = produto indisponível |

Os números chegam sem zeros à direita (`25` em vez de `25.00`). Para mostrar com duas casas, use `toFixed(2)`: `(25).toFixed(2)` dá `"25.00"`.

---

## GET `/produtos`

Devolve o **array** com todos os produtos do seu catálogo, em ordem de `id`. Não precisa de login nem de headers.

**Resposta `200`:**

```json
[
  { "id": 1, "nome": "Café torrado 500 g", "preco": 22.9, "estoque": 12 },
  { "id": 2, "nome": "Caneca de cerâmica", "preco": 25, "estoque": 10 },
  { "id": 8, "nome": "Mochila escolar", "preco": 149.9, "estoque": 0 }
]
```

(Exemplo resumido: o catálogo inicial tem 10 produtos.)

A API **não** tem busca nem filtro: a pesquisa da prova é feita no array que já está no navegador.

---

## POST `/produtos` (exige login)

Cadastra um produto. Envie **somente** `nome`, `preco` e `estoque`, com `preco` e `estoque` como **números** (não como texto).

**Headers:**

```text
Content-Type: application/json
Authorization: Bearer SEU_TOKEN
```

**Corpo:**

```json
{
  "nome": "Arroz 5 kg",
  "preco": 29.9,
  "estoque": 8
}
```

**Resposta `201`:** o produto criado, já com o `id`.

```json
{ "id": 11, "nome": "Arroz 5 kg", "preco": 29.9, "estoque": 8 }
```

**Validações do servidor** (as mesmas que o frontend deve fazer antes de enviar):

| Campo | Regra |
| --- | --- |
| `nome` | Obrigatório; texto; sem contar os espaços das pontas, de 2 a 100 caracteres (só espaços é inválido) |
| `preco` | Obrigatório; número; maior que zero; no máximo duas casas decimais |
| `estoque` | Obrigatório; número inteiro; zero ou mais |

**Erros:**

- `401`: sem token, token inválido, expirado ou já encerrado com logout. **Nada é criado.**
- `400`: dados inválidos. O campo `detalhes` diz o problema de cada campo:

```json
{
  "erro": "Dados inválidos",
  "detalhes": {
    "preco": "Deve ser maior que zero",
    "estoque": "Deve ser um número inteiro"
  }
}
```

---

## POST `/compras`

Finaliza a compra simulada. **Não precisa de login.** Não existe pagamento.

Envie **apenas o id e a quantidade** de cada produto. Preço, subtotal, desconto e total **não** são enviados: o servidor usa os preços e o estoque que ele tem e calcula tudo sozinho.

**Headers:**

```text
Content-Type: application/json
```

**Corpo:**

```json
{
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 3, "quantidade": 1 }
  ]
}
```

**Resposta `201`:**

```json
{
  "id": 17,
  "criadaEm": "2026-11-05T13:45:10.120Z",
  "itens": [
    { "produtoId": 1, "nome": "Café torrado 500 g", "precoUnitario": 22.9, "quantidade": 2, "subtotal": 45.8, "estoqueRestante": 10 },
    { "produtoId": 3, "nome": "Fone de ouvido Bluetooth", "precoUnitario": 169, "quantidade": 1, "subtotal": 169, "estoqueRestante": 3 }
  ],
  "subtotal": 214.8,
  "desconto": 21.48,
  "total": 193.32
}
```

| Campo | Significado |
| --- | --- |
| `id` | Número da compra (mostre ao usuário) |
| `subtotal` | Soma de `precoUnitario × quantidade` |
| `desconto` | 10% do subtotal quando o subtotal é **maior ou igual a R$ 200,00**; senão `0` |
| `total` | `subtotal − desconto` (valor final, informado pelo servidor) |
| `estoqueRestante` | Estoque do produto depois desta compra |

**A compra é tudo ou nada.** O servidor confere todos os itens antes de descontar qualquer estoque. Se um único item for inválido ou não tiver estoque suficiente, **nenhum** estoque muda e nenhuma compra é registrada.

**Erros:**

- `400`: carrinho vazio, `itens` ausente, `produtoId` inválido, quantidade ausente, zero, negativa, decimal ou em texto.

```json
{ "erro": "O carrinho está vazio", "detalhes": { "itens": "Envie pelo menos um item" } }
```

- `404`: algum produto não existe.

```json
{ "erro": "Produto não encontrado", "detalhes": { "produtoId": 99 } }
```

- `409`: estoque insuficiente (outra pessoa pode ter comprado antes de você).

```json
{
  "erro": "Estoque insuficiente para Pen drive 64 GB",
  "detalhes": { "produtoId": 10, "nome": "Pen drive 64 GB", "solicitado": 2, "disponivel": 1 }
}
```

---

## POST `/auth/login`

Entra com o usuário e a senha fornecidos pelo professor. **Não existe rota de criar conta.**

**Headers:**

```text
Content-Type: application/json
```

**Corpo:**

```json
{
  "usuario": "maria",
  "senha": "senha-fornecida-pelo-professor"
}
```

O usuário não diferencia maiúsculas de minúsculas (`Maria` = `maria`); a senha diferencia.

**Resposta `200`:**

```json
{
  "token": "q3Vx0rN6m2hB...",
  "tipo": "Bearer",
  "usuario": "maria",
  "expiraEm": "2026-11-05T17:45:10.120Z"
}
```

Guarde o `token`. Ele vale até `expiraEm` (algumas horas) ou até o logout, e deve ser enviado nas rotas que exigem login, no header:

```text
Authorization: Bearer q3Vx0rN6m2hB...
```

(a palavra `Bearer`, **um espaço** e o token). Não envie o token nas rotas públicas: elas não precisam dele.

**Erros:**

- `400`: usuário ou senha vazios.
- `401`: usuário ou senha incorretos. A mensagem é a mesma nos dois casos: `{ "erro": "Usuário ou senha inválidos" }`.
- `429`: muitas tentativas erradas seguidas. Aguarde alguns minutos.

---

## GET `/auth/eu` (exige login)

Confirma se o token ainda vale. Use ao abrir a página para restaurar a sessão salva.

**Headers:**

```text
Authorization: Bearer SEU_TOKEN
```

**Resposta `200`:**

```json
{ "usuario": "maria", "expiraEm": "2026-11-05T17:45:10.120Z" }
```

**Erro `401`:** token ausente, inválido, expirado ou encerrado. O navegador deve voltar ao estado de visitante.

---

## POST `/auth/logout` (exige login)

Encerra a sessão: o token deixa de valer no servidor. Não precisa de corpo.

**Headers:**

```text
Authorization: Bearer SEU_TOKEN
```

**Resposta `204`:** **sem corpo**. Não chame `resposta.json()` em uma resposta 204: não há JSON para ler.

**Erro `401`:** o token já não valia.

---

## Erros

Toda resposta de erro tem corpo JSON com o campo `erro` (mensagem) e, às vezes, `detalhes` (objeto com mais informações):

```json
{ "erro": "Mensagem explicando o problema", "detalhes": { "campo": "problema do campo" } }
```

| Status | Quando acontece |
| --- | --- |
| `400` | Dados inválidos, carrinho vazio, JSON malformado, falta de `Content-Type: application/json`, código de aluno inválido |
| `401` | Login incorreto; token ausente, inválido ou expirado em rota que exige login |
| `404` | Produto não encontrado ou rota inexistente |
| `405` | Método HTTP errado para a rota (ex.: `DELETE /produtos`) |
| `409` | Estoque insuficiente ou conflito na compra |
| `429` | Muitas tentativas de login erradas |
| `500` | Erro interno do servidor |

Se nem chegar resposta (servidor fora do ar, endereço errado, sem rede), o `fetch` lança um erro, que deve ser tratado com `try`/`catch`.

## Parâmetro opcional `?atraso`

Para ver o estado de carregamento com calma, qualquer rota aceita `?atraso=MILISSEGUNDOS` (de 0 a 5000), que faz o servidor esperar antes de responder. Exemplo: `GET /produtos?atraso=2000`. Outra opção é usar o DevTools: F12 > Network > troque _No throttling_ por _Slow 4G_.

## Erros comuns

| Sintoma | Causa provável |
| --- | --- |
| `400` "Envie o corpo em JSON com o header Content-Type: application/json" | Faltou o header `Content-Type` no `fetch` |
| `400` "JSON inválido no corpo da requisição" | O `body` foi enviado sem `JSON.stringify()` |
| `400` em `preco` ou `estoque` com "recebido: o texto ..." | O valor do campo foi enviado sem `Number()` |
| `400` "Código de aluno inválido na URL" | Código com maiúsculas, espaços ou fora de 3 a 30 caracteres |
| `401` "foi enviado o texto \"null\"" | O token não foi salvo, ou foi lido do `localStorage` com a chave errada |
| `401` "Header Authorization inválido" | Faltou a palavra `Bearer` e o espaço antes do token |
| `Failed to fetch` no console | Servidor fora do ar, endereço errado, ou página aberta com dois cliques (`file://`) em vez do Live Server |
