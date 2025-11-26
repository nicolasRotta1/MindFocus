// Types.ts

export type HabitType = 'SIM_NAO' | 'QUANTITATIVO';
export type HabitFrequency = 'DIARIO' | 'SEMANAL' | 'MENSAL';
export type HabitStatus = 'PENDENTE' | 'CONCLUIDO' | 'ATRASADO';

export interface HabitRequest {
  nome: string;
  tipo: HabitType;
  status?: HabitStatus;   
  frequencia: HabitFrequency;
  concluido?: boolean;    
  progresso?: number;     
  notificacaoAtiva?: boolean; 
}

export interface HabitResponse {
  id: number;           
  nome: string;
  concluido: boolean;
  progresso: number;
  status: HabitStatus;
  tipo: HabitType;
  frequencia: HabitFrequency;
  criadoEm: string;     
  atualizadoEm: string; 
  notificacaoAtiva?: boolean; 
}
