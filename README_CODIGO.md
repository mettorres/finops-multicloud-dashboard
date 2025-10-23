# 📝 Documentação do Código do Dashboard FinOps

## 🎯 Visão Geral

Este dashboard é uma aplicação **Next.js 14** com **TypeScript**, **Prisma ORM** e **PostgreSQL**.

## 🏗️ Arquitetura

### Stack Tecnológico

```
Frontend:  Next.js 14 + React 18 + TypeScript + Tailwind CSS
Backend:   Next.js API Routes (serverless)
Database:  PostgreSQL + Prisma ORM
Charts:    Recharts + Plotly
UI:        ShadcN UI + Radix UI
```

## 📂 Arquivos Essenciais para Rodar

### 1. `package.json` - Dependências e Scripts

```json
{
  "scripts": {
    "dev": "next dev",           // Modo desenvolvimento
    "build": "next build",        // Compilar para produção
    "start": "next start",        // Rodar em produção
    "lint": "next lint"           // Verificar código
  }
}
```

**Principais dependências:**
- `next`: Framework React
- `react`: Biblioteca de UI
- `@prisma/client`: ORM para banco
- `recharts`: Gráficos
- `tailwindcss`: Estilos

### 2. `next.config.js` - Configuração do Next.js

```javascript
const nextConfig = {
  distDir: '.next',              // Pasta de build
  output: 'standalone',          // Modo standalone para deploy
  eslint: {
    ignoreDuringBuilds: true,    // Ignora erros de lint no build
  },
  images: { 
    unoptimized: true            // Imagens não otimizadas
  },
};
```

### 3. `app/layout.tsx` - Layout Principal

```typescript
// Este é o layout raiz da aplicação
// Todos os componentes são renderizados dentro dele

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>  {/* Suporte a tema escuro/claro */}
          {children}
          <Toaster />      {/* Notificações toast */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**O que faz:**
- Define estrutura HTML base
- Importa fontes (Inter)
- Configura tema claro/escuro
- Adiciona sistema de notificações

### 4. `app/page.tsx` - Página Inicial

```typescript
import { DashboardView } from '@/components/dashboard-view';

export default function HomePage() {
  return <DashboardView />;
}
```

**O que faz:**
- Renderiza o dashboard principal
- É a rota `/` do site

### 5. `lib/db.ts` - Conexão com Banco de Dados

```typescript
import { PrismaClient } from '@prisma/client'

// Singleton pattern para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**O que faz:**
- Cria instância única do Prisma
- Reutiliza conexão em desenvolvimento
- Evita abrir múltiplas conexões com PostgreSQL

### 6. `prisma/schema.prisma` - Schema do Banco

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Exemplo de model
model CloudProvider {
  id          String  @id @default(cuid())
  name        String  @unique
  displayName String
  costs       Cost[]
  
  @@map("cloud_providers")
}
```

**O que faz:**
- Define estrutura das tabelas
- Cria relacionamentos entre dados
- Gera TypeScript types automáticos

## 🔄 Fluxo de Funcionamento

### 1. Inicialização

```
1. Next.js lê next.config.js
2. Carrega app/layout.tsx (layout global)
3. Renderiza app/page.tsx (página inicial)
4. Prisma conecta ao PostgreSQL via DATABASE_URL
```

### 2. Requisição de Dados

```
Component → API Route → Prisma → PostgreSQL → Response
```

Exemplo:

```typescript
// No componente (frontend)
const response = await fetch('/api/dashboard');
const data = await response.json();

// Na API route (backend)
// app/api/dashboard/route.ts
export async function GET() {
  const costs = await prisma.cost.findMany();
  return Response.json(costs);
}
```

### 3. Renderização

```
Server Side (SSR):
  - Next.js renderiza HTML no servidor
  - Envia HTML pronto para o navegador
  - Cliente faz hydration (adiciona interatividade)

Client Side:
  - React gerencia estado e re-renderiza
  - Fetches adicionais via API routes
```

## 🧩 Componentes Principais

### DashboardLayout

```typescript
// components/dashboard-layout.tsx
export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar />              {/* Menu lateral */}
      <div className="ml-64">  {/* Margem para sidebar */}
        <TopBar />             {/* Barra superior */}
        <main>
          {children}           {/* Conteúdo da página */}
        </main>
      </div>
    </div>
  );
}
```

### Sidebar

```typescript
// components/sidebar.tsx
export function Sidebar() {
  return (
    <aside className="fixed w-64 h-screen">
      <nav>
        <Link href="/">Dashboard</Link>
        <Link href="/executive">Executivo</Link>
        <Link href="/forecast">Previsões</Link>
        {/* ... mais links */}
      </nav>
    </aside>
  );
}
```

## 🔌 APIs do Backend

### Estrutura de API Route

```typescript
// app/api/dashboard/route.ts
import { prisma } from '@/lib/db';

