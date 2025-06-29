import axios from 'axios';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import { AnatelResponse } from './types';

const ANATEL_DOWNLOAD_URL = 'https://www.anatel.gov.br/dadosabertos/paineis_de_dados/radiodifusao/planos_basicos.zip';

export async function fetchAnatelData(downloadDir?: string): Promise<AnatelResponse> {
  // Criar diretório de download
  if (!downloadDir) {
    downloadDir = path.join(process.cwd(), 'anatel_data');
  }

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  console.log(`Downloading file from: ${ANATEL_DOWNLOAD_URL}`);
  const zipFilePath = path.join(downloadDir, 'planos_basicos.zip');

  try {
    // Headers para simular um navegador
    const headers = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://www.anatel.gov.br/dadosabertos/paineis_de_dados/radiodifusao/'
    };

    // Download do arquivo ZIP
    const response = await axios.get(ANATEL_DOWNLOAD_URL, {
      responseType: 'stream',
      headers
    });

    if (response.status !== 200) {
      throw new Error(`Failed to download file. Status code: ${response.status}`);
    }

    // Salvar o arquivo ZIP
    const writer = fs.createWriteStream(zipFilePath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`Download complete: ${zipFilePath}`);

    // Extrair o arquivo ZIP
    const extractDir = path.join(downloadDir, 'extracted');

    // Remover diretório de extração existente se houver
    if (fs.existsSync(extractDir)) {
      console.log(`Removing existing files in: ${extractDir}`);
      fs.rmSync(extractDir, { recursive: true, force: true });
    }

    // Criar diretório de extração
    fs.mkdirSync(extractDir, { recursive: true });

    console.log(`Extracting to: ${extractDir}`);
    await extract(zipFilePath, { dir: extractDir });

    // Remover o arquivo ZIP após extração
    console.log(`Removing ZIP file: ${zipFilePath}`);
    fs.unlinkSync(zipFilePath);

    console.log('Extraction complete!');

    return {
      filePath: zipFilePath,
      extractedPath: extractDir
    };

  } catch (error) {
    console.error('Error fetching data from Anatel:', error);
    throw new Error('Failed to fetch data from Anatel');
  }
}