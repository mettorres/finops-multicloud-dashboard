
# 📥 Guia Completo: Como Exportar Dados CSV de AWS, Azure e GCP

## 🎯 Visão Geral
Este guia detalha o passo a passo para exportar dados de custos e recursos das suas contas de nuvem para uso no dashboard FinOps.

---

## ☁️ AWS (Amazon Web Services)

### **Método 1: AWS Cost Explorer (Recomendado para começar)**

#### Passo 1: Acessar o Cost Explorer
1. Faça login no **AWS Management Console**: https://console.aws.amazon.com
2. Na barra de pesquisa superior, digite **"Cost Explorer"**
3. Clique em **"Cost Explorer"** nos resultados
4. Se for a primeira vez, clique em **"Enable Cost Explorer"** (pode levar até 24h para ativar)

#### Passo 2: Criar Relatório Customizado
1. No Cost Explorer, clique em **"Reports"** no menu lateral
2. Clique em **"Create new report"**
3. Configure:
   - **Report name**: "FinOps Export - [Data Atual]"
   - **Time range**: Selecione o período (últimos 30 dias, 90 dias, etc.)
   - **Granularity**: Escolha "Daily" para análises detalhadas

#### Passo 3: Adicionar Dimensões
1. Em **"Group by"**, adicione as dimensões:
   - Service (obrigatório)
   - Region
   - Usage Type
   - Instance Type (se usar EC2)
2. Clique em **"Apply"**

#### Passo 4: Exportar para CSV
1. Clique no botão **"Download CSV"** no canto superior direito
2. O arquivo será baixado com nome como: `cost-explorer-report-YYYY-MM-DD.csv`

#### Passo 5: Formatar para o Dashboard
Abra o CSV e certifique-se de que contenha essas colunas:
```
date,service,region,resource_id,cost,usage_quantity,usage_type
2025-10-01,EC2,us-east-1,i-1234567890abcdef,45.23,720,BoxUsage:t2.micro
2025-10-01,S3,us-west-2,my-bucket,12.45,1024,StandardStorage
```

---

### **Método 2: AWS Cost and Usage Report (CUR) - Para Análises Avançadas**

#### Passo 1: Configurar S3 Bucket
1. Acesse **S3 Console**: https://s3.console.aws.amazon.com
2. Clique em **"Create bucket"**
3. Nome do bucket: `finops-billing-data-[sua-empresa]`
4. Região: escolha a mais próxima
5. Clique em **"Create bucket"**

#### Passo 2: Criar Cost and Usage Report
1. Acesse **Billing and Cost Management Console**: https://console.aws.amazon.com/billing
2. No menu lateral, clique em **"Cost & Usage Reports"**
3. Clique em **"Create report"**
4. Configure:
   - **Report name**: `finops-detailed-report`
   - **Time granularity**: Daily
   - **Enable resource IDs**: ✅ Marcar
   - **Enable split cost allocation**: ✅ Marcar
5. Clique em **"Next"**

#### Passo 3: Configurar S3 Delivery
1. **S3 bucket**: Selecione o bucket criado anteriormente
2. **Report path prefix**: `billing-reports/`
3. **Compression type**: GZIP
4. **Report versioning**: Overwrite existing report
5. Clique em **"Next"** e depois **"Review and Complete"**

#### Passo 4: Baixar Relatório (disponível após 24h)
1. Volte para **S3 Console**
2. Navegue até: `finops-billing-data-[sua-empresa]/billing-reports/`
3. Baixe o arquivo `.csv.gz` mais recente
4. Extraia o arquivo usando WinRAR, 7-Zip ou similar

---

## 🔷 AZURE (Microsoft Azure)

### **Método 1: Cost Management + Billing**

#### Passo 1: Acessar Cost Management
1. Faça login no **Azure Portal**: https://portal.azure.com
2. Na barra de pesquisa, digite **"Cost Management"**
3. Clique em **"Cost Management + Billing"**

#### Passo 2: Navegar para Cost Analysis
1. No menu lateral, clique em **"Cost analysis"**
2. Selecione o escopo:
   - Subscription (Assinatura)
   - Resource Group (Grupo de recursos específico)
   - Management Group (para múltiplas assinaturas)

#### Passo 3: Configurar Visualização
1. Ajuste o período:
   - Clique no seletor de data no topo
   - Escolha: "Last 30 days", "Last 3 months", etc.
