import { apiClient } from './axios';
export const apiSignup = async (email, password) => {
    const response = await apiClient.post('/auth/signup', {
        email,
        password
    });
    return response;
};
export const apiLogin = async (email, password) => {
    const response = await apiClient.post('/auth/login', {
        email,
        password
    });
    return response;
};
export const apiMe = async () => {
    const response = await apiClient.get('/auth/me');
    return response;
};
export const apiLogout = async () => {
    await apiClient.post('/auth/logout');
};
