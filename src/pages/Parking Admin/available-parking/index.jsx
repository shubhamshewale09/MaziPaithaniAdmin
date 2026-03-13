import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { MIN_LOADING_TIME, pagesArray, primarySelectStyles } from "../../../Utils/Utils";
import SuccessModal from "../../../components/custom/SuccessModal";
import ErrorModal from "../../../components/custom/ErrorModel";
import Pagination from "../../../components/custom/Pagination";
import { ChangeParkingStatus, GetAvailableParkingList } from "../../../services/Parking/ParkingApi";
import BackButton from "../../../components/custom/BackButton";

/* ---------------- Main Component ---------------- */
const ListComponent = () => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    const searchTimerRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useLocation();

    //================state===================
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [tableRows, setTableRows] = useState([]);
    const [modelAction, setModelAction] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatusOpen, setStatusModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState({})
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]); // All

    const [modelRequestData, setModelRequestData] = useState({
        KeyID: null,
        Action: null,
        Status: null,
        Name: null,
    })
    const [appliedFilter, setAppliedFilter] = useState({
        pageSize: pageSize,
        pageNo: 0,
        searchKeyword: null,
        fromDate: null,
        toDate: null,
        userKeyID: userKeyID,
        parkingKeyID: state?.fromDashboard ? null : state?.parkingKeyID,
        isCheckOut: state?.fromDashboard ? state?.status == "Check-Out" ? "Yes" : "No" : null
    });

    //======================useEffect================================

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const startTime = Date.now();
            setIsLoading(true);
            try {
                const res = await GetAvailableParkingList({ ...appliedFilter });

                if (!isMounted) return;

                if (res?.statusCode === 200) {
                    setTableRows(res.responseData.data || []);
                    setTotalPages(
                        Math.ceil(res.totalCount / appliedFilter.pageSize)
                    );
                } else {
                    setTableRows([]);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                if (isMounted) setTableRows([]);
            } finally {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

                setTimeout(() => {
                    if (isMounted) setIsLoading(false);
                }, remaining);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [appliedFilter]);

    useEffect(() => {
        if (!state?.fromDashboard) return;

        // Find the correct option object based on state.status
        const defaultOption =
            filterOptions.find(o => o.value === (state.status === "Check-Out" ? "Yes" : state.status === "Check-In" ? "No" : null))
            || filterOptions[0]; // fallback to 'All'

        setSelectedFilter(defaultOption);

        // Also sync appliedFilter so API call matches
        setAppliedFilter(prev => ({
            ...prev,
            isCheckOut: defaultOption.value,
            pageNo: 0,
        }));
    }, [state]);


    // Handle search input
    const handleSearch = (value) => {
        setSearch(value);
        // clear previous debounce
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        // debounce API trigger
        searchTimerRef.current = setTimeout(() => {
            setCurrentPage(1);
            setAppliedFilter(f => ({
                ...f,
                searchKeyword: value || null,
                pageNo: 0
            }));

        }, 500); // 500ms delay;
    }

    const handleClearSearch = () => {
        setSearch("")
        setAppliedFilter({
            ...appliedFilter,
            pageNo: 0,
            searchKeyword: ""
        })
    }

    const openAddModal = () => {
        setModelRequestData({
            ...modelRequestData,
            KeyID: null,
            Action: "Add",
            // userKeyIDForUpdate: state?.userKeyIDForUpdate
            userID: state?.userID
        })
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setModelRequestData({
            ...modelRequestData,
            KeyID: user.parkingKeyID,
            Action: "Update",
        })
        setModalOpen(true);
    };
    const openChangeStatusModal = (user) => {

        setStatusModalOpen(true);
        setSelectedParking(user)
    };
    const handleUpdateStatus = async () => {
        if (modelAction === "Status") {
            try {
                let data = await ChangeParkingStatus(modelRequestData.parkingKeyID);
                if (data?.statusCode === 200) {
                    setConfirmationModal(false);
                    setShowSuccessPopupModal(true);
                    // setAppliedFilter({ ...appliedFilter });
                } else {
                    setIsErrorOpen(true);
                    setConfirmationModal(false);
                    const errorMessage = data?.response?.data?.errorMessage;
                    setErrorMessage(errorMessage);
                }
            } catch (error) {
                console.log("error ==>>", error)
            }
        }
    };

    const handleBack = () => {
        if (state?.fromDashboard) {
            navigate(-1); // go back to dashboard
        } else {
            navigate("/users/dashboard"); // fallback route
        }
    };


    return (
        <div className="bg-background h-full flex flex-col rounded-xl border border-gray-200 shadow">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2">
                {/* Left side: Search + filter buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

                    <BackButton />
                    {/* Search input */}
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pr-9 px-3 py-1.5 rounded-lg border border-gray-300
                    focus:outline-none focus:ring-1 focus:ring-secondary text-sm"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Select
                            options={filterOptions}
                            value={selectedFilter}
                            onChange={(option) => {
                                const selected = option || filterOptions[0];

                                setSelectedFilter(selected);
                                setAppliedFilter(prev => ({
                                    ...prev,
                                    isCheckOut: selected.value, // null / Yes / No
                                    pageNo: 0,
                                }));
                            }}
                            className="w-56 text-sm"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                        />

                    </div>
                </div>

                {/* Right side: Add Parking button */}
                {/* <div className="flex-shrink-0">
                    <button
                        onClick={openAddModal}
                        className="px-4 py-1.5 rounded-lg bg-secondary-dark text-white hover:opacity-90 transition text-sm w-full md:w-auto"
                    >
                        Add Parking
                    </button>
                </div> */}
            </div>


            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="min-w-full text-sm text-gray-800 border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {["Sr. No.", "Parking Name", "Vehicle Type", "Vehicle Number", "Check In Time", "Check Out Time", "Parking Charges To Pay", "Paid Parking Charges"].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-2 text-center text-sm font-bold text-gray-700 tracking-wide"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <TableSkeleton rows={5} cols={7} />
                        ) : tableRows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-6 text-center text-gray-500">
                                    No Data found.
                                </td>
                            </tr>
                        ) : (
                            tableRows.map((u, idx) => (
                                <tr
                                    key={u.parkingKeyID}
                                    className="hover:bg-gray-50 transition-colors text-center"
                                >
                                    <td className="px-4 py-2 text-gray-600">
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700">{u.parkingName}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.vehicalType || "-"}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.vehicalNumber}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.checkInDateTime}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.checkOutDateTime || "-"}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.parkingChargesToPay}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.paidParkingCharges}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={pagesArray}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setAppliedFilter(f => ({
                        ...f,
                        pageSize: size,
                        pageNo: 0
                    }));
                    setCurrentPage(1);
                }}
                onPrev={() => {
                    const prev = Math.max(currentPage - 1, 1);
                    setCurrentPage(prev);
                    setAppliedFilter(f => ({ ...f, pageNo: prev - 1 }));
                }}

                onNext={() => {
                    const next = Math.min(currentPage + 1, totalPages);
                    setCurrentPage(next);
                    setAppliedFilter(f => ({ ...f, pageNo: next - 1 }));
                }}
                onPageClick={(page) => {
                    setCurrentPage(page);
                    setAppliedFilter(f => ({ ...f, pageNo: page - 1 }));
                }}
            />

            {/* User Form Modal */}
            {/* {modalOpen && (
                <AddUpdateForm
                    onClose={() => {
                        setModalOpen(false);
                        setAppliedFilter({ ...appliedFilter });
                    }}
                    modelRequestData={modelRequestData}
                />
            )} */}
            {/* confirmation modal  */}
            {/* <ConfirmationModal
                show={confirmationModal}
                onHide={() => setConfirmationModal(false)}
                actionType={modelAction}
                onConfirm={handleUpdateStatus}
                modelRequestData={modelRequestData}
            /> */}
            {/* success modal  */}
            <SuccessModal
                isOpen={showSuccessPopupModal}
                onClose={() => {
                    setShowSuccessPopupModal(false);
                    setAppliedFilter({
                        ...appliedFilter,
                    });
                }}
                modelAction={modelAction}
                actionMessage={
                    modelAction === "Status"
                        ? "Status has been changed successfully!"
                        : modelRequestData.Name
                }
            />
            {/* error modal  */}
            <ErrorModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                errorMessage={errorMessage}
            />
            {/* {modalStatusOpen && selectedParking && (
                <ParkingStatusModal
                    parking={selectedParking}
                    parkingOwnerID={state?.userID}
                    onClose={({ updated, newStatus }) => {
                        setStatusModalOpen(false);
                        setAppliedFilter({ ...appliedFilter, pageNo: 0 })
                    }}
                />
            )} */}

        </div>
    );
};
// table skeleton component 
const TableSkeleton = ({ rows = 5, cols = 7 }) => (
    <>
        {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx} className="animate-pulse">
                {Array.from({ length: cols }).map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                ))}
            </tr>
        ))}
    </>
);

const filterOptions = [
    { value: null, label: "All" },
    { value: "Yes", label: "Check Out" },
    { value: "No", label: "Check In" },
];
export default ListComponent;

