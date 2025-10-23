
# 🚀 FinOps Dashboard

> Dashboard profissional de FinOps para análise e otimização de custos multi-cloud (AWS, Azure, GCP)

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.7-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)

## 📊 Visão Geral

Dashboard executivo completo para profissionais de FinOps que precisam analisar, otimizar e prever custos de infraestrutura cloud. Suporta AWS, Azure e GCP com visualizações interativas e recomendações inteligentes.

### ✨ Funcionalidades Principais

- **📤 Upload de Dados** - Sistema de upload CSV com drag-and-drop para importação de dados de billing
- **📊 Dashboard Executivo** - KPIs e métricas consolidadas para apresentação a diretoria
- **🔮 Forecasting** - Previsão de custos baseada em tendências históricas
- **💻 Métricas de Computação** - Análise detalhada de CPU, memória e utilização de instâncias
- **💾 Métricas de Storage** - Monitoramento de S3/Blob Storage e otimização de custos
- **🔄 Recomendações de Modernização** - Sugestões para migração (EC2→EKS, recursos desatualizados)
- **💰 Oportunidades de Economia** - Identificação automática de recursos ociosos e subutilizados
- **📈 Análise de Tendências** - Visualizações históricas de custos e consumo
- **🌐 Multi-Cloud** - Suporte completo para AWS, Azure e GCP
- **🎨 Dark Mode** - Interface moderna com suporte a tema claro/escuro

## 🖼️ Screenshots

### Dashboard Executivo
![Executive Dashboard](public/og-image.png)

### Upload de Dados
Interface intuitiva para importação de dados de billing das clouds.

### Análise de Forecast
Previsões precisas baseadas em machine learning e análise de tendências.

## 🛠️ Tecnologias

- **Framework:** Next.js 14.2 (App Router)
- **Linguagem:** TypeScript 5.2
- **Database:** PostgreSQL com Prisma ORM
- **UI:** TailwindCSS + shadcn/ui
- **Gráficos:** Recharts + Plotly.js
- **Formulários:** React Hook Form + Zod
- **Estado:** Zustand + SWR

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+ ou 20+
- Yarn (recomendado) ou npm
- PostgreSQL (ou use um database remoto)

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/finops-dashboard.git
cd finops-dashboard
```

2. **Instale as dependências:**
```bash
cd nextjs_space
yarn install
```

3. **Configure as variáveis de ambiente:**
```bash
# Crie o arquivo .env na pasta nextjs_space
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/finops"
```

4. **Configure o banco de dados:**
```bash
# Execute as migrations
yarn prisma migrate dev

# (Opcional) Popule com dados de exemplo
yarn prisma db seed
```

5. **Inicie o servidor de desenvolvimento:**
```bash
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
finops_dashboard/
├── nextjs_space/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── api/               # API Routes
│   │   │   ├── upload/        # Upload de CSVs
│   │   │   ├── forecast/      # Previsões de custo
│   │   │   ├── compute-metrics/ # Métricas de computação
│   │   │   └── ...
│   │   ├── executive/         # Dashboard executivo
│   │   ├── forecast/          # Página de forecasting
│   │   ├── upload/            # Página de upload
│   │   └── ...
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (shadcn)
│   │   ├── executive-dashboard.tsx
│   │   ├── forecast-view.tsx
│   │   └── ...
│   ├── lib/                   # Utilitários e tipos
│   │   ├── db.ts             # Cliente Prisma
│   │   ├── types.ts          # Definições TypeScript
│   │   └── utils.ts          # Funções auxiliares
│   ├── prisma/
│   │   └── schema.prisma     # Schema do banco de dados
│   └── public/               # Assets estáticos
├── GUIA_EXPORTACAO_CSV.md    # Guia de exportação de dados
└── README_CODIGO.md          # Documentação técnica
```

## 📤 Como Usar o Sistema de Upload

1. **Prepare seus dados:**
   - Exporte os dados de billing das suas clouds (AWS Cost Explorer, Azure Cost Management, GCP Billing)
   - Formate os CSVs conforme os templates fornecidos

2. **Faça o upload:**
   - Acesse a página `/upload`
   - Arraste e solte o arquivo CSV ou clique para selecionar
   - O sistema valida automaticamente o formato e estrutura

3. **Visualize os insights:**
   - Navegue pelas diferentes páginas do dashboard
   - Explore métricas, forecasts e recomendações

📄 **Consulte o [GUIA_EXPORTACAO_CSV.md](GUIA_EXPORTACAO_CSV.md)** para instruções detalhadas de formatação.

## 🔑 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# (Opcional) APIs das Clouds - Para integração futura
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AZURE_SUBSCRIPTION_ID=""
# GOOGLE_CLOUD_PROJECT_ID=""
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor de desenvolvimento

# Build
yarn build            # Cria build de produção
yarn start            # Inicia servidor de produção

# Database
yarn prisma generate  # Gera Prisma Client
yarn prisma migrate dev  # Executa migrations
yarn prisma studio    # Abre Prisma Studio (GUI)
yarn prisma db seed   # Popula banco com dados de exemplo

# Qualidade
yarn lint             # Executa ESLint
```

## 📊 Métricas e KPIs Suportados

- **Custos:** Total Cost, Cost per Service, Cost per Region, Cost Trends
- **Computação:** CPU Utilization, Memory Usage, Instance Count, Reserved vs On-Demand
- **Storage:** Storage Usage, Growth Rate, Cost per GB, Unused Storage
- **Otimização:** Idle Resources, Rightsizing Recommendations, Reserved Instance Coverage
- **Forecasting:** 30/60/90 day cost predictions, Trend analysis, Anomaly detection

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Documentação Adicional

- [Guia de Exportação CSV](GUIA_EXPORTACAO_CSV.md) - Como exportar dados das clouds
- [Documentação do Código](README_CODIGO.md) - Detalhes técnicos da implementação
- [Guia de Exportação PDF](GUIA_EXPORTACAO_CSV.pdf) - Versão PDF do guia

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/finops-dashboard/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs observado
- Screenshots (se aplicável)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

Desenvolvido para profissionais de FinOps que buscam excelência em análise e otimização de custos cloud.

---

⭐ **Se este projeto foi útil, considere dar uma estrela!**

🌐 **Demo:** [finops-dashboard-tfp0w0.abacusai.app](https://finops-dashboard-tfp0w0.abacusai.app)
