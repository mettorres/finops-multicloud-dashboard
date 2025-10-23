
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface UploadStatus {
  type: 'success' | 'error' | 'info' | null;
  message: string;
  details?: string;
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: null, message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml'
    ];
    
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setUploadStatus({
        type: 'error',
        message: 'Formato inválido',
        details: 'Por favor, selecione um arquivo CSV ou Excel (.csv, .xlsx, .xls)'
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({
      type: 'info',
      message: 'Arquivo selecionado',
      details: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: 'error',
        message: 'Nenhum arquivo selecionado',
        details: 'Por favor, selecione um arquivo antes de fazer upload'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: 'Upload concluído com sucesso!',
          details: `${result.recordsProcessed || 0} registros processados`
        });
        setSelectedFile(null);
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Erro no upload',
          details: result.error || 'Ocorreu um erro ao processar o arquivo'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Erro de conexão',
        details: 'Não foi possível conectar ao servidor. Tente novamente.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = (cloudType: string) => {
    const templates = {
      aws: `data,resource_id,service,region,cost_usd,tags
2025-10-01,i-1234567890,EC2,us-east-1,125.50,env=production;team=backend
2025-10-01,db-mysql-prod,RDS,us-east-1,89.30,env=production;team=database
2025-10-02,i-1234567890,EC2,us-east-1,125.50,env=production;team=backend`,
      
      azure: `data,resource_id,service,region,cost_usd,tags
2025-10-01,vm-web-prod-01,Virtual Machines,eastus,95.80,env=production;team=frontend
2025-10-01,sql-db-main,Azure SQL Database,eastus,145.20,env=production;team=database
2025-10-02,vm-web-prod-01,Virtual Machines,eastus,95.80,env=production;team=frontend`,
      
      gcp: `data,resource_id,service,region,cost_usd,tags
2025-10-01,instance-1,Compute Engine,us-central1,110.40,env=production;team=backend
2025-10-01,bucket-storage,Cloud Storage,us-central1,25.60,env=production;team=data
2025-10-02,instance-1,Compute Engine,us-central1,110.40,env=production;team=backend`
    };

    const content = templates[cloudType as keyof typeof templates];
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${cloudType}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Upload de Dados
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Importe seus dados de billing da AWS, Azure e GCP
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Fazer Upload
                </CardTitle>
                <CardDescription>
                  Arraste e solte seu arquivo ou clique para selecionar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
                    }
                  `}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <FileSpreadsheet className={`w-16 h-16 mx-auto mb-4 ${
                    isDragging ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                  
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    {selectedFile ? selectedFile.name : 'Selecione ou arraste seu arquivo'}
                  </p>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Formatos aceitos: CSV, Excel (.xlsx, .xls)
                  </p>
                  
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file-input')?.click();
                    }}
                  >
                    Escolher Arquivo
                  </Button>
                </div>

                {/* Status Messages */}
                {uploadStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'}>
                      {uploadStatus.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                      {uploadStatus.type === 'error' && <AlertCircle className="h-4 w-4" />}
                      {uploadStatus.type === 'info' && <Info className="h-4 w-4" />}
                      <AlertTitle>{uploadStatus.message}</AlertTitle>
                      {uploadStatus.details && (
                        <AlertDescription>{uploadStatus.details}</AlertDescription>
                      )}
                    </Alert>
                  </motion.div>
                )}

                {/* Upload Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? 'Processando...' : 'Fazer Upload'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Como Preparar Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Badge variant="outline" className="shrink-0">1</Badge>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Exporte os dados de billing do seu console
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        AWS Cost Explorer, Azure Cost Management ou GCP Billing Reports
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge variant="outline" className="shrink-0">2</Badge>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Certifique-se que o arquivo contém as colunas necessárias
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        data, resource_id, service, region, cost_usd, tags
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge variant="outline" className="shrink-0">3</Badge>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Baixe nosso template e use como referência
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Templates disponíveis para AWS, Azure e GCP na aba ao lado
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge variant="outline" className="shrink-0">4</Badge>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Faça o upload e visualize os resultados
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Os dados serão processados e estarão disponíveis no dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Templates Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Templates
                </CardTitle>
                <CardDescription>
                  Baixe templates de exemplo para cada cloud
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="aws" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger 
                      value="aws"
                      onClick={() => {
                        // Tab switching handled by Tabs component
                      }}
                    >
                      AWS
                    </TabsTrigger>
                    <TabsTrigger 
                      value="azure"
                      onClick={() => {
                        // Tab switching handled by Tabs component
                      }}
                    >
                      Azure
                    </TabsTrigger>
                    <TabsTrigger 
                      value="gcp"
                      onClick={() => {
                        // Tab switching handled by Tabs component
                      }}
                    >
                      GCP
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="aws" className="space-y-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="mb-2">Template para dados da AWS:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Cost Explorer exports</li>
                        <li>Billing reports (CSV)</li>
                        <li>Tags estruturadas</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => downloadTemplate('aws')}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template AWS
                    </Button>
                  </TabsContent>

                  <TabsContent value="azure" className="space-y-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="mb-2">Template para dados do Azure:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Cost Management exports</li>
                        <li>Usage details (CSV)</li>
                        <li>Resource tags</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => downloadTemplate('azure')}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template Azure
                    </Button>
                  </TabsContent>

                  <TabsContent value="gcp" className="space-y-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="mb-2">Template para dados do GCP:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Billing exports to BigQuery</li>
                        <li>Cost table (CSV)</li>
                        <li>Labels estruturados</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => downloadTemplate('gcp')}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template GCP
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-900 dark:text-blue-100 font-medium mb-2">
                    💡 Dica
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Os templates incluem dados de exemplo. Substitua com seus dados reais mantendo o mesmo formato.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
