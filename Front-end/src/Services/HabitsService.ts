import api, { API_ENDPOINTS } from '../config/api';
import type { HabitRequest, HabitResponse, HabitStats, DashboardUsuario } from '../Types';

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

export const concludeHabit = async (id: number | string): Promise<any> => {
  // Backend expects POST /api/habitos/{id}/concluir
  const { data } = await api.post(API_ENDPOINTS.HABITO.CONCLUDE(id));
  return data;
};

export const getHabitStats = async (id: number | string): Promise<HabitStats> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.STATS(id));
  return data;
};

export const isHabitCompletedToday = async (id: number | string): Promise<boolean> => {
  const { data } = await api.get(API_ENDPOINTS.HABITO.COMPLETED_TODAY(id));
  // backend returns { "concluidoHoje": true }
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
