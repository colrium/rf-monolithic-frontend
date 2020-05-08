/** @format */

import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ErrorImage from "assets/img/icons/file-error.svg";

const placeHolder =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";

const LightBox = ({ src, alt, open, onClose, className, ...rest }) => {
	const [imageSrc, setImageSrc] = useState(placeHolder);
	const [imageRef, setImageRef] = useState();

	const onLoad = event => {
		event.target.classList.add("loaded");
	};

	const onError = event => {
		event.target.src = ErrorImage;
	};

	useEffect(() => {
		let observer = undefined;
		let didCancel = false;

		if (imageRef && imageSrc !== src) {
			if (IntersectionObserver) {
				observer = new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							if (
								!didCancel &&
								(entry.intersectionRatio > 0 ||
									entry.isIntersecting)
							) {
								setImageSrc(src);
								observer.unobserve(imageRef);
							}
						});
					},
					{ threshold: 0.01, rootMargin: "75%" }
				);
				observer.observe(imageRef);
			} else {
				// Old browsers fallback
				setImageSrc(src);
				observer.unobserve(imageRef);
			}
		}
		return () => {
			didCancel = true;
			// on component cleanup, we remove the listener
			if (observer) {
				observer.unobserve(imageRef);
			}
		};
	}, [src, imageSrc, imageRef]);
	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="light-modal-description"
			className={
				"rounded m-auto h-auto p-4 text-center " +
				(className ? className : "")
			}
			style={{ maxWidth: "80vw" }}
			open={open}
			onClose={onClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<img
					ref={setImageRef}
					src={imageSrc}
					alt={alt}
					className={"h-auto"}
					style={{ maxWidth: "100%" }}
					{...rest}
				/>
			</Fade>
		</Modal>
	);
};

export default LightBox;
