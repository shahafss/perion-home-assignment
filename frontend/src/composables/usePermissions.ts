import { computed } from "vue";
import { useAuth } from "./useAuth";

export function usePermissions() {
  const { user } = useAuth();

  const permissions = computed(() => user.value?.role?.permissions ?? []);
  const roleName = computed(() => user.value?.role?.name ?? "");

  const hasPermission = (p: string): boolean => permissions.value.includes(p);

  const isAdmin = computed(() => roleName.value === "Admin");
  const isEditor = computed(() => roleName.value === "Editor");
  const isViewer = computed(() => roleName.value === "Viewer");

  return { hasPermission, isAdmin, isEditor, isViewer };
}
