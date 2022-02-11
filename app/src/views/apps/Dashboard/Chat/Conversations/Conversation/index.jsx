/** @format */

import React, { useRef, useCallback } from "react"
import { useTheme } from "@mui/material/styles"
import { useSelector, useDispatch } from "react-redux"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Badge from "@mui/material/Badge"
import { useNetworkServices } from "contexts"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PersonIcon from "@mui/icons-material/Person"
import PeopleIcon from "@mui/icons-material/People"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined"
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import BlockIcon from "@mui/icons-material/Block"
import DoneIcon from "@mui/icons-material/Done"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import ScheduleIcon from "@mui/icons-material/Schedule"
import { useDidMount, useWillUnmount, useSetState, useDidUpdate } from "hooks"
const Conversation = (props, ref) => {
	const { data, className, selected, focused, style, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const { Sockets, Api: ApiService } = useNetworkServices()
	const [state, setState, getState] = useSetState({
		primaryText: "",
		recipients: [],
		avatars: [],
		owner: false,
		lastMessageContent: false,
		lastMessageDeleted: false,
		lastMessageSenderName: false,
	})

	const eveluateConversationState = useCallback(() => {
		let primaryText = ""
		let chatUser = false
		let avatar = false
		let last_message_content = false
		let last_message_deleted = false
		let last_message_sender_name = false
		if (data?.state && data?.state.total > 0 && data?.state.last_message) {
			last_message_content = data?.state?.last_message?.content
			if (
				data?.state?.last_message?.sender === auth.user?._id ||
				data?.state?.last_message?.sender._id === auth.user?._id
			) {
				last_message_sender_name = "You"
			} else if (data?.owner === data?.state?.last_message?.sender) {
				last_message_sender_name = data?.started_by.first_name
			} else {
				if (Array.isArray(data?.participants)) {
					data?.participants.map(participant => {
						if (
							participant._id ===
							data?.state?.last_message?.sender
						) {
							last_message_sender_name = participant.first_name
						}
					})
				}
			}
			if (
				(data?.state?.last_message?.state === "deleted-for-sender" &&
					(data?.state?.last_message?.sender._id === auth.user?._id ||
						data?.state?.last_message?.sender ===
							auth.user?._id)) ||
				data?.state?.last_message?.state === "deleted-for-all"
			) {
				last_message_deleted = true
			}
		}
		if (data?.type == "individual") {
			let chat_owner_id = data?.owner?._id || data?.owner

			if (auth.user?._id === chat_owner_id) {
				if (Array.isArray(data?.participants)) {
					if (data?.participants.length > 0) {
						chatUser = data?.participants[0]
						primaryText =
							data?.participants[0].first_name +
							" " +
							data?.participants[0].last_name
						avatar = data?.participants[0].avatar
					}
				}
			} else {
				if (data?.started_by) {
					chatUser = data?.started_by
					primaryText =
						data?.started_by?.first_name +
						" " +
						data?.started_by?.last_name
					avatar = data?.started_by?.avatar
				}
			}
		} else if (data?.type == "group") {
			primaryText = data?.group_name
			avatar = data?.group_avatar
		}
		setState({
			primaryText: primaryText,
			avatar: avatar,
			owner: chatUser,
			lastMessageContent: last_message_content,
			lastMessageDeleted: last_message_deleted,
			lastMessageSenderName: last_message_sender_name,
		})
	}, [data])

	useDidMount(() => {
		eveluateConversationState()
	})

	useDidUpdate(() => {
		eveluateConversationState()
	}, [data])

	return (
		<ListItemButton
			className={`px-8 transition transition-colors bg-transparent focus:bg-gray-300 focus:bg-opacity-10  ${
				className ? className : ""
			} ${selected ? "bg-gray-400 bg-opacity-25" : ""} ${
				focused ? "bg-gray-300 bg-opacity-25" : ""
			}`}
			{...rest}
			ref={ref}
		>
			<ListItemAvatar>
				<Badge
					variant="dot"
					badgeContent=" "
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					classes={{
						// dot:
						// 	state?.owner?.presence === "online"
						// 		? "bg-green-600"
						// 		: state?.owner?.presence == "away"
						// 		? "bg-orange-500"
						// 		: "bg-gray-500",
						dot:
							state?.owner?.presence === "online"
								? "bg-green-600"
								: state?.owner?.presence == "away"
								? "bg-orange-500"
								: "hidden",
					}}
				>
					{state.avatar && (
						<Avatar
							src={ApiService.getAttachmentFileUrl(state.avatar)}
							alt={state.primaryText}
							className={`text-base`}
							sx={{
								backgroundColor: theme =>
									theme.palette.action.selected,
								color: theme => theme.palette.text.primary,
							}}
						/>
					)}
					{!state.avatar && (
						<Avatar
							sx={{
								backgroundColor: theme =>
									theme.palette.action.selected,
								color: theme => theme.palette.text.primary,
							}}
							className={`text-sm`}
						>
							{data?.type === "group" ? (
								<PeopleIcon fontSize="inherit" />
							) : (
								<PersonIcon fontSize="inherit" />
							)}
						</Avatar>
					)}
				</Badge>
			</ListItemAvatar>

			<ListItemText
				className="flex flex-col justify-center"
				primary={
					<Typography
						variant="body1"
						color="textPrimary"
						className={"capitalize font-bold"}
					>
						{state.primaryText}
					</Typography>
				}
				secondary={
					<div className="w-full flex flex-row">
						{Array.isArray(data?.typing) && (
							<Typography
								variant="body2"
								color="primary"
								className="mx-0"
							>
								{data?.typing.length > 1
									? data?.typing.length +
									  " people are typing..."
									: data?.typing.length === 1
									? data?.typing[0].first_name +
									  " is typing..."
									: ""}
							</Typography>
						)}
						{(!Array.isArray(data?.typing) ||
							data?.typing.length === 0) && (
							<div className="w-full flex flex-row items-center">
								<Typography
									variant="body2"
									color="textPrimary"
									className="font-bold mr-2"
								>
									{state.lastMessageSenderName || ""}
								</Typography>
								{!state.lastMessageDeleted && (
									<Typography
										variant="body2"
										className="flex-initial truncate mr-2 font-normal"
										sx={{
											color: theme =>
												!String.isEmpty(
													state.lastMessageContent
												)
													? theme.palette.text.primary
													: theme.palette.action
															.disabled,
										}}
									>
										{state.lastMessageContent
											? state.lastMessageContent
											: "No messages yet"}
									</Typography>
								)}
								{state.lastMessageDeleted && (
									<div
										className={
											"flex flex-row items-center flex-initial"
										}
										style={{ color: theme.palette.divider }}
									>
										<Typography
											variant="body1"
											color="inherit"
											className={"flex-grow"}
										>
											Message deleted
										</Typography>
										<BlockIcon
											className={"mx-1 text-xs"}
											fontSize="small"
										/>
									</div>
								)}

								{!state.lastMessageDeleted &&
									data?.state &&
									data?.state.last_message && (
										<div
											className={
												"flex flex-row items-center "
											}
											style={{
												color: theme.palette.text
													.disabled,
											}}
										>
											{data?.state?.last_message
												?.state === "pending" &&
												(data?.state?.last_message
													?.sender
													? data?.state.last_message
															.sender ===
															auth.user?._id ||
													  data?.state.last_message
															.sender._id ===
															auth.user?._id
													: false) && (
													<ScheduleIcon
														className={
															"mx-1 text-xs"
														}
														fontSize="small"
													/>
												)}
											{data?.state?.last_message
												?.state === "sent" &&
												data?.state.last_message
													.sender ===
													auth.user?._id && (
													<DoneIcon
														className={
															"mx-1 text-xs"
														}
														fontSize="small"
													/>
												)}
											{(data?.state?.last_message
												?.state ===
												"partially-received" ||
												data?.state.last_message
													.state === "received") &&
												(data?.state?.last_message
													?.sender ===
													auth.user?._id ||
													data?.state?.last_message
														?.sender._id ===
														auth.user
															?._id: false) && (
													<DoneAllIcon
														className={
															"mx-1 text-xs"
														}
														fontSize="small"
													/>
												)}
											{(data?.state?.last_message
												?.state === "partially-read" ||
												data?.state.last_message
													.state === "read") &&
												(data?.state?.last_message
													?.sender
													? data?.state.last_message
															.sender ===
															auth.user?._id ||
													  data?.state.last_message
															.sender._id ===
															auth.user?._id
													: false) && (
													<DoneAllIcon
														className={
															"mx-1 text-xs"
														}
														color={"secondary"}
														fontSize="small"
													/>
												)}
										</div>
									)}
							</div>
						)}
						{(!Array.isArray(data?.typing) ||
							data?.typing.length === 0) && (
							<Typography
								variant="body2"
								color="secondary"
								className="mx-2"
							>
								{/*<DoneAllIcon fontSize="inherit" />*/}
							</Typography>
						)}
					</div>
				}
			/>
			{data?.state?.incoming_unread > 0 && (
				<ListItemSecondaryAction>
					<Avatar
						className={
							"bg-transparent primary-text h-4 w-4 text-xs"
						}
					>
						{data?.state.incoming_unread}
					</Avatar>
				</ListItemSecondaryAction>
			)}
		</ListItemButton>
	)
}

export default React.forwardRef(Conversation)
