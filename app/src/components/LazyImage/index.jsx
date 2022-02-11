/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LightBox from "components/LightBox";
import { Api as ApiService } from "services";
import { useLazyImage } from "hooks";

const placeHolder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC";

const Image = styled.img`
	display: block;
	width: 100%;
	height: 100%;
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
		content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC");
	}
`

const LazyImage = (props) => {
	const {src, alt, onClick, lightbox, className, fallbackSrc = "https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/icons/file-error.svg", ...rest } = props;


	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [hasError, setHasError] = useState(false);

	const [imageSrc, { ref: imageRef, error: imageError, loading: imageLoading }] = useLazyImage(src, fallbackSrc)

	const onLoad = event => {
		event.target.classList.add("loaded");
	};

	const onError = event => {
		event.target.src = fallbackSrc;
		setHasError(true);
	};

	return (
		<div className={className ? className : ""}>
			{lightbox && lightboxOpen && (
				<LightBox
					src={imageSrc}
					alt={alt}
					open={lightboxOpen}
					onClose={() => setLightboxOpen(false)}
				/>
			)}
			<Image
				ref={imageRef}
				src={imageSrc}
				onClick={event => {

					if (Function.isFunction(onClick)) {
						onClick(event);
					} else {
						event.preventDefault()
						setLightboxOpen(true);
					}
				}}
				className={
					(lightbox ? "cursor-pointer " : "cursor-auto") +
					className ? className :  " w-full h-full"
				}
				{...rest}
			/>
		</div>
	);
};

LazyImage.defaultProps = {
	lightbox: true,
};

export default React.memo(LazyImage);
