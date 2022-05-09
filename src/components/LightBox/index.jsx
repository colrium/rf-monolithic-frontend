/** @format */

import React, { useState, useEffect, useRef } from "react"
import Modal from "@mui/material/Modal"
import Backdrop from "@mui/material/Backdrop"
import IconButton from "@mui/material/IconButton"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Stack from "@mui/material/Stack"
import { useForwardedRef } from "hooks"
import { useSelector, useDispatch } from "react-redux"
import { setLightbox } from "state/actions"
import LazyImage from "components/LazyImage"
const placeHolder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC"

const LightBox = React.forwardRef((props, ref) => {
	const { className } = props
	const imageRef = useForwardedRef(ref)
	const dispatch = useDispatch()
	const { src, alt, next, prev } = useSelector(state => ({ ...state.lightbox }))

	return (
		<Modal
			className={`w-screen h-screen p-2 flex flex-col items-center justify-center ${className ? className : ""}`}
			sx={{ zIndex: theme => theme.zIndex.drawer + 10 }}
			open={!String.isEmpty(src)}
			onClose={() => dispatch(setLightbox(null))}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Stack direction="row" spacing={1} className={`w-full h-full p-2 flex flex-row items-center justify-center`}>
				{!String.isEmpty(prev) && (
					<IconButton
						aria-label="Previous"
						title="Previous"
						color="accent"
						sx={{ backgroundColor: theme => theme.palette.background.paper }}
						onClick={() => dispatch(setLightbox(prev))}
					>
						<ArrowBackIcon />
					</IconButton>
				)}
				<LazyImage
					lightbox={false}
					ref={imageRef}
					title={alt}
					src={src}
					alt={alt}
					className={"h-auto w-auto m-auto max-h-full max-w-full "}
					style={{ contain: "paint" }}
				/>
				{!String.isEmpty(next) && (
					<IconButton
						aria-label="Previous"
						title="Next"
						color="accent"
						sx={{ backgroundColor: theme => theme.palette.background.paper }}
						onClick={() => dispatch(setLightbox(next))}
					>
						<ArrowForwardIcon />
					</IconButton>
				)}
			</Stack>
		</Modal>
	)
})

export default LightBox;
