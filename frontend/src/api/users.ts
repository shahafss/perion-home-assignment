import { apiClient } from './axios';
import { type User } from '../types/auth';

export type { User } from '../types/auth';

export interface CreateUserDto {
  name: string;
  email: string;
  roleId: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  roleId?: string;
}

export const apiGetUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[], User[]>('/users');
  return response;
};

export const apiCreateUser = async (body: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<User, User>('/users', body);
  return response;
};

export const apiUpdateUser = async (
  id: string,
  body: UpdateUserDto
): Promise<User> => {
  const response = await apiClient.put<User, User>(`/users/${id}`, body);
  return response;
};

export const apiDeleteUser = async (id: string): Promise<void> => {
  await apiClient.delete<void, void>(`/users/${id}`);
};
