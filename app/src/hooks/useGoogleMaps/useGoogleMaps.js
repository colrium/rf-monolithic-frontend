import { useState, useEffect, useRef } from "react";
import useGoogleMapsApi from "./useGoogleMapsApi";
import { google_maps_api_key } from "config";


const useGoogleMaps = (options = {}, apiKey = null) => {
    const google = useGoogleMapsApi(apiKey || google_maps_api_key);
    const ref = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!google || !ref?.current) {
            return;
        }
        setMap(new google.maps.Map(ref.current, options));
    }, [google, ref]);

    return [map, google, ref];
}
export default useGoogleMaps;