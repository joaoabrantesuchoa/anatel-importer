# Anatel Spectrum Integration

Este projeto é responsável por baixar automaticamente os dados mais recentes da ANATEL (Planos Básicos de TV Digital), formatá-los e enviá-los para o Spectrum Board. O serviço roda continuamente em Docker e executa a integração a cada hora.

- [ ] Adicionar conexão para fazer o get dos dados sempre que for gerar as áreas protegidas no spectrum board.

## Instalação e Uso

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

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `SPECTRUM_BOARD_URL` | URL da API do Spectrum Board | `http://localhost:3000/api/upload` |
| `CRON_SCHEDULE` | Agendamento cron | `0 * * * *` (a cada hora) |
| `DATA_DIR` | Diretório para dados temporários | `./anatel_data` |
| `HTTP_TIMEOUT` | Timeout para requisições HTTP (ms) | `30000` |