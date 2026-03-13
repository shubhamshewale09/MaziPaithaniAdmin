import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AddUpdateImage, DeleteMedia, GetUploadedMedia, UploadImage } from "../../services/Media/UploadFile";
import BackButton from "../../components/custom/BackButton";

function ViewMedia() {
    const { userKeyID } = JSON.parse(localStorage.getItem("login"));
    const { state } = useLocation();

    const fileInputRef = useRef(null);

    // ================= STATE =================
    const [mediaList, setMediaList] = useState([]);
    const [editingItem, setEditingItem] = useState(null); // null = upload mode
    const [processingId, setProcessingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null); // item waiting for confirmation
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [appliedFilter, setAppliedFilter] = useState({
        pageSize: 20,
        pageNo: 0,
        userKeyID,
        keyID: state?.keyID
    })
    const [formData, setFormData] = useState({
        userKeyID,
        imagesKeyID: null,
        keyID: state?.keyID,
        moduleName: state?.moduleName,
        imageURL: [],
        parkingOwnerLatitude: null,
        parkingOwnerLongitude: null
    })


    // ================= FETCH =================
    useEffect(() => {
        let timer;

        async function fetchMedia() {
            setIsPageLoading(true);

            try {
                const res = await GetUploadedMedia({ ...appliedFilter });

                // ⏱️ delay skeleton hide
                timer = setTimeout(() => {
                    setMediaList(res?.responseData?.data || []);
                    setIsPageLoading(false);
                }, 600); // 👈 skeleton visible for 600ms
            } catch (err) {
                console.error(err);
                setIsPageLoading(false);
            }
        }

        fetchMedia();

        return () => clearTimeout(timer);
    }, [appliedFilter]);


    // ================= ACTIONS =================
    const openFileChooser = (item = null) => {
        setEditingItem(item); // null → upload | item → edit
        fileInputRef.current?.click();
    };

    const handleDelete = async (item) => {

        const res = await DeleteMedia(item.imagesKeyID);
        if (res.statusCode == 200) {
            setAppliedFilter({ ...appliedFilter, pageNo: 0 })
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        try {
            setIsSubmitting(true);
            const uploadedUrls = [];

            for (const file of files) {
                const fd = new FormData();
                fd.append("projectName", "WowUatS3Bucket");
                fd.append("moduleName", state?.moduleName);
                fd.append("userId", userKeyID);
                fd.append("imageFile", file);

                const res = await UploadImage(fd);
                if (res?.s3Url) {
                    uploadedUrls.push(res.s3Url)
                    try {
                        const res = await AddUpdateImage({
                            ...formData,
                            imagesKeyID: editingItem?.imagesKeyID || null,
                            imageURL: [...uploadedUrls]
                        })

                        if (res.statusCode == 200) {
                            setEditingItem(null)
                            setAppliedFilter({ ...appliedFilter, pageNo: 0 })
                        }
                    } catch (error) {
                        console.log("error==>>", error)
                    }
                };
            }


        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setIsSubmitting(false);
            setEditingItem(null);
            e.target.value = "";
        }
    };

    // ================= UI =================
    return (
        <div className="p-4">
            <div className="relative flex items-center mb-6">
                {/* Left: Back Button */}
                <div className="flex-shrink-0">
                    <BackButton />
                </div>
                {state?.label && <span className="font-semibold px-2">{state?.label}</span>}
                {/* Right: Upload Button */}
                <div className="ml-auto flex-shrink-0">
                    <button
                        onClick={() => openFileChooser()}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 rounded-lg bg-primary text-white hover:opacity-90 transition text-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin">⏳</span> Uploading…
                            </>
                        ) : (
                            <>Upload Image</>
                        )}
                    </button>
                </div>
            </div>





            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Content */}
            {isPageLoading ? (
                <GallerySkeleton />
            ) : mediaList.length === 0 ? (
                <p className="text-center text-gray-500">No images found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mediaList.map(item => (
                        <MediaCard
                            key={item.imagesKeyID}
                            item={item}
                            loading={processingId === item.imagesKeyID}
                            onEdit={() => openFileChooser(item)}
                            onDelete={() => setDeleteItem(item)}

                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Delete Image
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this image?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteItem(null)}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    setProcessingId(deleteItem.imagesKeyID);
                                    await handleDelete(deleteItem);
                                    setProcessingId(null);
                                    setDeleteItem(null);
                                }}
                                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* ================= CARD ================= */

const MediaCard = ({ item, onEdit, onDelete, loading }) => (
    <div className="rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition p-2">

        {/* Image */}
        <img
            src={item.imageURL}
            alt="media"
            className="w-full h-44 object-cover rounded-md"
        />

        {/* Buttons Below Image */}
        <div className="flex justify-between items-center mt-3 gap-2">
            <button
                onClick={onEdit}
                disabled={loading}
                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-shade text-white hover:bg-shade-light disabled:opacity-60"

            >
                Edit
            </button>

            <button
                onClick={onDelete}
                disabled={loading}
                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-primary text-white hover:bg-primary-light disabled:opacity-60"
            >
                {loading ? "Processing..." : "Delete"}
            </button>
        </div>

        {/* Processing Overlay */}
        {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-sm text-gray-600">Processing...</span>
            </div>
        )}
    </div>
);

/* ================= SKELETON ================= */
const GallerySkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg">
                <div className="bg-gray-200 h-44 w-full" />
            </div>
        ))}
    </div>
);

export default ViewMedia;