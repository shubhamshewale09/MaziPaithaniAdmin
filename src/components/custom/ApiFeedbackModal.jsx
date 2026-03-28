import React, { useEffect, useState } from "react";
import { CheckCircle2, X, XCircle, Sparkles } from "lucide-react";
import {
  FEEDBACK_MODAL_EVENT,
  FEEDBACK_MODAL_TYPES,
} from "../../Utils/feedbackModal";

const AUTO_CLOSE_MS = 1500;

const ApiFeedbackModal = () => {
  const [feedback, setFeedback] = useState(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const handleOpen = (event) => {
      const detail = event.detail || {};
      setFeedback({
        type:    detail.type    || FEEDBACK_MODAL_TYPES.SUCCESS,
        title:   detail.title   || "Notification",
        message: detail.message || "",
      });
      setProgress(100);
    };
    window.addEventListener(FEEDBACK_MODAL_EVENT, handleOpen);
    return () => window.removeEventListener(FEEDBACK_MODAL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (feedback?.type !== FEEDBACK_MODAL_TYPES.SUCCESS) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) { clearInterval(interval); return 0; }
        return prev - (100 / (AUTO_CLOSE_MS / 50));
      });
    }, 50);
    const timer = setTimeout(() => setFeedback(null), AUTO_CLOSE_MS);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [feedback]);

  if (!feedback) return null;

  const isSuccess = feedback.type === FEEDBACK_MODAL_TYPES.SUCCESS;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ backdropFilter: "blur(6px)", background: "rgba(47,29,24,0.45)" }}>
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-[#fffaf6] shadow-[0_30px_90px_rgba(94,35,23,0.28)]">

        {/* top glow */}
        <div className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-br ${isSuccess ? "from-emerald-400/25 via-teal-300/10" : "from-rose-500/20 via-red-400/10"} to-transparent`} />

        {/* sparkle */}
        <div className="absolute right-6 top-5 opacity-25">
          <Sparkles className={`h-8 w-8 ${isSuccess ? "text-emerald-500" : "text-rose-500"}`} />
        </div>

        {/* close */}
        <button
          type="button"
          onClick={() => setFeedback(null)}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7a1e2c] shadow-sm transition hover:scale-105 hover:bg-[#f9ede7]"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="relative px-7 pb-7 pt-8">
          <div className="flex items-center gap-5">

            {/* icon */}
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] shadow-lg ${
              isSuccess
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-400/30"
                : "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30"
            }`}>
              {isSuccess
                ? <CheckCircle2 size={30} strokeWidth={2.5} className="text-white" />
                : <XCircle     size={30} strokeWidth={2.5} className="text-white" />
              }
            </div>

            {/* text */}
            <div className="flex-1 min-w-0">
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${
                isSuccess
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}>
                {isSuccess ? "Success" : "Error"}
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#341814]">{feedback.title}</h3>
              {feedback.message && (
                <p className="mt-1.5 text-sm leading-6 text-[#6d5850]">{feedback.message}</p>
              )}
            </div>
          </div>

          {/* progress bar — success only */}
          {isSuccess && (
            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[#f0e0d6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
                style={{ width: `${progress}%`, transitionDuration: "50ms" }}
              />
            </div>
          )}

          {/* OK button — error only */}
          {!isSuccess && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="rounded-[14px] bg-gradient-to-r from-[#7a1e2c] to-[#9e3140] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:from-[#651623]"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiFeedbackModal;
