
# 📊 FinOps Dashboard - Documentação do Código

## 🎯 Visão Geral

Dashboard completo de FinOps desenvolvido em **Next.js 14** com **TypeScript**, **Prisma**, **PostgreSQL** e **Recharts** para visualizações avançadas.

---

## 📁 Estrutura Principal

```
nextjs_space/
├── app/                          # Rotas e páginas do Next.js 14
│   ├── page.tsx                  # Dashboard Principal
│   ├── executive/page.tsx        # Dashboard Executivo
│   ├── forecast/page.tsx         # Projeções de Custos
│   ├── compute/page.tsx          # Métricas de Computação
│   ├── storage/page.tsx          # Métricas de Storage
│   ├── modernization/page.tsx    # Recomendações de Modernização
│   ├── upload/page.tsx           # Upload de CSV
│   ├── aws/page.tsx              # Visão específica AWS
│   ├── azure/page.tsx            # Visão específica Azure
│   ├── gcp/page.tsx              # Visão específica GCP
│   └── api/                      # API Routes (Backend)
│       ├── dashboard/route.ts    # Dados consolidados do dashboard
│       ├── forecast/route.ts     # Forecast e projeções
│       ├── compute-metrics/route.ts  # Métricas de CPU/RAM/Rede
│       ├── storage-metrics/route.ts  # Métricas de S3/Blob/Storage
│       ├── modernization/route.ts    # Recomendações estratégicas
│       └── upload/route.ts       # Processamento de CSV
│
├── components/                   # Componentes React
│   ├── dashboard-view.tsx        # Componente principal do dashboard
│   ├── executive-dashboard.tsx   # Dashboard C-Level
│   ├── forecast-view.tsx         # Visualização de projeções
│   ├── compute-metrics-view.tsx  # Análise de computação
│   ├── storage-metrics-view.tsx  # Análise de storage
│   ├── modernization-view.tsx    # Roadmap de modernização
│   ├── sidebar.tsx               # Menu lateral
│   ├── top-bar.tsx               # Barra superior
│   ├── dashboard-layout.tsx      # Layout principal
│   ├── metric-card.tsx           # Cards de métricas
│   ├── chart-wrapper.tsx         # Wrapper para gráficos
│   └── ui/                       # Componentes UI (shadcn/ui)
│
├── lib/                          # Utilitários e configurações
│   ├── db.ts                     # Cliente Prisma
│   ├── types.ts                  # Tipos TypeScript
│   └── utils.ts                  # Funções auxiliares
│
├── prisma/                       # Banco de Dados
│   └── schema.prisma             # Schema do PostgreSQL
│
└── scripts/                      # Scripts auxiliares
    └── seed.ts                   # Popular BD com dados demo
```

---

## 🔑 Principais Componentes

### 1. **Dashboard Principal** (`components/dashboard-view.tsx`)

**Funcionalidades:**
- Visão consolidada multi-cloud (AWS, Azure, GCP)
- Métricas-chave: Custo Total, Savings, Recursos Ociosos, Recomendações
- Gráficos: Tendência de custos, Distribuição por cloud, Top serviços
- Forecast accuracy circular

**APIs utilizadas:**
```typescript
GET /api/dashboard
// Retorna: summary, cloudData, trendData, topServices
```

---

### 2. **Executive Dashboard** (`components/executive-dashboard.tsx`)

**Funcionalidades:**
- Visão estratégica para C-Level
- Índice de Eficiência, Potencial de Economia
- Forecast vs Real (gráfico de área)
- Oportunidades de economia categorizadas
- Utilização de infraestrutura (CPU, RAM, Rede)

**APIs utilizadas:**
```typescript
GET /api/dashboard
GET /api/forecast?horizon=90
GET /api/compute-metrics
```

---

### 3. **Forecast View** (`components/forecast-view.tsx`)

**Funcionalidades:**
- Projeções para 30, 60 e 90 dias
- Histórico vs Forecast (gráficos de área)
- Cenários: Otimista (-30%), Realista, Pessimista (+30%)
- Tendência de crescimento

**API utilizada:**
```typescript
GET /api/forecast?horizon=90
// Retorna: historical, forecast, trends, scenarios
```

**Algoritmo de Forecast:**
- Regressão linear simples
- Adiciona crescimento de 5% no horizonte
- Confiança diminui ao longo do tempo (95% → 80%)

---

### 4. **Compute Metrics** (`components/compute-metrics-view.tsx`)

**Funcionalidades:**
- Análise de EC2, VMs, Compute Engine
- Utilização: CPU, Memória, Rede
- Categorias: Subutilizado (<20%), Otimizado (20-70%), Sobrecarregado (>70%)
- Top 10 recursos com maior desperdício
- Potencial de Rightsizing