2. Configure agrupamentos:
   - Clique em **"Group by"**
   - Selecione: **"Service name"**, **"Location"**, **"Resource"**

#### Passo 4: Exportar Dados
1. Clique no ícone **"Export"** (📥) no topo da página
2. Escolha **"Download to CSV"**
3. O download começará automaticamente

#### Passo 5: Formatar para o Dashboard
O arquivo exportado deve ter este formato:
```
date,service,region,resource_name,cost,currency,meter_category
2025-10-01,Virtual Machines,East US,vm-production-01,78.45,USD,Compute
2025-10-01,Storage,West Europe,storage-backup,34.12,USD,Storage
```

---

### **Método 2: Exports Automatizados**

#### Passo 1: Criar Export Schedule
1. Em **Cost Management**, clique em **"Exports"**
2. Clique em **"+ Add"**
3. Configure:
   - **Export name**: `finops-monthly-export`
   - **Export type**: Daily export of month-to-date costs
   - **Start date**: Data de hoje

#### Passo 2: Configurar Storage Account
1. **Storage account**: Selecione ou crie uma
2. **Container**: `billing-exports`
3. **Directory**: `azure-costs/`
4. Clique em **"Create"**

#### Passo 3: Baixar Exports
1. Após a criação, o Azure gerará os arquivos diariamente
2. Acesse **Storage Account** > **Containers** > `billing-exports`
3. Baixe o CSV mais recente

---

## 🌐 GCP (Google Cloud Platform)

### **Método 1: Cloud Billing Console**

#### Passo 1: Acessar Billing Console
1. Faça login no **GCP Console**: https://console.cloud.google.com
2. No menu hambúrguer (☰), vá para **"Billing"**
3. Se tiver múltiplas contas de cobrança, selecione a desejada

#### Passo 2: Navegar para Reports
1. No menu lateral de Billing, clique em **"Reports"**
2. Você verá um gráfico de custos interativo

#### Passo 3: Configurar Filtros
1. **Time range**: Selecione o período desejado
2. **Group by**: Escolha dimensões
   - Project (obrigatório)
   - Service
   - SKU (Stock Keeping Unit)
   - Location
3. Aplique filtros adicionais se necessário

#### Passo 4: Exportar para CSV
1. Clique no ícone de **download** (seta para baixo) no canto superior direito
2. Escolha **"CSV"**
3. O arquivo será baixado como: `gcp-billing-report-YYYY-MM-DD.csv`

---

### **Método 2: BigQuery Export (Para Análises Avançadas)**

#### Passo 1: Configurar BigQuery Dataset
1. No GCP Console, vá para **BigQuery**
2. Clique no seu projeto
3. Clique em **"Create Dataset"**
4. Configure:
   - **Dataset ID**: `finops_billing_data`
   - **Location**: escolha a região mais próxima
5. Clique em **"Create dataset"**

#### Passo 2: Habilitar Billing Export
1. Volte para **Billing** > **"Billing export"**
2. Na aba **"BigQuery export"**, clique em **"Edit settings"**
3. Configure:
   - **Projects**: Selecione seu projeto
   - **Dataset name**: `finops_billing_data`
   - Marque **"Enable detailed usage cost"**
4. Clique em **"Save"**

#### Passo 3: Consultar Dados no BigQuery
Após 24h, os dados começarão a aparecer. Execute esta query:

```sql
SELECT 
  usage_start_time as date,
  service.description as service,
  location.region as region,
  project.name as resource_id,
  cost as cost,
  usage.amount as usage_quantity,
  usage.unit as usage_type
FROM `seu-projeto.finops_billing_data.gcp_billing_export_v1_XXXXXX`
WHERE DATE(usage_start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY date DESC
```

#### Passo 4: Exportar Resultados
1. Execute a query
2. Clique em **"Save results"** > **"CSV (local file)"**
3. O arquivo será baixado

---

### **Método 3: Cloud Storage Export (Mais Simples)**

#### Passo 1: Criar Bucket no Cloud Storage
1. Vá para **Cloud Storage** > **Buckets**
2. Clique em **"Create bucket"**
3. Configure:
   - **Name**: `finops-gcp-billing-exports`
   - **Location type**: Region
   - **Storage class**: Standard
4. Clique em **"Create"**

