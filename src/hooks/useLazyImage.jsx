import { useCallback, useEffect, useRef } from 'react'

import { useMountedState } from 'react-use';
import useSetState from './useSetState';

const useLazyImage = (src, fallbackUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC", placeholderUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC", intersectionObserverOptions = {}) => {

	const ref = useRef()
	const imageRef = useRef(new Image())
	const isMounted = useMountedState();
	const [state, setState] = useSetState({
		loading: false,
		src: placeholderUrl,
		error: null,
	})

	const onImageLoad = useCallback((event) => {
		// 
		imageRef.current.onload = null;
		// imageRef.current.src = "";
		if (isMounted) {
			setState({
				loading: false,
				error: null,
				src: src,
			});
		}
	}, [])

	const onImageError = useCallback((event) => {
		// 
		imageRef.current.onerror = null;
		if (isMounted && !String.isEmpty(imageRef.current.src)) {
			setState({
				loading: false,
				error: event,
				src: fallbackUrl || placeholderUrl,
			});
			imageRef.current.src = fallbackUrl || placeholderUrl
		}
	}, [])

	const loadImage = useCallback((imgSrc) => {
		imageRef.current.onload = onImageLoad;
		imageRef.current.onerror = onImageError;
		imageRef.current.src = imgSrc;
	}, [])
	// load image
	useEffect(() => {
		let observer = undefined;
		let didCancel = false;
		if (!state.error && src !== state.src) {
			// if browser supports IntersectionObserver and ref is given
			if ('IntersectionObserver' in window && ref && ref.current instanceof Element) {
				// reload image when prop - src changed

				observer = new IntersectionObserver(entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							// change state
							loadImage(src);
							// don't need to observe anymore
							observer.unobserve(entry.target)
						}
					})
				}, intersectionObserverOptions)
				// start to observe element
				observer.observe(ref.current)

			} else {
				// baseline: load image after componentDidMount
				//loadImage(src);
			}
			return () => {
				didCancel = true;
				imageRef.current.onerror = null;
				imageRef.current.onload = null;
				// on component cleanup, we remove the listner
				if (observer && ref && ref.current instanceof Element) {
					observer.unobserve(ref.current);
				}
			};
		}
	}, [src, state.src, ref, state.error]);

	// useEffect(() => {
	// 	if (errSrc && errSrc !== fallbackUrl) {
	// 		setErrSrc(fallbackUrl);
	// 	}

	// }, [errSrc, fallbackUrl]);

	return [state.src, { ...state, ref, fallback: fallbackUrl, placeholder: placeholderUrl }];
}
export default useLazyImage;