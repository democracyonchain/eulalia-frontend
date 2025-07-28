export interface ParametroSistema {
  parametroId: string;
  valor: string;
  tipo: 'texto' | 'boolean' | 'number' | 'url' | 'json';
  descripcion?: string;
  seccion?: string; 
}
