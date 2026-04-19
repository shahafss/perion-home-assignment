import { apiClient } from './axios';
import { type User } from '../types/auth';

export type { User } from '../types/auth';

export interface AuthApiResponse {
  user: User;
}

export const apiSelectUser = async (email: string): Promise<void> => {
  await apiClient.post<{ success: boolean }, { success: boolean }>(
    '/auth/select',
    { email }
  );
};

export const apiSignup = async (
  email: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<
    AuthApiResponse,
    AuthApiResponse
  >('/auth/signup', { email, password });
  return response;
};

export const apiLogin = async (
  email: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<
    AuthApiResponse,
    AuthApiResponse
  >('/auth/login', { email, password });
  return response;
};

export const apiMe = async (): Promise<AuthApiResponse> => {
  const response = await apiClient.get<AuthApiResponse, AuthApiResponse>(
    '/auth/me'
  );
  return response;
};

export const apiLogout = async (): Promise<void> => {
  await apiClient.post<{ message: string }, { message: string }>('/auth/logout');
};
