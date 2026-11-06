# Aula 08 — Prova final de JavaScript: MiniMarket

Implemente uma loja fictícia com catálogo, carrinho, compra simulada e login, usando **JavaScript puro** e a API MiniMarket (contrato completo no [API.md](API.md)). O [HTML](trabalho-final/index.html) e o [CSS](trabalho-final/style.css) são fornecidos. Escreva todo o código em `trabalho-final/script.js`, já ligado na página, e abra o projeto pelo **Live Server**.

Toda a lógica deve ser escrita por você. **Não altere o HTML, o CSS nem o servidor**, e não use bibliotecas nem frameworks. Tempo previsto: **2 horas**.

## Antes de começar

1. Abra `trabalho-final/script.js` e troque `SEU-CODIGO` na constante `URL_API` pelo seu código de aluno. Confirme com o professor o endereço do servidor.
2. Guarde o **usuário** e a **senha** que o professor entregou. Eles só são necessários para cadastrar produtos.
3. Abra `index.html` pelo Live Server. Aberta com dois cliques (`file://`), a página não consegue falar com a API.

## Regras de acesso

| Ação | Visitante (sem login) | Usuário logado |
| --- | :---: | :---: |
| Ver catálogo, preços e estoque; pesquisar | Sim | Sim |
| Adicionar, alterar quantidade e remover do carrinho | Sim | Sim |
| Finalizar compra simulada | Sim | Sim |
| Cadastrar produto no catálogo | **Não** | **Sim** |
| Sair da conta | — | Sim |

## Requisitos funcionais

### RF01 — Carregar e apresentar o catálogo

- Ao abrir a página, busque os produtos com `GET /produtos` e exiba-os em `lista-produtos`.
- Cada produto mostra **nome, preço e estoque** e o botão **Adicionar ao carrinho**.
- Produto com estoque `0` deve aparecer como indisponível e **não** pode ser adicionado.
- `total-produtos` mostra a quantidade de produtos do catálogo, contada por você a partir do array recebido. A pesquisa não altera esse número.
- `botao-recarregar` consulta a API de novo.
- Mostre `estado-catalogo-vazio` quando não houver produtos para exibir e esconda-o quando houver.

### RF02 — Pesquisar produtos

- `campo-busca` filtra por **parte do nome**, sem diferenciar maiúsculas de minúsculas (`can` encontra "Caneca de cerâmica" e "Kit canetas coloridas").
- A pesquisa reage à digitação e trabalha sobre o array já carregado, **sem** chamar a API a cada letra.
- A pesquisa **não** pode modificar o array original de produtos.
- Sem correspondência, mostre `estado-catalogo-vazio`.

### RF03 — Manter o carrinho (sem login)

- Adicionar um produto que **já está** no carrinho aumenta a quantidade dele; não cria uma segunda linha.
- Cada linha de `lista-carrinho` mostra nome, preço unitário, quantidade, subtotal do item (`preço × quantidade`) e os botões **-1**, **+1** e **Remover**.
- A quantidade não pode passar do estoque do produto no catálogo. Nesse caso, avise e não aumente.
- **Regra do -1:** com quantidade 1, o **-1** remove o item do carrinho.
- `quantidade-carrinho` mostra a **soma das quantidades** de todos os itens (não o número de linhas).
- `botao-limpar-carrinho` esvazia o carrinho.
- Mostre `estado-carrinho-vazio` com o carrinho vazio e esconda-o quando houver itens.
- O carrinho é salvo no `localStorage`, na chave **`minimarket-carrinho`**, a cada alteração, e recuperado ao abrir a página. O carrinho pertence ao navegador: login e logout **não** o apagam.

Sugestão de formato de cada item salvo: `{ id: 1, nome: "Café torrado 500 g", preco: 22.9, quantidade: 2 }`.

### RF04 — Calcular os valores

| Elemento | Regra |
| --- | --- |
| `subtotal-carrinho` | Soma de `preço × quantidade` de todos os itens |
| `desconto-carrinho` | 10% do subtotal se o subtotal for **maior ou igual a R$ 200,00**; abaixo disso, zero |
| `total-carrinho` | Subtotal − desconto |

- O limite de R$ 200,00 é verificado no subtotal **antes** do desconto. R$ 199,99 não tem desconto; R$ 200,00 tem desconto de R$ 20,00 e total de R$ 180,00.
- Recalcule tudo a cada inclusão, +1, -1, remoção ou limpeza, e também ao abrir a página com um carrinho salvo.
- Mostre os valores com duas casas decimais, no formato `R$ 22.90` (use `toFixed(2)`). Carrinho vazio: `R$ 0.00` nos três. Nunca mostre `NaN` nem valores negativos.

### RF05 — Finalizar a compra (sem login)

- `botao-finalizar` funciona para visitantes. Com o carrinho vazio, avise e não chame a API.
- Envie `POST /compras` **apenas com o id e a quantidade** de cada item. Não envie preço, desconto nem total.
- Durante o envio, desabilite `botao-finalizar` para evitar compra duplicada; reabilite ao terminar, mesmo com erro.
- **Sucesso (`201`):** mostre em `mensagem-compra` o número da compra e o **total informado pelo servidor**; esvazie o carrinho (variável e `localStorage`) e recarregue o catálogo para refletir o estoque novo.
- **Falha** (estoque insuficiente, produto inexistente, erro de rede): mostre a mensagem da API em `mensagem-compra` e **não** limpe o carrinho.

