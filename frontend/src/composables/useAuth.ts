import { computed, ref } from "vue";
import { AxiosError } from "axios";
import {
  apiLogin,
  apiLogout,
  apiMe,
  apiSelectUser,
  apiSignup,
} from "../api/auth";
import { type User } from "../types/auth";

const user = ref<User | null>(null);
const initialized = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const fetchUser = async (): Promise<void> => {
    try {
      const result = await apiMe();
      user.value = result.user;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        user.value = null;
      } else {
        throw error;
      }
    } finally {
      initialized.value = true;
    }
  };

  const selectUser = async (email: string): Promise<void> => {
    await apiSelectUser(email);
    await fetchUser();
  };

  const login = async (email: string, password: string): Promise<void> => {
    await apiLogin(email, password);
    await fetchUser();
  };

  const signup = async (email: string, password: string): Promise<void> => {
    await apiSignup(email, password);
    await fetchUser();
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    user.value = null;
  };

  return {
    user,
    initialized,
    isAuthenticated,
    fetchUser,
    selectUser,
    login,
    signup,
    logout,
  };
}
