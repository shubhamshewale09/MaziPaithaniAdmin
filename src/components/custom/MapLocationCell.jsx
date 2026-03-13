import { useState } from "react";
import { Tooltip } from "@mui/material";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import LatLongColumn from "./LatLongColumn";

const MapLocationCell = ({ latitude, longitude }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip title="View on Map">
                <button
                    className="text-blue-600 hover:text-blue-800 mt-1"
                    onClick={() => setOpen(true)}
                >
                    <MdOutlineAddLocationAlt size={16} />
                </button>
            </Tooltip>

            {open && (
                <LatLongColumn
                    open={open}
                    onClose={() => setOpen(false)}
                    latitude={latitude}
                    longitude={longitude}
                />
            )}
        </>
    );
};

export default MapLocationCell;
