import { useState, useEffect, useRef } from "react";
import useGoogleMapsApi from "./useGoogleMapsApi";
import { google_maps_api_key } from "config";
import {useSetState} from "hooks";


const useGoogleMaps = (options = {}, apiKey = null) => {
    const { onMapLoad } = options || {};
    const google = useGoogleMapsApi(apiKey || google_maps_api_key);
    const ref = useRef(null);
    const [state, setState] = useSetState({map: null, initialized: false});

    useEffect(() => {
        if (!google || !ref?.current) {
            return;
        }
        else {
            const map = new google.maps.Map(ref.current, options);
            if (Function.isFunction(onMapLoad)) {
				google.maps.event.addListenerOnce(map, "idle", function () {
					// do something only the first time the map is loaded
					onMapLoad(map);
				});
			}

            // setState({
			// 	map: map,
			// });
        }

    }, [google, ref]);

    return ref;
}
export default useGoogleMaps;
