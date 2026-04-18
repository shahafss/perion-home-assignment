import { css } from "@emotion/css";
import { defineComponent, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { AxiosError } from "axios";
import { useAuth } from "../composables/useAuth";

interface RoleOption {
  label: string;
  email: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  { label: "Admin", email: "admin@test.com" },
  { label: "Editor", email: "editor@test.com" },
  { label: "Viewer", email: "viewer@test.com" },
];

const getLoginError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 401) return "Invalid email or password.";
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return "Login failed. Please try again.";
};

export const LoginView = defineComponent({
  name: "LoginView",
  setup() {
    const router = useRouter();
    const auth = useAuth();

    const loadingEmail = ref<string | null>(null);
    const loginLoading = ref(false);
    const email = ref("");
    const password = ref("");
    const error = ref<string | null>(null);

    const redirectToDashboard = (): Promise<void> =>
      router.push("/dashboard") as unknown as Promise<void>;

    const onSelect = async (roleEmail: string): Promise<void> => {
      error.value = null;
      loadingEmail.value = roleEmail;
      try {
        await auth.selectUser(roleEmail);
        await redirectToDashboard();
      } catch {
        error.value = "Quick login failed. Please try again.";
      } finally {
        loadingEmail.value = null;
      }
    };

    const onLogin = async (event: Event): Promise<void> => {
      event.preventDefault();
      error.value = null;
      loginLoading.value = true;
      try {
        await auth.login(email.value, password.value);
        await redirectToDashboard();
      } catch (err) {
        error.value = getLoginError(err);
      } finally {
        loginLoading.value = false;
      }
    };

    const isAnyLoading = (): boolean =>
      loadingEmail.value !== null || loginLoading.value;

    return () => (
      <main class={pageContainer}>
        <div class={card}>
          <h1 class={heading}>Perion Dashboard</h1>
          <p class={subheading}>Sign in to your account.</p>

          {/* Section A: Quick Access */}
          <section>
            <p class={sectionLabel}>Quick Access</p>
            <div class={quickButtonGroup}>
              {ROLE_OPTIONS.map(({ label, email: roleEmail }) => (
                <button
                  key={roleEmail}
                  type="button"
                  class={quickButton}
                  disabled={isAnyLoading()}
                  onClick={() => void onSelect(roleEmail)}
                >
                  {loadingEmail.value === roleEmail
                    ? "Signing in…"
                    : `Login as ${label}`}
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div class={divider}>
            <span class={dividerLine} />
            <span class={dividerText}>OR</span>
            <span class={dividerLine} />
          </div>

          {/* Section B: Standard Login */}
          <section>
            <p class={sectionLabel}>Standard Login</p>
            <form class={loginForm} onSubmit={(e) => void onLogin(e)}>
              <label class={fieldLabel}>
                Email
                <input
                  class={inputField}
                  type="email"
                  placeholder="you@example.com"
                  value={email.value}
                  required
                  disabled={isAnyLoading()}
                  onInput={(e) => {
                    email.value = (e.target as HTMLInputElement).value;
                  }}
                />
              </label>

              <label class={fieldLabel}>
                Password
                <input
                  class={inputField}
                  type="password"
                  placeholder="••••••••"
                  value={password.value}
                  minlength={8}
                  required
                  disabled={isAnyLoading()}
                  onInput={(e) => {
                    password.value = (e.target as HTMLInputElement).value;
                  }}
                />
              </label>

              <button
                type="submit"
                class={submitButton}
                disabled={isAnyLoading()}
              >
                {loginLoading.value ? "Signing in…" : "Login"}
              </button>
            </form>
          </section>

          {error.value && <p class={errorText}>{error.value}</p>}

          <p class={signupPrompt}>
            No account yet?{" "}
            <RouterLink to="/signup" class={signupLink}>Create one</RouterLink>
          </p>
        </div>
      </main>
    );
  },
});

export default LoginView;

const pageContainer = css({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f0f4f8",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

const card = css({
  background: "#ffffff",
  borderRadius: "16px",
  padding: "48px 40px",
  width: "100%",
  maxWidth: "440px",
  boxShadow: "0 8px 32px rgba(15, 23, 42, 0.10)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const heading = css({
  margin: "0 0 2px",
  fontSize: "24px",
  fontWeight: 700,
  color: "#0f172a",
});

const subheading = css({
  margin: "0",
  fontSize: "14px",
  color: "#64748b",
});

const sectionLabel = css({
  margin: "0 0 10px",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#94a3b8",
});

const quickButtonGroup = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const quickButton = css({
  width: "100%",
  padding: "11px 16px",
  fontSize: "14px",
  fontWeight: 600,
  border: "1px solid #c7d2fe",
  borderRadius: "10px",
  cursor: "pointer",
  background: "#eef2ff",
  color: "#3730a3",
  transition: "background 0.15s ease, border-color 0.15s ease",
  "&:hover:not(:disabled)": {
    background: "#e0e7ff",
    borderColor: "#a5b4fc",
  },
  "&:disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
  },
});

const divider = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "4px 0",
});

const dividerLine = css({
  flex: 1,
  height: "1px",
  background: "#e2e8f0",
});

const dividerText = css({
  fontSize: "12px",
  fontWeight: 600,
  color: "#94a3b8",
  letterSpacing: "0.05em",
});

const loginForm = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const fieldLabel = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
});

const inputField = css({
  padding: "10px 12px",
  fontSize: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  outline: "none",
  color: "#0f172a",
  background: "#ffffff",
  transition: "border-color 0.15s ease",
  "&:focus": {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.12)",
  },
  "&:disabled": {
    background: "#f8fafc",
    cursor: "not-allowed",
  },
});

const submitButton = css({
  marginTop: "4px",
  width: "100%",
  padding: "12px 16px",
  fontSize: "15px",
  fontWeight: 600,
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  background: "#1e40af",
  color: "#ffffff",
  transition: "background 0.15s ease",
  "&:hover:not(:disabled)": {
    background: "#1d4ed8",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

const errorText = css({
  margin: "0",
  fontSize: "13px",
  color: "#b42318",
  textAlign: "center",
});

const signupPrompt = css({
  margin: "0",
  fontSize: "13px",
  color: "#64748b",
  textAlign: "center",
});

const signupLink = css({
  color: "#1e40af",
  fontWeight: 600,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});
