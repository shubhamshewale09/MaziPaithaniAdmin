const FEEDBACK_MODAL_EVENT = "paithani:feedback-modal";

export const FEEDBACK_MODAL_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};

export const getFeedbackMessage = (payload) => {
  const data = payload?.response?.data || payload?.data || payload;

  return (
    Object.values(data?.errors || {})?.[0]?.[0] ||
    data?.errorMessage ||
    data?.message ||
    data?.responseData?.message ||
    ""
  );
};

export const openFeedbackModal = ({
  type = FEEDBACK_MODAL_TYPES.SUCCESS,
  title,
  message,
}) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(FEEDBACK_MODAL_EVENT, {
      detail: {
        type,
        title,
        message,
      },
    })
  );
};

export const showGlobalSuccess = (payload, fallbackMessage = "Action completed successfully.") => {
  const message =
    typeof payload === "string" ? payload : getFeedbackMessage(payload);

  openFeedbackModal({
    type: FEEDBACK_MODAL_TYPES.SUCCESS,
    title: "Success",
    message: message || fallbackMessage,
  });
};

export const showGlobalError = (payload, fallbackMessage = "Something went wrong. Please try again.") => {
  const message =
    typeof payload === "string" ? payload : getFeedbackMessage(payload);

  openFeedbackModal({
    type: FEEDBACK_MODAL_TYPES.ERROR,
    title: "Something went wrong",
    message: message || fallbackMessage,
  });
};

export { FEEDBACK_MODAL_EVENT };
