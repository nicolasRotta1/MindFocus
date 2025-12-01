import api, { API_ENDPOINTS } from '../config/api';
import type { HabitRequest, HabitResponse, HabitStats, DashboardUsuario } from '../Types';

export interface ProgressHistoryItem {
  data: string;
  progresso: number;
  valor?: number;
}

export const getHabits = async (): Promise<HabitResponse[]> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.BASE);
  return data;
};

export const createHabit = async (payload: HabitRequest): Promise<HabitResponse> => {
  const { data } = await api.post(API_ENDPOINTS.HABITO.BASE, payload);
  return data;
};

export const updateHabit = async (id: number | string, payload: Partial<HabitRequest>): Promise<HabitResponse> => {
  const { data } = await api.patch(`${API_ENDPOINTS.HABITO.BASE}/${id}`, payload);
  return data;
};

export const deleteHabit = async (id: number | string): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.HABITO.BASE}/${id}`);
};

export const concludeHabit = async (id: number | string, valor?: number): Promise<any> => {
  const url = valor !== undefined && valor !== null 
    ? `${API_ENDPOINTS.HABITO.CONCLUDE(id)}?valor=${encodeURIComponent(String(valor))}`
    : API_ENDPOINTS.HABITO.CONCLUDE(id);
  const { data } = await api.post(url);
  return data;
};

export const unconcludeHabit = async (id: number | string): Promise<void> => {
  await api.post(API_ENDPOINTS.HABITO.UNCONCLUDE(id));
};

export const updateProgress = async (id: number | string, valor: number): Promise<void> => {
  const url = `${API_ENDPOINTS.HABITO.PROGRESS(id)}?valor=${encodeURIComponent(String(valor))}`;
  await api.post(url);
};

export const getHabitStats = async (id: number | string): Promise<HabitStats> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.STATS(id));
  return data;
};

export const isHabitCompletedToday = async (id: number | string): Promise<boolean> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.COMPLETED_TODAY(id));
  return data?.concluidoHoje ?? false;
};

export const getHabitHistory = async (id: number | string, de: string, ate: string): Promise<string[]> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.HISTORY(id, de, ate));
  return data?.datasConcluidas ?? [];
};

export const getDashboardUsuario = async (): Promise<DashboardUsuario> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.DASHBOARD_USER);
  return data;
};

export const getDashboardOverview = async (): Promise<any> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.OVERVIEW);
  return data;
};

export const getHabitProgressHistory = async (id: number | string, de: string, ate: string): Promise<ProgressHistoryItem[]> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.HISTORY_PROGRESS(id, de, ate));
  return data?.historico ?? [];
};
