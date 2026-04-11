import { computed, ref } from "vue";
import { apiLogin, apiSignup, type AuthUser } from "../api/auth";

const token = ref<string | null>(localStorage.getItem("token"));
const user = ref<AuthUser | null>(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string): Promise<void> => {
    const result = await apiLogin(email, password);
    token.value = result.token;
    user.value = result.user;
    localStorage.setItem("token", result.token);
  };

  const signup = async (email: string, password: string): Promise<void> => {
    const result = await apiSignup(email, password);
    token.value = result.token;
    user.value = result.user;
    localStorage.setItem("token", result.token);
  };

  const logout = (): void => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}
