import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// TODO: Configurar a URL real do Spectrum Board
const SPECTRUM_BOARD_API_URL = process.env.SPECTRUM_BOARD_URL || 'http://localhost:3000/api/upload';

export async function sendToSpectrumBoard(filePath: string): Promise<void> {
  try {
    console.log(`Enviando arquivo para Spectrum Board: ${filePath}`);

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    // Criar FormData para upload do arquivo
    const formData = new FormData();
    const fileStream = fs.createReadStream(filePath);
    formData.append('file', fileStream, {
      filename: 'plano_basico_formatado.csv',
      contentType: 'text/csv'
    });

    // Enviar arquivo
    const response = await axios.post(SPECTRUM_BOARD_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000 // 30 segundos timeout
    });

    console.log('Arquivo enviado para Spectrum Board com sucesso:', response.data);
    
  } catch (error) {
    console.error('Erro ao enviar arquivo para Spectrum Board:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
    }
    
    throw new Error('Failed to send data to Spectrum Board');
  }
}

export async function sendFormattedData(filePath: string): Promise<void> {
  return sendToSpectrumBoard(filePath);
}