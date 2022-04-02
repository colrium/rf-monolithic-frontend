/** @format */

import React, { useEffect, useRef, useState } from "react"
import Skeleton from "@mui/material/Skeleton"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useSetState, useDidUpdate, useDidMount } from "hooks"

const proxyLink = "https://rlp-proxy.herokuapp.com/v2?url="
export const placeholderImg = "https://i.imgur.com/UeDNBNQ.jpeg"

function isValidResponse(res) {
	if (!res) return false

	return (
		res.title !== null &&
		res.description !== null &&
		res.image !== null &&
		res.siteName !== null &&
		res.hostname !== null &&
		res.title !== undefined &&
		res.description !== undefined &&
		res.image !== undefined &&
		res.siteName !== undefined &&
		res.hostname !== undefined &&
		res.image !== "null" &&
		!res.image.startsWith("/")
	)
}

const LinkPreview = ({
	url,
	className = "",
	width="auto",
	height="100px",
	descriptionLength,
	borderRadius,
	imageHeight="100%",
	minimal=true,
	textAlign,
	margin,
	fallback = null,
	backgroundColor = "transparent",
	primaryTextColor = "black",
	secondaryTextColor = "rgb(100, 100, 100)",
	borderColor = "#ccc",
	showLoader = true,
	customLoader = null,
	openInNewTab = true,
	fetcher,
	fallbackImageSrc = placeholderImg,
	explicitImageSrc = null,
}) => {
	const [state, setState] = useSetState({
		metadata: null,
		loading: true,
	})

	useDidUpdate(() => {
		setState({ loading: true })
			fetch(proxyLink + url)
				.then(res => res.json())
				.then(res => {
					setState({ loading: false, metadata: res.metadata })
				})
				.catch(err => {
					console.error(err)
					console.error(
						"No metadata could be found for the given URL."
					)
					setState({ loading: false, metadata: null })
				})
	}, [url])

	useDidMount(() => {
		setState({ loading: true })
		fetch(proxyLink + url)
			.then(res => res.json())
			.then(res => {
				setState({ loading: false, metadata: res.metadata })
			})
			.catch(err => {
				console.error(err)
				console.error("No metadata could be found for the given URL.")
				setState({ loading: false, metadata: null })
			})
	}, [url])

	if (state.loading && showLoader) {
		if (customLoader) {
			return <>{customLoader}</>
		} else {
			return <Skeleton width={width} height={height} />
		}
	}

	// if (!state.metadata) {
	// 	return <>{fallback}</>
	// }

	const { image, description, title, siteName, hostname } = state.metadata || {}

	const onClick = () => {
		const browserTarget = openInNewTab ? "_blank" : "_self"
		window.open(url, browserTarget)
	}
	return (
		<Box
			onClick={onClick}
			className={`${className} bg-no-repeat bg-cover bg-center text-left flex flex-col  justify-end rounded cursor-pointer `}
			sx={{
				// border: theme => `1px solid ${theme.palette.action.hover}`,
				backgroundImage: `url(${
					explicitImageSrc || image || fallbackImageSrc
				}), url(${fallbackImageSrc})`,
				width,
				height,
				borderRadius,
				textAlign,
				margin,
				backgroundColor,
				borderColor,
			}}
		>
			<Box
				component="div"
				className="p-2 w-full flex flex-col blur-bg-sm transition-all"
				sx={{}}
			>
				<Typography
					data-testid="title"
					className="mb-2 "
					variant="body1"
				>
					{title || url}
				</Typography>
				{description && (
					<Typography
						data-testid="desc"
						className="sm:hidden md:inline-block Secondary"
						variant="body2"
					>
						{descriptionLength
							? description.length > descriptionLength
								? description.slice(0, descriptionLength) +
								  "..."
								: description
							: description}
					</Typography>
				)}
				<Box
					sx={{
						color: theme => theme.palette.blue.main,
						fontSize: theme => theme.spacing(1.3),
					}}
				>
					{siteName && <span>{siteName} • </span>}
					<span>{hostname}</span>
				</Box>
			</Box>
		</Box>
	)
}
export default React.memo(LinkPreview)
