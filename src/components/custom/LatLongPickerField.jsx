import React, { useState } from "react";
import MapLatLngPicker from "./MapLatLngPicker";

const LatLongPickerField = ({
    value = { lat: null, lng: null },
    onChange,
    error,
    label = "Select Location",
}) => {
    const [showMap, setShowMap] = useState(false);

    return (
        <div>
            <label className="block font-medium mb-1">
                {label} <span className="text-red-500">*</span>
            </label>

            <span
                onClick={() => setShowMap(true)}
                className="text-primary text-sm underline cursor-pointer hover:opacity-80"
            >
                📍 Click here to select location on map
            </span>

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    Please select a location on the map
                </p>
            )}

            {showMap && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white rounded-2xl w-full sm:w-[600px] p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Select Location</h3>
                            <button
                                onClick={() => setShowMap(false)}
                                className="text-gray-600 hover:text-black"
                            >
                                ✖
                            </button>
                        </div>

                        <MapLatLngPicker
                            value={{
                                lat: value.lat ? Number(value.lat) : null,
                                lng: value.lng ? Number(value.lng) : null,
                            }}
                            onChange={({ lat, lng }) => {
                                onChange({ lat, lng }); // updates parent formData
                                setShowMap(false); // close after selection
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LatLongPickerField;
