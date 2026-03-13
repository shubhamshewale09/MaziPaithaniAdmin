import React, { useEffect, useState } from "react";
import Select from "react-select";
import { primarySelectStyles } from "../../../Utils/Utils";
import { GetAmenityLookupList } from "../../../services/List/AllLookupList"; // <-- replace with your actual API
import { AssignAmenityToAggregator } from "../../../services/Service Aggregator/ServiceAggregatorApi";
import ErrorModal from "../../../components/custom/ErrorModel";

const AssignAmenityDialog = ({
    isOpen,
    onClose,
    defaultSelected = [],
    aggregatorKeyID,
    onSubmit
}) => {
    const [amenityLookupList, setAmenityLookupList] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState({})
    console.log("default selected ==>>", defaultSelected)
    useEffect(() => {
        if (!isOpen) return;

        async function fetchAmenities() {
            try {
                const res = await GetAmenityLookupList(); // <-- your API

                if (res?.statusCode === 200) {
                    const options = (res.responseData?.data || []).map(item => ({
                        label: item.amenityName,
                        value: item.amenityID
                    }));
                    setAmenityLookupList(options);

                }
            } catch (err) {
                console.error("Error fetching amenities:", err);
            }
        }

        fetchAmenities();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (Array.isArray(defaultSelected) && defaultSelected.length) {
                setSelectedAmenities(
                    defaultSelected.map(a => ({
                        label: a.amenityName,
                        value: a.amenityID
                    }))
                );
            } else {
                setSelectedAmenities([]); // clear when none
            }
        }
    }, [isOpen, defaultSelected]);

    if (!isOpen) return null;


    const handleSave = async () => {
        try {
            setIsSaving(true);

            const payload = {
                userKeyID: JSON.parse(localStorage.getItem("login"))?.userKeyID,
                serviceAggregatorKeyID: aggregatorKeyID,
                amenityIDs: selectedAmenities.map(a => a.value)
            };

            const res = await AssignAmenityToAggregator(payload);

            if (res?.statusCode === 200) {
                onSubmit(selectedAmenities);
                onClose();
            } else {
                setErrorMsg(
                    res?.response?.data?.errorMessage ||
                    res?.message ||
                    "Failed to assign amenities. Please try again."
                );
                setIsErrorOpen(true);
            }
        } catch (err) {
            setErrorMsg(
                err?.response?.data?.errorMessage ||
                err?.message ||
                "Something went wrong while saving amenities."
            );
            setIsErrorOpen(true);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-[400px]">

                {/* Header */}
                <div className="bg-background px-4 py-3 border-b flex justify-between items-center rounded-t-2xl">
                    <h3 className="font-semibold text-lg">
                        Assign Amenity
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    <label className="block font-medium mb-2">
                        Select Amenities
                    </label>
                    <Select
                        isMulti
                        options={amenityLookupList}
                        value={selectedAmenities}   // ✅ now correct format
                        onChange={(val) => setSelectedAmenities(val)}
                        placeholder="Select amenities..."
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                        closeMenuOnScroll={true}
                        maxMenuHeight={200}
                        styles={primarySelectStyles}
                    />


                    {/* <Select
                        isMulti
                        options={amenityLookupList}
                        value={selectedAmenities}   // 👈 default values will show here
                        onChange={(val) => setSelectedAmenities(val)}
                        placeholder="Select amenities..."
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                        closeMenuOnScroll={true}
                        maxMenuHeight={200}
                        styles={primarySelectStyles}
                    // hasError={!!errors.serviceAggregatorTypeID}
                    /> */}
                </div>

                {/* Footer */}
                <div className="bg-background px-4 py-3 border-t flex justify-end gap-2 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>

                </div>
            </div>

            <ErrorModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                errorMessage={errorMsg}
            />
        </div>
    );
};

export default AssignAmenityDialog;
