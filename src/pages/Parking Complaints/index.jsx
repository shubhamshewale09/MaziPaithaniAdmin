import { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";

import { MIN_LOADING_TIME, pagesArray } from "../../Utils/Utils";
import ConfirmationModal from "../../components/custom/ConfirmationModal";
import SuccessModal from "../../components/custom/SuccessModal";
import ErrorModal from "../../components/custom/ErrorModel";
import Pagination from "../../components/custom/Pagination";
import { ChangeStateStatus } from "../../services/State/StateApi";
import { GetComplaintsList } from "../../services/Parking Complaints/ParkingComplaintsApi";
import BackButton from "../../components/custom/BackButton";
import ParkingComplaintsStatusModal from "./components/ParkingComplaintsStatus";

/* ---------------- Main Component ---------------- */
const ListComponent = () => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    const searchTimerRef = useRef(null);

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
        userKeyID: null,
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
                const res = await GetComplaintsList(appliedFilter);

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
        })
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setModelRequestData({
            ...modelRequestData,
            KeyID: user.stateKeyID,
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
                let data = await ChangeStateStatus(modelRequestData.stateKeyID);
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

    return (
        <div className="bg-background h-full flex flex-col rounded-xl border border-gray-200 shadow">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <BackButton />
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pr-9 px-3 py-1.5 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-1 focus:ring-secondary text-sm"
                        />
                        {/* Clear button */}
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>



            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="min-w-full text-sm text-gray-800 border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {["Sr. No.", "Parking Name", "Parking Report", "Date", "Status"].map((h) => (
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
                                    key={u.stateKeyID}
                                    className="hover:bg-gray-50 transition-colors text-center"
                                >
                                    <td className="px-4 py-2 text-gray-600">
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700">{u.parkingName}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.parkingReport}</td>
                                    <td className="px-4 py-2 text-gray-700">{u.createdOnDate}</td>
                                    <td className="px-4 py-2" onClick={() => openChangeStatusModal(u)}>
                                        <span
                                            className={`cursor-pointer inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                                    ${u.isComplaintSolved === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : u.isComplaintSolved === "Solved"
                                                        ? "bg-green-100 text-green-700"
                                                        : u.isComplaintSolved === "Unsolved"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-600"
                                                }
  `}
                                        >
                                            {u.isComplaintSolved}
                                        </span>
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
                    <ParkingComplaintsStatusModal
                        parking={selectedParking}
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


export default ListComponent;
