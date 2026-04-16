import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';

const getErrorMessage = (error: unknown): string => {
  const fallback = 'Unable to login. Please try again.';
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;
  }
  return fallback;
};

export const LoginView = defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const auth = useAuth();
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref<string | null>(null);

    const onSubmit = async (event: Event): Promise<void> => {
      event.preventDefault();
      error.value = null;
      loading.value = true;

      try {
        await auth.login(email.value, password.value);
        await router.push('/dashboard');
      } catch (err) {
        error.value = getErrorMessage(err);
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <main style="max-width: 420px; margin: 48px auto; font-family: sans-serif;">
        <h1>Login</h1>
        <p>Sign in to access your dashboard.</p>

        <form onSubmit={onSubmit} style="display: grid; gap: 12px;">
          <label style="display: grid; gap: 6px;">
            <span>Email</span>
            <input
              type="email"
              value={email.value}
              onInput={(event) => {
                email.value = (event.target as HTMLInputElement).value;
              }}
              required
            />
          </label>

          <label style="display: grid; gap: 6px;">
            <span>Password</span>
            <input
              type="password"
              value={password.value}
              onInput={(event) => {
                password.value = (event.target as HTMLInputElement).value;
              }}
              minlength={8}
              required
            />
          </label>

          {error.value && <p style="color: #b00020; margin: 0;">{error.value}</p>}

          <button type="submit" disabled={loading.value}>
            {loading.value ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p style="margin-top: 16px;">
          No account yet? <a href="/signup">Create one</a>
        </p>
      </main>
    );
  }
});

export default LoginView;
