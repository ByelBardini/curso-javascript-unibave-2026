# Aula 08 — Prova final de JavaScript: MiniMarket

Implemente uma loja fictícia com catálogo, carrinho, compra simulada e login usando JavaScript puro e a API MiniMarket, documentada em [API.md](API.md). O HTML e o [CSS](trabalho-final/style.css) são fornecidos em duas páginas, ligadas pelo menu do topo e já com seus scripts referenciados. Abra o projeto pelo Live Server; aberta por `file://`, a página não consegue acessar a API.

| Página | Conteúdo | Script |
| --- | --- | --- |
| [Loja](trabalho-final/index.html) | Catálogo, pesquisa, carrinho e compra (RF01 a RF05) | `trabalho-final/script.js` |
| [Área do lojista](trabalho-final/login/index.html) | Login, sessão e cadastro de produtos (RF06 e RF07) | `trabalho-final/login/script.js` |

Toda a lógica deve ser escrita pelo aluno. Não altere o HTML, o CSS nem o servidor, e não use bibliotecas ou frameworks. Tempo previsto: 2 horas.

Somente o cadastro de produtos exige login. Catálogo, pesquisa, carrinho e compra funcionam para visitantes. As duas páginas compartilham o mesmo `localStorage`, então carrinho e token continuam disponíveis ao trocar de página.

## Requisitos funcionais

### RF01 — Carregar o catálogo

- Ao abrir a página, consulte `GET /produtos` e exiba os produtos em `lista-produtos`.
- Cada produto deve apresentar nome, preço, estoque e o botão Adicionar ao carrinho.
- Produto com estoque `0` aparece como indisponível e não pode ser adicionado.
- `total-produtos` mostra a quantidade de produtos do catálogo, contada a partir do array recebido. A pesquisa não altera esse número.
- O botão `botao-recarregar` deve consultar novamente o servidor.
- Mostre `estado-catalogo-vazio` quando não houver produtos para exibir; esconda-o quando houver.

### RF02 — Pesquisar produtos

- `campo-busca`: busque por parte do nome, sem diferenciar maiúsculas e minúsculas. `can` encontra "Caneca de cerâmica" e "Kit canetas coloridas".
- A pesquisa reage à digitação e trabalha sobre o array já carregado, sem chamar a API a cada letra.
- Não modifique o array original de produtos.
- Sem correspondência, mostre `estado-catalogo-vazio`.

### RF03 — Manter o carrinho

- Adicionar um produto que já está no carrinho aumenta sua quantidade, sem criar outra linha.
- Cada linha de `lista-carrinho` deve apresentar nome, preço unitário, quantidade, subtotal do item (preço × quantidade) e botões -1, +1 e Remover.
- A quantidade não pode passar do estoque do produto no catálogo. Nesse caso, avise e não aumente.
- Com quantidade 1, o botão -1 remove o item.
- `quantidade-carrinho` mostra a soma das quantidades de todos os itens, não o número de linhas.
- `botao-limpar-carrinho` esvazia o carrinho.
- Mostre `estado-carrinho-vazio` com o carrinho vazio; esconda-o quando houver itens.
- Salve o carrinho no `localStorage`, na chave `minimarket-carrinho`, a cada alteração, e recupere-o ao abrir a página. Login, logout e `401` não apagam o carrinho.

Formato sugerido de cada item salvo: `{ id: 1, nome: "Café torrado 500 g", preco: 22.9, quantidade: 2 }`.

### RF04 — Calcular os valores

| Elemento | Resultado esperado |
| --- | --- |
| `subtotal-carrinho` | Soma de preço × quantidade de todos os itens |
| `desconto-carrinho` | 10% do subtotal quando o subtotal for maior ou igual a R$ 200,00; abaixo disso, zero |
| `total-carrinho` | Subtotal − desconto |

- O limite de R$ 200,00 é verificado no subtotal, antes do desconto. R$ 199,99 não tem desconto; R$ 200,00 tem desconto de R$ 20,00 e total de R$ 180,00.
- Recalcule a cada inclusão, +1, -1, remoção ou limpeza, e também ao abrir a página com um carrinho salvo.
- Formate com `toFixed(2)`, no padrão `R$ 22.90`. Com o carrinho vazio, apresente `R$ 0.00` nos três valores. Nunca apresente `NaN` ou valores negativos.

### RF05 — Finalizar a compra

- `botao-finalizar` funciona sem login. Com o carrinho vazio, avise e não chame a API.
- Envie `POST /compras` apenas com o id e a quantidade de cada item. Não envie preço, desconto nem total.
- Em caso de sucesso (`201`), mostre em `mensagem-compra` o número da compra e o total informado pelo servidor, esvazie o carrinho (variável e `localStorage`) e recarregue o catálogo para refletir o novo estoque.
- Em caso de falha (estoque insuficiente, produto inexistente ou erro de rede), mostre a mensagem da API em `mensagem-compra` e não limpe o carrinho.

