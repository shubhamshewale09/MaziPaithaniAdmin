import React from "react";
import { Tooltip } from "@mui/material";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackButton = ({
    onClick,           // optional custom click handler
    tooltip = "Go Back",
    className = "",
    size = 16,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(); // use custom click if provided
        } else {
            navigate(-1); // default go back
        }
    };

    return (
        <Tooltip title={tooltip}>
            <button
                onClick={handleClick}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border
                    bg-gray-100 hover:bg-primary-light
                    text-gray-700 hover:text-white
                    transition ${className}`}
            >
                <span className={`text-[${size}px]`}>
                    <IoMdArrowRoundBack />
                </span>
            </button>
        </Tooltip>
    );
};

export default BackButton;
