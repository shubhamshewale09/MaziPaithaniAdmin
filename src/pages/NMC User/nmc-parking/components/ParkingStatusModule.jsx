import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ChangeParkingStatus } from "../../../../services/Parking/ParkingApi";
import { statusOptions } from "../../../../Utils/Utils";

const ParkingStatusModal = ({ onClose, parking }) => {

    const { userKeyID } = JSON.parse(localStorage.getItem("login"));

    const [formData, setFormData] = useState({
        parkingKeyID: parking?.parkingKeyID,
        isAdminApproved: parking?.isAdminApproved ?? null,
        remarks: parking?.rejectionReason || "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ================= VALIDATION =================
    const validate = () => {
        const newErrors = {};

        if (formData.isAdminApproved === null) {
            newErrors.isAdminApproved = "Status is required";
        }

        // if (!formData.remarks || !formData.remarks.trim()) {
        //     newErrors.remarks = "Remark is required";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const res = await ChangeParkingStatus({
                ...formData,
                userKeyID,
            });

            if (res.status == 200 || res.statusCode == 200) {
                onClose({ updated: true });
            } else {
                const newErrors = {};
                newErrors.remarks = `${res.response.data.errorMessage}`;
                setErrors(newErrors);
            }
        } catch (err) {
            console.error("Error updating status:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 rounded-t-xl">
                    <h2 className="text-lg font-semibold">Update Parking Status</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
                    {/* Status Select */}
                    <div>
                        <label className="block font-medium mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={statusOptions}
                            placeholder="Select Status"
                            isClearable
                            value={
                                statusOptions.find(
                                    opt => opt.value === formData.isAdminApproved
                                ) || null
                            }
                            onChange={(option) => {
                                setFormData(prev => ({
                                    ...prev,
                                    isAdminApproved: option ? option.value : null,
                                }));
                                setErrors(prev => ({ ...prev, isAdminApproved: null }));
                            }}
                        />
                        {errors.isAdminApproved && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.isAdminApproved}
                            </p>
                        )}
                    </div>

                    {/* Remark Textfield */}
                    <div>
                        <label className="block font-medium mb-1">
                            Remark
                        </label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    remarks: e.target.value,
                                }));
                                setErrors(prev => ({ ...prev, remarks: null }));
                            }}
                            placeholder="Enter remark"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1
                                ${errors.remarks
                                    ? "border-red-500 focus:ring-red-400"
                                    : "focus:ring-secondary"
                                }`}
                        />
                        {errors.remarks && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.remarks}
                            </p>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onClose({ updated: false })}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-200 transition"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg bg-secondary-dark text-white
                            hover:opacity-90 transition
                            ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParkingStatusModal;