### RF06 — Login e logout

- `form-login` envia `campo-usuario` e `campo-senha` em `POST /auth/login`. Sem o `preventDefault()` no `submit`, a página recarrega.
- **Login válido:** salve o token no `localStorage`, na chave **`minimarket-token`**; mostre o usuário em `estado-sessao`; esconda `form-login`; mostre `botao-logout` e `area-cadastro-produto`; limpe o campo de senha.
- **Login inválido:** mostre a mensagem de erro e continue como visitante.
- **Ao abrir a página** com um token salvo, confirme-o com `GET /auth/eu`. Se valer, entre no estado logado; se responder `401`, remova o token e fique como visitante.
- Envie o header `Authorization: Bearer TOKEN` **somente** nas rotas que exigem login (`/auth/eu`, `/auth/logout` e `POST /produtos`).
- **Logout** (`botao-logout`): chame `POST /auth/logout` (resposta `204`, sem corpo), remova o token do `localStorage` e volte ao estado de visitante, escondendo o cadastro.
- Qualquer `401` em rota protegida (token expirado ou inválido) também remove o token e volta ao estado de visitante. **O carrinho nunca é apagado** por login, logout ou `401`.

### RF07 — Cadastrar produto (somente logado)

- `area-cadastro-produto` só aparece com sessão válida.
- Antes de enviar, valide os campos de `form-produto` e mostre o problema encontrado:
  - `produto-nome`: obrigatório, sem contar os espaços das pontas; de 2 a 100 caracteres; só espaços é inválido.
  - `produto-preco`: obrigatório, numérico, maior que zero.
  - `produto-estoque`: obrigatório, número **inteiro**, maior ou igual a zero (zero é permitido).
  - Campo vazio **não** vale como zero.
- Dados inválidos **não** são enviados ao servidor.
- Envie `POST /produtos` com JSON (`nome`, `preco` e `estoque`, com números convertidos) e o token no header `Authorization`.
- **Sucesso (`201`):** limpe os campos, mostre mensagem de sucesso e recarregue o catálogo.
- **`401`:** volte ao estado de visitante. **`400`:** mostre o `erro` e os `detalhes` da API, sem limpar os campos.

### RF08 — Mensagens, carregamento e erros

- Use `mensagem` para carregamento, sucesso e erros do catálogo, do login/logout e do cadastro. Use `mensagem-compra` para o resultado da finalização.
- Mostre `Carregando...` enquanto o catálogo é buscado.
- Em toda chamada à API, verifique `resposta.ok` (ou o status) e use `try`/`catch` para falhas de rede.
- Desabilite o botão que disparou a requisição enquanto ela estiver em andamento e reabilite-o ao terminar, inclusive em caso de erro.
- Em operação malsucedida, não informe sucesso e não apague o que foi digitado.
- Depois de uma compra, catálogo, carrinho, contadores e totais devem ficar coerentes entre si.

## Integração com a API

Base: `ENDERECO-DO-SERVIDOR/api/SEU-CODIGO`. Formatos, exemplos e erros estão no [API.md](API.md).

| Método | Caminho após a base | Login? | Finalidade |
| --- | --- | :---: | --- |
| GET | `/produtos` | Não | Array de produtos `{ id, nome, preco, estoque }` |
| POST | `/produtos` | **Sim** | Cadastrar `{ nome, preco, estoque }`; retorna 201 |
| POST | `/compras` | Não | Finalizar `{ itens: [ { produtoId, quantidade } ] }`; retorna 201 com `id`, `subtotal`, `desconto` e `total` |
| POST | `/auth/login` | Não | Enviar `{ usuario, senha }`; retorna `{ token, usuario, ... }` |
| GET | `/auth/eu` | **Sim** | Confirmar o token salvo |
| POST | `/auth/logout` | **Sim** | Encerrar a sessão; retorna 204 sem corpo |

Erros vêm no formato `{ "erro": "...", "detalhes": { ... } }`. Nenhuma rota de carrinho existe: o carrinho é todo seu.

## Referência da interface