### RF06 — Login e logout

RF06 e RF07 ficam em `login/index.html` e `login/script.js`.

- `form-login` envia `campo-usuario` e `campo-senha` para `POST /auth/login`. Use `preventDefault()` no `submit` para a página não recarregar.
- Com login válido, salve o token no `localStorage`, na chave `minimarket-token`; mostre o usuário em `estado-sessao`; esconda `form-login`; mostre `botao-logout` e `area-cadastro-produto`; e limpe o campo de senha.
- Com login inválido, mostre a mensagem de erro e mantenha o estado de visitante.
- Ao abrir a página com token salvo, confirme-o com `GET /auth/eu`. Se for válido, entre no estado logado; se a resposta for `401`, remova o token e mantenha o estado de visitante.
- Envie o header `Authorization: Bearer TOKEN` somente nas rotas que exigem login: `/auth/eu`, `/auth/logout` e `POST /produtos`.
- `botao-logout` chama `POST /auth/logout`, remove o token do `localStorage` e volta ao estado de visitante, escondendo o cadastro.
- Qualquer `401` em rota protegida também remove o token e volta ao estado de visitante.

### RF07 — Cadastrar produto

- `area-cadastro-produto` só aparece com sessão válida.
- Valide os campos de `form-produto` antes de enviar e exiba uma mensagem explicando o problema:
  - `produto-nome`: obrigatório; remova espaços das extremidades e aceite de 2 a 100 caracteres.
  - `produto-preco`: obrigatório, numérico e maior que zero.
  - `produto-estoque`: obrigatório, inteiro e maior ou igual a zero.
  - Campo vazio não equivale a zero.
- Não envie dados inválidos ao servidor.
- Envie `POST /produtos` com JSON contendo `nome`, `preco` e `estoque` (números convertidos) e o token no header `Authorization`.
- Em caso de sucesso (`201`), limpe os campos e mostre uma mensagem com o nome do produto. Ele passa a aparecer no catálogo da loja ao abri-la ou clicar em Atualizar catálogo.
- Com `401`, volte ao estado de visitante. Com `400`, mostre `erro` e `detalhes` da API sem limpar os campos.

### RF08 — Tratar carregamento e erros

- As duas páginas têm o elemento `mensagem`. Na loja, use-o para catálogo e carrinho, e `mensagem-compra` para o resultado da finalização. Na área do lojista, use-o para login, logout, sessão e cadastro.
- Mostre `Carregando...` enquanto o catálogo é consultado.
- Verifique o status das respostas e use `try`/`catch` para tratar falhas de rede.
- Durante a requisição, desabilite o botão responsável para impedir cliques repetidos. Reabilite-o ao terminar, inclusive em caso de erro.
- Não limpe os campos nem informe sucesso se a operação falhar.
- Uma resposta `204` não possui corpo e não deve ser convertida em JSON.
- Após uma compra, catálogo, carrinho, contadores e totais devem permanecer coerentes.

## Integração com a API

Use a base `ENDERECO-DO-SERVIDOR/api/SEU-CODIGO`, informada na constante `URL_API` dos dois scripts. O endereço do servidor é informado pelo professor; substitua `SEU-CODIGO` pelo seu código de aluno, com 3 a 30 caracteres: letras minúsculas, números, hífen ou sublinhado. O usuário e a senha entregues pelo professor são necessários apenas para cadastrar produtos.

| Método | Caminho após a base | Login | Finalidade |
| --- | --- | :---: | --- |
| GET | `/produtos` | Não | Consultar o array de produtos `{ id, nome, preco, estoque }` |
| POST | `/produtos` | Sim | Cadastrar `{ nome, preco, estoque }`; retorna 201 |
| POST | `/compras` | Não | Finalizar `{ itens: [ { produtoId, quantidade } ] }`; retorna 201 com `id`, `subtotal`, `desconto` e `total` |
| POST | `/auth/login` | Não | Enviar `{ usuario, senha }`; retorna `{ token, usuario, ... }` |
| GET | `/auth/eu` | Sim | Confirmar o token salvo |
| POST | `/auth/logout` | Sim | Encerrar a sessão; retorna 204 |

POST recebe JSON com `Content-Type: application/json`. Erros podem conter os campos `erro` e `detalhes`. Não existe rota de carrinho: ele fica inteiramente no JavaScript e no `localStorage`. Consulte o [API.md](API.md) para o contrato completo.

## Referência da interface

Loja (`index.html` e `script.js`):

