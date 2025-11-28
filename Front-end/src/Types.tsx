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

export interface HabitStats {
  habitoId?: string;
  totalConcluido?: number;
  concluidoHoje?: boolean;
  streakAtual?: number;
  concluidosEsteMes?: number;
  historico?: string[]; 
  dataConsulta?: string;
}

export interface DashboardUsuario {
  usuarioId?: string;
  totalHabitos: number;
  concluidosHoje: number;
  concluidosSemana?: number;
  percentualHoje?: number;
  dataConsulta?: string;
  completedDays?: boolean[];
  weeklyStats?: number[];
  monthProgress?: number;
}