// GET /api/dashboard
export async function GET(request: Request) {
  try {
    // Buscar dados do banco
    const data = await prisma.cost.findMany({
      where: { /* filtros */ },
      orderBy: { date: 'desc' }
    });
    
    // Retornar JSON
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard
export async function POST(request: Request) {
  const body = await request.json();
  
  // Criar no banco
  const newCost = await prisma.cost.create({
    data: body
  });
  
  return Response.json(newCost);
}
```

### APIs Disponíveis

```
GET  /api/dashboard          - Dashboard principal
GET  /api/executive          - KPIs executivos
GET  /api/forecast           - Previsões
GET  /api/recommendations    - Recomendações
GET  /api/compute-metrics    - Métricas de computação
GET  /api/storage-metrics    - Métricas de storage
POST /api/upload             - Upload de CSV
```

## 💾 Modelos de Dados (Prisma)

### Principais Models

```prisma
// Cloud Provider (AWS, Azure, GCP)
model CloudProvider {
  id          String   @id @default(cuid())
  name        String   @unique
  costs       Cost[]
}

// Custos
model Cost {
  id       String   @id
  cloudId  String
  costUSD  Decimal
  date     DateTime
  
  cloud    CloudProvider @relation(fields: [cloudId], references: [id])
}

// Recursos
model Resource {
  id                    String
  name                  String
  monthlyCostCurrent    Decimal
  potentialSavings      Decimal
}

// Recomendações
model Recommendation {
  id              String
  title           String
  potentialSaving Decimal
  priority        String
}
```

## 🎨 Sistema de Estilos (Tailwind)

### Configuração

```typescript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas
      },
    },
  },
};
```

### Classes Comuns Usadas

```css
/* Layout */
min-h-screen          /* Altura mínima da tela */
flex, flex-col        /* Flexbox */
grid, grid-cols-3     /* Grid */

/* Espaçamento */
p-6, px-4, py-2       /* Padding */
m-4, mx-auto, my-2    /* Margin */
gap-4, space-x-2      /* Gaps */

/* Cores */
bg-white              /* Background */
text-gray-900         /* Texto */
border-gray-200       /* Bordas */

/* Responsivo */
sm:w-full             /* Mobile */
md:w-1/2              /* Tablet */
lg:w-1/3              /* Desktop */
```

## 🚀 Como o Build Funciona

### 1. Processo de Build

```bash
yarn build
```

Executa:

```
1. TypeScript Compilation (tsc)
   - Verifica tipos
   - Compila .ts para .js

2. Next.js Build
   - Otimiza código
   - Gera páginas estáticas
   - Cria chunks de JavaScript
   - Otimiza imagens

3. Prisma Generate
   - Gera cliente Prisma
   - Cria tipos TypeScript

Output: pasta .next/ com app pronta
```

### 2. Estrutura do Build

```
.next/
├── server/           # Código do servidor
├── static/           # Assets estáticos
├── cache/            # Cache de build
└── standalone/       # Versão standalone
```

### 3. Deploy em Produção

```bash
# Opção 1: Usando yarn start
yarn build
yarn start

# Opção 2: Usando standalone
node .next/standalone/server.js
```

## 🔐 Variáveis de Ambiente

### Obrigatórias

```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
NEXTAUTH_URL="http://localhost:3000"
```

### Como São Usadas

```typescript
// Em qualquer lugar do código
const dbUrl = process.env.DATABASE_URL;

// Prisma lê automaticamente
// Next.js expõe apenas NEXT_PUBLIC_* no cliente
```

## 🧪 Como Testar

### Rodar Localmente

```bash
# 1. Instalar
cd nextjs_space
yarn install

# 2. Configurar banco
yarn prisma generate
yarn prisma db push

# 3. Rodar
yarn dev
```

### Acessar

- Dashboard: http://localhost:3000
- API: http://localhost:3000/api/dashboard

## 📊 Como os Gráficos Funcionam

### Recharts (Biblioteca Principal)

```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export function CostChart({ data }) {
  return (
    <LineChart data={data} width={600} height={300}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line dataKey="cost" stroke="#8884d8" />
    </LineChart>
  );
}
```

**Fluxo:**
1. Buscar dados da API
2. Formatar dados para Recharts
3. Passar para componente de gráfico
4. Recharts renderiza SVG

## 🔄 Hot Reload em Desenvolvimento

Quando você salva um arquivo:

```
1. Next.js detecta mudança
2. Recompila apenas o arquivo alterado
3. Envia update via WebSocket
4. Browser atualiza sem refresh
```

## 🐛 Debug e Logs

### No Terminal

```bash
# Modo desenvolvimento mostra logs detalhados
yarn dev

# Logs aparecerão aqui
[info] compiling /
[info] compiled successfully
```

### No Browser

```javascript
// Use console.log para debug
console.log('Dados recebidos:', data);

// Ou debugger
debugger; // Pausa execução
```

## 📦 Como Adicionar Nova Funcionalidade

### Exemplo: Nova Página

```typescript
// 1. Criar página
// app/nova-pagina/page.tsx
export default function NovaPagina() {
  return <div>Conteúdo</div>;
}

// 2. Adicionar link no Sidebar
// components/sidebar.tsx
<Link href="/nova-pagina">Nova Página</Link>

// 3. (Opcional) Criar API
// app/api/nova-pagina/route.ts
export async function GET() {
  return Response.json({ data: 'ok' });
}
```

## 🎓 Conceitos Importantes

### Server Components vs Client Components

```typescript
// Server Component (padrão)
// Roda no servidor, não tem interatividade
export default function ServerComp() {
  const data = await fetchData(); // OK
  return <div>{data}</div>;
}

// Client Component
// Roda no cliente, tem estado e eventos
'use client';
export default function ClientComp() {
  const [count, setCount] = useState(0); // OK
  return <button onClick={() => setCount(count + 1)}>
    {count}
  </button>;
}
```

### Hydration

```
1. Servidor gera HTML estático
2. Browser recebe e exibe HTML
3. JavaScript carrega
4. React "hidrata" HTML (adiciona eventos)
5. Página fica interativa
```

## 🔗 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

---

**Este documento explica como o dashboard funciona internamente**
