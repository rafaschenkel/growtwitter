import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

export function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === 'object' && error != null && 'message' in error;
}

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if ('error' in error) {
      return error.error;
    }

    if (error.data && typeof error.data === 'object') {
      const data = error.data as { message?: string };
      if (data.message) {
        return data.message;
      }
    }

    switch (error.status) {
      case 400:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito. Este recurso já existe.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
      default:
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
  }

  if (isSerializedError(error)) {
    return error.message || 'Ocorreu um erro inesperado.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
}

export function getErrorStatus(error: unknown): number | undefined {
  if (isFetchBaseQueryError(error)) {
    if (typeof error.status === 'number') {
      return error.status;
    }
  }
  return undefined;
}

export function isNetworkError(error: unknown): boolean {
  if (isFetchBaseQueryError(error)) {
    return error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR';
  }
  return false;
}

export function isAuthError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
}

export function isValidationError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 400 || status === 422;
}

export interface FormattedError {
  message: string;
  status?: number;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
}

export function formatError(error: unknown): FormattedError {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
    isNetworkError: isNetworkError(error),
    isAuthError: isAuthError(error),
    isValidationError: isValidationError(error),
  };
}
