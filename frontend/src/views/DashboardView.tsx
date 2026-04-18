import { css } from "@emotion/css";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { usePermissions } from "../composables/usePermissions";
import { UsersTable } from "../components/UsersTable";
import { RolesSection } from "../components/RolesSection";

export const DashboardView = defineComponent({
  name: "DashboardView",
  setup() {
    const router = useRouter();
    const auth = useAuth();
    const { isAdmin, isEditor } = usePermissions();

    const onLogout = async (): Promise<void> => {
      await auth.logout();
      await router.push("/login");
    };

    return () => {
      const user = auth.user.value;
      const showRoles = isAdmin.value || isEditor.value;

      return (
        <div class={pageWrapper}>
          <header class={headerBar}>
            <span class={appName}>Perion Dashboard</span>
            <div class={headerRight}>
              {user && (
                <span class={userInfo}>
                  Logged in as <strong>{user.name}</strong>
                  <span class={rolePill}>{user.role.name}</span>
                </span>
              )}
              <button type="button" class={logoutButton} onClick={() => void onLogout()}>
                Logout
              </button>
            </div>
          </header>

          <main class={mainContent}>
            <UsersTable />
            {showRoles && <RolesSection />}
          </main>
        </div>
      );
    };
  },
});

export default DashboardView;

const pageWrapper = css({
  minHeight: "100vh",
  background: "#f0f4f8",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: "#0f172a",
});

const headerBar = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 32px",
  height: "60px",
  background: "#ffffff",
  borderBottom: "1px solid #e2e8f0",
  boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)",
});

const appName = css({
  fontSize: "16px",
  fontWeight: 700,
  color: "#1e40af",
  letterSpacing: "-0.01em",
});

const headerRight = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const userInfo = css({
  fontSize: "14px",
  color: "#475569",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const rolePill = css({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
  background: "#e0e7ff",
  color: "#3730a3",
  letterSpacing: "0.02em",
});

const logoutButton = css({
  padding: "7px 16px",
  fontSize: "13px",
  fontWeight: 600,
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#ffffff",
  color: "#334155",
  "&:hover": {
    background: "#f1f5f9",
  },
});

const mainContent = css({
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "32px 24px",
});
