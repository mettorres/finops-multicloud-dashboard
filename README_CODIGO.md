# 🚀 FinOps Dashboard - Guia do Código-Fonte

## 📋 Visão Geral

Este é o código-fonte completo do **FinOps Dashboard**, uma aplicação Next.js 14 para análise e otimização de custos multi-cloud (AWS, Azure, GCP).

---

## 📁 Estrutura do Projeto

```
nextjs_space/
├── app/                      # Páginas e rotas (App Router do Next.js 14)
│   ├── api/                 # API Routes (endpoints backend)
│   │   ├── clouds/          # Endpoint para dados de provedores
│   │   ├── dashboard/       # Endpoint para métricas consolidadas
│   │   ├── resources/       # Endpoints de recursos
│   │   └── upload/          # Endpoint para upload de CSV
│   ├── aws/                 # Página específica da AWS
│   ├── azure/               # Página específica do Azure
│   ├── gcp/                 # Página específica do GCP
│   ├── comparison/          # Comparação multi-cloud
│   ├── idle-resources/      # Recursos ociosos
│   ├── recommendations/     # Recomendações de otimização
│   ├── savings/             # Análise de economia
│   ├── trends/              # Tendências temporais
│   ├── upload/              # Página de upload
│   └── page.tsx             # Dashboard principal
├── components/              # Componentes React reutilizáveis
│   ├── ui/                  # Componentes UI (Shadcn/ui)
│   └── *.tsx                # Componentes customizados
├── lib/                     # Utilitários e configurações
│   ├── db.ts                # Configuração Prisma/Database
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Funções utilitárias
├── prisma/                  # ORM e Schema do banco
│   └── schema.prisma        # Definição do schema
├── public/                  # Arquivos estáticos
├── scripts/                 # Scripts de utilidades
│   └── seed.ts              # Seed do banco de dados
└── package.json             # Dependências do projeto
```

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **Shadcn/ui** - Componentes UI
- **Recharts** - Gráficos e visualizações
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **PostgreSQL** - Banco de dados (via Prisma)

---

## 📦 Como Usar em Outro Ambiente

### Pré-requisitos

- Node.js 18+ instalado
- Yarn ou npm
- PostgreSQL (ou outro banco compatível com Prisma)

### Passo 1: Baixar o Código

Baixe todo o conteúdo da pasta `nextjs_space/`

### Passo 2: Instalar Dependências

```bash
cd nextjs_space
yarn install
# ou
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/finops_db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Passo 4: Configurar o Banco de Dados

```bash
# Gerar cliente Prisma
yarn prisma generate

# Executar migrations
yarn prisma migrate dev

# (Opcional) Popular com dados de exemplo
yarn prisma db seed
```

### Passo 5: Executar em Desenvolvimento

```bash
yarn dev
```

Acesse: `http://localhost:3000`

### Passo 6: Build para Produção

```bash
yarn build
yarn start
```

---

## 📤 Funcionalidades Principais

### 1. Upload de Dados CSV
- Suporta AWS, Azure e GCP
- Validação automática de formato
- Parsing e armazenamento no banco

### 2. Dashboard Multi-Cloud
- Visão consolidada de custos
- Métricas de economia potencial
- Recursos ociosos identificados
- Recomendações de otimização

### 3. Análises Específicas por Provedor
- Páginas dedicadas para AWS, Azure e GCP
- Visualizações detalhadas por serviço
- Breakdown por região

### 4. Comparação Multi-Cloud
- Side-by-side dos três provedores
- Análise de custos relativos
- Identificação de oportunidades

### 5. Tendências Temporais
- Evolução de custos ao longo do tempo
- Projeções futuras
- Alertas de anomalias

---

## 🔧 Personalizações Comuns

### Alterar Cores do Tema

Edite `app/globals.css`:

```css
:root {
  --primary: 220 90% 56%;
  --secondary: 240 5% 96%;
  /* ... */
}
```

### Adicionar Novo Provedor de Nuvem

1. Crie nova página em `app/novo-provedor/page.tsx`
2. Adicione endpoint em `app/api/novo-provedor/route.ts`
3. Atualize schema Prisma se necessário
4. Adicione item no sidebar (`components/sidebar.tsx`)

### Modificar Métricas

Edite os cálculos em:
- `app/api/dashboard/route.ts` (métricas principais)
- `components/metric-card.tsx` (exibição)

---

## 📊 Formato de Dados CSV

### AWS
```csv
date,service,region,resource_id,cost,usage_quantity,usage_type
2025-10-01,EC2,us-east-1,i-abc123,45.23,720,BoxUsage:t2.micro
```

### Azure
```csv
date,service,region,resource_name,cost,currency,meter_category
2025-10-01,Virtual Machines,East US,vm-prod,78.45,USD,Compute
```

### GCP
```csv
date,service,region,project_id,cost,usage_quantity,sku
2025-10-01,Compute Engine,us-central1,my-project,56.78,24,N1-Standard-2
```

---

## 🔐 Segurança

- Todas as rotas de API validam dados de entrada
- Prisma protege contra SQL injection
- Variáveis sensíveis em `.env` (nunca commitadas)
- CORS configurado adequadamente

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub
2. Configure variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **AWS Amplify**: Suporte nativo para Next.js
- **Netlify**: Com plugin de Next.js
- **Railway**: Deploy com PostgreSQL integrado
- **DigitalOcean App Platform**: Container-based

---

## 📝 Licença

Este código foi gerado para uso pessoal/comercial. Você pode:
- ✅ Usar em projetos pessoais
- ✅ Usar em projetos comerciais
- ✅ Modificar livremente
- ✅ Distribuir (com ou sem modificações)

---

## 🆘 Suporte

Para dúvidas sobre o código:
1. Revise a documentação inline (comentários no código)
2. Consulte a documentação oficial do Next.js
3. Verifique issues comuns abaixo

### Issues Comuns

**Erro de build com Prisma:**
```bash
yarn prisma generate
```

**Porta 3000 em uso:**
```bash
yarn dev -p 3001
```

**Erro de conexão com banco:**
Verifique `DATABASE_URL` no `.env`

---

## 🎯 Próximos Passos Sugeridos

1. Configurar autenticação (NextAuth.js)
2. Adicionar integração direta com APIs de cloud
3. Implementar alertas automáticos por email
4. Criar relatórios PDF exportáveis
5. Dashboard personalizado por usuário

---

**Desenvolvido com Next.js + Prisma + TypeScript**

Última atualização: Outubro 2025
