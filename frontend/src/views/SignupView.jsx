import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';
const getErrorMessage = (error) => {
    const fallback = 'Unable to create account. Please try again.';
    if (error instanceof AxiosError) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
};
export default defineComponent({
    name: 'SignupView',
    setup() {
        const router = useRouter();
        const auth = useAuth();
        const email = ref('');
        const password = ref('');
        const loading = ref(false);
        const error = ref(null);
        const onSubmit = async (event) => {
            event.preventDefault();
            error.value = null;
            loading.value = true;
            try {
                await auth.signup(email.value, password.value);
                await router.push('/dashboard');
            }
            catch (err) {
                error.value = getErrorMessage(err);
            }
            finally {
                loading.value = false;
            }
        };
        return () => (<main style="max-width: 420px; margin: 48px auto; font-family: sans-serif;">
        <h1>Sign up</h1>
        <p>Create an account to access the dashboard.</p>

        <form onSubmit={onSubmit} style="display: grid; gap: 12px;">
          <label style="display: grid; gap: 6px;">
            <span>Email</span>
            <input type="email" value={email.value} onInput={(event) => {
                email.value = event.target.value;
            }} required/>
          </label>

          <label style="display: grid; gap: 6px;">
            <span>Password</span>
            <input type="password" value={password.value} onInput={(event) => {
                password.value = event.target.value;
            }} minlength={8} required/>
          </label>

          {error.value && <p style="color: #b00020; margin: 0;">{error.value}</p>}

          <button type="submit" disabled={loading.value}>
            {loading.value ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p style="margin-top: 16px;">
          Already registered? <a href="/login">Login</a>
        </p>
      </main>);
    }
});
