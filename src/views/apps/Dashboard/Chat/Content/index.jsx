/** @format */

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import classNames from "classnames"

import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"

import Conversation from "../Conversation"

import { useNetworkServices } from "contexts"
import { connect, useDispatch, useSelector } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
import { Routes, Route } from "react-router-dom"
import {
	apiCallRequest,
	setMessagingCache,
	setActiveConversation,
	sendMessage,
	fetchMessages,
	ensureMessage,
	fetchContacts,
	fetchInbox,
	createConversation,
	getIndexOfConversation,
} from "state/actions"
import { EventRegister } from "utils"
import { useDidMount, useSetState, useDidUpdate } from "hooks"
import { useTheme } from "@mui/material/styles"
import dexieDB from "config/dexie/database"
import { useLiveQuery } from "dexie-react-hooks"

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

function Chat(props) {
	const {
		classes,
		className,
		layout,
		communication: { messaging },
		auth,
		device: { window_size },
		apiCallRequest,
		sendMessage,
		fetchMessages,
		ensureMessage,
		fetchContacts,
		fetchInbox,
		createConversation,
		...rest
	} = props

	const theme = useTheme()

	const dispatch = useDispatch()
	const { SocketIO, Api: ApiService } = useNetworkServices()
	const active_conversation = useSelector(state => state.communication?.messaging?.active_conversation)
	const conversations = useLiveQuery(() => dexieDB.conversations.toArray())
	const [state, setState] = useSetState({
		drawerContentType: "conversations",
		drawerOpen: true,
	})
	const [error, setError] = useState(false)
	const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false)
	const [contextMenu, setContextMenu] = useState({
		mouseX: null,
		mouseY: null,
	})
	const messages = useLiveQuery(() =>
		dexieDB.messages
			.where("conversation")
			.equalsIgnoreCase(active_conversation || "")
			.or("conversation_uuid")
			.equalsIgnoreCase(active_conversation || "")
			.toArray()
	)

	const active_conversation_index = getIndexOfConversation(conversations, active_conversation)
	const conversation = Array.isArray(conversations) ? conversations[active_conversation_index] : null

	const handleContextOpen = (type, entry) => event => {
		event.preventDefault()
		setContextMenu(prevContextMenu => ({
			type: type,
			entry: entry,
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		}))
	}

	const handleContextClose = () => {
		setContextMenu({ mouseX: null, mouseY: null })
		EventRegister.emit("clear-conversation-selection")
	}

	const handleArchiveConversation = conversation => {}

	const handleDeleteConversation = conversation => {}
	useDidUpdate(() => {
		if (conversation?._id || conversation?.uuid) {
			fetchMessages(conversation)
		}
	}, [conversation?.uuid, conversation?._id])
	useDidMount(() => {
		if (conversation?._id || conversation?.uuid) {
			fetchMessages(conversation)
		}
	}, [conversation?.uuid, conversation?._id])

	return (
		<Paper
			className={classNames({
				"p-0 m-0 relative overflow-x-hidden overflow-y-visible ": true,
				[className]: !!className,
			})}
			onClick={event => {
				if (contextMenu?.mouseX > 0 || contextMenu?.mouseY > 0) {
					event.preventDefault()
					handleContextClose()
				}
			}}
			onContextMenu={event => {
				if (contextMenu?.mouseX > 0 || contextMenu?.mouseY > 0) {
					event.stopPropagation()
					handleContextClose()
				}
			}}
		>
			<Box className="flex flex-row w-full" sx={{ height: theme => `calc(100vh - ${theme.spacing(20)})` }}>
				<Box className={"p-0 flex-1 relative"}>
					{!!conversation ? (
						<Box className={"p-0 relative flex flex-col h-full"}>
							<Conversation
								onMessageClick={(event, index, message) => {}}
								onMessageContextMenu={(event, index, message) => handleContextOpen("message", message)(event)}
								conversation={conversation}
								messages={messages}
								canShowMessageComposer
							/>
						</Box>
					) : (
						<Grid container spacing={2} className="flex flex-col items-center justify-center h-full">
							<Grid item md={12} className={"flex flex-col items-center relative p-0 px-4 my-4 justify-center h-full"}>
								<span data-testid="intro-md-beta-logo-light">
									<img src={`${process.env.PUBLIC_URL}/img/svg/empty-conversations-state.svg`} alt="Web Conversations" />
								</span>
								<Typography color="textSecondary" className="mx-0 mt-12 text-lg">
									Messaging Web
								</Typography>
								<Typography color="textSecondary" variant="body2" className="mx-0 mt-4 text-xs">
									Select or start a conversation to start sending messages via web
								</Typography>
							</Grid>
						</Grid>
					)}
				</Box>
			</Box>

			<Menu
				keepMounted
				open={contextMenu.mouseY !== null}
				onClose={handleContextClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu.mouseY !== null && contextMenu.mouseX !== null
						? { top: contextMenu.mouseY, left: contextMenu.mouseX }
						: undefined
				}
			>
				{contextMenu.type === "conversation" && (
					<MenuItem
						onClick={event => {
							dispatch(setActiveConversation(contextMenu?.entry?.uuid))
							handleContextClose(event)
						}}
					>
						Open Conversation
					</MenuItem>
				)}
				{contextMenu.type === "conversation" && (
					<MenuItem
						onClick={event => {
							handleArchiveConversation(contextMenu.entry)
							handleContextClose(event)
						}}
					>
						Archive Conversation
					</MenuItem>
				)}
				{contextMenu.type === "conversation" && (
					<MenuItem
						onClick={event => {
							handleDeleteConversation(contextMenu.entry)
							handleContextClose(event)
						}}
					>
						Delete Conversation
					</MenuItem>
				)}

				{contextMenu.type === "message" &&
					contextMenu.entry.sender._id !== auth.user?._id &&
					contextMenu.entry.sender !== auth.user?._id && (
						<MenuItem
							onClick={event => {
								handleContextClose(event)
							}}
						>
							Reply Message
						</MenuItem>
					)}
				{contextMenu.type === "message" &&
					(contextMenu.entry.sender._id === auth.user?._id || contextMenu.entry.sender === auth.user?._id) && (
						<MenuItem
							onClick={event => {
								handleContextClose(event)
								ensureMessage({
									...contextMenu.entry,
									state: "deleted-for-sender",
									deletions: Array.isArray(contextMenu.entry.deletions)
										? contextMenu.entry.deletions.concat([auth.user?._id])
										: [auth.user?._id],
								})
								SocketIO.emit("delete-message-for-user", {
									message: contextMenu.entry,
									user: auth.user,
								})
							}}
						>
							Delete For Me
						</MenuItem>
					)}

				{contextMenu.type === "message" &&
					(contextMenu.entry.sender._id === auth.user?._id || contextMenu.entry.sender === auth.user?._id) && (
						<MenuItem
							onClick={event => {
								handleContextClose(event)

								ensureMessage({
									...contextMenu.entry,
									state: "deleted-for-all",
									deletions: conversation.recipients.concat([conversation.owner]),
								})
								SocketIO.emit("delete-message-for-all", {
									message: contextMenu.entry,
									user: auth.user,
								})
							}}
						>
							Delete For All
						</MenuItem>
					)}
			</Menu>
			{error && (
				<Snackbar open={Boolean(error)} autoHideDuration={10000} onClose={() => setError(false)}>
					<Alert onClose={() => setError(false)} severity="error">
						{error}
					</Alert>
				</Snackbar>
			)}
		</Paper>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
	communication: state.communication,
	device: state.device,
})

Chat.defaultProps = {
	layout: "full",
	firstView: "conversations",
}

export default compose(
	connect(mapStateToProps, {
		apiCallRequest,
		sendMessage,
		fetchMessages,
		ensureMessage,
		fetchContacts,
		fetchInbox,
		createConversation,
	}),
	withTheme
)(Chat)