**API utilizada:**
```typescript
GET /api/compute-metrics
// Retorna: summary, categories, topWasters, performanceByCloud
```

---

### 5. **Storage Metrics** (`components/storage-metrics-view.tsx`)

**Funcionalidades:**
- Análise de S3, Azure Blob, Cloud Storage
- Crescimento mês a mês
- Distribuição por classe de storage (Standard, IA, Glacier)
- Oportunidades de otimização:
  - Lifecycle policies (30% economia)
  - Remoção de snapshots antigos (15% economia)
  - Compressão de dados (20% economia)

**API utilizada:**
```typescript
GET /api/storage-metrics
// Retorna: summary, storageByClass, storageByCloud, optimizations
```

---

### 6. **Modernization View** (`components/modernization-view.tsx`)

**Funcionalidades:**
- Recomendações estratégicas de modernização
- Exemplos:
  - EC2 → EKS/ECS (containers)
  - VMs → Azure Functions (serverless)
  - Monolith → Microservices
- ROI detalhado (3 anos)
- Arquitetura atual vs proposta
- Business case completo

**API utilizada:**
```typescript
GET /api/modernization
// Retorna: recommendations, maturityScore
```

---

## 🗄️ Banco de Dados (Prisma Schema)

### Principais Tabelas:

1. **CloudProvider** - Clouds configurados (AWS, Azure, GCP)
2. **CloudService** - Serviços (EC2, S3, Azure VM, etc)
3. **Cost** - Registros de custos diários
4. **Resource** - Recursos (instâncias, volumes, etc)
5. **Recommendation** - Recomendações de otimização
6. **Savings** - Economias realizadas

### Relacionamentos:
```
CloudProvider (1) → (N) CloudService
CloudProvider (1) → (N) Cost
CloudService (1) → (N) Cost
CloudProvider (1) → (N) Resource
Resource (1) → (N) Recommendation
```

---

## 🎨 Visualizações (Recharts)

### Tipos de Gráficos Utilizados:

1. **AreaChart** - Tendências e forecast
2. **BarChart** - Top serviços, categorias
3. **PieChart** - Distribuição por cloud, storage classes
4. **LineChart** - Cenários de projeção

### Cores e Temas:
- **AWS**: #FF9900 (laranja)
- **Azure**: #0078D4 (azul)
- **GCP**: #4285F4 (azul claro)
- Dark mode completo com `next-themes`

---

## 📤 Upload de CSV

### Formato Esperado:

**Arquivo CSV:**
```csv
date,cloud,service,cost,category,region,usageUnit
2024-01-01,aws,EC2,1250.50,compute,us-east-1,Hours
2024-01-01,aws,S3,350.25,storage,us-east-1,GB-Month
```

**Campos obrigatórios:**
- `date` - Data (YYYY-MM-DD)
- `cloud` - aws | azure | gcp
- `service` - Nome do serviço
- `cost` - Custo em USD
- `category` - compute | storage | network | database | other

### API de Upload:

```typescript
POST /api/upload
Content-Type: multipart/form-data

{
  file: [CSV File],
  cloud: "aws" | "azure" | "gcp"
}

// Retorna:
{
  success: true,
  recordsImported: 1500,
  summary: { ... }
}
```

---

## 🚀 Como Rodar Localmente

### 1. Instalar dependências:
```bash
cd nextjs_space
yarn install
```

### 2. Configurar banco de dados:
```bash
# Editar .env com suas credenciais PostgreSQL
# Depois rodar:
npx prisma generate
npx prisma db push
```

### 3. Popular com dados demo (opcional):
```bash
npx prisma db seed
```

### 4. Rodar em desenvolvimento:
```bash
yarn dev
# Acesse: http://localhost:3000
```

### 5. Build para produção:
```bash
yarn build
yarn start
```

---

## 🔧 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Next.js | 14.2.28 | Framework React com SSR |
| TypeScript | 5.2.2 | Type safety |
| Prisma | 6.7.0 | ORM para PostgreSQL |
| Recharts | 2.15.3 | Gráficos e visualizações |
| Tailwind CSS | 3.3.3 | Estilização |
| shadcn/ui | - | Componentes UI |
| Framer Motion | 10.18.0 | Animações |
| date-fns | 3.6.0 | Manipulação de datas |

---

## 📊 APIs Disponíveis

### `/api/dashboard`
Retorna dados consolidados do dashboard principal.

**Query params:**
- `clouds` - Filtrar por clouds (ex: `?clouds=aws,azure`)
- `from` - Data inicial (ISO 8601)
- `to` - Data final (ISO 8601)

**Response:**
```json
{
  "summary": {
    "totalCost": "12500.00",
    "totalSavings": "2300.00",
    "savingsPercent": "18.4",
    "idleResourcesCount": 45,
    "recommendationsCount": 12,
    "forecastAccuracy": "85.2"
  },
  "cloudData": [...],
  "trendData": [...],
  "topServices": [...]
}
```

