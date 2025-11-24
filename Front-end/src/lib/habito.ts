import { apiRequest } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface Habito {
  id?: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  frequencia?: string;
  concluido?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export async function listarHabitos(params?: Record<string, any>) {
  const url = new URL(API_ENDPOINTS.HABITO.BASE);
  if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.append(k, String(v)));
  return await apiRequest<Habito[]>(url.toString());
}

export async function criarHabito(habito: Habito) {
  return await apiRequest<Habito>(API_ENDPOINTS.HABITO.BASE, { method: 'POST', body: JSON.stringify(habito) });
}

export async function atualizarHabito(id: string, habito: Habito) {
  return await apiRequest<Habito>(`${API_ENDPOINTS.HABITO.BASE}/${id}`, { method: 'PUT', body: JSON.stringify(habito) });
}

export async function deletarHabito(id: string) {
  return await apiRequest(`${API_ENDPOINTS.HABITO.BASE}/${id}`, { method: 'DELETE' });
}

export async function concluirHabito(id: string) {
  return await apiRequest<Habito>(`${API_ENDPOINTS.HABITO.BASE}/${id}/concluir`, { method: 'POST' });
}
