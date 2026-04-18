import { css } from "@emotion/css";
import { Teleport, defineComponent, type PropType } from "vue";

export const BaseModal = defineComponent({
  name: "BaseModal",
  props: {
    title: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <Teleport to="body">
        <div class={backdrop} onClick={props.onClose}>
          <div
            class={modalBox}
            role="dialog"
            aria-modal="true"
            aria-label={props.title}
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <div class={modalHeader}>
              <h3 class={modalTitle}>{props.title}</h3>
              <button
                type="button"
                class={closeButton}
                onClick={props.onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div class={modalBody}>{slots.default?.()}</div>
          </div>
        </div>
      </Teleport>
    );
  },
});

const backdrop = css({
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.45)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});

const modalBox = css({
  background: "#ffffff",
  borderRadius: "14px",
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
  width: "100%",
  maxWidth: "480px",
  margin: "0 16px",
  overflow: "hidden",
});

const modalHeader = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px 16px",
  borderBottom: "1px solid #e2e8f0",
});

const modalTitle = css({
  margin: 0,
  fontSize: "17px",
  fontWeight: 700,
  color: "#0f172a",
});

const closeButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  fontSize: "14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "transparent",
  color: "#64748b",
  "&:hover": {
    background: "#f1f5f9",
    color: "#0f172a",
  },
});

const modalBody = css({
  padding: "24px",
});
