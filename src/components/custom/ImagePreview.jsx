
const ImagePreview = ({ images = [], onRemove }) => {
    if (!images.length) return null;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {images.map((img, index) => (
                <div
                    key={index}
                    className="relative rounded-lg border overflow-hidden group"
                >
                    <img
                        src={img.previewUrl}
                        alt="Parking"
                        className="w-full h-28 object-cover"
                    />

                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow opacity-90 group-hover:opacity-100"
                        title="Remove image"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ImagePreview;