---

### `/api/forecast`
Gera projeções de custos baseadas em tendências históricas.

**Query params:**
- `horizon` - Dias de projeção (padrão: 90)
- `clouds` - Filtrar por clouds

**Response:**
```json
{
  "historical": [...],
  "forecast": [...],
  "trends": {
    "currentDailyAverage": "420.50",
    "trendPercent": "12.3",
    "projectedMonthlyCost": "12615.00"
  },
  "scenarios": {
    "optimistic": [...],
    "realistic": [...],
    "pessimistic": [...]
  }
}
```

---

### `/api/compute-metrics`
Análise de recursos de computação.

**Response:**
```json
{
  "summary": {
    "totalResources": 120,
    "totalCurrentCost": "8500.00",
    "totalSavings": "1200.00",
    "avgUtilization": {
      "cpu": "35.2",
      "memory": "42.8"
    }
  },
  "categories": {
    "underutilized": {
      "count": 45,
      "potentialSavings": "900.00"
    },
    "rightSized": { "count": 60 },
    "overutilized": { "count": 15 }
  },
  "topWasters": [...]
}
```

---

### `/api/storage-metrics`
Análise de custos de armazenamento.

**Response:**
```json
{
  "summary": {
    "totalCost": "4200.00",
    "growthPercent": "15.2"
  },
  "storageByClass": [
    { "class": "Standard", "cost": "2100.00", "percent": "50.0" },
    { "class": "IA", "cost": "1050.00", "percent": "25.0" }
  ],
  "optimizations": [...]
}
```

---

### `/api/modernization`
Recomendações de modernização cloud.

**Response:**
```json
{
  "summary": {
    "totalPotentialSavings": "3500.00",
    "totalRecommendations": 8
  },
  "maturityScore": {
    "current": 65,
    "target": 85,
    "areas": {
      "containerization": 45,
      "serverless": 60,
      "automation": 70
    }
  },
  "recommendations": [
    {
      "id": "...",
      "title": "Migrar EC2 para EKS",
      "currentArchitecture": "EC2 Auto Scaling Groups",
      "proposedArchitecture": "Amazon EKS com Fargate",
      "monthlySavings": "1200.00",
      "roi": { "year1Savings": "14400.00" },
      "businessBenefits": [...],
      "risks": [...]
    }
  ]
}
```

---

## 🎯 KPIs e Métricas

### Métricas Principais:
1. **Total Cost** - Custo total consolidado
2. **Savings Percent** - % de economia realizada
3. **Idle Resources** - Recursos sem uso há 14+ dias
4. **Utilization** - CPU/RAM/Network average
5. **Forecast Accuracy** - Precisão das projeções
6. **Growth Rate** - Taxa de crescimento mensal
7. **Cost per Cloud** - Distribuição por provedor
8. **Top Services** - Serviços com maior custo

### Categorização de Recursos:
- **Subutilizado**: CPU < 20% → Rightsizing
- **Otimizado**: CPU 20-70% → Manter
- **Sobrecarregado**: CPU > 70% → Upgrade

---

## 🎨 Design System

### Cores Principais:
```css
/* Blues */
--blue-500: #3b82f6
--blue-600: #2563eb

/* Greens */
--green-500: #10b981
--green-600: #059669

/* Reds */
--red-500: #ef4444
--red-600: #dc2626

/* Purples */
--purple-500: #8b5cf6
--purple-600: #7c3aed
```

### Gradientes:
- Dashboard: `from-slate-50 via-blue-50 to-indigo-100`
- Sidebar: `from-slate-50 to-slate-100`
- Buttons: `from-blue-500 to-purple-600`

---

## 📝 Notas Importantes

1. **Performance**: Dados são consultados via API Routes (Server-Side)
2. **Reatividade**: `useEffect` + `fetch` para dados em tempo real
3. **Type Safety**: TypeScript completo em todo o projeto
4. **Acessibilidade**: Componentes shadcn/ui são accessibility-first
5. **Responsivo**: Mobile-first com Tailwind CSS

---

## 🔐 Segurança

- Validação de CSV no backend
- Sanitização de inputs
- Prisma previne SQL injection
- Variáveis de ambiente para credenciais
- CORS configurado

---

## 📈 Roadmap Futuro

- [ ] Integração com APIs nativas AWS/Azure/GCP
- [ ] Alertas em tempo real (WebSockets)
- [ ] Exports em PDF/Excel
- [ ] Multi-tenancy (usuários/empresas)
- [ ] ML para previsões avançadas
- [ ] Integração Slack/Teams
- [ ] Audit trail completo

---

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato ou abra uma issue no repositório.

**Desenvolvido com ❤️ para FinOps profissionais**
