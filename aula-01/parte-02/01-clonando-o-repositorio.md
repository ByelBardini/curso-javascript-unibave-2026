# Tutorial 1 — Clonando o repositório

Passo a passo para instalar o Git, clonar este repositório e criar a sua branch pessoal.

---

## 1. Instalar o Git com o winget

Abra o **PowerShell** (ou o Terminal do Windows) e rode:

```powershell
winget install --id Git.Git -e
```

Feche e abra o terminal de novo para o comando `git` ser reconhecido. Confira a instalação:

```powershell
git --version
```

---

## 2. Clonar o repositório

Vá até a pasta onde você quer guardar o projeto e rode:

```powershell
git clone https://github.com/ByelBardini/curso-javascript-unibave-2026.git
```

Isso cria uma pasta `curso-javascript-unibave-2026` com todo o conteúdo do repositório.

---

## 3. Entrar na pasta do projeto

```powershell
cd curso-javascript-unibave-2026
```

Todos os comandos a seguir precisam ser rodados **de dentro dessa pasta**.

---

## 4. Buscar as atualizações do repositório

```powershell
git fetch
```

O `fetch` baixa as informações mais recentes do GitHub (branches novas, commits novos) sem alterar seus arquivos.

---

## 5. Criar a sua branch

Cada aluno trabalha na sua própria branch, nomeada com **nome-sobrenome** (tudo minúsculo, sem acento, separado por hífen):

```powershell
git checkout -b nome-sobrenome
```

Exemplo:

```powershell
git checkout -b joao-silva
```

O `-b` cria a branch e já muda para ela.

---

## 6. Enviar a branch para o GitHub

```powershell
git push -u origin nome-sobrenome
```

O `-u` liga a sua branch local com a do GitHub. Depois desse primeiro push, basta usar `git push`.

---

Pronto! Sua branch já existe no GitHub. Agora siga o [Tutorial 2 — Enviando alterações para o GitHub](02-enviando-para-o-github.md)...
