import React from "react";

const SuccessModal = ({
  isOpen,
  onClose,
  actionMessage,
  modelAction,
  onSuccess,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" />

      {/* Modal Container */}
      <div className="relative z-60 w-full max-w-md bg-white rounded-lg shadow-xl min-h-[250px]">
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-14 font-semibold mb-2">Success!</h3>

          {/* Message */}
          <p className="mb-4 text-12">
            {modelAction === null ? actionMessage : null}
            {modelAction === "Status"
              ? "Status has been updated successfully!"
              : null}
            {modelAction === "Add"
              ? `${actionMessage} has been added successfully!`
              : null}
            {modelAction === "Update"
              ? `${actionMessage} has been updated successfully!`
              : null}
            {modelAction === "Delete"
              ? `${actionMessage} has been deleted successfully!`
              : null}
            {modelAction === "Permissions" ? `${actionMessage}!` : null}
          </p>

          {/* Button */}
          <button
            onClick={() => {
              onClose(); // Close the modal
              if (onSuccess) onSuccess(); // Call the onSuccess function if provided
            }}
            className="w-1/3 text-center bg-primary text-white px-4 py-2 rounded text-12"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
