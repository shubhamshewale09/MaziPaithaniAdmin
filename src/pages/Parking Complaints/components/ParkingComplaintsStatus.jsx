import { useState } from "react";
import Select from "react-select";
import { UpdateComplaintStatus } from "../../../services/Parking Complaints/ParkingComplaintsApi";
import { primarySelectStyles } from "../../../Utils/Utils";

/* -------------------- STATUS MAPPING -------------------- */
const complaintStatusMap = {
    Pending: null,
    Solved: true,
    Unsolved: false,
};

const complaintStatusOptions = [
    { label: "Pending", value: null },
    { label: "Solved", value: true },
    { label: "Unsolved", value: false },
];

const ParkingComplaintsStatusModal = ({ onClose, parking }) => {

    const { userKeyID } = JSON.parse(localStorage.getItem("login"));

    /* -------------------- STATE -------------------- */
    const [formData, setFormData] = useState({
        parkingReportKeyID: parking?.parkingReportKeyID,
        isComplaintSolved:
            parking?.isComplaintSolved in complaintStatusMap
                ? complaintStatusMap[parking.isComplaintSolved]
                : null,
        remark: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* -------------------- VALIDATION -------------------- */
    const validate = () => {
        const newErrors = {};

        // undefined is invalid, null (Pending) is valid
        if (formData.isComplaintSolved === undefined) {
            newErrors.isComplaintSolved = "Status is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        const payload = {
            userKeyID,
            parkingReportKeyID: formData.parkingReportKeyID,
            isComplaintSolved: formData.isComplaintSolved, // null | true | false
            remark: formData.remark,
        };

        try {
            const res = await UpdateComplaintStatus(payload);
            if (res?.statusCode === 200) {
                onClose({ updated: true });
            }
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* -------------------- UI -------------------- */
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
                            options={complaintStatusOptions}
                            placeholder="Select Status"
                            isClearable
                            value={
                                complaintStatusOptions.find(
                                    (opt) => opt.value === formData.isComplaintSolved
                                ) || null
                            }
                            onChange={(option) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    isComplaintSolved: option ? option.value : null,
                                }));
                                setErrors((prev) => ({ ...prev, isComplaintSolved: null }));
                            }}

                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.isComplaintSolved}
                        />

                        {errors.isComplaintSolved && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.isComplaintSolved}
                            </p>
                        )}
                    </div>

                    {/* Remark */}
                    <div>
                        <label className="block font-medium mb-1">Remark</label>
                        <textarea
                            value={formData.remark}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    remark: e.target.value,
                                }))
                            }
                            placeholder="Enter remark"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                        />
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
                        className={`px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParkingComplaintsStatusModal;
