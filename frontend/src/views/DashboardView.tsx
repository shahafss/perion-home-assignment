import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const router = useRouter();
    const auth = useAuth();

    const onLogout = async (): Promise<void> => {
      auth.logout();
      await router.push('/login');
    };

    return () => (
      <main style="max-width: 560px; margin: 48px auto; font-family: sans-serif;">
        <h1>Dashboard</h1>
        <p>Welcome to the protected area.</p>
        <p>
          Signed in as: <strong>{auth.user.value?.email ?? 'Unknown user'}</strong>
        </p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </main>
    );
  }
});
