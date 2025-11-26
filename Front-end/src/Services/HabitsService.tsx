// src/services/habitsService.ts
import { api } from '../config/api';
import type { HabitRequest, HabitResponse } from '../Types';

export const getHabits = async (): Promise<HabitResponse[]> => {
  const { data } = await api.get('/habitos');
  return data;
};

export const createHabit = async (payload: HabitRequest): Promise<HabitResponse> => {
  const { data } = await api.post('/habitos', payload);
  return data;
};

export const updateHabit = async (id: number, payload: Partial<HabitRequest>): Promise<HabitResponse> => {
  const { data } = await api.patch(`/habitos/${id}`, payload);
  return data;
};

export const concludeHabit = async (id: number): Promise<HabitResponse> => {
  try {
    const { data } = await api.patch(`/habitos/${id}/concluir`);
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      const { data } = await api.patch(`/habitos/${id}`, { status: 'CONCLUIDO' });
      return data;
    }
    throw err;
  }
};

export const deleteHabit = async (id: number): Promise<void> => {
  await api.delete(`/habitos/${id}`);
};
