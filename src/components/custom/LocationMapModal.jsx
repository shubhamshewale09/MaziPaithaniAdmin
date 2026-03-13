import MapLatLngPicker from "./MapLatLngPicker";

const LocationMapModal = ({
    show,
    onClose,
    onSubmit,
    formData,
    setFormData,
    setSelectedLocation,
    onLocationSelect,   // <-- NEW
}) => {
    if (!show) return null;

    const clearLatLngAndClose = () => {
        setFormData((prev) => ({
            ...prev,
            latitude: "",
            longitude: "",
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Select Location</h3>
                    <button
                        onClick={clearLatLngAndClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Map Body */}
                <div className="p-2 overflow-y-auto">
                    <MapLatLngPicker
                        defaultLocation={
                            formData.latitude && formData.longitude
                                ? {
                                    lat: parseFloat(formData.latitude),
                                    lng: parseFloat(formData.longitude),
                                }
                                : null
                        }
                        onLocationSelect={(loc) => {
                            setSelectedLocation({
                                lat: loc.lat,
                                lng: loc.lng,
                            });

                            // Pass location back to parent
                            onLocationSelect?.(loc);
                        }}
                    />
                </div>

                {/* Footer Buttons */}
                <div className="px-4 py-3 border-t flex justify-end gap-2">
                    <button
                        onClick={clearLatLngAndClose}
                        className="px-4 py-2 rounded-lg border bg-background-light hover:bg-gray-100"
                    >
                        Close
                    </button>

                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationMapModal;
