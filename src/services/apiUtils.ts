import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

export function shouldRetry(
  error: FetchBaseQueryError,
  retryCount: number
): boolean {
  if (retryCount >= RETRY_CONFIG.maxRetries) {
    return false;
  }

  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return true;
  }

  if (typeof error.status === 'number') {
    return RETRY_CONFIG.retryableStatuses.includes(error.status);
  }

  return false;
}

export function getRetryDelay(retryCount: number): number {
  return RETRY_CONFIG.retryDelay * Math.pow(2, retryCount);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function transformResponse<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

export function prepareRequestBody<T extends Record<string, unknown>>(
  body: T
): T {
  const cleanBody = { ...body };
  Object.keys(cleanBody).forEach((key) => {
    if (cleanBody[key] === undefined) {
      delete cleanBody[key];
    }
  });
  return cleanBody;
}

export function buildQueryString(
  params: Record<string, string | number | boolean>
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export function isSuccessResponse(status: number): boolean {
  return status >= 200 && status < 300;
}

export interface ErrorDetails {
  message: string;
  field?: string;
  code?: string;
}

export function extractErrorDetails(error: unknown): ErrorDetails {
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object'
  ) {
    const data = error.data as Record<string, unknown>;
    return {
      message: (data.message as string) || 'Ocorreu um erro',
      field: data.field as string | undefined,
      code: data.code as string | undefined,
    };
  }

  return {
    message: 'Ocorreu um erro inesperado',
  };
}
