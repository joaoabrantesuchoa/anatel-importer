// Dados brutos do arquivo PBTVD da Anatel
export interface PBTVDData {
  '_id'?: string;
  'UF PBTVD'?: string;
  'Município-UF'?: string;
  'Canal PBTVD'?: string;
  'Frequência PBTVD'?: string;
  'Classe PBTVD'?: string;
  'Caráter PBTVD'?: string;
  'Latitude GMS PBTVD'?: string;
  'Longitude GMS PBTVD'?: string;
  'Latitude Decimal'?: string;
  'Longitude Decimal'?: string;
  'ERP PBTVD'?: string;
  [key: string]: any; // Para campos adicionais
}

// Dados formatados para o plano básico
export interface PlanoBasicoData {
  id?: string;
  IdtPlanoBasico: string;
  Pais: string;
  UF?: string;
  CodMunicipio: string;
  Municipio?: string;
  Canal?: string;
  Frequencia?: string;
  Decalagem: string;
  Classe?: string;
  Servico: string;
  Carater?: string;
  Finalidade: string;
  Status: string;
  Entidade: string;
  CNPJ: string;
  LatitudeGMS?: string;
  LongitudeGMS?: string;
  Latitude?: string;
  Longitude?: string;
  ERP?: string;
  Altura: string;
  Limitacoes: string;
  Observacoes: string;
  Fistel: string;
}

// Resposta da API da Anatel (estrutura do arquivo ZIP)
export interface AnatelResponse {
  filePath: string;
  extractedPath: string;
}
