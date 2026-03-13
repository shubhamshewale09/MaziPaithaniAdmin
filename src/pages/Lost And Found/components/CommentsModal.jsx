import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GetLostAndFoundComments } from "../../../services/Lost And Found/LostAndFoundApi";

const CommentsModal = ({ isOpen, onClose, keyID }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem("login"));
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch comments when modal opens or keyID changes
    useEffect(() => {
        if (!isOpen) return;

        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const res = await GetLostAndFoundComments({
                    pageSize: 30,
                    pageNo: 0,
                    searchKeyword: null,
                    fromDate: null,
                    toDate: null,
                    userKeyID,
                    loastAndFoundKeyID: keyID,
                });

                if (res?.statusCode === 200) {
                    setComments(res.responseData?.data || []);
                } else {
                    setComments([]);
                }
            } catch (err) {
                console.error("Error fetching comments:", err);
                setComments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [isOpen, keyID, userKeyID]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-md p-4 relative flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <AiOutlineClose size={20} />
                </button>

                <h3 className="text-lg font-bold mb-3">Comments</h3>

                {/* Comments List */}
                <div className="flex-1 overflow-auto max-h-80 space-y-3">
                    {isLoading ? (
                        <p>Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-gray-500">No comments found.</p>
                    ) : (
                        comments.map((c) => (
                            <div
                                key={c.loastAndFoundCommentsKeyID}
                                className="border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                            >
                                <p className="text-gray-800">{c.loastAndFoundComments}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {c.createdOnDate}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;
