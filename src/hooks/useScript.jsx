import { useState, useEffect, useRef } from "react";
// usage
//const status = useScript("https://external.com/test-external-script.js");
function loadScript(src, position, id) {
	if (!position) {
		return;
	}

	const script = document.createElement('script');
	script.setAttribute('async', '');
	script.setAttribute('id', id);
	script.src = src;
	position.appendChild(script);
}
const useScript = (src, id=("use-Script-"+String.uid(11)), position="head") => {
	const loaded = useRef(false);
	useEffect(() => {
		if (typeof window !== 'undefined' && !loaded.current) {
			if (!document.querySelector('[src*="'+src+'"]')) {
				loadScript(src, document.querySelector(position), id );
			}

			loaded.current = true;
		}
	}, [src, loaded]);
	return loaded.current;
}

export default useScript;