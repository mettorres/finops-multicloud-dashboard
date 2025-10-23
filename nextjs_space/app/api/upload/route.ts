
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface CsvRow {
  data: string;
  resource_id: string;
  service: string;
  region: string;
  cost_usd: string;
  tags?: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    
    // Parse CSV
    let records: CsvRow[];
    try {
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Erro ao processar CSV. Verifique o formato do arquivo.' },
        { status: 400 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: 'Arquivo vazio ou sem dados válidos' },
        { status: 400 }
      );
    }

    // Validate required columns
    const requiredColumns = ['data', 'resource_id', 'service', 'region', 'cost_usd'];
    const firstRow = records[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { 
          error: 'Colunas obrigatórias faltando',
          details: `Colunas necessárias: ${requiredColumns.join(', ')}. Faltando: ${missingColumns.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Detect cloud provider from service names
    const detectCloudProvider = (serviceName: string): string => {
      const service = serviceName.toLowerCase();
      
      // AWS services
      if (service.includes('ec2') || service.includes('s3') || 
          service.includes('rds') || service.includes('lambda') ||
          service.includes('dynamodb') || service.includes('cloudfront')) {
        return 'aws';
      }
      
      // Azure services
      if (service.includes('virtual machines') || service.includes('storage accounts') ||
          service.includes('azure sql') || service.includes('app service') ||
          service.includes('cosmos db') || service.includes('functions')) {
        return 'azure';
      }
      
      // GCP services
      if (service.includes('compute engine') || service.includes('cloud storage') ||
          service.includes('cloud sql') || service.includes('cloud functions') ||
          service.includes('bigquery') || service.includes('cloud run')) {
        return 'gcp';
      }
      
      // Default to AWS if can't detect
      return 'aws';
    };

    let processedCount = 0;
    const errors: string[] = [];

    // Process each record
    for (const [index, record] of records.entries()) {
      try {
        // Parse date
        const date = new Date(record.data);
        if (isNaN(date.getTime())) {
          errors.push(`Linha ${index + 2}: Data inválida - ${record.data}`);
          continue;
        }

        // Parse cost
        const costUsd = parseFloat(record.cost_usd);
        if (isNaN(costUsd)) {
          errors.push(`Linha ${index + 2}: Custo inválido - ${record.cost_usd}`);
          continue;
        }

        // Detect cloud provider
        const cloudName = detectCloudProvider(record.service);

        // Get or create cloud provider
        let cloud = await prisma.cloudProvider.findUnique({
          where: { name: cloudName }
        });

        if (!cloud) {
          // Create cloud provider if doesn't exist
          const cloudDisplayNames: Record<string, string> = {
            'aws': 'Amazon Web Services',
            'azure': 'Microsoft Azure',
            'gcp': 'Google Cloud Platform'
          };

          const cloudColors: Record<string, string> = {
            'aws': '#FF9900',
            'azure': '#0078D4',
            'gcp': '#4285F4'
          };

          const cloudIcons: Record<string, string> = {
            'aws': 'AmazonWebServices',
            'azure': 'MicrosoftAzure',
            'gcp': 'GoogleCloud'
          };

          cloud = await prisma.cloudProvider.create({
            data: {
              name: cloudName,
              displayName: cloudDisplayNames[cloudName] || cloudName.toUpperCase(),
              color: cloudColors[cloudName] || '#6B7280',
              icon: cloudIcons[cloudName] || 'Cloud'
            }
          });
        }

        // Get or create service
        let service = await prisma.cloudService.findFirst({
          where: {
            name: record.service,
            cloudId: cloud.id
          }
        });

        if (!service) {
          service = await prisma.cloudService.create({
            data: {
              name: record.service,
              displayName: record.service,
              category: 'Compute', // Default category
              cloudId: cloud.id,
              icon: 'Server' // Default icon
            }
          });
        }

        // Parse tags if present
        const tags = record.tags 
          ? record.tags.split(';').reduce((acc, tag) => {
              const [key, value] = tag.split('=');
              if (key && value) {
                acc[key.trim()] = value.trim();
              }
              return acc;
            }, {} as Record<string, string>)
          : {};

        // Extract accountId from tags or use default
        const accountId = typeof tags === 'object' && tags !== null && 'account' in tags 
          ? String(tags['account']) 
          : 'default-account';

        // Create cost record (we'll use create instead of upsert since there's no unique constraint)
        await prisma.cost.create({
          data: {
            cloudId: cloud.id,
            serviceId: service.id,
            resourceId: record.resource_id,
            date: date,
            costUSD: costUsd,
            region: record.region,
            accountId: accountId,
            tags: tags
          }
        });

        processedCount++;
      } catch (error) {
        errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return NextResponse.json({
      success: true,
      recordsProcessed: processedCount,
      totalRecords: records.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Return first 10 errors
      message: `${processedCount} de ${records.length} registros processados com sucesso`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar upload', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
