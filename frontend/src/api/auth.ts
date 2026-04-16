import { apiClient } from './axios';

export interface AuthRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole | null;
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
