import api, { API_ENDPOINTS } from '../config/api';
import type { HabitRequest, HabitResponse } from '../Types';

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

export const concludeHabit = async (id: number | string): Promise<HabitResponse> => {
  const { data } = await api.patch(API_ENDPOINTS.HABITO.CONCLUDE(id));
  return data;
};

export const deleteHabit = async (id: number | string): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.HABITO.BASE}/${id}`);
};
