import React, { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";
import CalendarFilter from "../../../components/custom/CalenderFilter";
import { CalenderFilterEnum, pageSize } from "../../../Utils/Utils";
import dayjs from "dayjs";
import { GetUserVisitedLocations } from "../../../services/Family Group/FamilyGroupApi";
import { useEffect } from "react";

// Default blue marker icon (fix for React-Leaflet)
const defaultIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LocationMapDialog2 = ({ open,userKeyID ,setLocations, onClose, locations = [] }) => {
    // Convert to Leaflet format and remove invalid points
    const pathCoords = useMemo(() => {
        return (locations || [])
            .map((loc) => [
                Number(loc.latitude ?? loc.lat),
                Number(loc.longitude ?? loc.lng),
            ])
            .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
    }, [locations]);

    
const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);
        const [fromDate, setFromDate] = useState(null);
        const [toDate, setToDate] = useState(null);

useEffect(() => {
    if (open && (fromDate || toDate)) {
        fetchLocations();
    }
}, [open, fromDate, toDate]);

const fetchLocations = async () => {
    
    if (!userKeyID) return;

    try {
        setLoading(true);

        const res = await GetUserVisitedLocations({
            pageSize: 40,
            pageNo: 0,
            searchKeyword: null,
            fromDate: fromDate? dayjs(fromDate).format("YYYY-MM-DD") : null,
            toDate: toDate? dayjs(toDate).format("YYYY-MM-DD"): null,
            userKeyID: userKeyID
        });

        if (res?.statusCode === 200) {
            const formatted = res.responseData.data.map(p => ({
                lat: Number(p.latitude),
                lng: Number(p.longitude),
                dateAndTime: p.dateAndTime
            }));

            setLocations(formatted);
        } else {
            setLocations([]);
        }

    } catch (err) {
        console.error("Location API error", err);
        setLocations([]);
    } finally {
        setLoading(false);
    }
};

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

                <div className="w-48">
                                            <CalendarFilter
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                setFromDate={setFromDate}
                                                setToDate={setToDate}
                                                hideAllOption
                                                size="small"
                                                defaultSelectedOption={{ value: CalenderFilterEnum.This_Week, label: "This Week" }}
                                                onDateChange={(from, to) => {
                                                    setFromDate(from);
                                                    setToDate(to);
                                                    
                                                   
                                                }}
                                            />
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

export default LocationMapDialog2;