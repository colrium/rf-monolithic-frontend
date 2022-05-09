/** @format */

import React, { useState, useCallback } from "react"
import styled from "styled-components"

import { useLazyImage } from "hooks"
import { useForwardedRef } from "hooks"
import { useDispatch } from "react-redux"
import { setLightbox } from "state/actions"
const placeHolder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC"
import { makeStyles } from "@mui/styles"

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

const useStyles = makeStyles(theme => ({}))

const LazyImage = React.forwardRef((props, ref) => {
	const { src, alt, onClick, prev, next, lightbox, Component, className, ...rest } = props
	const dispatch = useDispatch()
	const classes = useStyles()
	const [imageSrc, { ref: imageRef, error, loading }] = useLazyImage({ src: src, ref: ref })

	const handleOnClick = useCallback(
		event => {
			event.preventDefault()
			if (lightbox) {
				dispatch(setLightbox({ src, prev, next, alt }))
			}
			if (Function.isFunction(onClick)) {
				onClick(event)
			}
		},
		[onClick, lightbox, src, prev, next, alt]
	)

	return (
		<Component
			ref={imageRef}
			src={imageSrc}
			onClick={handleOnClick}
			className={`cursor-auto ${lightbox ? "cursor-pointer " : ""} ${className ? className : ""}${!loading ? "loaded" : ""} ${
				error ? "has-error" : ""
			}`}
			{...rest}
		/>
	)
})

LazyImage.defaultProps = {
	lightbox: true,
	Component: Image,
}

export default React.memo(LazyImage);
