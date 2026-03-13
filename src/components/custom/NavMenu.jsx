import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

const UserMenu = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Read user from localStorage
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("login")) || {};
        } catch {
            return {};
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const initials = user.fullName
        ? user.fullName
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
        : "U";

    const handleLogout = () => {
        logout();
        setOpen(false);
        setShowProfile(false);
        navigate("/login");
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Profile Button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 transition"
            >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {initials}
                </div>
            </button>

            {/* Dropdown */}
            {
                open && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md py-2 z-30">
                        <button
                            onClick={() => {
                                setShowProfile(true);
                                setOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-primary hover:text-white transition"
                        >
                            View Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-primary hover:text-white transition"
                        >
                            Logout
                        </button>
                    </div>
                )
            }

            {/* Profile Modal */}
            {
                showProfile && (
                    <ProfileModal
                        user={user}
                        initials={initials}
                        onClose={() => setShowProfile(false)}
                        onLogout={handleLogout}
                    />
                )
            }
        </div >
    );
};

export default UserMenu;

const ProfileModal = ({ user, initials, onClose, onLogout }) => {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                // onClick={onClose}
            />

            {/* Card */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-50">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                        {initials}
                    </div>

                    <h2 className="mt-3 text-lg font-semibold text-gray-800">
                        {user.fullName || "—"}
                    </h2>

                    <span className="text-sm text-gray-500">
                        {user.roleName || "—"}
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-3 text-sm">
                    <InfoRow label="Mobile" value={user.mobileNo} />
                    <InfoRow label="Address" value={user.address} />

                    <InfoRow
                        label="Status"
                        value={
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                    ${user.status
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"}
                                `}
                            >
                                {user.status ? "Active" : "Inactive"}
                            </span>
                        }
                    />
                </div>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className="mt-6 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b pb-2">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">
            {value || "—"}
        </span>
    </div>
);
