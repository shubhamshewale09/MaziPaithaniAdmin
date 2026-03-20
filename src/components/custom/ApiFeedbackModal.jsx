import React, { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, X, XCircle } from "lucide-react";
import {
  FEEDBACK_MODAL_EVENT,
  FEEDBACK_MODAL_TYPES,
} from "../../Utils/feedbackModal";

const modalThemes = {
  [FEEDBACK_MODAL_TYPES.SUCCESS]: {
    badge: "bg-emerald-100 text-emerald-700",
    cardRing: "shadow-[0_30px_90px_rgba(5,150,105,0.24)]",
    glow: "from-emerald-300/45 via-lime-200/20 to-transparent",
    iconShell: "bg-emerald-500 text-white",
    label: "Success",
    Icon: CheckCircle2,
  },
  [FEEDBACK_MODAL_TYPES.ERROR]: {
    badge: "bg-rose-100 text-rose-700",
    cardRing: "shadow-[0_30px_90px_rgba(225,29,72,0.22)]",
    glow: "from-rose-300/45 via-orange-200/20 to-transparent",
    iconShell: "bg-rose-500 text-white",
    label: "Failure",
    Icon: XCircle,
  },
};

const ApiFeedbackModal = () => {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleOpen = (event) => {
      const detail = event.detail || {};
      setFeedback({
        type: detail.type || FEEDBACK_MODAL_TYPES.SUCCESS,
        title: detail.title || "Notification",
        message: detail.message || "",
      });
    };

    window.addEventListener(FEEDBACK_MODAL_EVENT, handleOpen);

    return () => {
      window.removeEventListener(FEEDBACK_MODAL_EVENT, handleOpen);
    };
  }, []);

  if (!feedback) {
    return null;
  }

  const theme =
    modalThemes[feedback.type] || modalThemes[FEEDBACK_MODAL_TYPES.SUCCESS];
  const Icon = theme.Icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2d140f]/35 px-4 backdrop-blur-[4px]">
      <div
        className={`feedback-modal-enter relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/70 bg-[#fffaf6] ${theme.cardRing}`}
      >
        <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${theme.glow}`} />
        <div className="absolute right-6 top-5 opacity-30">
          <Sparkles className="feedback-modal-float h-8 w-8 text-[#7a1e2c]" />
        </div>

        <button
          type="button"
          onClick={() => setFeedback(null)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-sm transition hover:scale-105 hover:bg-white"
          aria-label="Close feedback modal"
        >
          <X size={18} />
        </button>

        <div className="relative px-6 pb-7 pt-8 sm:px-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className={`feedback-modal-icon-pop flex h-16 w-16 items-center justify-center rounded-[20px] ${theme.iconShell}`}>
              <Icon size={32} strokeWidth={2.4} />
            </div>

            <div className="flex-1">
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${theme.badge}`}>
                {theme.label}
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[#341814]">
                {feedback.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#6d5850]">
                {feedback.message}
              </p>
            </div>
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="rounded-[14px] bg-[#7a1e2c] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-[#651623]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiFeedbackModal;
