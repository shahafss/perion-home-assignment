import { css } from "@emotion/css";
import { defineComponent, onMounted, ref, type PropType } from "vue";
import { apiCreateUser, apiUpdateUser, type User } from "../api/users";
import { apiGetRoles, type Role } from "../api/roles";
import { BaseModal } from "./BaseModal";

export const UserModal = defineComponent({
  name: "UserModal",
  props: {
    user: Object as PropType<User>,
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onSaved: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const isEditMode = props.user !== undefined;

    const formName = ref(props.user?.name ?? "");
    const formEmail = ref(props.user?.email ?? "");
    const formRoleId = ref(props.user?.role.id ?? "");

    const roles = ref<Role[]>([]);
    const submitting = ref(false);
    const error = ref<string | null>(null);

    const loadRoles = async (): Promise<void> => {
      try {
        roles.value = await apiGetRoles();
        if (!isEditMode && roles.value.length > 0) {
          formRoleId.value = roles.value[0].id;
        }
      } catch {
        error.value = "Failed to load roles.";
      }
    };

    const onSubmit = async (): Promise<void> => {
      error.value = null;

      if (!formName.value.trim()) {
        error.value = "Name is required.";
        return;
      }
      if (!formEmail.value.trim()) {
        error.value = "Email is required.";
        return;
      }
      if (!formRoleId.value) {
        error.value = "Role is required.";
        return;
      }

      submitting.value = true;
      try {
        if (isEditMode && props.user) {
          await apiUpdateUser(props.user.id, {
            name: formName.value.trim(),
            email: formEmail.value.trim(),
            roleId: formRoleId.value,
          });
        } else {
          await apiCreateUser({
            name: formName.value.trim(),
            email: formEmail.value.trim(),
            roleId: formRoleId.value,
          });
        }
        props.onSaved();
        props.onClose();
      } catch {
        error.value = isEditMode
          ? "Failed to update user. Please try again."
          : "Failed to create user. Please try again.";
      } finally {
        submitting.value = false;
      }
    };

    onMounted(() => {
      void loadRoles();
    });

    return () => (
      <BaseModal
        title={isEditMode ? "Edit User" : "Add User"}
        onClose={props.onClose}
      >
        {{
          default: () => (
            <form
              class={form}
              onSubmit={(e: Event) => {
                e.preventDefault();
                void onSubmit();
              }}
            >
              {error.value && <p class={errorText}>{error.value}</p>}

              <div class={fieldGroup}>
                <label class={fieldLabel} for="user-name">
                  Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  class={fieldInput}
                  value={formName.value}
                  onInput={(e: Event) => {
                    formName.value = (e.target as HTMLInputElement).value;
                  }}
                  placeholder="Full name"
                  disabled={submitting.value}
                />
              </div>

              <div class={fieldGroup}>
                <label class={fieldLabel} for="user-email">
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  class={fieldInput}
                  value={formEmail.value}
                  onInput={(e: Event) => {
                    formEmail.value = (e.target as HTMLInputElement).value;
                  }}
                  placeholder="email@example.com"
                  disabled={submitting.value}
                />
              </div>

              <div class={fieldGroup}>
                <label class={fieldLabel} for="user-role">
                  Role
                </label>
                <select
                  id="user-role"
                  class={fieldSelect}
                  value={formRoleId.value}
                  onChange={(e: Event) => {
                    formRoleId.value = (e.target as HTMLSelectElement).value;
                  }}
                  disabled={submitting.value}
                >
                  {roles.value.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div class={formActions}>
                <button
                  type="button"
                  class={cancelButton}
                  onClick={props.onClose}
                  disabled={submitting.value}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class={submitButton}
                  disabled={submitting.value}
                >
                  {submitting.value
                    ? "Saving…"
                    : isEditMode
                    ? "Save Changes"
                    : "Create User"}
                </button>
              </div>
            </form>
          ),
        }}
      </BaseModal>
    );
  },
});

const form = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
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

const fieldGroup = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

const fieldLabel = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
});

const fieldInput = css({
  fontSize: "14px",
  color: "#0f172a",
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "9px 12px",
  outline: "none",
  transition: "border-color 0.15s",
  "&:focus": {
    borderColor: "#3b82f6",
    background: "#ffffff",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

const fieldSelect = css({
  fontSize: "14px",
  color: "#0f172a",
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "9px 12px",
  outline: "none",
  cursor: "pointer",
  "&:focus": {
    borderColor: "#3b82f6",
    background: "#ffffff",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

const formActions = css({
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

const submitButton = css({
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
