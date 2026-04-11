import { apiClient } from './axios';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthApiResponse {
  token: string;
  user: AuthUser;
}

export const apiSignup = async (
  email: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<AuthApiResponse>('/auth/signup', {
    email,
    password
  });
  return response.data;
};

export const apiLogin = async (
  email: string,
  password: string
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<AuthApiResponse>('/auth/login', {
    email,
    password
  });
  return response.data;
};
