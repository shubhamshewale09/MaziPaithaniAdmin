import { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { ImLocation } from "react-icons/im";

import { MIN_LOADING_TIME, pagesArray, truncateText } from "../../../Utils/Utils";
import AddUpdateForm from "./components/AddUpdateForm";
import Android12Switch from "../../../components/custom/AndroidSwitch";
import ConfirmationModal from "../../../components/custom/ConfirmationModal";
import SuccessModal from "../../../components/custom/SuccessModal";
import ErrorModal from "../../../components/custom/ErrorModel";
import Pagination from "../../../components/custom/Pagination";
import { ChangeParkingStatus, GetParkingList } from "../../../services/Parking/ParkingApi";
import ParkingStatusModal from "./components/ParkingStatusModal";
import Badge from "../../../components/custom/Badge";

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
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
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
        isAdminApproved: null,
        userKeyID: state?.userKeyIDForUpdate,
        parkingOwnerID: state?.userID
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatusOpen, setStatusModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState({})
    //======================useEffect================================

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const startTime = Date.now();
            setIsLoading(true);
            try {
                let res = [];

                if (state?.fromDashboard) {
                    res = await GetParkingList({
                        ...appliedFilter,
                        userKeyID: userKeyID,
                        isAdminApproved: state?.status,
                        parkingOwnerID: null,
                    });
                } else {
                    res = await GetParkingList({ ...appliedFilter });
                }

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

    const openGoogleMapsDirections = (destLat, destLng) => {
        if (!destLat || !destLng) return;

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destLat},${destLng}&travelmode=driving`;

                window.open(googleMapsUrl, "_blank");
            },
            (error) => {
                console.error("Location error:", error);
                alert("Unable to fetch your current location");
            }
        );
    };

    return (
        <div className="bg-background h-full flex flex-col rounded-xl border border-gray-200 shadow">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2">
                {/* Left side: Search + filter buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
                    {!state?.fromDashboard && (
                        <div className="flex flex-wrap gap-2">
                            <Select
                                options={filterOptions}
                                isClearable
                                placeholder="Filter by status"
                                value={selectedFilter}
                                onChange={(option) => {
                                    const selected = option || filterOptions[0]; // fallback to All
                                    setSelectedFilter(selected);
                                    setAppliedFilter(prev => ({
                                        ...prev,
                                        isAdminApproved: selected.value,
                                        pageNo: 0,
                                    }));
                                }}
                                className="w-56 text-sm"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>)}
                </div>

                {/* Right side: Add Parking button */}
                {!state?.fromDashboard && (
                    <div className="flex-shrink-0">
                        <Tooltip title="Add Parking">
                            <button
                                onClick={openAddModal}
                                className="px-4 py-1.5 rounded-lg bg-secondary-dark text-white hover:opacity-90 transition text-sm w-full md:w-auto"
                            >
                                Add Parking
                            </button>
                        </Tooltip>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="min-w-full text-sm text-gray-800 border-collapse" style={{
                }}>
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {["Sr. No.", "Name", "Parking Capacity", "Available Spots", "Parking Manager", "Assigned Staff", "Address", "Date", "Distance", "Government", "Paid", "Approval Status", "Status", "Action"].map((h) => (
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
                                    <td className="px-4 py-2 text-gray-700">{u.parkingCapacity}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.availableSpots}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.parkingOwner}</td>
                                    <td className="px-4 py-2">
                                        <Tooltip title="View Staff">
                                            <button
                                                onClick={() => navigate("/users/preview-staff", {
                                                    state: { parkingKeyID: u.parkingKeyID } // optional
                                                })}
                                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                                            >
                                                {u.totalAssignedUsers}
                                            </button>
                                        </Tooltip>
                                    </td>
                                    <td className="px-4 py-2 text-gray-700"><Tooltip title={u.address} arrow>{truncateText(u.address, 15)}</Tooltip></td>
                                    <td className="px-4 py-2 text-gray-700">{u.parkingRegistrationDate}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.registrationDistanceFromUserKM} Km</td>
                                    <td className="px-4 py-2 text-gray-700"> <Badge value={u.isGovParking} /></td>
                                    <td className="px-4 py-2 text-gray-700"><Badge value={u.isPaidParking} /></td>
                                    <td className="px-4 py-2 text-center cursor-pointer" onClick={() => openChangeStatusModal(u)}>
                                        <Tooltip title="Parking Status">
                                            {u.isAdminApproved === true && (
                                                <span className="px-2 py-1 rounded-full text-white bg-green-500 text-xs font-semibold">
                                                    Approved
                                                </span>
                                            )}
                                            {u.isAdminApproved === false && (
                                                <span className="px-2 py-1 rounded-full text-white bg-red-500 text-xs font-semibold">
                                                    Rejected
                                                </span>
                                            )}
                                            {(u.isAdminApproved === null || u.isAdminApproved === undefined) && (
                                                <span className="px-2 py-1 rounded-full text-white bg-yellow-500 text-xs font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </Tooltip>
                                    </td>

                                    <td className="px-4 py-2">
                                        <div className="cursor-pointer flex items-center space-x-2 justify-center">
                                            <span
                                                className={`text-12 font-medium ${u.status === "Active" ? "text-green-600" : "text-red-600"
                                                    }`}
                                            >
                                                {u.status === "Active" ? "Active" : "In Active"}
                                            </span>
                                            <Tooltip title="Change Status">
                                                <Android12Switch
                                                    checked={u.status === "Active"}
                                                    onClick={() => {
                                                        setModelRequestData({
                                                            ...modelRequestData,
                                                            parkingKeyID: u.parkingKeyID,
                                                            status: u.status === "InActive" ? "InActive" : "Active",
                                                        });
                                                        setModelAction("Status");
                                                        setConfirmationModal(true);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2 justify-center">
                                            <Tooltip title="Update">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => openEditModal(u)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Upload Media">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => {
                                                        navigate("/view-media", {
                                                            state: {
                                                                keyID: u.parkingKeyID,
                                                                moduleName: "Parking"
                                                            }
                                                        })
                                                    }}
                                                >
                                                    <FaImages />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Available Parking">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => {
                                                        //navigate

                                                        navigate(`/users/available-parking`, { state: { parkingKeyID: u.parkingKeyID } })
                                                    }}
                                                >
                                                    <MdOutlineSpaceDashboard />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="View Location">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"

                                                    onClick={() => openGoogleMapsDirections(u.latitude, u.longitude)}

                                                >
                                                    <ImLocation
                                                        className="text-[#EA4335] text-lg hover:scale-110 transition-transform"
                                                    />

                                                </button>
                                            </Tooltip>
                                        </div>
                                    </td>
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
                    debugger
                    const prev = Math.max(currentPage - 1, 1);
                    setCurrentPage(prev);
                    setAppliedFilter(f => ({ ...f, pageNo: prev }));
                }}

                onNext={() => {
                    const next = Math.min(currentPage + 1, totalPages);
                    setCurrentPage(next);
                    setAppliedFilter(f => ({ ...f, pageNo: next - 1 }));
                }}
                onPageClick={(page) => {
                    debugger
                    setCurrentPage(page);
                    setAppliedFilter(f => ({ ...f, pageNo: page - 1 }));
                }}
            />

            {/* User Form Modal */}
            {
                modalOpen && (
                    <AddUpdateForm
                        onClose={() => {
                            setModalOpen(false);
                            setAppliedFilter({ ...appliedFilter });
                        }}
                        modelRequestData={modelRequestData}
                    />
                )
            }
            {/* confirmation modal  */}
            <ConfirmationModal
                show={confirmationModal}
                onHide={() => setConfirmationModal(false)}
                actionType={modelAction}
                onConfirm={handleUpdateStatus}
                modelRequestData={modelRequestData}
            />
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
            {
                modalStatusOpen && selectedParking && (
                    <ParkingStatusModal
                        parking={selectedParking}
                        parkingOwnerID={state?.userID}
                        onClose={({ updated, newStatus }) => {
                            setStatusModalOpen(false);
                            setAppliedFilter({ ...appliedFilter, pageNo: 0 })
                        }}
                    />
                )
            }
        </div >
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
    { value: "Approved", label: "Approved" },
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
];
export default ListComponent;