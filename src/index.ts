import cron from 'node-cron';
import { fetchAnatelData } from './fetchAnatelData';
import { processAnatelData } from './formatData';
import { sendFormattedData } from './sendToSpectrumBoard';

async function runIntegration() {
  try {
    console.log('=== Iniciando integração Anatel-Spectrum Board ===');
    
    // 1. Baixar e extrair dados da Anatel
    console.log('1. Baixando dados da Anatel...');
    const anatelResponse = await fetchAnatelData();
    
    // 2. Processar e formatar dados PBTVD
    console.log('2. Formatando dados PBTVD...');
    const formattedFilePath = await processAnatelData(anatelResponse.extractedPath);
    
    // 3. Enviar dados formatados para o Spectrum Board
    console.log('3. Enviando dados para Spectrum Board...');
    await sendFormattedData(formattedFilePath);
    
    console.log('=== Integração concluída com sucesso! ===');
  } catch (error) {
    console.error('=== Erro na integração ===', error);
  }
}

// Executa imediatamente ao iniciar
console.log('Serviço de integração Anatel-Spectrum Board iniciado');
runIntegration();

// Agenda para rodar de hora em hora (0 minutos de cada hora)
cron.schedule('0 * * * *', () => {
  console.log('Executando integração agendada...');
  runIntegration();
});

console.log('Agendamento configurado: execução a cada hora');

// Manter o processo vivo
process.on('SIGINT', () => {
  console.log('Recebido sinal de interrupção. Encerrando serviço...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Recebido sinal de término. Encerrando serviço...');
  process.exit(0);
});