import { css } from "@emotion/css";
import { defineComponent, ref, type PropType } from "vue";
import { apiDeleteUser, type User } from "../api/users";
import { BaseModal } from "./BaseModal";

export const DeleteConfirmModal = defineComponent({
  name: "DeleteConfirmModal",
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onDeleted: {
      type: Function as PropType<(userId: string) => void>,
      required: true,
    },
  },
  setup(props) {
    const deleting = ref(false);
    const error = ref<string | null>(null);

    const onConfirm = async (): Promise<void> => {
      deleting.value = true;
      error.value = null;
      try {
        await apiDeleteUser(props.user.id);
        props.onDeleted(props.user.id);
        props.onClose();
      } catch {
        error.value = "Failed to delete user. Please try again.";
        deleting.value = false;
      }
    };

    return () => (
      <BaseModal title="Delete User" onClose={props.onClose}>
        {{
          default: () => (
            <div class={container}>
              <p class={message}>
                Are you sure you want to delete{" "}
                <strong>{props.user.name}</strong>? This action cannot be
                undone.
              </p>

              {error.value && <p class={errorText}>{error.value}</p>}

              <div class={actions}>
                <button
                  type="button"
                  class={cancelButton}
                  onClick={props.onClose}
                  disabled={deleting.value}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class={deleteButton}
                  onClick={() => void onConfirm()}
                  disabled={deleting.value}
                >
                  {deleting.value ? "Deleting…" : "Delete User"}
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

const message = css({
  margin: 0,
  fontSize: "14px",
  color: "#374151",
  lineHeight: 1.6,
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

const deleteButton = css({
  padding: "8px 18px",
  fontSize: "13px",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#dc2626",
  color: "#ffffff",
  "&:hover:not(:disabled)": {
    background: "#b91c1c",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});
