/** @format */

import React, { useRef, useCallback } from "react"
import classNames from "classnames"
import Box from "@mui/material/Box"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
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
import { useDidUpdate, useVisibility, useSetState, useDeepMemo, useDidMount, useForwardedRef } from "hooks"
import { useNetworkServices } from "contexts"
import { Stack } from "@mui/material"
import Linkify from "react-linkify"
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
		message,
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
		showDetails,
		index,
		style,
		...rest
	} = props
	const theme = useTheme()
	const auth = useSelector(state => state.auth)
	const { Api: ApiService, SocketIO } = useNetworkServices()
	const [state, setState, getState] = useSetState({
		loading: false,
		selected: -1,
		showDetails: Boolean(showDetails),
	})
	const classes = useStyles()
	const styleRef = useRef(style)
	const messageDeleted = useDeepMemo(
		() =>
			(message?.state === "deleted-for-sender" && (message?.sender === auth.user?._id || message?.sender?._id === auth.user?._id)) ||
			message.state === "deleted-for-all",
		[message]
	)

	const isOutgoing = useDeepMemo(() => message?.sender?._id === auth.user?._id || message?.sender === auth.user?._id, [message, auth])
	const bubbleClassName = useDeepMemo(() => {
		const isCurrentOutgoing = message.sender?._id === auth.user?._id || message.sender === auth.user?._id
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
			if (!messageDeleted) {
				// setState(prevState => ({
				// 	selected: !prevState.selected,
				// 	showDetails: !prevState.showDetails,
				// }))
				if (Function.isFunction(onClick)) {
					onClick(event, index, message)
				}
			}
		},
		[onClick, message]
	)

	const handleOnContextMenu = useCallback(
		event => {
			event.preventDefault()
			if (!messageDeleted) {
				if (Function.isFunction(onContextMenu)) {
					onContextMenu(event)
				}
			}
		},
		[onContextMenu, messageDeleted]
	)

	const handleOnVisibilityChange = useCallback(
		isVisible => {
			if (!isOutgoing) {
				if (isVisible) {
					if (message.state === "sent" || message.state === "received" || message.state === "partially-received") {
						SocketIO.emit("mark-message-as-read", {
							message: message._id,
						})
					}
				} else {
					if (message.state === "sent") {
						SocketIO.emit("mark-message-as-received", {
							message: message._id,
						})
					}
				}
			}
		},
		[isOutgoing, message]
	)
	const content = useDeepMemo(() => {
		return message.content
	}, [message.content])
	const ensuredForwardRef = useForwardedRef(ref)
	const visibilityRef = useRef(null)
	const visible = useVisibility(visibilityRef)

	useDidUpdate(() => {
		handleOnVisibilityChange(visible)
	}, [visible])

	useDidMount(() => {
		handleOnVisibilityChange(visible)
	})
	return (
		<Box
			onClick={handleOnClick(index)}
			onContextMenu={handleOnContextMenu}
			{...rest}
			className={`overflow-hidden bg-transparent px-0  `}
			style={style}
			ref={ensuredForwardRef}
		>
			{showUnreadHeader && Array.isArray(message.reads) && message.reads.indexOf(auth.user?._id) === -1 && (
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
			{showDateHeader && (!!message.timestamp || !!message.created_on) && (
				<Box className={`flex flex-row items-center justify-center p-0 w-full`} sx={{ height: headerHeight }}>
					<Box
						className="px-2 rounded-md h-3/6 flex flex-row items-center justify-center"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme => theme.palette.background.default,
						}}
					>
						<Typography variant="body2">{`${Date.prose(message.timestamp || message.created_on, false)}`}</Typography>
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
					className={`flex flex-col break-words px-4 py-1 mb-1 ${bubbleClassName} ${className ? className : ""} `}
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
							{conversation.type !== "individual" && JSON.isJSON(message.sender) && (
								<Typography variant="body1" className={"flex-grow text-gray-500 font-bold"}>
									{message.sender.first_name + " " + message.sender.last_name}
								</Typography>
							)}
						</div>
					)}
					{!messageDeleted && ["audio", "file", "video", "image"].includes(message.type) && Array.isArray(message.attachments) && (
						<div
							className={`flex flex-row flex-1 flex-wrap ${
								message.type === "image" ? (message.attachments.length > 2 ? "grid-cols-2 grid-rows-2" : "") : ""
							}`}
						>
							{message.attachments.map(
								(attachment, cursor) =>
									cursor <= 3 && (
										<div className={"mx-auto rounded"} key={"attachment-" + cursor}>
											{message.type === "image" && (
												<LazyImage
													className={"w-48 rounded"}
													src={ApiService.getAttachmentFileUrl(attachment)}
													alt={attachment?.name}
													style={{
														height: "auto",
														borderSize: 5,
														borderColor: "transparent",
														// minWidth: mediaSize,
													}}
												/>
											)}
											{message.type === "audio" && (
												<ListItem
													onClick={e => {
														e.preventDefault()
														let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank")
														win.focus()
													}}
												>
													<ListItemAvatar>
														<Avatar className="bg-black bg-opacity-10">
															<AudiotrackOutlinedIcon className={"text-2xl"} />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary="Audio" secondary={attachment?.name || "Attachment"} />
												</ListItem>
											)}
											{message.type === "video" && (
												<ListItem
													onClick={e => {
														e.preventDefault()
														let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank")
														win.focus()
													}}
												>
													<ListItemAvatar>
														<Avatar className="bg-black bg-opacity-10">
															<MovieOutlinedIcon className={"text-2xl"} />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary="Video" secondary={attachment?.name || "Attachment"} />
												</ListItem>
											)}
											{message.type === "file" && (
												<ListItem
													onClick={e => {
														e.preventDefault()
														let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank")
														win.focus()
													}}
												>
													<ListItemAvatar>
														<Avatar className="bg-black bg-opacity-10">
															<AttachFileIcon className={"text-2xl"} />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary="File" secondary={attachment?.name || "Attachment"} />
												</ListItem>
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
									{String.containsUrl(message.content) && (
										<LinkPreview
											width="100%"
											height={linkHeight}
											className="p-0"
											imageHeight={10}
											descriptionLength={100}
											url={String.getContainedUrl(message.content)[0]}
											openInNewTab
										/>
									)}
									<Typography
										variant="body1"
										color="textPrimary"
										component="div"
										ref={visibilityRef}
										className="flex-1 leading-normal"
									>
										<Linkify>{content}</Linkify>
									</Typography>
								</Stack>

								{!state.showDetails && (
									<Stack className="m-0 p-0 pb-1 flex flex-col self-end">
										{message.state === "pending" &&
											(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
												<ScheduleIcon className={"ml-2 text-xs"} fontSize="small" />
											)}
										{message.state === "sent" &&
											(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
												<DoneIcon className={"ml-2 text-xs "} fontSize="small" />
											)}
										{(message.state === "partially-received" || message.state === "received") &&
											(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
												<DoneAllIcon className={"ml-2 text-xs"} fontSize="small" />
											)}
										{(message.state === "partially-read" || message.state === "read") &&
											(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
												<DoneAllIcon className={"ml-2 text-xs text-blue-500"} fontSize="small" />
											)}
									</Stack>
								)}
							</Stack>
							{state.showDetails && (
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
										{`${Date.format(message.timestamp || message.created_on, "h:i a")}`}
									</Typography>
									{message.state === "pending" &&
										(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
											<ScheduleIcon className={"ml-2 text-xs"} fontSize="small" />
										)}
									{message.state === "sent" &&
										(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
											<DoneIcon className={"ml-2 text-xs "} fontSize="small" />
										)}
									{(message.state === "partially-received" || message.state === "received") &&
										(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
											<DoneAllIcon className={"ml-2 text-xs"} fontSize="small" />
										)}
									{(message.state === "partially-read" || message.state === "read") &&
										(message.sender._id === auth.user?._id || message.sender === auth.user?._id) && (
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
