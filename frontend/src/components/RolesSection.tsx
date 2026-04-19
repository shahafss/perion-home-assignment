import { css } from "@emotion/css";
import { defineComponent, onMounted, ref } from "vue";
import { apiGetRoles, type Role } from "../api/roles";
import { usePermissions } from "../composables/usePermissions";
import { PERMISSIONS } from "../types/permissions";
import { RolePermissionsModal } from "./RolePermissionsModal";

export const RolesSection = defineComponent({
  name: "RolesSection",
  setup() {
    const { hasPermission } = usePermissions();
    const roles = ref<Role[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const editingRole = ref<Role | null>(null);

    const loadRoles = async (): Promise<void> => {
      loading.value = true;
      error.value = null;
      try {
        roles.value = await apiGetRoles();
      } catch {
        error.value = "Failed to load roles.";
      } finally {
        loading.value = false;
      }
    };

    const onRoleSaved = (updated: Role): void => {
      roles.value = roles.value.map((role) =>
        role.id === updated.id ? updated : role
      );
    };

    onMounted(() => {
      void loadRoles();
    });

    return () => (
      <section class={sectionContainer}>
        <div class={sectionHeader}>
          <h2 class={sectionTitle}>Roles & Permissions</h2>
        </div>

        {loading.value && <p class={statusText}>Loading roles…</p>}
        {error.value && <p class={errorText}>{error.value}</p>}

        {!loading.value && !error.value && (
          <div class={rolesGrid}>
            {roles.value.map((role) => (
              <div class={roleCard} key={role.id}>
                <div class={roleCardHeader}>
                  <span class={roleName}>{role.name}</span>
                  {hasPermission(PERMISSIONS.RolesEdit) && (
                    <button
                      type="button"
                      class={editButton}
                      onClick={() => {
                        editingRole.value = role;
                      } }
                    >
                      Edit Role
                    </button>
                  )}
                </div>
                <div class={permissionsList}>
                  {role.permissions.map((p) => (
                    <span class={permissionBadge} key={p}>
                      {p}
                    </span>
                  ))}
                  {role.permissions.length === 0 && (
                    <span class={noPermissions}>No permissions assigned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {editingRole.value && (
          <RolePermissionsModal
            role={editingRole.value}
            onClose={() => {
              editingRole.value = null;
            }}
            onSaved={(updated: Role) => {
              onRoleSaved(updated);
              editingRole.value = null;
            }}
          />
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

const statusText = css({
  color: "#64748b",
  fontSize: "14px",
});

const errorText = css({
  color: "#b42318",
  fontSize: "14px",
});

const rolesGrid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "16px",
});

const roleCard = css({
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px",
  background: "#ffffff",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
});

const roleCardHeader = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "14px",
});

const roleName = css({
  fontSize: "15px",
  fontWeight: 700,
  color: "#0f172a",
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

const permissionsList = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
});

const permissionBadge = css({
  display: "inline-block",
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: 600,
  background: "#f0fdf4",
  color: "#166534",
  border: "1px solid #bbf7d0",
});

const noPermissions = css({
  fontSize: "12px",
  color: "#94a3b8",
});
