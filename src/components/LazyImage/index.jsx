import React, { useState, useEffect } from "react"
import styled from "styled-components";
import LightBox from "components/LightBox";
import ErrorImage from "assets/img/icons/file-error.svg";

const placeHolder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC"

const Image = styled.img`
	display: block;
	// Add a smooth animation on loading
	@keyframes loaded {
		0% {
			opacity: 0.1;
		}
		100% {
			opacity: 1;
		}
	}
	
	&.loaded:not(.has-error) {
		animation: loaded 300ms ease-in-out;
	}
	&.has-error {
		// fallback to placeholder image on error
		content: url(${placeHolder});
	}
`

const LazyImage = ({ src, alt, onClick, lightbox, className, ...rest }) => {
	const [imageSrc, setImageSrc] = useState(placeHolder);	
	const [imageRef, setImageRef] = useState();
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const onLoad = event => {
		event.target.classList.add("loaded");
	}

	const onError = event => {
		event.target.src = ErrorImage;
	}

	useEffect(() => {
		let observer = undefined;
		let didCancel = false;

		if (imageRef && imageSrc !== src) {
			if (IntersectionObserver) {
				observer = new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							if ( !didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting) ) {
								setImageSrc(src);
								observer.unobserve(imageRef);
							}
						})
					}, { threshold: 0.01, rootMargin: "75%", });
				observer.observe(imageRef);
			} 
			else {
				// Old browsers fallback
				setImageSrc(src);
				observer.unobserve(imageRef);
			}
		}
		return () => {
			didCancel = true
			// on component cleanup, we remove the listner
			if (observer) {
				observer.unobserve(imageRef);
			}
		}
	}, [src, imageSrc, imageRef]);
	return (
			<div className={className? className : "inline-block"}>
				{ (lightbox && lightboxOpen) && <LightBox
					src={src}
					alt={alt}
					open={lightboxOpen}
					onClose={()=>setLightboxOpen(false)}
				/> }
				<Image
					ref={setImageRef}
					src={imageSrc}
					alt={alt}
					onLoad={onLoad}
					onError={onError}
					onClick={event =>{
						if (Function.isFunction(onClick)) {
							onClick(event);
						}
						else{
							setLightboxOpen(true);
						}
					}}
					className={(lightbox? "cursor-pointer " : "cursor-auto")+" w-full h-full"}
					{...rest}
				/>
			</div>
	);
}

LazyImage.defaultProps = {
	lightbox: true,
}

export default LazyImage;