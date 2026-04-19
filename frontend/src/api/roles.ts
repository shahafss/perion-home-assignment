import { apiClient } from './axios';
import { type Role } from '../types/auth';

export type { Role } from '../types/auth';

export interface UpdateRoleDto {
  permissions: string[];
}

export const apiGetRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get<Role[], Role[]>('/roles');
  return response;
};

export const apiUpdateRole = async (
  id: string,
  body: UpdateRoleDto
): Promise<Role> => {
  const response = await apiClient.put<Role, Role>(`/roles/${id}`, body);
  return response;
};
