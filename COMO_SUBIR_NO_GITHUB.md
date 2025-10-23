
# 📤 Como Subir o Projeto no GitHub

Guia passo a passo para fazer upload do seu dashboard FinOps para o GitHub.

## 🎯 Pré-requisitos

1. **Conta no GitHub:** Crie uma conta em [github.com](https://github.com) se ainda não tiver
2. **Git instalado:** Verifique com `git --version` no terminal

## 📝 Passo a Passo

### 1️⃣ Baixar o Projeto

Clique no botão **"Files"** no canto superior direito desta plataforma para baixar todos os arquivos.

### 2️⃣ Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Configure o repositório:
   - **Repository name:** `finops-dashboard` (ou o nome que preferir)
   - **Description:** "Dashboard profissional de FinOps para análise multi-cloud"
   - **Visibility:** Escolha Public ou Private
   - ⚠️ **NÃO marque** "Initialize this repository with a README"
5. Clique em **"Create repository"**

### 3️⃣ Preparar o Projeto Localmente

Abra o terminal na pasta onde você baixou o projeto:

```bash
# Navegue até a pasta do projeto
cd finops_dashboard

# Inicialize o Git (se ainda não foi inicializado)
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "🚀 Initial commit: FinOps Dashboard completo"
```

### 4️⃣ Conectar ao GitHub

No GitHub, você verá comandos prontos. Use estes (substitua com seu username e repositório):

```bash
# Adicione o remote do GitHub
git remote add origin https://github.com/SEU-USUARIO/finops-dashboard.git

# Renomeie a branch para main (se necessário)
git branch -M main

# Faça o push
git push -u origin main
```

### 5️⃣ Autenticação

Quando solicitado, você tem duas opções:

#### Opção A: Personal Access Token (Recomendado)
1. Vá em GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome: "FinOps Dashboard"
4. Marque a permissão: **repo** (todas as sub-opções)
5. Clique em **"Generate token"**
6. **COPIE o token** (ele só aparece uma vez!)
7. Use como senha ao fazer push

#### Opção B: SSH Key
```bash
# Gere uma chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Copie a chave pública
cat ~/.ssh/id_ed25519.pub

# Adicione em GitHub → Settings → SSH and GPG keys → New SSH key
```

Depois use:
```bash
git remote set-url origin git@github.com:SEU-USUARIO/finops-dashboard.git
git push -u origin main
```

## ✅ Verificar Upload

Acesse `https://github.com/SEU-USUARIO/finops-dashboard` e confirme que todos os arquivos estão lá!

## 🔒 Segurança: Arquivo .env

⚠️ **IMPORTANTE:** O arquivo `.env` com credenciais **NÃO** será enviado ao GitHub (está no `.gitignore`).

Isso é proposital para segurança! Para usar o projeto em outro lugar:
1. Copie o `.env.example` para `.env`
2. Preencha com suas credenciais reais

## 📊 Próximos Passos

### Adicionar Badge de Deploy
Adicione ao README.md:
```markdown
[![Deploy](https://img.shields.io/badge/Deploy-Live-success?style=flat-square)](https://finops-dashboard-tfp0w0.abacusai.app)
```

### Configurar GitHub Pages (opcional)
Se quiser hospedar documentação:
1. Vá em Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / docs

### Proteger a Branch Main
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Marque: "Require pull request reviews before merging"

## 🆘 Resolução de Problemas

### Erro: "repository not found"
- Verifique se o nome do repositório está correto
- Confirme que você tem permissão de escrita

### Erro: "failed to push some refs"
```bash
# Faça pull primeiro
git pull origin main --rebase
git push -u origin main
```

### Erro: "remote origin already exists"
```bash
# Remova e adicione novamente
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/finops-dashboard.git
```

### Arquivo muito grande
Se tiver arquivos grandes (>100MB):
```bash
# Use Git LFS
git lfs install
git lfs track "*.pdf"
git add .gitattributes
git commit -m "Configure Git LFS"
```

## 🎉 Pronto!

Seu dashboard FinOps agora está no GitHub e pode ser:
- ✅ Compartilhado com a equipe
- ✅ Clonado em outros computadores
- ✅ Versionado adequadamente
- ✅ Colaborado via Pull Requests

## 📞 Suporte

Se tiver dúvidas:
- 📖 [GitHub Docs](https://docs.github.com)
- 💬 [GitHub Community](https://github.community)
- 📧 Abra uma issue no repositório

---

**Boa sorte com seu projeto FinOps! 🚀**