| IDs | Uso |
| --- | --- |
| `mensagem` | Mensagens gerais: carregamento, sucesso e erro |
| `lista-produtos` | `<ul>` que recebe os cartões de produto |
| `campo-busca` | Pesquisa pelo nome |
| `botao-recarregar` | Nova consulta ao catálogo |
| `total-produtos` | Quantidade de produtos do catálogo |
| `estado-catalogo-vazio` | Aviso de catálogo vazio ou pesquisa sem resultado |
| `filtro-estoque` | Checkbox do desafio opcional |
| `lista-carrinho` | `<ul>` que recebe os itens do carrinho |
| `quantidade-carrinho` | Soma das unidades no carrinho |
| `estado-carrinho-vazio` | Aviso de carrinho vazio |
| `subtotal-carrinho`, `desconto-carrinho`, `total-carrinho` | Valores da compra |
| `botao-finalizar`, `botao-limpar-carrinho` | Finalizar compra e esvaziar carrinho |
| `mensagem-compra` | Resultado da finalização (número da compra ou erro) |
| `estado-sessao` | Texto de visitante ou do usuário conectado |
| `form-login`, `campo-usuario`, `campo-senha`, `botao-login` | Formulário de login (`botao-login` é `submit`) |
| `botao-logout` | Sair; começa escondido |
| `area-cadastro-produto` | Área de cadastro; começa escondida |
| `form-produto`, `produto-nome`, `produto-preco`, `produto-estoque`, `botao-cadastrar-produto` | Formulário de cadastro (`botao-cadastrar-produto` é `submit`) |

Os formulários têm `novalidate`: o navegador não valida nada sozinho, a validação é sua.

### Estrutura visual de um produto

Exemplo de HTML de um item de `lista-produtos`, sem lógica pronta:

```html
<li class="produto">
  <h3 class="produto-nome">Café torrado 500 g</h3>
  <p class="produto-preco">R$ 22.90</p>
  <p class="produto-estoque">Estoque: 12</p>
  <button type="button" class="botao primario">Adicionar ao carrinho</button>
</li>
```

Produto com estoque zero: classe extra `sem-estoque` e botão desabilitado.

```html
<li class="produto sem-estoque">
  <h3 class="produto-nome">Mochila escolar</h3>
  <p class="produto-preco">R$ 149.90</p>
  <p class="produto-estoque">Sem estoque</p>
  <button type="button" class="botao primario" disabled>Indisponível</button>
</li>
```

### Estrutura visual de um item do carrinho

```html
<li class="item-carrinho">
  <div class="item-dados">
    <strong class="item-nome">Café torrado 500 g</strong>
    <span class="item-preco">R$ 22.90 cada</span>
  </div>
  <div class="item-controles">
    <button type="button" class="botao-quantidade">-1</button>
    <span class="item-quantidade">2</span>
    <button type="button" class="botao-quantidade">+1</button>
  </div>
  <span class="item-subtotal">R$ 45.80</span>
  <button type="button" class="botao-remover">Remover</button>
</li>
```

### Observações sobre a interface

- Os botões de cada produto e de cada item precisam saber a qual `id` se referem. Você pode usar o `onclick` montado na string do `innerHTML`, como na aula 05, ou `createElement` com `addEventListener`, como na aula 06. Prefira `textContent` para o nome do produto.
- Para esconder ou mostrar `estado-catalogo-vazio`, `estado-carrinho-vazio`, `form-login`, `botao-logout` e `area-cadastro-produto`, use a propriedade `hidden`: `elemento.hidden = true` esconde e `elemento.hidden = false` mostra.
- As mensagens mudam de cor pela classe: `elemento.className = "mensagem sucesso"`, `"mensagem erro"`, `"mensagem carregando"` ou só `"mensagem"`. Sem texto, a mensagem some sozinha.
- Opcional: `estado-sessao` com a classe `"sessao logado"` fica verde.

## Critérios de avaliação (100 pontos)

| Critério | Requisitos | Pontos | Evidência |
| --- | --- | ---: | --- |
| Catálogo e busca | RF01, RF02 | 15 | Lista vem da API, recarregar funciona, busca por parte do nome sem diferenciar maiúsculas, produto sem estoque bloqueado |
| Carrinho e persistência | RF03 | 20 | Adicionar sem duplicar linha, +1/-1, remover, limite de estoque, esvaziar, carrinho permanece após F5 |
| Subtotal, desconto e total | RF04 | 15 | Cálculos corretos, desconto de 10% a partir de R$ 200,00, carrinho vazio zerado |
| Finalização da compra | RF05 | 15 | `POST` sem login só com ids e quantidades, número e total do servidor, carrinho limpo só no sucesso, estoque atualizado |
| Login e logout | RF06 | 15 | Token salvo, sessão restaurada após F5 com `/auth/eu`, botão Sair, `401` tratado sem apagar o carrinho |
| Cadastro autenticado | RF07 | 10 | Validações antes do envio, `POST` com token, catálogo atualizado |
| Mensagens e tratamento de erros | RF08 | 10 | Carregamento, erros da API e de rede, botões bloqueados durante requisições |

Na correção serão testados, entre outros: produto sem estoque, o mesmo produto adicionado duas vezes, +1 acima do estoque, subtotal de R$ 199,99 e de exatamente R$ 200,00, F5 com carrinho e com sessão, compra sem login, estoque esgotado por outra compra antes de finalizar, senha errada, cadastro com nome só de espaços, preço zero, estoque negativo e estoque decimal, logout, token inválido e servidor fora do ar. Dados fixos no código não substituem a integração com a API.

## Desafio opcional

Faça o checkbox `filtro-estoque` mostrar somente produtos com estoque maior que zero, funcionando junto com a pesquisa e sem modificar o array original. Não vale pontos da nota principal; o professor pode usá-lo como desempate ou bonificação.
