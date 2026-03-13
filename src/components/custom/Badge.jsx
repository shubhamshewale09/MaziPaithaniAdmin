const Badge = ({ value }) => {

    const isYes = value === true || value === "Yes" || value === "yes";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
            ${isYes
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
        >
            {isYes ? "Yes" : "No"}
        </span>
    );
};

export default Badge;
