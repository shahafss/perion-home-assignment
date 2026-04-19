import { computed } from "vue";
import { useAuth } from "./useAuth";
import { ROLE, type Permission, type RoleName } from "../types/permissions";

export function usePermissions() {
  const { user } = useAuth();

  const permissions = computed(() => user.value?.role.permissions);
  const roleName = computed(() => user.value?.role.name);

  const hasPermission = (permission: Permission) => Boolean(permissions.value?.includes(permission));

  const isAdmin  = computed(() => roleName.value === ROLE.Admin);
  const isEditor = computed(() => roleName.value === ROLE.Editor);
  const isViewer = computed(() => roleName.value === ROLE.Viewer);

  return { hasPermission, isAdmin, isEditor, isViewer };
}
