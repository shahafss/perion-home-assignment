import { css } from "@emotion/css";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export const ForbiddenView = defineComponent({
  name: "ForbiddenView",
  setup() {
    const router = useRouter();

    return () => (
      <main class={container}>
        <div class={card}>
          <h1 class={code}>403</h1>
          <h2 class={title}>Access Denied</h2>
          <p class={message}>
            You don't have permission to view this page.
          </p>
          <button
            class={backButton}
            type="button"
            onClick={() => void router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  },
});

export default ForbiddenView;

const container = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  background: "#f8fafc",
});

const card = css({
  textAlign: "center",
  padding: "48px 40px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
  maxWidth: "400px",
  width: "100%",
});

const code = css({
  fontSize: "80px",
  fontWeight: 800,
  color: "#e53e3e",
  margin: "0 0 8px",
  lineHeight: 1,
});

const title = css({
  fontSize: "22px",
  fontWeight: 700,
  color: "#122031",
  margin: "0 0 12px",
});

const message = css({
  color: "#5c6a7a",
  margin: "0 0 28px",
  fontSize: "15px",
});

const backButton = css({
  display: "inline-block",
  padding: "10px 24px",
  background: "#1a56db",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  "&:hover": {
    background: "#1648c0",
  },
});