| IDs | Uso |
| --- | --- |
| `lista-produtos` | Lista que receberá os cartões de produto |
| `campo-busca`, `botao-recarregar` | Pesquisa pelo nome e nova consulta ao servidor |
| `total-produtos`, `estado-catalogo-vazio` | Quantidade de produtos e aviso de catálogo vazio ou pesquisa sem resultado |
| `filtro-estoque` | Checkbox do desafio opcional |
| `lista-carrinho` | Lista que receberá os itens do carrinho |
| `quantidade-carrinho`, `estado-carrinho-vazio` | Soma das unidades e aviso de carrinho vazio |
| `subtotal-carrinho`, `desconto-carrinho`, `total-carrinho` | Valores da compra |
| `botao-finalizar`, `botao-limpar-carrinho` | Finalizar a compra e esvaziar o carrinho |
| `mensagem`, `mensagem-compra` | Retorno ao usuário e resultado da finalização |

Área do lojista (`login/index.html` e `login/script.js`):

| IDs | Uso |
| --- | --- |
| `estado-sessao` | Texto de visitante ou do usuário conectado |
| `form-login`, `campo-usuario`, `campo-senha`, `botao-login` | Formulário de login; `botao-login` é `submit` |
| `botao-logout` | Sair da conta; começa escondido |
| `area-cadastro-produto` | Área de cadastro; começa escondida |
| `form-produto`, `produto-nome`, `produto-preco`, `produto-estoque`, `botao-cadastrar-produto` | Formulário de cadastro; `botao-cadastrar-produto` é `submit` |
| `mensagem` | Retorno de login, logout, sessão e cadastro |

Os formulários têm `novalidate`: o navegador não valida os campos, e a validação é responsabilidade do aluno.

Exemplo de estrutura visual de um produto, sem lógica pronta:

```html
<li class="produto">
  <h3 class="produto-nome">Café torrado 500 g</h3>
  <p class="produto-preco">R$ 22.90</p>
  <p class="produto-estoque">Estoque: 12</p>
  <button type="button" class="botao primario">Adicionar ao carrinho</button>
</li>
```

Para produtos sem estoque, utilize a classe extra `sem-estoque` e desabilite o botão:

```html
<li class="produto sem-estoque">
  <h3 class="produto-nome">Mochila escolar</h3>
  <p class="produto-preco">R$ 149.90</p>
  <p class="produto-estoque">Sem estoque</p>
  <button type="button" class="botao primario" disabled>Indisponível</button>
</li>
```

Exemplo de estrutura visual de um item do carrinho:

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

Vincule os botões de cada produto e item ao `id` correspondente, com `onclick` na string do `innerHTML` (aula 05) ou `createElement` e `addEventListener` (aula 06). Prefira `textContent` para inserir nomes. A propriedade `hidden` controla a visibilidade dos avisos de vazio, de `form-login`, `botao-logout` e `area-cadastro-produto`. As mensagens usam as classes `mensagem sucesso`, `mensagem erro`, `mensagem carregando` ou apenas `mensagem`; sem texto, a mensagem fica oculta. Opcionalmente, `estado-sessao` com a classe `sessao logado` fica verde.

## Critérios (100 pontos)

| Critério | Requisitos | Pontos | Evidência |
| --- | --- | ---: | --- |
| Catálogo e busca | RF01, RF02 | 15 | Lista vem da API, recarregar funciona, busca por parte do nome sem diferenciar maiúsculas e produto sem estoque bloqueado |
| Carrinho e persistência | RF03 | 20 | Adiciona sem duplicar linha, +1/-1, remove, respeita o estoque, esvazia e permanece após F5 |
| Subtotal, desconto e total | RF04 | 15 | Cálculos corretos, desconto de 10% a partir de R$ 200,00 e carrinho vazio zerado |
| Finalização da compra | RF05 | 15 | POST sem login só com ids e quantidades, número e total do servidor, carrinho limpo só no sucesso e estoque atualizado |
| Login e logout | RF06 | 15 | Token salvo, sessão restaurada após F5 com `/auth/eu`, logout e `401` tratado sem apagar o carrinho |
| Cadastro autenticado | RF07 | 10 | Validações antes do envio, POST com token e produto visível no catálogo da loja |
| Carregamento e falhas | RF08 | 10 | Mensagens adequadas, erros da API e de rede tratados e botões protegidos |

Na correção, teste produto sem estoque, o mesmo produto adicionado duas vezes, +1 acima do estoque, subtotal de R$ 199,99 e de exatamente R$ 200,00, F5 com carrinho e com sessão, compra sem login, estoque esgotado por outra compra antes de finalizar, senha errada, nome só com espaços, preço zero, estoque negativo ou decimal, logout, token inválido e servidor fora do ar. Dados fixos no código não substituem a integração com a API.

## Desafio opcional

Faça o checkbox `filtro-estoque` exibir somente produtos com estoque maior que zero, funcionando em conjunto com a pesquisa e sem modificar o array original. Não vale pontos na nota principal; pode ser usado como desempate ou bonificação.
