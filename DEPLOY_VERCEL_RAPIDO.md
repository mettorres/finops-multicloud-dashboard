# 🚀 Como Colocar seu Dashboard na Vercel em 2 Minutos

## ⚡ O Jeito MAIS RÁPIDO (Recomendado)

### Passo 1: Acesse a Vercel
**Link:** https://vercel.com/signup

### Passo 2: Crie sua Conta GRÁTIS
Escolha uma das opções:
- 🔵 **Continue with Google** (mais fácil)
- ⚫ **Continue with GitHub** (se você usa GitHub)
- 📧 **Continue with Email** (se preferir)

### Passo 3: Baixe o Código
1. Clique em **"Files"** no canto superior direito desta conversa
2. Baixe o arquivo: `dashboard_codigo.zip`
3. Extraia a pasta no seu computador

### Passo 4: Faça Upload na Vercel

**Opção A: Via Website (Mais Fácil)**
1. Na Vercel, clique em **"Add New..."** → **"Project"**
2. Arraste a pasta `finops_dashboard` para a Vercel
   
   OU
   
3. Clique em **"Browse"** e selecione a pasta

**IMPORTANTE:** Configure assim:
```
Framework: Next.js (detecta automaticamente)
Root Directory: nextjs_space/  ⚠️ CRUCIAL!
Build Command: yarn build
```

### Passo 5: Configurar Banco de Dados (Obrigatório)

Você precisa de um banco PostgreSQL GRÁTIS. Escolha uma opção:

#### 🟢 Opção 1: Neon (RECOMENDADO - 100% Grátis)

1. **Acesse:** https://console.neon.tech/signup
2. **Crie conta** (use Google para ser mais rápido)
3. **Crie um projeto:**
   - Nome: `finops-dashboard-db`
   - Region: Choose closest (Brasil/US)
   - PostgreSQL: versão 15
4. **Copie a Connection String:**
   ```
   postgresql://usuario:senha@ep-xxx.aws.neon.tech/neondb
   ```

#### 🔵 Opção 2: Supabase (Também 100% Grátis)

1. **Acesse:** https://supabase.com/dashboard
2. **Crie projeto** (grátis)
3. **Vá em:** Settings → Database
4. **Copie:** Connection String (Pooler)
5. **Substitua** `[YOUR-PASSWORD]` pela senha do projeto

### Passo 6: Adicionar Variável de Ambiente na Vercel

Na tela de deploy da Vercel:

1. Clique em **"Environment Variables"**
2. Adicione:
   ```
   Nome: DATABASE_URL
   Valor: [cole aqui a Connection String do Neon/Supabase]
   ```
3. Clique em **"Add"**

### Passo 7: DEPLOY! 🚀

1. Clique no botão **"Deploy"**
2. Aguarde 2-3 minutos enquanto a Vercel:
   - ✓ Instala as dependências
   - ✓ Compila o código
   - ✓ Gera as páginas
   - ✓ Coloca online

### Passo 8: Pronto! 🎉

Você verá uma tela de sucesso com:
- ✅ **URL do seu dashboard:** `https://seu-projeto.vercel.app`
- ✅ **Botão "Visit"** para acessar

---

## 🎯 Checklist Completo

Siga esta ordem:

- [ ] **1.** Criar conta Vercel (Google/GitHub)
- [ ] **2.** Baixar `dashboard_codigo.zip` (botão Files →)
- [ ] **3.** Criar banco grátis (Neon ou Supabase)
- [ ] **4.** Copiar Connection String do banco
- [ ] **5.** Fazer upload na Vercel
- [ ] **6.** Configurar `Root Directory: nextjs_space/`
- [ ] **7.** Adicionar variável `DATABASE_URL`
- [ ] **8.** Clicar em Deploy
- [ ] **9.** Aguardar 2-3 minutos
- [ ] **10.** Acessar sua URL! 🚀

**Tempo total: 5-10 minutos** ⏱️

---

## 🎬 Video Tutorial

Se preferir ver em vídeo como fazer deploy na Vercel:
- **Tutorial Oficial:** https://www.youtube.com/watch?v=2HBIzEx6IZA
- **Em Português:** https://www.youtube.com/results?search_query=como+fazer+deploy+vercel+portugues

---

## 💡 Dicas Importantes

### ✅ Depois do Deploy

Seu dashboard estará online em:
```
https://finops-dashboard-xxx.vercel.app
```

✓ 100% GRÁTIS para sempre  
✓ HTTPS automático  
✓ CDN global (rápido no mundo todo)  
✓ Sem limite de visitas*  

*Limite do plano grátis: 100GB bandwidth/mês (mais que suficiente!)

### 🔄 Atualizações Futuras

**Método 1: Upload Manual**
- Faça alterações no código
- Arraste novamente para Vercel
- Deploy automático!

**Método 2: GitHub (Recomendado)**
- Conecte o projeto ao GitHub
- Toda vez que você fizer push → Deploy automático! 🚀

### 🌐 Usar Seu Próprio Domínio

Quer usar `seusite.com` em vez de `.vercel.app`?

1. Na Vercel: **Settings** → **Domains**
2. Adicione seu domínio: `meufinops.com`
3. Configure no seu registrador (GoDaddy, Registro.br, etc):
   ```
   Tipo: CNAME
   Nome: @
   Valor: cname.vercel-dns.com
   ```
4. Aguarde 24-48h para propagar

---

## 🐛 Resolvendo Problemas

### ❌ Erro: "Root directory not found"
**Solução:** Certifique-se de configurar `Root Directory: nextjs_space/`

### ❌ Erro: "Build failed"
**Solução:** 
1. Verifique se extraiu todo o ZIP
2. Certifique-se de que a pasta `nextjs_space` existe
3. Tente fazer upload novamente

### ❌ Erro: "Cannot connect to database"
**Solução:**
1. Verifique se `DATABASE_URL` está correta
2. Teste a connection string no banco (Neon/Supabase)
3. Certifique-se de que não tem espaços extras

### ❌ Página em branco
**Solução:**
1. Abra o Console do navegador (F12)
2. Veja os erros
3. Geralmente é problema de DATABASE_URL

---

## 📞 Precisa de Mais Ajuda?

### Documentação Oficial
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs

### Comunidade
- **Discord Vercel:** https://vercel.com/discord
- **Fórum:** https://github.com/vercel/vercel/discussions

### Vídeos em Português
- YouTube: "como fazer deploy vercel"
- YouTube: "next.js deploy grátis"

---

## 🎉 Parabéns!

Agora você tem seu Dashboard FinOps hospedado GRATUITAMENTE! 🚀

**Próximos passos:**
1. ✅ Compartilhe a URL com sua equipe
2. ✅ Faça upload dos CSVs reais
3. ✅ Analise os custos da sua cloud
4. ✅ Economize dinheiro! 💰

---

**Dashboard FinOps - Otimização de Custos em AWS, Azure e GCP** ☁️

**100% Grátis · Open Source · Desenvolvido com Next.js e Vercel**
