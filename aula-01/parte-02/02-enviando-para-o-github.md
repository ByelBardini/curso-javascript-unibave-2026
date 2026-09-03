# Tutorial 2 — Enviando alterações para o GitHub

Depois de fazer suas alterações nos arquivos, siga esses passos para enviar tudo para o GitHub.

---

## 1. Conferir em qual branch você está

```powershell
git branch
```

A branch atual aparece com um `*` na frente:

```
  main
* joao-silva
```

---

## 2. Mudar para a sua branch (se não estiver nela)

```powershell
git checkout nome-sobrenome
```

> Sem o `-b`, porque a branch já existe. O `-b` só é usado na criação.

---

## 3. Adicionar os arquivos alterados

```powershell
git add .
```

O `.` adiciona **todos** os arquivos modificados. Para conferir o que será enviado:

```powershell
git status
```

---

## 4. Criar o commit

```powershell
git commit -m "mensagem"
```

A mensagem deve descrever o que você fez. Exemplos:

```powershell
git commit -m "adiciona exercicio 1 da aula 01"
git commit -m "corrige calculo da media"
```

---

## 5. Enviar para o GitHub

```powershell
git push
```

Se der erro dizendo que a branch não tem upstream, use:

```powershell
git push -u origin nome-sobrenome
```

---

## Resumo rápido

```powershell
git branch                    # confere a branch
git checkout nome-sobrenome   # muda de branch, se precisar
git add .                     # adiciona as alterações
git commit -m "mensagem"      # salva as alterações
git push                      # envia para o GitHub
```
