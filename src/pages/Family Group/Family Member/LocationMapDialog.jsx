import React, { useMemo } from "react";
import { Dialog } from "@mui/material";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

// Default blue marker icon (fix for React-Leaflet)
const defaultIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LocationMapDialog = ({ open, onClose, locations = [] }) => {
    // Convert to Leaflet format and remove invalid points
    const pathCoords = useMemo(() => {
        return (locations || [])
            .map((loc) => [
                Number(loc.latitude ?? loc.lat),
                Number(loc.longitude ?? loc.lng),
            ])
            .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
    }, [locations]);

    const center =
        pathCoords.length > 0 ? pathCoords[0] : [20.0129137, 73.7567085];

    // Add direction arrows after map load
    const handleMapLoad = (map) => {
        if (pathCoords.length < 2) return;

        const polyline = L.polyline(pathCoords, {
            color: "dodgerblue",
            weight: 4,
        }).addTo(map);

        // Add arrows along the line
        L.polylineDecorator(polyline, {
            patterns: [
                {
                    offset: 25,
                    repeat: 50,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 10,
                        polygon: false,
                        pathOptions: { stroke: true, color: "red", weight: 2 },
                    }),
                },
            ],
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <div
                style={{
                    width: "100%",
                    height: "70vh",
                    minHeight: "500px",
                    background: "#f3f4f6",
                    padding: "10px",
                }}
            >
                <div
                    style={{
                        background: "#111827",
                        color: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        fontWeight: "600",
                    }}
                >
                    User Visited Route
                </div>

                {/* NO DATA UI */}
                {pathCoords.length === 0 ? (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            color: "#6b7280",
                            background: "white",
                            borderRadius: "8px",
                        }}
                    >
                        🚫 No data found
                    </div>
                ) : (
                    <MapContainer
                        center={center}
                        zoom={17}
                        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                        whenReady={(e) => handleMapLoad(e.target)}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Markers for each point */}
                        {locations.map((loc, idx) => {
                            const lat = Number(loc.latitude ?? loc.lat);
                            const lng = Number(loc.longitude ?? loc.lng);

                            if (isNaN(lat) || isNaN(lng)) return null;

                            return (
                                <Marker key={idx} position={[lat, lng]} icon={defaultIcon}>
                                    <Tooltip direction="top" offset={[0, -10]}>
                                        <div style={{ fontSize: "12px" }}>
                                            <b>Point {idx + 1}</b>
                                            <br />
                                            {loc.dateAndTime}
                                        </div>
                                    </Tooltip>
                                </Marker>
                            );
                        })}

                        {/* Base polyline (blue path) */}
                        {pathCoords.length > 1 && (
                            <Polyline
                                positions={pathCoords}
                                pathOptions={{ color: "dodgerblue", weight: 4 }}
                            />
                        )}
                    </MapContainer>
                )}
            </div>
        </Dialog>
    );
};

export default LocationMapDialog;