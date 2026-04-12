import { computed, ref } from "vue";
import { AxiosError } from "axios";
import { apiLogin, apiLogout, apiMe, apiSignup, } from "../api/auth";
const COOKIE_SESSION_TOKEN = "cookie-session";
const token = ref(null);
const user = ref(null);
const initPromise = ref(null);
export function useAuth() {
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const init = async () => {
        if (initPromise.value) {
            await initPromise.value;
            return;
        }
        initPromise.value = (async () => {
            try {
                const result = await apiMe();
                token.value = COOKIE_SESSION_TOKEN;
                user.value = result.user;
            }
            catch (error) {
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
    const login = async (email, password) => {
        const result = await apiLogin(email, password);
        token.value = COOKIE_SESSION_TOKEN;
        user.value = result.user;
    };
    const signup = async (email, password) => {
        const result = await apiSignup(email, password);
        token.value = COOKIE_SESSION_TOKEN;
        user.value = result.user;
    };
    const logout = () => {
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
