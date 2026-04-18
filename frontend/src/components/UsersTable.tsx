import { css } from "@emotion/css";
import { defineComponent, onMounted, ref } from "vue";
import { apiDeleteUser, apiGetUsers, type User } from "../api/users";
import { usePermissions } from "../composables/usePermissions";
import { PERMISSIONS } from "../types/permissions";

export const UsersTable = defineComponent({
  name: "UsersTable",
  setup() {
    const { hasPermission, isViewer } = usePermissions();
    const users = ref<User[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const loadUsers = async (): Promise<void> => {
      loading.value = true;
      error.value = null;
      try {
        users.value = await apiGetUsers();
      } catch {
        error.value = "Failed to load users.";
      } finally {
        loading.value = false;
      }
    };

    const onDelete = async (id: string): Promise<void> => {
      try {
        await apiDeleteUser(id);
        users.value = users.value.filter((u) => u.id !== id);
      } catch {
        error.value = "Failed to delete user.";
      }
    };

    onMounted(() => {
      void loadUsers();
    });

    return () => (
      <section class={sectionContainer}>
        <div class={sectionHeader}>
          <h2 class={sectionTitle}>Users</h2>
          {hasPermission(PERMISSIONS.UsersCreate) && (
            <button type="button" class={addButton}>
              + Add User
            </button>
          )}
        </div>

        {loading.value && <p class={statusText}>Loading users…</p>}
        {error.value && <p class={errorText}>{error.value}</p>}

        {!loading.value && !error.value && (
          <div class={tableWrapper}>
            <table class={tableClass}>
              <thead>
                <tr>
                  <th class={headerCell}>Name</th>
                  <th class={headerCell}>Email</th>
                  {!isViewer.value && <th class={headerCell}>Role</th>}
                  {(hasPermission(PERMISSIONS.UsersEdit) || hasPermission(PERMISSIONS.UsersDelete)) && (
                    <th class={headerCell}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.value.map((user) => (
                  <tr class={rowClass} key={user.id}>
                    <td class={cellClass}>{user.name}</td>
                    <td class={cellClass}>{user.email}</td>
                    {!isViewer.value && (
                      <td class={cellClass}>
                        <span class={roleBadge}>{user.role.name}</span>
                      </td>
                    )}
                    {(hasPermission(PERMISSIONS.UsersEdit) || hasPermission(PERMISSIONS.UsersDelete)) && (
                      <td class={cellClass}>
                        <div class={actionGroup}>
                          {hasPermission(PERMISSIONS.UsersEdit) && (
                            <button type="button" class={editButton}>
                              Edit
                            </button>
                          )}
                          {hasPermission(PERMISSIONS.UsersDelete) && (
                            <button
                              type="button"
                              class={deleteButton}
                              onClick={() => void onDelete(user.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  },
});

const sectionContainer = css({
  marginBottom: "32px",
});

const sectionHeader = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const sectionTitle = css({
  margin: 0,
  fontSize: "18px",
  fontWeight: 700,
  color: "#0f172a",
});

const addButton = css({
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#1e40af",
  color: "#ffffff",
  "&:hover": {
    background: "#1d4ed8",
  },
});

const statusText = css({
  color: "#64748b",
  fontSize: "14px",
});

const errorText = css({
  color: "#b42318",
  fontSize: "14px",
});

const tableWrapper = css({
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  overflow: "hidden",
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
});

const tableClass = css({
  width: "100%",
  borderCollapse: "collapse",
});

const headerCell = css({
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "#607086",
  background: "#f8fafc",
  padding: "12px 16px",
  borderBottom: "1px solid #e2e8f0",
});

const rowClass = css({
  "&:not(:last-of-type)": {
    borderBottom: "1px solid #edf2f7",
  },
  "&:hover": {
    background: "#f8fafc",
  },
});

const cellClass = css({
  padding: "12px 16px",
  fontSize: "14px",
  color: "#1e293b",
});

const roleBadge = css({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
  background: "#e0e7ff",
  color: "#3730a3",
});

const actionGroup = css({
  display: "flex",
  gap: "8px",
});

const editButton = css({
  padding: "5px 12px",
  fontSize: "12px",
  fontWeight: 600,
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#ffffff",
  color: "#334155",
  "&:hover": {
    background: "#f1f5f9",
  },
});

const deleteButton = css({
  padding: "5px 12px",
  fontSize: "12px",
  fontWeight: 600,
  border: "1px solid #fca5a5",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#fff1f2",
  color: "#b42318",
  "&:hover": {
    background: "#ffe4e6",
  },
});
