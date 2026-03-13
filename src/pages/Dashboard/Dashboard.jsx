import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetDashboardDetails } from "../../services/Dashboard/DashboardApi";
import { Users, UserCheck, UserPlus, Car, Users2, UserMinus, ArrowRight, ArrowLeft } from "lucide-react";
import CalendarFilter from "../../components/custom/CalenderFilter";
import { CalenderFilterEnum, pageSize } from "../../Utils/Utils";
import dayjs from "dayjs";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState(dayjs().startOf("week"));
    const [toDate, setToDate] = useState(dayjs().endOf("week"));
    const navigate = useNavigate();
    const [appliedFilter, setAppliedFilter] = useState({

        "fromDate": fromDate,
        "toDate": toDate
    });
    useEffect(() => {
        const fetchData = async () => {
            const res = await GetDashboardDetails(appliedFilter);
            setData(res?.responseData?.data || []);
        };
        fetchData();
    }, [appliedFilter]);

    const d = data[0] || {};

    return (
        <div className="min-h-screen bg-background text-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* KPI Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-semibold">
                    <KpiCard icon={<UserCheck size={24} />} label="Super Admin" value={d.totalSuperAdmins} />
                    <KpiCard icon={<Users size={24} />} label="Admins" value={d.totalAdmins} />
                    <KpiCard icon={<UserPlus size={24} />} label="NMC Users" value={d.totalNMCUsers} />
                </section>

                {/* Parking Status Section */}
                <section className="bg-white border border-gray-200 rounded-2xl shadow p-6 space-y-4">

                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <h2 className="text-lg font-semibold text-gray-800">Parking Status</h2>
                        <div className="w-48">
                            <CalendarFilter
                                fromDate={fromDate}
                                toDate={toDate}
                                setFromDate={setFromDate}
                                setToDate={setToDate}
                                hideAllOption
                                size="small"
                                defaultSelectedOption={{ value: CalenderFilterEnum.This_Week, label: "This Week" }}
                                onDateChange={(from, to) => {
                                    setFromDate(from);
                                    setToDate(to);
                                    setAppliedFilter({ ...appliedFilter, fromDate: from, toDate: to })
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                        <StatusCard title="Approved" value={d.totalApprovedParkings} icon={<Car size={28} />} color="green" navigate={navigate} />
                        <StatusCard title="Pending" value={d.totalApprovalPendingParkings} icon={<Car size={28} />} color="yellow" navigate={navigate} />
                        <StatusCard title="Rejected" value={d.totalApprovalRejectdParkings} icon={<Car size={28} />} color="red" navigate={navigate} />
                        <StatusCard title="Check-In" value={d.checkInCount ?? 0} icon={<ArrowRight size={28} />} color="blue" navigate={navigate} />
                        <StatusCard title="Check-Out" value={d.checkOutCount ?? 0} icon={<ArrowLeft size={28} />} color="purple" navigate={navigate} />
                    </div>

                    {/* Parking Type Cards */}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                        <ParkingTypeCard title="Government Parking" value={d.govParkingCount} icon={<Car size={24} />} color="indigo" navigate={navigate} filterKey="isGovParking" filterValue="Yes" />
                        <ParkingTypeCard title="Private Parking" value={d.privateParkingCount} icon={<Car size={24} />} color="gray" navigate={navigate} filterKey="isGovParking" filterValue="No" />
                        <ParkingTypeCard title="Paid Parking" value={d.paidParkingCount} icon={<Car size={24} />} color="emerald" navigate={navigate} filterKey="isPaidParking" filterValue="Yes" />
                        <ParkingTypeCard title="Free Parking" value={d.freeParkingCount} icon={<Car size={24} />} color="sky" navigate={navigate} filterKey="isPaidParking" filterValue="No" />
                    </div>

                    {/* Additional Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <MiniCard label="App Users" value={d.totalAppUsers} icon={<Users2 size={20} />} color="blue" />
                        <MiniCard label="Parking Owners" value={d.totalParkingOwners} icon={<Car size={20} />} color="green" />
                        <MiniCard label="Parking Staff" value={d.totalParkingStaff} icon={<UserMinus size={20} />} color="purple" />
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>✅ New user registered</li>
                        <li>🅿️ Parking approved</li>
                        <li>👤 Staff added</li>
                        <li>📄 Report generated</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

// ---------------- KPI Card ----------------
const KpiCard = ({ icon, label, value }) => (
    <div className="rounded-xl shadow-md hover:shadow-xl transition p-4 flex items-center gap-4 h-28
                  bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="p-3 bg-gradient-to-tr from-blue-200 to-blue-400 text-white rounded-xl">{icon}</div>
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{value ?? 0}</p>
        </div>
    </div>
);


// ---------------- Status Card ----------------
const StatusCard = ({ title, value, icon, color, navigate }) => {
    const gradient = {
        green: "bg-gradient-to-r from-green-50 to-green-100 text-green-800",
        yellow: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800",
        red: "bg-gradient-to-r from-red-50 to-red-100 text-red-800",
        blue: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800",
        purple: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800",
    }[color];

    const isCheckStatus = title === "Check-In" || title === "Check-Out";
    const route = isCheckStatus ? "/users/available-parking" : "/users/parking-slot";

    return (
        <button
            onClick={() => navigate(route, { state: { fromDashboard: true, status: title } })}
            className={`rounded-xl shadow-md hover:shadow-xl transition flex justify-between items-center p-4 ${gradient} h-28`}
        >
            <div className="flex flex-col justify-center">
                <p className="text-2xl font-bold">{value ?? 0}</p>
                <p className="text-sm font-medium mt-1">{title}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30">{icon}</div>
        </button>
    );
};


// ---------------- Mini Card ----------------
const MiniCard = ({ label, value, icon, color }) => {
    const gradient = {
        blue: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800",
        green: "bg-gradient-to-r from-green-50 to-green-100 text-green-800",
        yellow: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800",
        purple: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800",
    }[color] || "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800";

    return (
        <div className={`rounded-lg shadow-md hover:shadow-lg transition p-4 flex items-center gap-3 ${gradient} h-24`}>
            <div className="p-3 bg-white rounded-full text-xl flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-lg font-bold mt-1">{value ?? 0}</p>
            </div>
        </div>
    );
};


// ---------------- Parking Type Card ----------------
const ParkingTypeCard = ({ title, value, icon, color, navigate, filterKey, filterValue }) => {
    const bgColor = {
        indigo: "bg-indigo-50 text-indigo-700",
        gray: "bg-gray-50 text-gray-700",
        emerald: "bg-emerald-50 text-emerald-700",
        sky: "bg-sky-50 text-sky-700",
    }[color];

    return (
        <button
            onClick={() => navigate("/users/parking-slot", { state: { fromDashboard: true, [filterKey]: filterValue } })}
            className={`rounded-xl shadow hover:shadow-md transition flex justify-between items-center p-4 ${bgColor} h-24`}
        >
            <div>
                <p className="text-xl font-bold">{value ?? 0}</p>
                <p className="text-sm font-medium mt-1">{title}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/40">{icon}</div>
        </button>
    );
};

export default Dashboard;

