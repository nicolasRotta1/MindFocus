// auth.ts
import { API_ENDPOINTS } from '../config/api';

export type IdentifierType = 'telefone' | 'email';

/**
 * Remove todos os caracteres que não sejam números
 * útil para telefone
 */
export const cleanNumber = (value: string) => value.replace(/\D/g, '');

/**
 * Consulta usuário para login no MindFocus
 */
export async function queryUser({
  identifier,
  identifierType,
  senha,
}: {
  identifier: string;
  identifierType: IdentifierType;
  senha: string;
}) {
  // Limpa telefone apenas se necessário
  const value = identifierType === 'telefone' ? cleanNumber(identifier) : identifier;

  const body = {
    identifier: value,
    senha,
  };

  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn('Login falhou:', response.status);
      return null;
    }

    const data = await response.json();

    // Retorna token e dados adicionais do usuário se existirem
    if (data.token) {
      return {
        token: data.token,
        user: data.user ?? null,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao consultar usuário MindFocus:', error);
    return null;
  }
}
