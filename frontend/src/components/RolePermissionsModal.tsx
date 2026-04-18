import { css } from "@emotion/css";
import { defineComponent, ref, type PropType } from "vue";
import { apiUpdateRole, type Role } from "../api/roles";
import { PERMISSIONS, type Permission } from "../types/permissions";
import { BaseModal } from "./BaseModal";

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

export const RolePermissionsModal = defineComponent({
  name: "RolePermissionsModal",
  props: {
    role: {
      type: Object as PropType<Role>,
      required: true,
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onSaved: {
      type: Function as PropType<(role: Role) => void>,
      required: true,
    },
  },
  setup(props) {
    const selected = ref<Permission[]>([...props.role.permissions]);
    const submitting = ref(false);
    const error = ref<string | null>(null);

    const toggle = (perm: Permission): void => {
      if (selected.value.includes(perm)) {
        selected.value = selected.value.filter((p) => p !== perm);
      } else {
        selected.value = [...selected.value, perm];
      }
    };

    const onSave = async (): Promise<void> => {
      submitting.value = true;
      error.value = null;
      try {
        const updated = await apiUpdateRole(props.role.id, {
          permissions: selected.value,
        });
        props.onSaved(updated);
        props.onClose();
      } catch {
        error.value = "Failed to update permissions. Please try again.";
        submitting.value = false;
      }
    };

    return () => (
      <BaseModal
        title={`Edit Permissions — ${props.role.name}`}
        onClose={props.onClose}
      >
        {{
          default: () => (
            <div class={container}>
              <p class={hint}>
                Select the permissions to grant to this role.
              </p>

              {error.value && <p class={errorText}>{error.value}</p>}

              <ul class={permList}>
                {ALL_PERMISSIONS.map((perm) => {
                  const isChecked = selected.value.includes(perm);
                  return (
                    <li key={perm} class={permItem}>
                      <label class={permLabel}>
                        <input
                          type="checkbox"
                          class={checkbox}
                          checked={isChecked}
                          disabled={submitting.value}
                          onChange={() => toggle(perm)}
                        />
                        <span class={permName}>{perm}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              <div class={actions}>
                <button
                  type="button"
                  class={cancelButton}
                  onClick={props.onClose}
                  disabled={submitting.value}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class={saveButton}
                  onClick={() => void onSave()}
                  disabled={submitting.value}
                >
                  {submitting.value ? "Saving…" : "Save Permissions"}
                </button>
              </div>
            </div>
          ),
        }}
      </BaseModal>
    );
  },
});

const container = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const hint = css({
  margin: 0,
  fontSize: "13px",
  color: "#64748b",
});

const errorText = css({
  fontSize: "13px",
  color: "#b42318",
  background: "#fff1f2",
  border: "1px solid #fca5a5",
  borderRadius: "8px",
  padding: "10px 12px",
  margin: 0,
});

const permList = css({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  overflow: "hidden",
});

const permItem = css({
  padding: "0",
  "&:not(:last-of-type)": {
    borderBottom: "1px solid #f1f5f9",
  },
});

const permLabel = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  cursor: "pointer",
  "&:hover": {
    background: "#f8fafc",
  },
});

const checkbox = css({
  width: "16px",
  height: "16px",
  accentColor: "#1e40af",
  cursor: "pointer",
  flexShrink: 0,
});

const permName = css({
  fontSize: "13px",
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  color: "#0f172a",
});

const actions = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "4px",
});

const cancelButton = css({
  padding: "8px 18px",
  fontSize: "13px",
  fontWeight: 600,
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#ffffff",
  color: "#334155",
  "&:hover:not(:disabled)": {
    background: "#f1f5f9",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

const saveButton = css({
  padding: "8px 18px",
  fontSize: "13px",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#1e40af",
  color: "#ffffff",
  "&:hover:not(:disabled)": {
    background: "#1d4ed8",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});
