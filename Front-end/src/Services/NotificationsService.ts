import api, { API_ENDPOINTS, API_NOTIFICATION_BASE_URL } from '../config/api';

export interface NotificacaoDTO {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem?: string;
  tipo?: string;
  lida?: boolean;
  criadaEm?: string;
}

export async function getNotifications() {
  const url = `${API_NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.LIST}`;
  const { data } = await api.get<NotificacaoDTO[]>(url);
  return data ?? [];
}

export async function getUnreadCount() {
  const url = `${API_NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT}`;
  const { data } = await api.get<number>(url);
  return data ?? 0;
}

export async function markAsRead(notificacaoId: string) {
  const url = `${API_NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificacaoId)}`;
  await api.put(url);
}

export default { getNotifications, getUnreadCount, markAsRead };
