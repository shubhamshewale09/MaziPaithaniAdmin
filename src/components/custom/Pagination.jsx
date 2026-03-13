const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    pageSizeOptions = [],
    onPageSizeChange,
    onPrev,
    onNext,
    onPageClick,
}) => {
    // if (totalPages <= 1) return null;

    return (
        <div className="bg-background flex items-center justify-between gap-3 p-2 border-t border-gray-200 sticky bottom-0 z-20">
            {/* Page Size */}
            <div className="flex items-center gap-2">
                <span className="text-primary font-semibold">Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                    className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-secondary-dark text-sm"
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onPrev}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-secondary-light text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    const active = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageClick?.(page)}
                            className={`px-3 py-1 rounded-lg border transition
                                ${active
                                    ? "bg-shade text-white border-shade-light"
                                    : "border-shade-light text-gray-700 hover:bg-gray-200"}
                            `}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-secondary-light text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
