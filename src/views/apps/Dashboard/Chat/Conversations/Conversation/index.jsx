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
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import PersonIcon from "@mui/icons-material/Person"
import PeopleIcon from "@mui/icons-material/People"
import BlockIcon from "@mui/icons-material/Block"
import DoneIcon from "@mui/icons-material/Done"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import ScheduleIcon from "@mui/icons-material/Schedule"
import Icon from "@mdi/react"
import { mdiImage, mdiVolumeHigh, mdiVideo, mdiPaperclip, mdiDotsHorizontal } from "@mdi/js"
import { useDidMount, useDeepMemo, useSetState, useDidUpdate } from "hooks"
import dexieDB from "config/dexie/database"
import { useLiveQuery } from "dexie-react-hooks"

const messageTypeIcons = {
	video: mdiVideo,
	audio: mdiVolumeHigh,
	image: mdiImage,
	file: mdiPaperclip,
	// text: mdiDotsHorizontal,
}
const Conversation = React.forwardRef((props, ref) => {
	const { data, className, selected, focused, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const { SocketIO, Api: ApiService } = useNetworkServices()
	const [state, setState, getState] = useSetState({
		loading: false,
		primaryText: "",
		recipients: [],
		avatars: [],
		owner: false,
		lastMessageContent: false,
		lastMessageDeleted: false,
		lastMessageSenderName: false,
	})
	const conversationID = data?.uuid || data?._id || data

	const lastMessage = useLiveQuery(
		async () => {
			setState({ loading: true })
			let result = await dexieDB.messages
				.filter(item => item?.conversation === conversationID || item?.conversation_uuid === conversationID)
				.last()
			setState({ loading: false })
			return result
		},
		[conversationID],
		null
	)

	const unreadCount = useLiveQuery(
		() =>
			dexieDB.messages
				.where("conversation")
				.equalsIgnoreCase(conversationID)
				.or("conversation_uuid")
				.equalsIgnoreCase(conversationID)
				.and(
					item =>
						item.state === "sent" /*  || item.state === "received" || item.state === "partially-received" */ &&
						item.sender !== auth.user?._id
				)
				.count(),
		[conversationID, auth],
		0
	)

	const details = useDeepMemo(() => {
		let primaryText = ""
		let chatUser = false
		let avatar = false
		let last_message_content = false
		let last_message_deleted = false
		let last_message_sender_name = false
		if (lastMessage) {
			last_message_content = lastMessage.content
			if (lastMessage?.sender === auth.user?._id || lastMessage?.sender?._id === auth.user?._id) {
				last_message_sender_name = "You"
			} else if (data?.owner === lastMessage?.sender) {
				last_message_sender_name = data.started_by.first_name
			} else {
				if (Array.isArray(data?.participants)) {
					data?.participants.map(participant => {
						if (participant._id === lastMessage.sender) {
							last_message_sender_name = participant.first_name
						}
					})
				}
			}
			if (
				(lastMessage?.state === "deleted-for-sender" &&
					(lastMessage?.sender._id === auth.user?._id || lastMessage?.sender === auth.user?._id)) ||
				lastMessage?.state === "deleted-for-all"
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
						primaryText = data?.participants[0].first_name + " " + data?.participants[0].last_name
						avatar = data?.participants[0].avatar
					}
				}
			} else {
				if (data?.started_by) {
					chatUser = data?.started_by
					primaryText = data?.started_by?.first_name + " " + data?.started_by?.last_name
					avatar = data?.started_by?.avatar
				}
			}
		} else if (data?.type == "group") {
			primaryText = data?.group_name
			avatar = data?.group_avatar
		}
		return {
			primaryText: `${!String.isEmpty(primaryText) ? primaryText : "Unknown"}`.capitalize(),
			avatar: avatar,
			owner: chatUser,
			lastMessage: lastMessage,
			lastMessageContent: last_message_content,
			lastMessageDeleted: last_message_deleted,
			lastMessageSenderName: last_message_sender_name,
		}
	}, [data, lastMessage])

	return (
		<ListItemButton
			className={`px-8 transition transition-colors bg-transparent focus:bg-gray-300 focus:bg-opacity-10  ${
				className ? className : ""
			} ${selected ? "bg-gray-400 bg-opacity-25" : ""} ${focused ? "bg-gray-300 bg-opacity-25" : ""}`}
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
							details.owner?.presence === "online"
								? "bg-green-600"
								: details.owner?.presence == "away"
								? "bg-orange-500"
								: "hidden",
					}}
				>
					{details.avatar && (
						<Avatar
							src={ApiService.getAttachmentFileUrl(details.avatar)}
							alt={details.primaryText}
							className={`text-base`}
							sx={{
								backgroundColor: theme => theme.palette.action.selected,
								color: theme => theme.palette.text.primary,
							}}
						/>
					)}
					{!details.avatar && (
						<Avatar
							sx={{
								backgroundColor: theme => theme.palette.action.selected,
								color: theme => theme.palette.text.primary,
							}}
							className={`text-sm`}
						>
							{data?.type === "group" ? <PeopleIcon fontSize="inherit" /> : <PersonIcon fontSize="inherit" />}
						</Avatar>
					)}
				</Badge>
			</ListItemAvatar>

			<ListItemText
				className="flex flex-col justify-center"
				primary={
					<Typography variant="body1" color="textPrimary" className={"capitalize font-bold"}>
						{details.primaryText}
					</Typography>
				}
				secondary={
					<div className="w-full flex flex-row">
						{Array.isArray(data?.typing) && (
							<Typography variant="body2" color="primary" className="mx-0">
								{data?.typing.length > 1
									? data?.typing.length + " people are typing..."
									: data?.typing.length === 1
									? data?.typing[0].first_name + " is typing..."
									: ""}
							</Typography>
						)}
						{(!Array.isArray(data?.typing) || data?.typing.length === 0) && (
							<div className="w-full flex flex-row items-center">
								<Typography variant="body2" color="textPrimary" className="font-bold mr-2">
									{details.lastMessageSenderName || ""}
								</Typography>
								{!details.lastMessageDeleted && (
									<Typography
										variant="body2"
										className="flex-initial truncate mr-2 text-xs"
										sx={{
											color: theme =>
												!String.isEmpty(details.lastMessageContent)
													? theme.palette.text.primary
													: theme.palette.action.disabled,
										}}
									>
										{(details.lastMessage?.type in messageTypeIcons || state.loading) && (
											<Icon
												size={0.5}
												path={state.loading ? mdiDotsHorizontal : messageTypeIcons[details.lastMessage?.type]}
												color={theme.palette.text.disabled}
											/>
										)}
										{!state.loading && details.lastMessageContent
											? details.lastMessageContent
											: !state.loading && JSON.isEmpty(details?.lastMessage)
											? "No messages yet"
											: ""}
									</Typography>
								)}
								{details.lastMessageDeleted && (
									<div className={"flex flex-row items-center flex-initial"} style={{ color: theme.palette.divider }}>
										<Typography variant="body1" color="inherit" className={"flex-grow"}>
											Message deleted
										</Typography>
										<BlockIcon className={"mx-1 text-xs"} fontSize="small" />
									</div>
								)}

								{!details.lastMessageDeleted && details.lastMessage && (
									<div
										className={"flex flex-row items-center "}
										style={{
											color: theme.palette.text.disabled,
										}}
									>
										{details.lastMessage?.state === "pending" &&
											(details.lastMessage?.sender
												? details.lastMessage.sender === auth.user?._id ||
												  details.lastMessage.sender._id === auth.user?._id
												: false) && <ScheduleIcon className={"mx-1 text-xs"} fontSize="small" />}
										{details.lastMessage?.state === "sent" && details.lastMessage.sender === auth.user?._id && (
											<DoneIcon className={"mx-1 text-xs"} fontSize="small" />
										)}
										{(details.lastMessage?.state === "partially-received" ||
											details.lastMessage.state === "received") &&
											(details.lastMessage?.sender === auth.user?._id ||
												details.lastMessage?.sender._id === auth.user?._id) && (
												<DoneAllIcon className={"mx-1 text-xs"} fontSize="small" />
											)}
										{(details.lastMessage?.state === "partially-read" || details.lastMessage.state === "read") &&
											(details.lastMessage?.sender
												? details.lastMessage.sender === auth.user?._id ||
												  details.lastMessage.sender._id === auth.user?._id
												: false) && <DoneAllIcon className={"mx-1 text-xs"} color={"secondary"} fontSize="small" />}
									</div>
								)}
							</div>
						)}
						{(!Array.isArray(data?.typing) || data?.typing.length === 0) && (
							<Typography variant="body2" color="secondary" className="mx-2">
								{/*<DoneAllIcon fontSize="inherit" />*/}
							</Typography>
						)}
					</div>
				}
			/>
			{unreadCount > 0 && (
				<ListItemSecondaryAction>
					<Avatar className={"bg-transparent primary-text h-4 w-4 text-xs"}>{unreadCount}</Avatar>
				</ListItemSecondaryAction>
			)}
		</ListItemButton>
	)
})

export default React.memo(Conversation)
