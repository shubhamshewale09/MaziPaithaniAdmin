import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { SellerButton } from "../seller/SellerUI";

const ConfirmationModal = ({
  open,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#2d140f]/45 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-md rounded-[20px] border border-[#ead8cf] bg-[#fffaf6] shadow-[0_30px_80px_rgba(45,20,15,0.22)]">
        <div className="flex items-center justify-between border-b border-[#f1dfd7] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#fff1e7] text-[#b42318]">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a27c68]">Confirmation</p>
              <h3 className="mt-1 text-lg font-bold text-[#381c17]">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-[#7a1e2c] shadow-sm transition hover:bg-[#f8ede7]"
            aria-label="Close confirmation modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm leading-7 text-[#6d5850]">{message}</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <SellerButton type="button" variant="ghost" className="min-h-[38px] rounded-[12px] px-4 text-sm sm:w-auto" onClick={onClose}>
              {cancelLabel}
            </SellerButton>
            <SellerButton type="button" className="min-h-[38px] rounded-[12px] px-4 text-sm sm:w-auto" onClick={onConfirm}>
              {confirmLabel}
            </SellerButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
