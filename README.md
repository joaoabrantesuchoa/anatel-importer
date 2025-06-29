# Anatel Spectrum Integration

Este projeto é responsável por baixar automaticamente os dados mais recentes da ANATEL (Planos Básicos de TV Digital), formatá-los e enviá-los para o Spectrum Board. O serviço roda continuamente em Docker e executa a integração a cada hora.

## Funcionalidades

- ✅ Download automático dos dados PBTVD da ANATEL
- ✅ Extração e processamento de arquivos ZIP
- ✅ Formatação dos dados para o padrão do Plano Básico
- ✅ Envio automático para o Spectrum Board
- ✅ Agendamento automático (execução de hora em hora)
- ✅ Containerização com Docker
- ✅ Logs detalhados de monitoramento

## Estrutura do Projeto

```
anatel-spectrum-integration/
├── src/
│   ├── fetchAnatelData.ts       # Download e extração dos dados da ANATEL
│   ├── formatData.ts            # Formatação dos dados PBTVD
│   ├── sendToSpectrumBoard.ts   # Envio para o Spectrum Board
│   ├── index.ts                 # Orquestrador principal e agendamento
│   └── types/
│       └── index.ts             # Definições de tipos TypeScript
├── Dockerfile                   # Configuração do container
├── .dockerignore               # Arquivos ignorados no build
├── package.json                # Configuração do NPM
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Documentação
```

## Instalação e Uso

### Opção 1: Docker (Recomendado)

1. **Construir a imagem:**
   ```bash
   docker build -t anatel-spectrum-integration .
   ```

2. **Executar o container:**
   ```bash
   docker run -d \
     --name anatel-spectrum-integration \
     --restart unless-stopped \
     -e SPECTRUM_BOARD_URL="http://seu-spectrum-board:3000/api/upload" \
     anatel-spectrum-integration
   ```

3. **Verificar logs:**
   ```bash
   docker logs -f anatel-spectrum-integration
   ```

### Opção 2: Desenvolvimento Local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

3. **Executar:**
   ```bash
   npm start
   ```

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `SPECTRUM_BOARD_URL` | URL da API do Spectrum Board | `http://localhost:3000/api/upload` |
| `CRON_SCHEDULE` | Agendamento cron | `0 * * * *` (a cada hora) |
| `DATA_DIR` | Diretório para dados temporários | `./anatel_data` |
| `HTTP_TIMEOUT` | Timeout para requisições HTTP (ms) | `30000` |

## Como Funciona

1. **Download**: Baixa o arquivo ZIP dos Planos Básicos da ANATEL
2. **Extração**: Extrai o arquivo PBTVD.csv do ZIP
3. **Formatação**: Converte os dados para o formato esperado pelo Spectrum Board
4. **Envio**: Envia o arquivo formatado via HTTP para o Spectrum Board
5. **Agendamento**: Repete o processo a cada hora automaticamente

## Monitoramento

- **Logs detalhados**: Cada etapa é registrada com timestamp
- **Tratamento de erros**: Falhas são capturadas e registradas
- **Health checks**: Container inclui verificações de saúde

## Dados Processados

### Fonte (ANATEL PBTVD)
- `UF PBTVD`, `Município-UF`, `Canal PBTVD`
- `Frequência PBTVD`, `Classe PBTVD`, `Caráter PBTVD`
- `Latitude/Longitude (GMS e Decimal)`
- `ERP PBTVD`

### Saída (Plano Básico)
- Campos padronizados para integração com Spectrum Board
- Formato CSV com separador `;`
- Conversão de coordenadas e classificações

## Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test

# Linting
npm run lint
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

MIT License

This project is licensed under the MIT License.