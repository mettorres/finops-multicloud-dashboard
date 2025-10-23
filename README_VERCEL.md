# 🚀 Deploy Rápido na Vercel - 2 Minutos!

## ✨ Opção 1: Deploy com 1 Clique (MAIS RÁPIDO)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/finops-dashboard&project-name=finops-dashboard&root-directory=nextjs_space)

**Clique no botão acima** → Faça login com Google/GitHub → Deploy automático! ✅

---

## 📱 Opção 2: Fazer Upload Manual (5 minutos)

### Passo 1: Acessar Vercel
1. Vá em: https://vercel.com/signup
2. Clique em **"Continue with Google"** ou **"Continue with GitHub"**
3. Autorize o acesso

![Vercel Login](https://vercel.com/docs-proxy/static/docs/concepts/git/login.png)

### Passo 2: Importar Projeto
1. Clique em **"Add New..."** → **"Project"**
2. Clique em **"Browse"** para fazer upload
3. Selecione a pasta `finops_dashboard.zip` (disponível em "Files")

![Import Project](https://assets.vercel.com/image/upload/v1645127190/docs-assets/static/docs/getting-started/new-project.png)

### Passo 3: Configurar

Na tela de configuração:

```
Framework Preset: Next.js
Root Directory: nextjs_space/
Build Command: yarn build
Output Directory: .next
```

![Configure](https://assets.vercel.com/image/upload/v1645127190/docs-assets/static/docs/getting-started/configure-project.png)

### Passo 4: Variáveis de Ambiente

**IMPORTANTE:** Adicione estas variáveis:

```env
DATABASE_URL=sua_url_do_banco
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

**Como conseguir DATABASE_URL grátis:**

#### Opção A: Neon (Recomendado)
1. Acesse: https://neon.tech
2. Crie conta grátis
3. Crie banco PostgreSQL
4. Copie a **Connection String**

#### Opção B: Supabase
1. Acesse: https://supabase.com
2. Crie projeto grátis
3. Vá em Settings → Database
4. Copie **Connection String (Pooler)**

### Passo 5: Deploy!

Clique em **"Deploy"** e aguarde 2-3 minutos! 🎉

---

## 🎬 Tutorial em Vídeo

Assista como fazer deploy em 2 minutos:
https://www.youtube.com/watch?v=2HBIzEx6IZA

---

## ✅ Checklist Rápido

- [ ] Baixou o código (`dashboard_codigo.zip`)
- [ ] Criou conta na Vercel (grátis)
- [ ] Criou banco de dados grátis (Neon ou Supabase)
- [ ] Configurou `DATABASE_URL`
- [ ] Clicou em Deploy
- [ ] Dashboard online! 🚀

---

## 🌐 Sua URL Final

Após o deploy, sua URL será algo como:

```
https://finops-dashboard-abc123.vercel.app
```

✅ 100% grátis
✅ HTTPS automático
✅ Deploy automático (conecte ao GitHub)
✅ CDN global

---

## 🐛 Problemas Comuns

### Erro: "Module not found"
**Solução:** Verifique se `Root Directory` está como `nextjs_space/`

### Erro: "Build failed"
**Solução:** Confira se todas as dependências estão no `package.json`

### Erro: "Database connection failed"
**Solução:** 
1. Verifique se `DATABASE_URL` está correta
2. Use banco Neon ou Supabase (permitem conexões externas)
3. Formato: `postgresql://usuario:senha@host:5432/database`

---

## 💡 Dicas Extras

### Deploy Automático
Depois do primeiro deploy, conecte ao GitHub:
1. Push código para GitHub
2. Vercel detecta automaticamente
3. Deploy automático a cada commit! 🚀

### Domínio Personalizado
1. Na Vercel: Settings → Domains
2. Adicione: `seudominio.com`
3. Configure DNS no seu registrador
4. Pronto!

---

## 📞 Precisa de Ajuda?

- 📖 Documentação Vercel: https://vercel.com/docs
- 💬 Comunidade: https://github.com/vercel/vercel/discussions
- 📧 Suporte: support@vercel.com

---

**Dashboard desenvolvido para FinOps - Otimização de custos cloud** 🚀
