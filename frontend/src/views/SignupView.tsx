import { css } from "@emotion/css";
import { defineComponent, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { AxiosError } from "axios";
import { useAuth } from "../composables/useAuth";

const getSignupError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return "Unable to create account. Please try again.";
};

export const SignupView = defineComponent({
  name: "SignupView",
  setup() {
    const router = useRouter();
    const auth = useAuth();
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref<string | null>(null);

    const onSubmit = async (event: Event): Promise<void> => {
      event.preventDefault();
      error.value = null;
      loading.value = true;
      try {
        await auth.signup(email.value, password.value);
        await router.push("/dashboard");
      } catch (err) {
        error.value = getSignupError(err);
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <main class={pageContainer}>
        <div class={card}>
          <h1 class={heading}>Create an account</h1>
          <p class={subheading}>Sign up to access the Perion Dashboard.</p>

          <form class={loginForm} onSubmit={(e) => void onSubmit(e)}>
            <label class={fieldLabel}>
              Email
              <input
                class={inputField}
                type="email"
                placeholder="you@example.com"
                value={email.value}
                required
                disabled={loading.value}
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
                disabled={loading.value}
                onInput={(e) => {
                  password.value = (e.target as HTMLInputElement).value;
                }}
              />
            </label>

            <button type="submit" class={submitButton} disabled={loading.value}>
              {loading.value ? "Creating account…" : "Sign up"}
            </button>
          </form>

          {error.value && <p class={errorText}>{error.value}</p>}

          <p class={loginPrompt}>
            Already have an account?{" "}
            <RouterLink to="/login" class={loginLink}>Sign in</RouterLink>
          </p>
        </div>
      </main>
    );
  },
});

export default SignupView;

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

const loginPrompt = css({
  margin: "0",
  fontSize: "13px",
  color: "#64748b",
  textAlign: "center",
});

const loginLink = css({
  color: "#1e40af",
  fontWeight: 600,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});
