import { useEffect, useRef, useState } from "react";

const MapLatLngPicker = ({
    defaultLocation = null,
    onLocationSelect
}) => {
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const markerRef = useRef(null);

    const [map, setMap] = useState(null);

    useEffect(() => {
        const loadMap = () => {
            const google = window.google;

            const center = defaultLocation || { lat: 19.076, lng: 72.8777 }; // Mumbai default

            const mapInstance = new google.maps.Map(mapRef.current, {
                center,
                zoom: defaultLocation ? 15 : 10,
            });

            // If default lat/lng exists → show marker
            if (defaultLocation) {
                markerRef.current = new google.maps.Marker({
                    position: defaultLocation,
                    map: mapInstance,
                });
            }

            // CLICK EVENT ON MAP
            mapInstance.addListener("click", (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                placeMarker(mapInstance, { lat, lng });

                getAddressFromLatLng(lat, lng);

                onLocationSelect({ lat, lng });
            });

            const searchBox = new google.maps.places.SearchBox(inputRef.current);

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
                if (places.length === 0) return;

                const place = places[0];
                const location = place.geometry.location;

                const lat = location.lat();
                const lng = location.lng();

                mapInstance.setCenter({ lat, lng });
                mapInstance.setZoom(15);

                placeMarker(mapInstance, { lat, lng });

                onLocationSelect({
                    lat,
                    lng,
                    address: place.formatted_address
                });
            });

            setMap(mapInstance);
        };

        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAtZ94hrxs813CocYwcRdWMOQvP0dIlvgA&libraries=places`;
            script.async = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, []);

    const placeMarker = (mapInstance, position) => {
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        markerRef.current = new window.google.maps.Marker({
            position,
            map: mapInstance,
        });
    };

    const getAddressFromLatLng = async (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
                if (status === "OK" && results[0]) {
                    onLocationSelect({
                        lat,
                        lng,
                        address: results[0].formatted_address,
                    });
                }
            }
        );
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search location..."
                style={{
                    width: "300px",
                    padding: "8px",
                    margin: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                }}
            />

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                }}
            />
        </div>
    );
};

export default MapLatLngPicker;
