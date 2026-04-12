import { computed, ref } from "vue";
import { AxiosError } from "axios";
import {
  apiLogin,
  apiLogout,
  apiMe,
  apiSignup,
  type AuthUser,
} from "../api/auth";

const COOKIE_SESSION_TOKEN = "cookie-session";
const token = ref<string | null>(null);
const user = ref<AuthUser | null>(null);
const initPromise = ref<Promise<void> | null>(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const init = async (): Promise<void> => {
    if (initPromise.value) {
      await initPromise.value;
      return;
    }

    initPromise.value = (async () => {
      try {
        const result = await apiMe();
        token.value = COOKIE_SESSION_TOKEN;
        user.value = result.user;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          token.value = null;
          user.value = null;
          return;
        }

        throw error;
      }
    })();

    await initPromise.value;
  };

  const login = async (email: string, password: string): Promise<void> => {
    const result = await apiLogin(email, password);
    token.value = COOKIE_SESSION_TOKEN;
    user.value = result.user;
  };

  const signup = async (email: string, password: string): Promise<void> => {
    const result = await apiSignup(email, password);
    token.value = COOKIE_SESSION_TOKEN;
    user.value = result.user;
  };

  const logout = (): void => {
    void apiLogout();
    token.value = null;
    user.value = null;
  };

  return {
    token,
    user,
    isAuthenticated,
    init,
    login,
    signup,
    logout,
  };
}
