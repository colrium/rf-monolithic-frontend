/** @format */

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import classNames from "classnames"

import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PersonIcon from "@mui/icons-material/Person"
import PeopleIcon from "@mui/icons-material/People"
import ContactsIcon from "@mui/icons-material/Contacts"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import RefreshIcon from "@mui/icons-material/Refresh"
import CloseIcon from "@mui/icons-material/Close"
import { Routes, Route, useSearchParams, useLocation } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import Fab from "@mui/material/Fab"
import GridItem from "components/Grid/GridItem"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Conversations from "./Conversations"
import Conversation from "./Conversation"
import Header from "./Header"

import { useNetworkServices } from "contexts"
import * as definations from "definations"
import { connect, useDispatch, useSelector } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
import {
	apiCallRequest,
	setMessagingCache,
	setActiveConversation,
	sendMessage,
	fetchMessages,
	updateMessage,
	fetchContacts,
	fetchInbox,
	createConversation,
	getIndexOfConversation,
} from "state/actions"
import { EventRegister } from "utils"

import { useDidMount, useSetState } from "hooks"

const drawerWidth = 240

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

function Chat(props) {
	const {
		classes,
		className,
		layout,
		communication: { messaging },
		activeConversation,
		auth,
		device: { window_size },
		apiCallRequest,
		theme,
		sendMessage,
		fetchMessages,
		updateMessage,
		fetchContacts,
		fetchInbox,
		createConversation,
		...rest
	} = props

	const conversationTypingUsersRef = useRef({})
	const dispatch = useDispatch()
	const preferences = useSelector(state => state?.app?.preferences)
	const { Sockets, Api: ApiService } = useNetworkServices()
	const { conversations, active_conversation } = messaging

	const [error, setError] = useState(false)
	const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false)
	const [contextMenu, setContextMenu] = useState({
		mouseX: null,
		mouseY: null,
	})

	const [state, setState, getState] = useSetState({
		typing: {},
	})

	const active_conversation_index = getIndexOfConversation(conversations, active_conversation)
	const current_active_convesation = conversations[active_conversation_index]

	const handleOnUserStartedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail
			const { typing } = getState()
			let nextTyping = { ...typing }
			if (!Array.isArray(nextTyping[conversation])) {
				nextTyping[conversation] = []
			}
			if (nextTyping[conversation].indexOf(user) === -1) {
				nextTyping[conversation].push(user)
			}
			setState({
				typing: nextTyping,
			})
		},
		[active_conversation]
	)

	const handleOnUserStoppedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail
			const { typing } = getState()
			let nextTyping = { ...typing }

			if (!Array.isArray(nextTyping[conversation])) {
				nextTyping[conversation] = []
			}
			nextTyping[conversation] = nextTyping[conversation].filter(entry => entry !== user)
			setState({
				typing: nextTyping,
			})
		},
		[active_conversation]
	)

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

	const handleArchiveConversation = conversation => {
		dispatch(
			setMessagingCache("conversations", currentChats => {
				try {
					let newChats = JSON.parse(JSON.stringify(currentChats))

					newChats = newChats.filter(chat => {
						if (conversation) {
							if (JSON.isJSON(conversation)) {
								return chat._id !== conversation._id
							}
							return chat._id !== conversation
						}
						return true
					})

					return newChats
				} catch (err) {
					return currentChats
				}
			})
		)
	}

	const handleDeleteConversation = conversation => {
		dispatch(
			setMessagingCache("conversations", currentChats => {
				try {
					let newChats = JSON.parse(JSON.stringify(currentChats))

					newChats = newChats.filter(chat => {
						if (conversation) {
							if (JSON.isJSON(conversation)) {
								return chat._id !== conversation._id
							}
							return chat._id !== conversation
						}
						return true
					})

					return newChats
				} catch (err) {
					return currentChats
				}
			})
		)
	}

	const handleRefresh = () => {
		fetchInbox()
	}

	useDidMount(() => {
		if (current_active_convesation) {
			fetchMessages(current_active_convesation)
		}
	}, [])

	useDidMount(() => {
		const onStartTypingListener = EventRegister.on("compose-message-started", handleOnUserStartedTyping)
		const onStopTypingListener = EventRegister.on("compose-message-stopped", handleOnUserStoppedTyping)

		return () => {
			onStartTypingListener.remove()
			onStopTypingListener.remove()
		}
	})

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
			<Header typing={state.typing} />

			{!current_active_convesation && (
				<GridItem
					md={12}
					className={"p-0 relative"}
					sx={{
						height: theme => `calc(100vh - ${theme.spacing(25)})`,
						maxHeight: theme => `calc(100vh - ${theme.spacing(25)})`,
					}}
				>
					<Box
						sx={{
							height: theme => `calc(100% - ${theme.spacing(8)})`,
							paddingTop: 0,
							paddingBottom: 0,
						}}
					>
						<Conversations
							onConversationClick={(event, index, conversation) => {
								dispatch(setActiveConversation(conversation.uuid))
							}}
							onConversationContextMenu={(event, index, conversation) =>
								handleContextOpen("conversation", conversation)(event)
							}
							typing={state.typing}
						/>
					</Box>

					<AppBar
						position="absolute"
						color="secondary"
						className={"bottom-0 top-auto"}
						sx={{
							backgroundColor: theme => theme.palette.secondary,
						}}
					>
						<Toolbar className={`relative`}>
							<IconButton edge="start" color="inherit" aria-label="Refresh" onClick={handleRefresh}>
								<RefreshIcon />
							</IconButton>

							<Fab
								color="primary"
								aria-label="add"
								className={`absolute left-2/4 -top-2/4 -translate-x-2/4 -translate-y-2/4`}
								onClick={() => setContactsDrawerOpen(!contactsDrawerOpen)}
							>
								{!contactsDrawerOpen && <ChatBubbleOutlineIcon />}
								{contactsDrawerOpen && <CloseIcon />}
							</Fab>

							<div className={classes?.grow} />

							{/*<IconButton edge="end" color="inherit">
									<MoreIcon />
								</IconButton>*/}

							{/*<IconButton
									color="inherit"
									aria-label="Search"
									edge="end"

								>
									<SearchIcon />
								</IconButton>*/}
						</Toolbar>
					</AppBar>
				</GridItem>
			)}
			{!!current_active_convesation && (
				<GridItem md={12} className={"p-0 block relative flex flex-col"}>
					<Box>
						<Conversation
							onMessageClick={(event, index, message) => {}}
							onMessageContextMenu={(event, index, message) => handleContextOpen("message", message)(event)}
							data={current_active_convesation}
							canShowMessageComposer
						/>
					</Box>
				</GridItem>
			)}
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
								updateMessage({
									...contextMenu.entry,
									state: "deleted-for-sender",
									deletions: Array.isArray(contextMenu.entry.deletions)
										? contextMenu.entry.deletions.concat([auth.user?._id])
										: [auth.user?._id],
								})
								Sockets.emit("delete-message-for-user", {
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

								updateMessage({
									...contextMenu.entry,
									state: "deleted-for-all",
									deletions: current_active_convesation.recipients.concat([current_active_convesation.owner]),
								})
								Sockets.emit("delete-message-for-all", {
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
	activeConversation: undefined,
}

export default compose(
	connect(mapStateToProps, {
		apiCallRequest,
		sendMessage,
		fetchMessages,
		updateMessage,
		fetchContacts,
		fetchInbox,
		createConversation,
	}),
	withTheme
)(Chat)
