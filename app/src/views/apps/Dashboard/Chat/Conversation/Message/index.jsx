/** @format */

import React, { useMemo, useCallback } from "react"
import classNames from "classnames"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined"
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined"
import BlockIcon from "@mui/icons-material/Block"
import DoneIcon from "@mui/icons-material/Done"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import ScheduleIcon from "@mui/icons-material/Schedule"
import LazyImage from "components/LazyImage"
import LinkPreview from "components/LinkPreview"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { useDidUpdate, useVisibility, useSetState, useDeepMemo } from "hooks"
import { useNetworkServices } from "contexts"
import { Stack } from "@mui/material"
import { useEnsuredForwardedRef } from "react-use"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles(theme => ({
	incoming: {
		borderRadius: theme.spacing(2),
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.primary,
		borderTopLeftRadius: 0,
	},
	incomingStart: {
		borderTopLeftRadius: theme.spacing(2),
		borderBottomLeftRadius: 0,
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
	},
	incomingMid: {
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
	},
	incomingEnd: {
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: theme.spacing(2),
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
	},
	outgoing: {
		borderRadius: theme.spacing(2),
		backgroundColor: theme.palette.teal.lighten_3,
		color: theme.palette.text.primary,
		borderBottomRightRadius: 0,
	},
	outgoingStart: {
		borderTopRightRadius: theme.spacing(2),
		borderBottomLeftRadius: 0,
		borderTopLeftRadius: theme.spacing(2),
		borderBottomLeftRadius: theme.spacing(2),
	},
	outgoingMid: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: theme.spacing(2),
		borderBottomLeftRadius: theme.spacing(2),
	},
	outgoingEnd: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: theme.spacing(2),
		borderTopLeftRadius: theme.spacing(2),
		borderBottomLeftRadius: theme.spacing(2),
	},
}))

