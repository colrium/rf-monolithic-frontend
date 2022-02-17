/** @format */

import React, { useCallback, useRef, useMemo } from "react"
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from "react-redux"
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon"
import { useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import CloseIcon from "@mui/icons-material/Close"
import SpeedDial from "@mui/material/SpeedDial"
import ImageIcon from "@mui/icons-material/Image"
import SpeedDialAction from "@mui/material/SpeedDialAction"
import VideocamIcon from "@mui/icons-material/Videocam"
import HeadphonesIcon from "@mui/icons-material/Headphones"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import Typography from "@mui/material/Typography"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import EmojiPicker from "emoji-picker-react"
import LinkPreview from "components/LinkPreview"
import { useDidMount, useDidUpdate, useWillUnmount, useSetState, usePersistentForm } from "hooks"
import { useStartTyping } from "react-use"

const messageTypes = {
	image: {
		icon: <ImageIcon fontSize="inherit" />,
		label: "Image",
		value: "image",
		actionStyle: {
			"& .MuiSpeedDialAction-fab": {
				backgroundColor: theme => theme.palette.red.main,
				color: theme => theme.palette.background.paper,
				fontSize: theme => theme.spacing(2.5),
			},
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
		actionStyle: {
			"& .MuiSpeedDialAction-fab": {
				backgroundColor: theme => theme.palette.teal.main,
				color: theme => theme.palette.background.paper,
				fontSize: theme => theme.spacing(2.5),
			},
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
		actionStyle: {
			"& .MuiSpeedDialAction-fab": {
				backgroundColor: theme => theme.palette.blue?.main,
				color: theme => theme.palette.background.paper,
				fontSize: theme => theme.spacing(2.5),
			},
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
		actionStyle: {
			"& .MuiSpeedDialAction-fab": {
				backgroundColor: theme => theme.palette.purple.main,
				color: theme => theme.palette.background.paper,
				fontSize: theme => theme.spacing(2.5),
			},
		},
		filePickerProps: {
			acceptedFiles: ["application/*"],
			dropzoneText: "Click to select file or Drag and drop a file here",
			dropzoneIcon: <InsertDriveFileIcon fontSize="inherit" />,
		},
	},
}

const MessageComposer = React.forwardRef((props, ref) => {
	const { onSubmit, conversation, replyFor, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const { isAuthenticated, user } = auth
	const { handleSubmit, TextField, FilePicker, values, setValue, resetValues } = usePersistentForm({
		name: `compose-message-${!String.isEmpty(conversation?.uuid) ? conversation?.uuid : "new"}`,
		defaultValues: {
			content: "",
			attachments: [],
			type: "text",
			is_reply: false,
			sender: auth.user,
			reply_for: null,
			type: "text",
			content: "",
			conversation: conversation?._id,
			conversation_uuid: conversation?.uuid,
		},
	})
	const inputRef = useRef(null)
	const [state, setState, getState] = useSetState({
		emojiPickerOpen: false,
		filePickerOpen: false,
		typePickerOpen: false,
	})

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
		setState({ typePickerOpen: false, filePickerOpen: true })
		setValue("type", messageType)
	}

	const handleOnSubmit = useCallback(() => {
		let content = inputRef.current.value || ""
		content = content.trim()
		let form_values = {
			...values,
			sender: auth.user?._id,
			conversation: conversation?._id || conversation,
			conversation_uuid: conversation?.uuid || conversation,
			content: content,
		}
		if (["image", "audio", "video", "file"].indexOf(form_values.type) !== -1 && Array.isEmpty(form_values.attachments)) {
			form_values.type = "text"
			setValue("type", "text")
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
			} catch (error) {
				resetValues()
			}
		}
	}, [values, onSubmit, conversation, auth])

	const handleOnContentInputKeyDown = useCallback(event => {
		if (event.key === "Enter" && !event.altKey && !event.ctrlKey && !event.shiftKey) {
			event.preventDefault()
			handleOnSubmit()
		} else if (!String.isEmpty(event?.target?.value)) {
			console.log("event?.target?.value", event?.target?.value)
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
			}
		}
	}, [])

	useDidMount(() => {
		autoFocusContentInput()
	})

	useStartTyping(() => console.log("Started typing..."))

	return (
		<Grid {...rest} container ref={ref}>
			<Grid container className="relative">
				<Grid item xs={12} className="">
					<Paper
						id="file-picker"
						className={` m-1 p-4 absolute transform -top-4 -translate-y-full right-4 transition-all ${
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
									label=""
									defaultValue={values?.attachments || []}
									onChange={new_value => setValue(`attachments`, new_value)}
									variant={"outlined"}
									filesLimit={20}
									rules={{
										validate: {
											isNotEmpty: v => !Array.isEmpty(v) || "Required",
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
									autoFocus
									multiline
									minRows={4}
									maxRows={8}
									fullWidth
								/>
							</div>
							<div>
								<div className="relative">
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
								</div>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
})

export default React.memo(MessageComposer)
