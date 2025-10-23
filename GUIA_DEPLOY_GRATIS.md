
# 🚀 Guia Completo: Como Hospedar o Dashboard GRATUITAMENTE

## 📋 Opções Gratuitas Disponíveis

1. **Vercel** ⭐ RECOMENDADO - Mais fácil para Next.js
2. **Netlify** - Alternativa popular
3. **Railway** - Inclui banco de dados grátis
4. **Render** - Boa para apps completos

---

# 🎯 OPÇÃO 1: VERCEL (RECOMENDADA)

## Por que Vercel?
- ✅ Feita especificamente para Next.js
- ✅ Deploy em 2 minutos
- ✅ 100% grátis para projetos pessoais
- ✅ HTTPS automático
- ✅ CDN global incluído
- ✅ Domínio grátis (.vercel.app)

---

## 📝 Passo a Passo - Deploy na Vercel

### **MÉTODO 1: Via Interface Web (Mais Fácil)**

#### Passo 1: Preparar o Projeto no GitHub

Antes de fazer deploy, você precisa ter o código no GitHub:

1. **Baixe o código**
   - Clique em "Files" no canto superior direito
   - Baixe `dashboard_codigo.zip`
   - Extraia a pasta

2. **Suba para o GitHub**
   - Siga o guia: `GUIA_GITHUB_GUI.pdf`
   - Ou acesse: https://github.com/new
   - Crie um repositório chamado `finops-dashboard`
   - Faça upload dos arquivos

#### Passo 2: Criar Conta na Vercel

1. **Acesse:** https://vercel.com
2. **Clique em:** "Sign Up" (Cadastrar)
3. **Escolha:** "Continue with GitHub"
4. **Autorize** a Vercel a acessar seus repositórios

