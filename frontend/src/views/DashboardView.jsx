import { css } from "@emotion/css";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { AxiosError } from "axios";
import { useAuth } from "../composables/useAuth";
import { apiGetDashboardStats } from "../api/dashboard";
export default defineComponent({
    name: "DashboardView",
    setup() {
        const router = useRouter();
        const auth = useAuth();
        const campaigns = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const loadStats = async () => {
            loading.value = true;
            error.value = null;
            try {
                campaigns.value = await apiGetDashboardStats();
            }
            catch (err) {
                if (!(err instanceof AxiosError && err.response?.status === 401)) {
                    error.value = "Failed to load campaign analytics.";
                }
            }
            finally {
                loading.value = false;
            }
        };
        onMounted(() => {
            void loadStats();
        });
        const onLogout = async () => {
            auth.logout();
            await router.push("/login");
        };
        return () => (<main class={pageContainer}>
        <section class={topBar}>
          <div>
            <h1>Ad-Tech Dashboard</h1>
            <p class={subtitle}>
              Signed in as <strong>{auth.user.value?.email ?? "Unknown user"}</strong>
            </p>
          </div>
          <button class={logoutButton} type="button" onClick={onLogout}>
            Logout
          </button>
        </section>

        {loading.value && <p>Loading campaign stats...</p>}
        {error.value && <p class={errorText}>{error.value}</p>}

        {!loading.value && !error.value && (<section class={tableWrapper}>
            <table class={tableClass}>
              <thead>
                <tr>
                  <th class={headerCell}>Campaign</th>
                  <th class={headerCell}>Status</th>
                  <th class={headerCell}>Impressions</th>
                  <th class={headerCell}>Clicks</th>
                  <th class={headerCell}>Spend (USD)</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.value.map((campaign) => (<tr class={rowClass} key={campaign.name}>
                    <td class={cellClass}>{campaign.name}</td>
                    <td class={cellClass}>
                      <span class={statusBadge(campaign.status)}>{campaign.status}</span>
                    </td>
                    <td class={cellClass}>{campaign.impressions.toLocaleString()}</td>
                    <td class={cellClass}>{campaign.clicks.toLocaleString()}</td>
                    <td class={cellClass}>${campaign.spend.toLocaleString()}</td>
                  </tr>))}
              </tbody>
            </table>
          </section>)}
      </main>);
    },
});
const pageContainer = css({
    maxWidth: "980px",
    margin: "40px auto",
    padding: "0 16px",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#122031",
});
const topBar = css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
});
const subtitle = css({
    margin: "4px 0 0",
    color: "#5c6a7a",
});
const logoutButton = css({
    border: "1px solid #c9d2dc",
    background: "#fff",
    color: "#1e2f42",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 600,
    "&:hover": {
        background: "#f4f7fb",
    },
});
const tableWrapper = css({
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
});
const tableClass = css({
    width: "100%",
    borderCollapse: "collapse",
});
const headerCell = css({
    textAlign: "left",
    fontSize: "12px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#607086",
    background: "#f8fafc",
    padding: "14px 16px",
    borderBottom: "1px solid #e2e8f0",
});
const rowClass = css({
    "&:not(:last-of-type)": {
        borderBottom: "1px solid #edf2f7",
    },
});
const cellClass = css({
    padding: "14px 16px",
    fontSize: "14px",
});
const statusBadge = (status) => {
    const color = status === "Active" ? "#0f5132" : status === "Paused" ? "#7a2e0b" : "#1e3a8a";
    const background = status === "Active" ? "#d1fae5" : status === "Paused" ? "#ffedd5" : "#dbeafe";
    return css({
        display: "inline-block",
        borderRadius: "999px",
        padding: "4px 10px",
        fontSize: "12px",
        fontWeight: 700,
        color,
        background,
    });
};
const errorText = css({
    margin: "12px 0",
    color: "#b42318",
});
