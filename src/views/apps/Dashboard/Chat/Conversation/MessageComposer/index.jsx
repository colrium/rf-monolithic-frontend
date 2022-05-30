/** @format */

import React, { useCallback, useRef } from "react"
import Grid from "@mui/material/Grid"
import { useSelector, useDispatch } from "react-redux"
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon"
import { useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import CloseIcon from "@mui/icons-material/Close"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import HeadphonesIcon from "@mui/icons-material/Headphones"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import Typography from "@mui/material/Typography"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import EmojiPicker from "emoji-picker-react"
import LinkPreview from "components/LinkPreview"
import { useDidMount, useDidUpdate, useSetState, usePersistentForm } from "hooks"
import { useNetworkServices } from "contexts/NetworkServices"
import { getIndexOfConversation } from "state/actions"

const messageTypes = {
	image: {
		icon: <ImageIcon fontSize="inherit" />,
		label: "Image",
		value: "image",
		color: "red",
		actionStyle: {
			backgroundColor: theme => theme.palette.red,
			color: theme => theme.palette.background.paper,
			fontSize: theme => theme.spacing(2.5),
		},
		filePickerProps: {
			acceptedFiles: ["image/*"],
			dropzoneText: "Click to select file or  Drag and drop your image file here",
			dropzoneIcon: <ImageIcon fontSize="inherit" />,
		},
	},
	video: {
		icon: <VideocamIcon fontSize="inherit" />,
		label: "Video",
		color: "teal",
		actionStyle: {
			backgroundColor: theme => theme.palette.teal.main,
			color: theme => theme.palette.background.paper,
			fontSize: theme => theme.spacing(2.5),
		},
		filePickerProps: {
			acceptedFiles: ["video/*"],
			dropzoneText: "Click to select file or  Drag and drop your video file here",
			dropzoneIcon: <VideocamIcon fontSize="inherit" />,
		},
	},
	audio: {
		icon: <HeadphonesIcon fontSize="inherit" />,
		label: "Audio",
		color: "blue",
		actionStyle: {
			backgroundColor: theme => theme.palette.blue?.main,
			color: theme => theme.palette.background.paper,
			fontSize: theme => theme.spacing(2.5),
		},
		filePickerProps: {
			acceptedFiles: ["audio/*"],
			dropzoneText: "Click to select file or  Drag and drop your audio file here",
			dropzoneIcon: <HeadphonesIcon fontSize="inherit" />,
		},
	},
	file: {
		icon: <InsertDriveFileIcon fontSize="inherit" />,
		label: "File",
		color: "purple",
		actionStyle: {
			backgroundColor: theme => theme.palette.purple.main,
			color: theme => theme.palette.background.paper,
			fontSize: theme => theme.spacing(2.5),
		},
		filePickerProps: {
			acceptedFiles: ["application/*"],
			dropzoneText: "Click to select file or Drag and drop a file here",
			dropzoneIcon: <InsertDriveFileIcon fontSize="inherit" />,
		},
	},
}

const MessageComposer = React.forwardRef((props, ref) => {
	const { onSubmit, replyFor, conversation, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)

	const conversationRef = useRef(conversation)

	const { handleSubmit, TextField, FilePicker, setValue, getValues, resetValues } = usePersistentForm({
		// name: `compose-message-${conversation?.uuid || conversation?._id || "new"}`,
		name: `compose-message`,
		defaultValues: {
			content: "",
			attachments: [],
			type: "text",
			is_reply: false,
			sender: auth.user,
			reply_for: null,
			type: "text",
			content: "",
			// conversation: conversation?._id,
			// conversation_uuid: conversation?.uuid,
		},
	})
	const values = getValues()
	const inputRef = useRef(null)
	const isTypingRef = useRef(false)
	const [state, setState, getState] = useSetState({
		emojiPickerOpen: false,
		filePickerOpen: false,
		typePickerOpen: false,
		type: "text",
	})
	const { SocketIO } = useNetworkServices()
	const onEmojiClick = useCallback(
		(event, emojiObject) => {
			const cursor = inputRef.current.selectionStart
			const text = values.content.slice(0, cursor) + emojiObject.emoji + values.content.slice(cursor)
			inputRef.current.value = text
			setValue(`content`, `${text}`)
		},
		[values]
	)

	const handleTypePickerOpen = () => {
		setState({ typePickerOpen: true, filePickerOpen: false })
	}

	const handleTypePickerClose = () => {
		setState({ typePickerOpen: false })
	}

	const handleOnPickType = messageType => () => {
		setState({ typePickerOpen: false, filePickerOpen: true, type: messageType })
		setValue("type", messageType)
	}

	const handleOnSubmit = useCallback(
		event => {
			let content = inputRef.current.value || ""
			content = content.trim()
			const { type } = getState()
			let form_values = {
				...getValues(),
				type: type,
				sender: auth.user?._id,
				// conversation: conversation?._id || conversation,
				// conversation_uuid: conversation?.uuid || conversation,
				content: content,
			}
			const submittable =
				(form_values.type === "text" && !String.isEmpty(content)) ||
				(["image", "audio", "video", "file"].indexOf(form_values.type) !== -1 && !Array.isEmpty(form_values.attachments))

			if (Function.isFunction(onSubmit) && submittable) {
				try {
					onSubmit(form_values)
					// if (!!inputRef.current) {
					// 	inputRef.current.value = ""
					// }

					resetValues()
					setState({ emojiPickerOpen: false, filePickerOpen: false, typePickerOpen: false, type: "text" })
					setValue("type", "text")
					setValue("attachments", [])
				} catch (error) {
					resetValues()
				}
			}
		},
		[values, onSubmit, conversation, auth]
	)

	const handleOnContentInputKeyDown = useCallback(event => {
		if (event.key === "Enter" && !event.altKey && !event.ctrlKey && !event.shiftKey) {
			event.preventDefault()
			handleOnSubmit()
		}
	}, [])

	const autoFocusContentInput = useCallback(() => {
		if (!!inputRef.current) {
			inputRef.current.focus()
			if (typeof inputRef.current.selectionStart == "number") {
				inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length
			} else if (typeof inputRef.current.createTextRange != "undefined") {
				let range = inputRef.current.createTextRange()
				range.collapse(false)
				range.select()
				inputRef.current.focus()
			}
		}
	}, [])

	useDidMount(() => {
		resetValues()
		// autoFocusContentInput()
	})

	const handleOnStartedTyping = useCallback(() => {
		if (!isTypingRef.current) {
			isTypingRef.current = true
			SocketIO.emit("started-typing-message", {
				conversation: conversationRef.current.uuid || conversationRef.current._id,
				user: auth.user._id,
			})
		}
	}, [conversation])

	const handleOnStoppedTyping = useCallback(() => {
		if (isTypingRef.current) {
			isTypingRef.current = false
			SocketIO.emit("stopped-typing-message", {
				conversation: conversationRef.current.uuid || conversationRef.current._id,
				user: auth.user?._id,
			})
		}
	}, [])

	useDidUpdate(() => {
		if (!String.isEmpty(values.content) || !Array.isEmpty(values.attachments)) {
			handleOnStartedTyping()
		} else {
			handleOnStoppedTyping()
		}
	}, [values.content])

	// useDidUpdate(() => {

	// 	if (!!inputRef.current) {
	// 		inputRef.current.focus()
	// 		inputRef.current.value = ""
	// 	}
	// }, [conversation.uuid, conversation._id])

	useDidUpdate(() => {
		conversationRef.current = conversation
	}, [conversation])

	return (
		<Grid {...rest} container ref={ref}>
			<Grid container className="relative">
				<Grid item xs={12} className="">
					<Paper
						id="file-picker"
						className={` m-1 p-4 absolute transform -top-4 -translate-y-full right-4 left-0 transition-all ${
							state.filePickerOpen && ["image", "audio", "video", "file"].indexOf(values.type) !== -1
								? "scale-y-100"
								: "hidden scale-y-0"
						}`}
						elevation={4}
					>
						<Grid container>
							<Grid item xs={12} className="flex flex-row items-center mb-2">
								<Box
									className=" mx-2 rounded-full flex items-center justify-center w-8 h-8"
									sx={{
										backgroundColor: theme.palette.background.default,
									}}
								>
									{messageTypes[values.type]?.icon}
								</Box>
								<Typography className="flex-1">{messageTypes[values.type]?.label}</Typography>
								<IconButton onClick={() => setState({ filePickerOpen: false })} color="error" className="text-sm">
									<CloseIcon fontSize="inherit" />
								</IconButton>
							</Grid>
							<Grid item xs={12}>
								<FilePicker
									name={`attachments`}
									variant={"outlined"}
									filesLimit={20}
									rules={{
										validate: {
											// isNotEmpty: v => !Array.isEmpty(v) || `${messageTypes[values.type]?.label} is Required`,
										},
									}}
									{...messageTypes[values.type]?.filePickerProps}
								/>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid
					item
					xs={12}
					sx={{
						backgroundColor: theme.palette.background.paper,
						padding: theme.spacing(),
						paddingTop: theme.spacing(2),
						paddingBottom: theme.spacing(2),
					}}
				>
					<Grid container>
						{state.typePickerOpen && (
							<Grid item xs={12} className="mb-4 flex flex-row ">
								<Box className="m-4 flex flex-row flex-grow">
									{Object.entries(messageTypes).map(([messageType, messageTypeProps]) => (
										<Box
											className="flex flex-col flex-1 mx-4 items-center justify-center"
											key={`message-type-${messageType}`}
										>
											<IconButton color={messageTypeProps.color} onClick={handleOnPickType(messageType)}>
												{messageTypeProps.icon}
											</IconButton>

											<Typography>{messageTypeProps.label}</Typography>
										</Box>
									))}
								</Box>
								<Box>
									<IconButton color={"error"} size="small" onClick={() => setState({ typePickerOpen: false })}>
										<CloseIcon fontSize="inherit" />
									</IconButton>
								</Box>
							</Grid>
						)}
						{!Array.isEmpty(values.attachments) && !state.filePickerOpen && !state.typePickerOpen && (
							<Grid item xs={12} className="mb-4">
								{/* <FilePicker
									name={`attachments`}
									variant={"outlined"}
									filesLimit={values.attachments.length}
									rules={{
										validate: {
											// isNotEmpty: v => !Array.isEmpty(v) || `${messageTypes[values.type]?.label} is Required`,
										},
									}}
									{...messageTypes[values.type]?.filePickerProps}
								/> */}
							</Grid>
						)}
						{String.containsUrl(values.content) && (
							<Grid item xs={12} className="mb-4">
								<LinkPreview
									width="100%"
									descriptionLength={100}
									url={String.getContainedUrl(values.content)[0]}
									openInNewTab
								/>
							</Grid>
						)}

						<Grid item xs={12} className="flex flex-row items-center">
							<ClickAwayListener
								onClickAway={() =>
									setState(prevState => ({
										emojiPickerOpen: false,
									}))
								}
							>
								<div className="flex flex-row">
									<Paper
										sx={{ m: 1 }}
										id="emoji-picker"
										className={`absolute transform -top-4 -translate-y-full transition-all ${
											state.emojiPickerOpen ? "scale-y-100" : "hidden scale-y-0"
										}`}
										elevation={4}
									>
										<EmojiPicker onEmojiClick={onEmojiClick} disableAutoFocus={true} native />
									</Paper>

									<IconButton
										aria-describedby={"emoji-picker"}
										onClick={event =>
											setState(prevState => ({
												emojiPickerOpen: !prevState.emojiPickerOpen,
											}))
										}
									>
										<InsertEmoticonIcon />
									</IconButton>
								</div>
							</ClickAwayListener>
							<div className="flex-1 px-4">
								<TextField
									label=""
									name={`content`}
									placeholder="Enter your message"
									inputRef={inputRef}
									variant={"outlined"}
									inputProps={{
										onKeyDown: handleOnContentInputKeyDown,
									}}
									multiline
									minRows={4}
									maxRows={8}
									fullWidth
									autoFocus
								/>
							</div>
							<div>
								<IconButton ariaLabel={"Add Attachment"} onClick={handleTypePickerOpen}>
									<AttachFileIcon />
								</IconButton>
								{/* <div className="relative">

									<SpeedDial
										ariaLabel="Add Attachment"
										sx={{
											position: "relative",
											// bottom: 16,
											// right: 16,
											"& .MuiSpeedDial-actions": {
												position: "absolute",
												transform: `translateY(-${theme.spacing(10)})`,
											},
										}}
										FabProps={{
											color: "inherit",
											size: "medium",
											component: IconButton,
											className: "shadow-none bg-transparent hover:bg-gray-900 hover:bg-opacity-5",
										}}
										icon={<AttachFileIcon />}
										onClose={handleTypePickerClose}
										onOpen={handleTypePickerOpen}
										open={state.typePickerOpen}
									>
										{Object.entries(messageTypes).map(([messageType, messageTypeProps]) => (
											<SpeedDialAction
												key={`message-type-${messageType}`}
												icon={messageTypeProps.icon}
												tooltipTitle={messageTypeProps.label}
												tooltipOpen
												onClick={handleOnPickType(messageType)}
												sx={{
													...messageTypeProps.actionStyle,
												}}
											/>
										))}
									</SpeedDial>
								</div> */}
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
})

export default React.memo(MessageComposer)
