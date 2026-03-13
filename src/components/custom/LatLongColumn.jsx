import { Dialog } from "@mui/material";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker issue in React-Leaflet
const defaultIcon = L.icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LatLongColumn = ({ open, onClose, latitude, longitude }) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    const isValid = !isNaN(lat) && !isNaN(lng);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <div className="p-3 bg-gray-100">
                <div className="bg-gray-900 text-white p-2 rounded-md mb-2 font-semibold">
                    Location on Map
                </div>

                {!isValid ? (
                    <div className="h-[400px] flex items-center justify-center bg-white rounded-md text-gray-500">
                        🚫 Invalid Location
                    </div>
                ) : (
                    <MapContainer
                        center={[lat, lng]}
                        zoom={16}
                        style={{ width: "100%", height: "400px", borderRadius: "8px" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[lat, lng]} icon={defaultIcon} />
                    </MapContainer>
                )}
            </div>
        </Dialog>
    );
};

export default LatLongColumn;
