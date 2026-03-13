import React from "react";

const ConfirmationModal = ({
  show,
  onHide,
  actionType, // delete, status, other
  onConfirm,
  modelRequestData,
}) => {

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        aria-hidden={!show}
      >
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl mx-auto flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-16 font-bold text-gray-700">Confirmation</h2>

            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={onHide}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div
            className="container mx-auto p-5 overflow-y-auto flex-grow flex flex-col items-center"
            style={{ maxHeight: "60vh" }}
          >
            {/* Confirmation Icon */}
            <div className="w-16 h-16 mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#E86B1B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
            </div>

            {/* Confirmation Message */}
            <h3 className="text-center mb-3 font-bold text-gray-700 text-16 px-4">
              {actionType === "Delete"
                ? "Are you sure you want to delete this record?"
                : actionType === "Status"
                  ? `Are you sure you want to change the status?`
                  : actionType === "Start Task"
                    ? "Are you sure you want to start this task?"
                    : `Are you sure you want to ${actionType}?`}
            </h3>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-center gap-4 p-4 border-t sticky bottom-0 bg-white z-25 text-12">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={onHide}
            >
              No
            </button>
            <button
              className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90 text-white px-5 py-2 rounded-lg text-12 font-medium shadow-md  transition-all duration-300"
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
