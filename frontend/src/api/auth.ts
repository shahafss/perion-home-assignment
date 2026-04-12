import { apiClient } from './axios';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthApiResponse {
  user: AuthUser;
}

export const apiSignup = async (
  email: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<
    AuthApiResponse,
    AuthApiResponse
  >('/auth/signup', {
    email,
    password
  });
  return response;
};

export const apiLogin = async (
  email: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<
    AuthApiResponse,
    AuthApiResponse
  >('/auth/login', {
    email,
    password
  });
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
