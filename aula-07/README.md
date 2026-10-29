# Aula 07 — Simulado de JavaScript

Implemente um painel de notas usando JavaScript puro e a [API de Notas](https://exemplosapi.evolutivasistemas.com.br/). O [HTML](simulado/index.html) e o [CSS](simulado/style.css) são fornecidos. Crie o arquivo `script.js` dentro de `simulado/`, já referenciado na página, e abra o projeto pelo Live Server.

Toda a lógica deve ser escrita pelo aluno. Não é necessário alterar o HTML ou o CSS.

## Requisitos funcionais

### RF01 — Carregar a turma

- Ao abrir a página, consulte a API e exiba os alunos em `lista-alunos`.
- Cada linha deve apresentar nome, quatro notas, média, situação e botões Editar e Excluir.
- O botão `botao-recarregar` deve consultar novamente o servidor.
- Após recarregar a página, os registros devem continuar disponíveis pela API.

### RF02 — Cadastrar e validar

- Cadastre nome e quatro notas pelo botão `botao-salvar`.
- Remova espaços das extremidades do nome e rejeite nomes vazios ou com mais de 100 caracteres.
- Todas as notas são obrigatórias, numéricas e devem estar entre 0 e 10, inclusive. Aceite zero e notas decimais; campo vazio não equivale a zero.
- Não envie dados inválidos ao servidor. Exiba uma mensagem explicando o problema.
- Após salvar com sucesso, limpe os campos e atualize os dados da tela.

### RF03 — Mostrar a prévia da média

- Atualize `previa-media` enquanto as notas são digitadas.
- A média é a soma das quatro notas dividida por quatro; cada avaliação tem peso de 25%.
- Enquanto houver nota ausente ou inválida, apresente `—`.
- A aprovação exige média exata maior ou igual a 7. Arredonde apenas para exibição: uma média de 6,9975 continua reprovada.

### RF04 — Editar e cancelar

- Editar deve preencher nome e notas com os dados do aluno selecionado.
- Identifique o modo de edição alterando `titulo-formulario` e o texto de `botao-salvar`.
- Salvar nesse modo deve atualizar o registro pelo seu `id`, sem cadastrar outro aluno.
- `botao-cancelar` deve limpar os campos, a prévia e o estado de edição, restaurando os textos iniciais. Ele também deve limpar os campos no modo de cadastro.

### RF05 — Excluir

- Após a exclusão confirmada e bem-sucedida, atualize a tela.

### RF06 — Buscar, filtrar e ordenar

- `campo-busca`: busque por parte do nome, sem diferenciar maiúsculas e minúsculas.
- `filtro-situacao`: apresente todos, aprovados ou reprovados.
- `filtro-ordem`: ordene por nome de A a Z, maior média ou menor média.
- Os três controles devem funcionar em conjunto, inclusive após alterações nos registros.
- Pode aplicar filtros no array em memória ou usar os parâmetros da API. Preserve acesso à turma inteira para calcular os indicadores.

### RF07 — Calcular indicadores

Calcule os valores no JavaScript, percorrendo o array completo da turma. Os filtros não devem alterar os indicadores.

| Elemento | Resultado esperado |
| --- | --- |
| `total-alunos` | Quantidade total de alunos |
| `media-turma` | Soma das médias individuais dividida pelo total de alunos |
| `total-aprovados` | Quantidade de alunos com média exata maior ou igual a 7 |
| `total-reprovados` | Quantidade de alunos com média exata menor que 7 |
| `maior-media` | Maior média da turma |
| `menor-media` | Menor média da turma |
| `percentual-aprovacao` | Aprovados / total de alunos × 100, acompanhado de `%` |

Com a turma vazia, apresente zero nas contagens e `—` nas médias e no percentual. Nunca apresente `NaN` ou `Infinity`.

### RF08 — Manter a interface consistente

- Após carregar, cadastrar, editar ou excluir, atualize tabela, indicadores e resumo.
- Mostre `estado-vazio` quando não houver alunos para os filtros atuais; esconda-o quando houver linhas.
- Atualize `resultado-filtro` no formato `Exibindo X de Y alunos`: X representa as linhas visíveis e Y, o total da turma.
- Use a situação retornada pela API na tabela e formate notas e médias com casas decimais de forma consistente.

### RF09 — Tratar carregamento e erros

- Use `mensagem` para informar carregamento, sucesso e falhas. As classes `sucesso` e `erro` já possuem estilos.
- Verifique o status das respostas e trate erros de validação da API e falhas de rede.
- Durante a requisição, desabilite o botão responsável para impedir cliques repetidos. Reabilite-o ao terminar, inclusive em caso de erro.
- Não limpe os campos nem informe sucesso se a operação falhar.
- Uma resposta `204` não possui corpo e não deve ser convertida em JSON.

## Integração com a API

Use a base `https://exemplosapi.evolutivasistemas.com.br/api/SEU-CODIGO`. Substitua `SEU-CODIGO` por um identificador próprio com 3 a 30 caracteres: letras minúsculas, números, hífen ou sublinhado. A etapa pública não exige login. Use dados fictícios.

| Método | Caminho após a base | Finalidade |
| --- | --- | --- |
| GET | `/alunos` | Consultar o array de alunos |
| POST | `/alunos` | Cadastrar um aluno; retorna 201 |
| PUT | `/alunos/{id}` | Substituir nome e quatro notas do aluno |
| DELETE | `/alunos/{id}` | Excluir o aluno; retorna 204 |

POST e PUT recebem JSON com `Content-Type: application/json`. Envie somente `nome`, `nota1`, `nota2`, `nota3` e `nota4`; as notas devem ser números. A API devolve também `id`, `media`, `situacao`, `criadoEm` e `atualizadoEm`. A situação é `aprovado` ou `reprovado`.

Os parâmetros de consulta disponíveis incluem `q`, `situacao`, `ordenar` e `ordem`. Erros podem conter os campos `erro` e `detalhes`. Consulte a documentação para o contrato completo.

## Referência da interface

| IDs | Uso |
| --- | --- |
| `campos-aluno` | Contêiner dos campos, sem envio automático |
| `campo-nome`, `nota-1`, `nota-2`, `nota-3`, `nota-4` | Entradas do cadastro e da edição |
| `titulo-formulario`, `botao-salvar`, `botao-cancelar` | Controle do modo de cadastro e edição |
| `previa-media` | Média das notas digitadas |
| `lista-alunos` | Corpo da tabela que receberá as linhas |
| `campo-busca`, `filtro-situacao`, `filtro-ordem` | Controles da listagem |
| `botao-recarregar` | Nova consulta ao servidor |
| `mensagem`, `estado-vazio`, `resultado-filtro` | Retorno ao usuário e estado da listagem |

Exemplo de estrutura visual de uma linha, sem lógica pronta:

```html
<tr>
  <td>Ana Oliveira</td>
  <td>7,0</td><td>8,0</td><td>9,0</td><td>6,0</td>
  <td class="media">7,5</td>
  <td><span class="situacao aprovado">Aprovado</span></td>
  <td class="acoes">
    <button type="button" class="acao">Editar</button>
    <button type="button" class="acao excluir">Excluir</button>
  </td>
</tr>
```

Para reprovados, utilize `situacao reprovado`. Insira os nomes com `textContent` e vincule as ações ao `id` retornado pela API. O atributo `hidden` pode controlar a visibilidade do estado vazio.

## Critérios

| Critério | Requisitos | Evidência |
| --- | --- | --- |
| Consulta e persistência | RF01 | Lista vem da API, recarregar funciona e registros permanecem após F5 |
| Cadastro e validação | RF02 | Cadastra dados válidos; rejeita nome vazio, notas ausentes e fora do intervalo; aceita zero |
| Prévia e regra de média | RF03 | Prévia reage à digitação e respeita notas incompletas e limite de aprovação |
| Edição e cancelamento | RF04 | Atualiza o registro correto sem duplicação e restaura o cadastro ao cancelar |
| Exclusão com confirmação | RF05 | Cancelar preserva o registro; confirmar exclui e atualiza a tela |
| Busca, filtros e ordenação | RF06 | Os controles funcionam isolados e combinados |
| Indicadores e resumo | RF07 | Cálculos corretos para toda a turma, inclusive vazia e com filtros ativos |
| Consistência da interface | RF08 | Tabela, contagem e estado vazio acompanham as alterações |
| Carregamento e falhas | RF09 | Mensagens adequadas, botões protegidos e recuperação após erro |

Na correção, teste uma turma vazia, notas zero e dez, média exatamente sete, média abaixo de sete, edição com filtros ativos, cancelamento de exclusão e falha de rede. Dados fixos no código não substituem a integração com a API.

## Desafio opcional

Salve busca, situação e ordenação no `localStorage` e restaure os controles ao recarregar a página.