![Vercel Login](https://i.ytimg.com/vi/Ltzg8aFkfsY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGD0gEyh_MA8=&rs=AOn4CLCQTnovGImftEy-WCnV6qxpwUHMbQ)

#### Passo 3: Importar o Projeto

1. **No painel da Vercel, clique:** "Add New..." → "Project"
2. **Selecione** o repositório `finops-dashboard`
3. **Clique em:** "Import"

![Import Project](https://pbs.twimg.com/media/FYCfpapXkAIpKYg?format=jpg&name=large)

#### Passo 4: Configurar o Deploy

**Configure as seguintes opções:**

1. **Framework Preset:** Next.js (já detecta automaticamente)
2. **Root Directory:** `nextjs_space` ⚠️ IMPORTANTE
3. **Build Command:** `yarn build`
4. **Output Directory:** `.next` (deixe padrão)

![Configure Project](https://i.ytimg.com/vi/GfyBwnWbR5c/maxresdefault.jpg)

#### Passo 5: Adicionar Variáveis de Ambiente

**IMPORTANTE:** Você precisa configurar o banco de dados.

1. **Clique em:** "Environment Variables" (durante o setup)
2. **Adicione:**

```
Nome: DATABASE_URL
Valor: [Sua URL do PostgreSQL]
```

**Onde conseguir o DATABASE_URL?**

**Opção A: Banco grátis na Neon (Recomendado)**
- Acesse: https://neon.tech
- Crie conta grátis
- Crie um banco PostgreSQL
- Copie a `Connection String`

**Opção B: Banco grátis na Supabase**
- Acesse: https://supabase.com
- Crie projeto grátis
- Vá em: Settings → Database
- Copie a `Connection String (Pooler)`

**Opção C: Seu próprio PostgreSQL**
- Use o banco que você já tem
- Formato: `postgresql://usuario:senha@host:5432/database`

3. **Adicione também:**

```
Nome: NEXTAUTH_URL
Valor: https://seu-projeto.vercel.app
```

(Você pode voltar e editar depois com a URL real)

#### Passo 6: Deploy!

1. **Clique em:** "Deploy"
2. **Aguarde** 2-3 minutos (a Vercel vai compilar tudo)
3. **Pronto!** 🎉

Você verá uma tela de sucesso com:
- 🌐 URL do seu dashboard: `https://seu-projeto.vercel.app`
- Botão para visitar o site

---

### **MÉTODO 2: Via CLI (Linha de Comando)**

Se preferir usar o terminal:

#### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

#### Passo 2: Login

```bash
vercel login
```

Digite seu email e confirme no link enviado.

#### Passo 3: Navegar até o projeto

```bash
cd /caminho/para/finops_dashboard/nextjs_space
```

#### Passo 4: Deploy

```bash
vercel
```

**Siga as perguntas:**
- Set up and deploy? → **Y** (sim)
- Which scope? → Sua conta
- Link to existing project? → **N** (não)
- What's your project's name? → **finops-dashboard**
- In which directory is your code? → **./** (pasta atual)
- Want to override settings? → **N** (não)

#### Passo 5: Deploy para produção

```bash
vercel --prod
```

**Pronto!** A URL do seu dashboard será exibida no terminal.

---

## 🔧 Configurar Banco de Dados após Deploy

### Opção 1: Usar Neon (PostgreSQL grátis)

1. **Acesse:** https://neon.tech
2. **Crie conta** (grátis)
3. **Crie projeto:** "finops-dashboard-db"
4. **Copie a Connection String**

Exemplo:
```
postgresql://usuario:senha@ep-xxx.us-east-2.aws.neon.tech/neondb
```

5. **Na Vercel:**
   - Vá em: Settings → Environment Variables
   - Edite `DATABASE_URL`
   - Cole a Connection String
   - Salve

6. **Redeploy:**
   - Vá em: Deployments
   - Clique nos 3 pontos do último deploy
   - Clique em "Redeploy"

### Opção 2: Usar Supabase (PostgreSQL grátis)

1. **Acesse:** https://supabase.com
2. **Crie projeto** (grátis)
3. **Vá em:** Settings → Database
4. **Copie:** Connection String (Pooler)
5. **Substitua** `[YOUR-PASSWORD]` pela senha do seu projeto
6. **Configure na Vercel** (mesmos passos acima)

---

## 🔄 Configurar Deploy Automático

Depois do primeiro deploy, toda vez que você fizer push no GitHub:

1. **Edite código localmente**
2. **Commit e push para GitHub**

```bash
git add .
git commit -m "Atualização"
git push
```

3. **Vercel detecta automaticamente e faz deploy!** 🎉

Você receberá email de cada deploy.

---

## 🌐 Configurar Domínio Próprio (Opcional)

Se você tem um domínio (ex: meusite.com):

1. **Na Vercel, vá em:** Settings → Domains
2. **Adicione seu domínio:** meusite.com
3. **Configure no seu registrador** (GoDaddy, Registro.br, etc):

   **Adicione registro DNS:**
   ```
   Tipo: CNAME
   Nome: @
   Valor: cname.vercel-dns.com
   ```

4. **Aguarde** propagação (até 48h)
5. **Pronto!** Seu dashboard estará em `https://meusite.com`

---

# 🎯 OPÇÃO 2: NETLIFY

## Passo a Passo - Deploy na Netlify

### Passo 1: Criar Conta

1. **Acesse:** https://app.netlify.com/signup
2. **Escolha:** "GitHub" para conectar
3. **Autorize** a Netlify

### Passo 2: Novo Site

1. **Clique em:** "Add new site" → "Import an existing project"
2. **Escolha:** GitHub
3. **Selecione** o repositório `finops-dashboard`

### Passo 3: Configurar Build

```
Base directory: nextjs_space
Build command: yarn build
Publish directory: nextjs_space/.next
```

### Passo 4: Variáveis de Ambiente

Adicione as mesmas variáveis:
- `DATABASE_URL`
- `NEXTAUTH_URL`

### Passo 5: Deploy

Clique em "Deploy site" e aguarde!

URL: `https://seu-site.netlify.app`

---

# 🎯 OPÇÃO 3: RAILWAY

## Por que Railway?
- ✅ Banco de dados PostgreSQL INCLUÍDO grátis
- ✅ $5 de crédito grátis por mês
- ✅ Fácil configuração

## Passo a Passo

### Passo 1: Criar Conta

1. **Acesse:** https://railway.app
2. **Clique em:** "Login with GitHub"
3. **Autorize** Railway

### Passo 2: Novo Projeto

1. **Clique em:** "New Project"
2. **Escolha:** "Deploy from GitHub repo"
3. **Selecione:** seu repositório

### Passo 3: Adicionar PostgreSQL

1. **No projeto, clique:** "New" → "Database" → "PostgreSQL"
2. **Railway cria automaticamente** e conecta o banco!
3. **Copie** a variável `DATABASE_URL` (já está configurada)

### Passo 4: Configurar o App

1. **Clique no serviço** do seu app
2. **Vá em:** Settings
3. **Root Directory:** `nextjs_space`
4. **Build Command:** `yarn build`
5. **Start Command:** `yarn start`

### Passo 5: Deploy

Railway faz deploy automaticamente!

**Sua URL:** Vá em Settings → Domains → Generate Domain

---

# 🎯 OPÇÃO 4: RENDER

## Passo a Passo

### Passo 1: Criar Conta

1. **Acesse:** https://render.com
2. **Clique em:** "Get Started"
3. **Conecte** com GitHub

### Passo 2: Novo Web Service

1. **Clique em:** "New +" → "Web Service"
2. **Conecte** seu repositório GitHub
3. **Configure:**

```
Name: finops-dashboard
Environment: Node
Root Directory: nextjs_space
Build Command: yarn install && yarn build
Start Command: yarn start
```

### Passo 3: Variáveis de Ambiente

Adicione:
- `DATABASE_URL`
- `NEXTAUTH_URL`

### Passo 4: Escolher Plano

- **Free tier:** 750 horas/mês grátis
- ⚠️ O serviço "hiberna" após 15 min de inatividade

### Passo 5: Create Web Service

Aguarde o deploy!

---

# 📊 Comparação das Opções

| Recurso | Vercel | Netlify | Railway | Render |
|---------|--------|---------|---------|--------|
| **Preço** | Grátis | Grátis | $5/mês grátis | Grátis limitado |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Next.js** | Nativo | Bom | Bom | Bom |
| **Banco incluído** | ❌ | ❌ | ✅ | ✅ (pago) |
| **Deploy automático** | ✅ | ✅ | ✅ | ✅ |
| **Domínio grátis** | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **Hibernação** | ❌ | ❌ | ❌ | ✅ (free tier) |

## 🏆 Recomendação Final

### Para Next.js: **VERCEL** ⭐
- Melhor suporte
- Zero configuração
- Deploy mais rápido

### Com banco incluído: **RAILWAY**
- PostgreSQL grátis
- Tudo em um lugar
- Fácil de configurar

---

# 🐛 Resolução de Problemas

## Erro: "Module not found"

**Solução:**
```bash
# Na pasta nextjs_space
yarn install
git add yarn.lock
git commit -m "Update dependencies"
git push
```

## Erro: "Database connection failed"

**Verifique:**
1. `DATABASE_URL` está correta?
2. Banco está acessível externamente?
3. IP da Vercel está liberado no firewall?

**Solução:** Use Neon ou Supabase (permitem conexões externas)

## Deploy muito lento

**Motivos comuns:**
- Muitas dependências
- Sem cache

**Solução:**
- Use `yarn.lock` versionado
- Verifique logs de build

## Site está offline

**Verifique:**
1. Deployment passou? (veja logs)
2. Variáveis de ambiente configuradas?
3. Banco de dados está online?

---

# ✅ Checklist Final

Antes de considerar concluído:

- [ ] Código no GitHub
- [ ] Deploy feito com sucesso
- [ ] Site acessível na URL
- [ ] Banco de dados configurado
- [ ] `DATABASE_URL` configurada
- [ ] Dados de teste carregados
- [ ] Dashboard funcionando
- [ ] Upload de CSV funcionando
- [ ] Gráficos renderizando

---

# 🎉 Pronto!

Seu dashboard FinOps está hospedado GRATUITAMENTE e disponível 24/7!

**Próximos passos:**
1. Compartilhe a URL com sua equipe
2. Configure domínio próprio (opcional)
3. Ative notificações de deploy
4. Configure backup automático

---

**Precisa de ajuda? Consulte:**
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Suporte Netlify: https://docs.netlify.com

**Dashboard desenvolvido para otimização de custos em cloud computing** 🚀