const Message = React.forwardRef((props, ref) => {
	const {
		conversation,
		data,
		className,
		selected,
		focused,
		onContextMenu,
		onClick,
		imageWidth = "100%",
		showDateHeader = false,
		showUnreadHeader = false,
		prevMessage,
		nextMessage,
		imageHeight = "100%",
		mediaSize = 100,
		headerHeight = 48,
		linkHeight = 100,
		showTimeStamp,
		...rest
	} = props
	const theme = useTheme()
	const auth = useSelector(state => state.auth)
	const { Api: ApiService, SocketIO } = useNetworkServices()
	const [state, setState, getState] = useSetState({
		loading: false,
		selected: -1,
		showTimeStamp: Boolean(showTimeStamp),
	})
	const classes = useStyles()

	const messageDeleted = useDeepMemo(
		() =>
			(data.state === "deleted-for-sender" && (data.sender === auth.user?._id || data.sender._id === auth.user?._id)) ||
			data.state === "deleted-for-all",
		[data]
	)

	const isOutgoing = useDeepMemo(() => data.sender._id === auth.user?._id || data.sender === auth.user?._id, [data, auth])
	const bubbleClassName = useDeepMemo(() => {
		const isCurrentOutgoing = data.sender?._id === auth.user?._id || data.sender === auth.user?._id
		let classNamesVal = isCurrentOutgoing ? "rounded-l-2xl " : "rounded-r-2xl"
		const isPrevMessageOutgoing =
			prevMessage?.sender && (prevMessage?.sender?._id === auth.user?._id || prevMessage?.sender === auth.user?._id)
		const isNextMessageOutgoing =
			nextMessage?.sender && (nextMessage?.sender?._id === auth.user?._id || nextMessage?.sender === auth.user?._id)
		classNamesVal = classNames({
			[classes.outgoing]: isCurrentOutgoing,
			[classes.outgoingStart]: isCurrentOutgoing && isNextMessageOutgoing,
			[classes.outgoingMid]: isCurrentOutgoing && isNextMessageOutgoing && isPrevMessageOutgoing,
			[classes.outgoingEnd]: isCurrentOutgoing && !isNextMessageOutgoing && isPrevMessageOutgoing,
			[classes.incoming]: !isCurrentOutgoing,
			[classes.incomingStart]: !isCurrentOutgoing && !isNextMessageOutgoing,
			[classes.incomingMid]: !isCurrentOutgoing && !isNextMessageOutgoing && !isPrevMessageOutgoing,
			[classes.incomingEnd]: !isCurrentOutgoing && (isNextMessageOutgoing || !nextMessage) && !isPrevMessageOutgoing,
		})
		// if (isCurrentOutgoing) {
		// 	classNamesVal = c
		// } else {
		// 	classNamesVal = `${classNames} ${isPrevMessageOutgoing ? "rounded-tl-none" : "rounded-tl-2xl"} ${
		// 		isNextMessageOutgoing ? "rounded-bl-2xl" : "rounded-bl-none"
		// 	}`
		// }

		return classNamesVal
	}, [prevMessage, nextMessage, auth])

	const handleOnClick = useCallback(
		index => event => {
			setState({
				selected: index,
			})
			if (Function.isFunction(onClick)) {
				onClick(event, index, data)
			}
		},
		[onClick, data]
	)

	const handleOnContextMenu = useCallback(
		index => event => {
			event.preventDefault()
			setState({
				selected: index,
			})

			if (Function.isFunction(onContextMenu)) {
				onContextMenu(event, index, data)
			}
		},
		[onContextMenu, data]
	)

	const handleOnVisibilityChange = useCallback(
		isVisible => {
			console.log("handleOnVisible isVisible", isVisible)
			if (isVisible) {
				console.log("handleOnVisible data", data)
			}
		},
		[data]
	)

	const ensuredForwardRef = useEnsuredForwardedRef(ref)
	const visible = useVisibility(ensuredForwardRef)

	useDidUpdate(() => {
		handleOnVisibilityChange(visible)
	}, [visible])

	return (
		<Box
			onClick={handleOnClick}
			onContextMenu={handleOnContextMenu}
			{...rest}
			className={`overflow-hidden bg-transparent px-0  `}
			ref={ensuredForwardRef}
		>
			{showUnreadHeader && Array.isArray(data.reads) && data.reads.indexOf(auth.user?._id) === -1 && (
				<Box className={`flex flex-row items-center p-0 w-full`} sx={{ height: headerHeight }}>
					<Box
						component="span"
						sx={
							{
								// border: theme => `0.5px solid ${theme.palette.divider}`,
							}
						}
						className="flex-1 mx-4"
					/>
					<Typography
						variant="body2"
						sx={{
							color: theme => theme.palette.text.disabled,
							padding: theme => theme.spacing(),
							backgroundColor: theme => theme.palette.background.default,
						}}
					>
						{`Unread Message`}
					</Typography>
					<Box
						component="span"
						sx={
							{
								// border: theme => `0.5px solid ${theme.palette.divider}`,
							}
						}
						className="flex-1 mx-4"
					/>
				</Box>
			)}
			{showDateHeader && (!!data.timestamp || !!data.created_on) && (
				<Box className={`flex flex-row items-center justify-center p-0 w-full`} sx={{ height: headerHeight }}>
					<Box
						className="px-2 rounded-md h-3/6 flex flex-row items-center justify-center"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme => theme.palette.background.default,
						}}
					>
						<Typography variant="body2">{`${Date.prose(data.timestamp || data.created_on, false)}`}</Typography>
					</Box>
				</Box>
			)}
			<Box
				className={`flex cursor-pointer p-0 px-2 w-full ${isOutgoing ? "flex-row-reverse" : "flex-row"}`}
				sx={
					{
						// height: "fit-content !important",
					}
				}
			>
				<Box
					className={`flex flex-col  px-4 py-1 mb-1 ${bubbleClassName} ${className ? className : ""} `}
					sx={{
						maxWidth: "60%",
						height: "100% !important",
					}}
				>
					{!messageDeleted && (
						<div
							className={
								conversation.type !== "individual"
									? "flex flex-row w-full items-center"
									: "flex flex-row-reverse w-full items-center"
							}
						>
							{conversation.type !== "individual" && JSON.isJSON(data.sender) && (
								<Typography variant="body1" className={"flex-grow text-gray-500 font-bold"}>
									{data.sender.first_name + " " + data.sender.last_name}
								</Typography>
							)}
						</div>
					)}
					{!messageDeleted && ["audio", "file", "video", "image"].includes(data.type) && Array.isArray(data.attachments) && (
						<div
							className={`flex flex-row flex-1 flex-wrap ${
								data.type === "image" ? (data.attachments.length > 2 ? "grid-cols-2 grid-rows-2" : "") : ""
							}`}
						>
							{data.attachments.map(
								(attachment, cursor) =>
									cursor <= 3 && (
										<div className={"mx-auto rounded"} key={"attachment-" + cursor}>
											{data.type === "image" && (
												<LazyImage
													className={"w-48 rounded"}
													src={ApiService.getAttachmentFileUrl(attachment)}
													alt={attachment?.name}
													style={{
														height: mediaSize,
														borderSize: 5,
														borderColor: "transparent",
														minWidth: mediaSize,
													}}
												/>
											)}
											{data.type === "audio" && (
												<div
													className={"w-full lex flex-row items-center"}
													onClick={e => {
														e.preventDefault()
														let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank")
														win.focus()
													}}
													style={{ height: mediaSize, minWidth: mediaSize }}
												>
													<AudiotrackOutlinedIcon className={"text-2xl"} />
													<Typography variant="body1" color="textPrimary" className={"flex-grow truncate"}>
														{attachment.name}
													</Typography>
												</div>
											)}
											{data.type === "video" && (
												<div
													className={"w-full flex flex-row items-center"}
													onClick={e => {
														e.preventDefault()
														let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank")
														win.focus()
													}}
													style={{ height: mediaSize, minWidth: mediaSize }}
												>
													<MovieOutlinedIcon className={"text-2xl"} />
													<Typography variant="body1" color="textPrimary" className={"flex-grow truncate"}>
														{attachment.name}
													</Typography>
												</div>
											)}
											{data.type === "file" && (
												<div
													className={"w-full flex flex-row items-center"}
													onClick={e => {
														e.preventDefault()
														let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank")
														win.focus()
													}}
													style={{ height: mediaSize, minWidth: mediaSize }}
												>
													<AttachFileIcon className={"text-2xl"} />
													<Typography variant="body1" color="textPrimary" className={"flex-grow truncate"}>
														{attachment.name}
													</Typography>
												</div>
											)}
										</div>
									)
							)}
						</div>
					)}

					{messageDeleted && (
						<div
							className={"flex flex-row items-center w-full"}
							style={{
								color: theme.palette.divider,
							}}
						>
							<Typography variant="body1" color="inherit" className={"flex-grow"}>
								Message deleted
							</Typography>
							<BlockIcon className={"mx-2"} fontSize="small" />
						</div>
					)}

					{!messageDeleted && (
						<Stack className="flex flex-col">
							<Stack xs={12} direction="row" spacing={2} className="p-0 flex-1 ">
								<Stack className="m-0 p-0 flex flex-1 flex-col">
									{String.containsUrl(data.content) && (
										<LinkPreview
											width="100%"
											height={linkHeight}
											className="p-0"
											imageHeight={10}
											descriptionLength={100}
											url={String.getContainedUrl(data.content)[0]}
											openInNewTab
										/>
									)}
									<Typography variant="body1" color="textPrimary" component="div" className="flex-1 leading-normal">
										{data.content}
									</Typography>
								</Stack>

								{!showTimeStamp && (
									<Stack className="m-0 p-0 pb-1 flex flex-col self-end">
										{data.state === "pending" &&
											(data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
												<ScheduleIcon className={"ml-2 text-xs"} fontSize="small" />
											)}
										{data.state === "sent" &&
											(data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
												<DoneIcon className={"ml-2 text-xs "} fontSize="small" />
											)}
										{(data.state === "partially-received" || data.state === "received") &&
											(data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
												<DoneAllIcon className={"ml-2 text-xs"} fontSize="small" />
											)}
										{(data.state === "partially-read" || data.state === "read") &&
											(data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
												<DoneAllIcon className={"ml-2 text-xs text-blue-500"} fontSize="small" />
											)}
									</Stack>
								)}
							</Stack>
							{showTimeStamp && (
								<Box
									component="div"
									sx={{
										color: theme.palette.text.secondary,
									}}
									className="flex flex-row items-center justify-end text-sm w-full"
								>
									<Typography
										sx={{
											fontSize: theme => theme.spacing(1.3),
										}}
										className={"flex-1 text-right"}
									>
										{`${Date.format(data.timestamp || data.created_on, "h:i a")}`}
									</Typography>
									{data.state === "pending" && (data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
										<ScheduleIcon className={"ml-2 text-xs"} fontSize="small" />
									)}
									{data.state === "sent" && (data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
										<DoneIcon className={"ml-2 text-xs "} fontSize="small" />
									)}
									{(data.state === "partially-received" || data.state === "received") &&
										(data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
											<DoneAllIcon className={"ml-2 text-xs"} fontSize="small" />
										)}
									{(data.state === "partially-read" || data.state === "read") &&
										(data.sender._id === auth.user?._id || data.sender === auth.user?._id) && (
											<DoneAllIcon className={"ml-2 text-xs text-blue-500"} fontSize="small" />
										)}
								</Box>
							)}
						</Stack>
					)}
				</Box>
			</Box>
		</Box>
	)
})

export default React.memo(Message)
