const RoleBadge = ({ role }) => {
    const isSuperAdmin = role === "Super Admin";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                ${isSuperAdmin
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }
            `}
        >
            {role}
        </span>
    );
};

export default RoleBadge;
