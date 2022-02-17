
import { useCallback, useEffect, useState, useRef } from 'react';
import { useIntersectionObserver } from "hooks"


const useVisibility = (ref, config = {}) => {
    const { useBrowser = true, threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = config;
    const isMountedRef = useRef(false);
    const entry = useIntersectionObserver(ref, { threshold, root, rootMargin, freezeOnceVisible });

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    const [visible, setVisible] = useState(false);
    const [browserVisible, setBrowserVisible] = useState(true);

    const handleVisibilityChange = useCallback(() => {
        if (isMountedRef.current && useBrowser) {

            setBrowserVisible(!document[hidden]);
        }
    }, [useBrowser]);

    useEffect(() => {
        isMountedRef.current = true;
        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || hidden === undefined) {

            return () => {
                isMountedRef.current = false;
            }
        }
        else {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleVisibilityChange, false);
            return () => {
                document.removeEventListener(visibilityChange, handleVisibilityChange, false);
                isMountedRef.current = false;
            }
        }


    }, [])

    useEffect(() => {
        if (isMountedRef.current) {
            setVisible(!!(entry?.isIntersecting));
        }
    }, [entry]);

    return visible && browserVisible;
}

export default useVisibility;
