import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { PBTVDData, PlanoBasicoData } from './types';

/**
 * Extrai o nome do município de uma string no formato 'Município-UF'
 */
function extrairMunicipio(municipioUf: string): string {
  if (!municipioUf) return '';
  
  const partes = municipioUf.split('-');
  if (partes.length >= 1) {
    return partes[0].trim();
  }
  return '';
}

/**
 * Transforma os dados PBTVD em formato plano básico
 */
export async function formatPBTVDData(pbtvdFilePath: string, outputFilePath: string): Promise<PlanoBasicoData[]> {
  const records: PBTVDData[] = [];
  
  // Ler arquivo CSV
  const fileContent = fs.readFileSync(pbtvdFilePath, 'utf-8');
  
  return new Promise((resolve, reject) => {
    parse(fileContent, {
      columns: true,
      delimiter: ';',
      skip_empty_lines: true
    }, (err, data: PBTVDData[]) => {
      if (err) {
        reject(err);
        return;
      }

      // Transformar dados
      const transformedData: PlanoBasicoData[] = data.map(row => ({
        id: row['_id'] || '',
        IdtPlanoBasico: '',
        Pais: 'BRA',
        UF: row['UF PBTVD'] || '',
        CodMunicipio: '',
        Municipio: row['Município-UF'] ? extrairMunicipio(row['Município-UF']) : '',
        Canal: row['Canal PBTVD'] || '',
        Frequencia: row['Frequência PBTVD'] || '',
        Decalagem: '',
        Classe: row['Classe PBTVD'] || '',
        Servico: '',
        Carater: row['Caráter PBTVD'] === 'Primário' ? 'P' : 
                 row['Caráter PBTVD'] === 'Secundário' ? 'S' : '',
        Finalidade: '',
        Status: '',
        Entidade: '',
        CNPJ: '',
        LatitudeGMS: row['Latitude GMS PBTVD'] || '',
        LongitudeGMS: row['Longitude GMS PBTVD'] || '',
        Latitude: row['Latitude Decimal'] || '',
        Longitude: row['Longitude Decimal'] || '',
        ERP: row['ERP PBTVD'] || '',
        Altura: '',
        Limitacoes: '',
        Observacoes: '',
        Fistel: ''
      }));

      // Salvar arquivo formatado
      stringify(transformedData, {
        header: true,
        delimiter: ';'
      }, (err, output) => {
        if (err) {
          reject(err);
          return;
        }

        // Verificar se arquivo existe e avisar
        if (fs.existsSync(outputFilePath)) {
          console.log(`Arquivo existente será substituído: ${outputFilePath}`);
        }

        // Criar diretório se não existir
        const outputDir = path.dirname(outputFilePath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputFilePath, output);
        console.log(`Arquivo salvo com sucesso: ${outputFilePath}`);
        console.log(`${transformedData.length} registros processados.`);

        resolve(transformedData);
      });
    });
  });
}

/**
 * Processa os dados da Anatel: encontra o arquivo PBTVD, formata e salva
 */
export async function processAnatelData(extractedPath: string): Promise<string> {
  // Procurar arquivo PBTVD
  const files = fs.readdirSync(extractedPath);
  const pbtvdFile = files.find(file => file.includes('PBTVD') && file.endsWith('.csv'));
  
  if (!pbtvdFile) {
    throw new Error('Arquivo PBTVD não encontrado no diretório extraído');
  }

  const pbtvdFilePath = path.join(extractedPath, pbtvdFile);
  const outputDir = path.join(extractedPath, '..', 'formatted_data');
  const outputFilePath = path.join(outputDir, 'plano_basico_formatado.csv');

  console.log(`Processando arquivo de entrada: ${pbtvdFilePath}`);
  console.log(`Resultado será salvo em: ${outputFilePath}`);

  await formatPBTVDData(pbtvdFilePath, outputFilePath);

  return outputFilePath;
}