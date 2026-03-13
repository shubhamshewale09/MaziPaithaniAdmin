import errorImage from "../../assets/images/wired-outline-1140-error.gif";

const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Body */}
                <div className="px-8 py-8 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-50">
                        <img
                            src={errorImage}
                            alt="Error"
                            className="w-14 h-14"
                        />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-red-600 mb-2">
                        Error Occurred
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {errorMessage || "Something went wrong. Please try again later."}
                    </p>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 flex justify-center bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-lg bg-primary text-white font-medium
                       hover:bg-primary-light transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;