#### Passo 2: Configurar File Export
1. Vá para **Billing** > **"Billing export"**
2. Na aba **"File export"**, clique em **"Edit settings"**
3. Configure:
   - **Bucket**: Selecione `finops-gcp-billing-exports`
   - **Report prefix**: `billing-reports/`
   - **File type**: CSV
4. Clique em **"Save"**

#### Passo 3: Baixar Arquivos
1. Vá para **Cloud Storage** > **Buckets** > `finops-gcp-billing-exports`
2. Navegue até `billing-reports/`
3. Baixe o arquivo CSV mais recente

---

## ✅ Formato Final Esperado pelo Dashboard

Para que o dashboard funcione perfeitamente, seus CSVs devem ter estas colunas (com esses nomes exatos):

### Para AWS:
```csv
date,service,region,resource_id,cost,usage_quantity,usage_type
2025-10-01,EC2,us-east-1,i-abc123,45.23,720,BoxUsage:t2.micro
2025-10-02,S3,us-west-2,bucket-prod,12.45,1024,StandardStorage
```

### Para Azure:
```csv
date,service,region,resource_name,cost,currency,meter_category
2025-10-01,Virtual Machines,East US,vm-prod,78.45,USD,Compute
2025-10-02,Storage,West Europe,storage-01,34.12,USD,Storage
```

### Para GCP:
```csv
date,service,region,project_id,cost,usage_quantity,sku
2025-10-01,Compute Engine,us-central1,my-project,56.78,24,N1-Standard-2
2025-10-02,Cloud Storage,us-east1,my-project,23.45,500,Standard Storage
```

---

## 🔧 Ferramentas Úteis para Manipular CSVs

### Microsoft Excel
1. Abra o CSV no Excel
2. Use **"Text to Columns"** se necessário
3. Renomeie colunas conforme necessário
4. Salve como `.csv`

### Google Sheets
1. Faça upload do CSV para Google Drive
2. Abra com Google Sheets
3. Edite e renomeie colunas
4. **File** > **Download** > **Comma-separated values (.csv)**

### Python (para grandes volumes)
```python
import pandas as pd

# Ler CSV
df = pd.read_csv('billing-export.csv')

# Renomear colunas
df.rename(columns={
    'UsageStartDate': 'date',
    'ProductName': 'service',
    'Region': 'region',
    'ResourceId': 'resource_id',
    'Cost': 'cost'
}, inplace=True)

# Salvar formatado
df.to_csv('formatted-billing.csv', index=False)
```

---

## 📤 Próximos Passos Após Exportar

1. ✅ **Verifique o formato** do CSV exportado
2. ✅ **Renomeie colunas** se necessário
3. ✅ **Acesse o dashboard** em: https://finops-dashboard-krwqlf.abacusai.app/upload
4. ✅ **Faça upload** do arquivo CSV
5. ✅ **Visualize insights** no dashboard

---

## 🆘 Solução de Problemas Comuns

### Erro: "Colunas não encontradas"
- Verifique se os nomes das colunas estão exatamente como especificado acima
- Use Excel/Sheets para renomear conforme necessário

### Erro: "Formato de data inválido"
- Datas devem estar no formato: `YYYY-MM-DD` (ex: 2025-10-23)
- Evite formatos como `DD/MM/YYYY` ou `MM-DD-YY`

### Arquivo muito grande
- Divida em períodos menores (ex: upload mensal separado)
- Use ferramentas como Python pandas para filtrar dados desnecessários

### Dados não aparecem no dashboard
- Certifique-se de ter selecionado o provedor correto (AWS/Azure/GCP)
- Verifique se o upload foi concluído com sucesso
- Aguarde alguns segundos e recarregue a página

---

## 💡 Dicas Profissionais

1. **Automatize**: Configure exports automáticos mensais nos consoles
2. **Padronize**: Mantenha sempre a mesma estrutura de colunas
3. **Archive**: Guarde cópias dos CSVs originais
4. **Valide**: Sempre verifique os totais antes e após o upload
5. **Tags**: Use tags nos recursos para melhor categorização

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas ou encontrar problemas:
1. Revise este guia cuidadosamente
2. Verifique os logs de erro no dashboard
3. Entre em contato com o suporte técnico com:
   - Provedor de nuvem (AWS/Azure/GCP)
   - Mensagem de erro exata
   - Screenshot do problema

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0

