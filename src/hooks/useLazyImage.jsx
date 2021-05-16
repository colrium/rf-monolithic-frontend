import { useState, useEffect } from 'react'



const useLazyImage = (imgUrl, lazyTargetRef=null, fallbackUrl=`${process.env.PUBLIC_URL}/img/placeholder.png`, placeholderUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC",  intersectionObserverOptions = {}) => {
	const [loading, setLoading] = useState(true);
	const [imgSrc, setImgSrc] = useState(placeholderUrl)
	const [errSrc, setErrSrc] = useState(null);
	const [error, setError] = useState(null)
	const onError = () => {
		setErrSrc(fallbackUrl || placeholderUrl);
	}

	const loadImage = (src) => {
			setErrSrc(null);
			const imageToLoad = new Image();
		    
		    imageToLoad.onload = (event) => {
				imageToLoad.onload = null;
				imageToLoad.onerror = null;
		    	imageToLoad.src = "";
		    	setError(null);
				// When image is loaded replace the src and set loading to false
				setLoading(false);
				setErrSrc(null);
				setImgSrc(src);
		    }
		    imageToLoad.onerror = (event) => {
		    	if (!String.isEmpty(imageToLoad.src)) {
		    		console.log("imageToLoad.onerror imageToLoad.src", imageToLoad.src);
					setLoading(false);
					setError(event);
					setErrSrc(fallbackUrl || placeholderUrl);
		    	}					
		    }
			imageToLoad.src = src;
	}
	// load image
	useEffect(() => {
		let observer = undefined;
		let didCancel = false;	
		if (!error && imgUrl !== imgSrc) {	
			// if browser supports IntersectionObserver and lazyTargetRef is given
			if ('IntersectionObserver' in window && lazyTargetRef && lazyTargetRef.current instanceof Element) {
				// reload image when prop - imgUrl changed
				
					observer = new IntersectionObserver(entries => {
						entries.forEach(entry => {
							console.log("entry", entry);
							if (entry.isIntersecting) {
								// change state
								loadImage(imgUrl);
								// don't need to observe anymore
								observer.unobserve(entry.target)
							}
						})
					}, intersectionObserverOptions)
					// start to observe element
					observer.observe(lazyTargetRef.current)
			
			} else {
				// baseline: load image after componentDidMount
				loadImage(imgUrl);
			}
			return () => {
				didCancel = true;
				// on component cleanup, we remove the listner
				if (observer && lazyTargetRef && lazyTargetRef.current instanceof Element) {
					observer.unobserve(lazyTargetRef.current);
				}
			};
		}
	}, [imgUrl, imgSrc, lazyTargetRef, error]);

	useEffect(() => {
		if (errSrc && errSrc !== fallbackUrl) {
			setErrSrc(fallbackUrl);
		}

	}, [errSrc, fallbackUrl]);

	return errSrc || imgSrc;
}
export default useLazyImage;