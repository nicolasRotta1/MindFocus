import api, { API_ENDPOINTS } from '../config/api';
import type { HabitRequest, HabitResponse } from '../Types'; // Assuming Types.ts defines these

export const getHabits = async (): Promise<HabitResponse[]> => {
  const response = await api.get<HabitResponse[]>(API_ENDPOINTS.HABITO.BASE);
  return response.data;
};

export const createHabit = async (payload: HabitRequest): Promise<HabitResponse> => {
  const response = await api.post<HabitResponse>(API_ENDPOINTS.HABITO.BASE, payload);
  return response.data;
};

export const updateHabit = async (id: number, payload: Partial<HabitRequest>): Promise<HabitResponse> => {
  const response = await api.patch<HabitResponse>(`${API_ENDPOINTS.HABITO.BASE}/${id}`, payload);
  return response.data;
};

export const concludeHabit = async (id: number): Promise<HabitResponse> => {
  const response = await api.patch<HabitResponse>(API_ENDPOINTS.HABITO.CONCLUDE(id));
  return response.data;
};

export const deleteHabit = async (id: number): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.HABITO.BASE}/${id}`);
  // No need for boolean return; throw on error via interceptor
};