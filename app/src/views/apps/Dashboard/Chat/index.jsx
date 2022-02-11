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
import { Redirect, Switch, Route } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import Fab from "@mui/material/Fab"
import GridItem from "components/Grid/GridItem"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Conversations from "./Conversations"
import Conversation from "./Conversation"

import { useNetworkServices } from "contexts"
import * as definations from "definations"
import { useLocation, useHistory } from "react-router-dom"
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
} from "state/actions"
import { EventRegister } from "utils"

import { useDidMount, useWillUnmount } from "hooks"

const drawerWidth = 240

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

const AlwaysScrollToBottom = React.forwardRef((props, ref) => {
	const scrollIntoView = useCallback(() => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: "smooth" })
		}
	}, [ref.current])

	useEffect(() => {
		/*Sockets.on("message-sent", scrollIntoView);
		Sockets.on("new-message", scrollIntoView);*/
		//scrollIntoView();
		return () => {
			/*Sockets.off("message-sent", scrollIntoView);
			Sockets.off("new-message", scrollIntoView);*/
		}
	}, [])
	return <div ref={ref} />
})

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

	const textInputRef = React.createRef()
	const messagesWrapperRef = React.createRef()
	const conversationBottomRef = useRef()
	const conversationRef = useRef(null)
	const location = useLocation()
	const history = useHistory()
	const dispatch = useDispatch()
	const preferences = useSelector(state => state?.app?.preferences)
	const { Sockets, Api: ApiService } = useNetworkServices()
	const {
		conversations,
		fetching_inbox,
		active_conversation,
	} = messaging

	const [query, setQuery] = useState({ desc: "created_on" })
	const [contactsQuery, setContactsQuery] = useState({ desc: "created_on" })
	const [loadingContacts, setLoadingContacts] = useState(true)
	const [draft, setDraft] = useState({})
	const [
		individualConversationsRecipients,
		setIndividualConversationsRecipients,
	] = useState([])
	const [activeConversationRecipients, setActiveConversationRecipients] =
		useState([])
	const [error, setError] = useState(false)
	const [contacts, setContacts] = useState([])
	const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false)
	const [attachmentDialOpen, setAttachmentDialOpen] = useState(false)
	const [contextMenu, setContextMenu] = useState({
		mouseX: null,
		mouseY: null,
	})
	const [loadingActiveChatMessages, setLoadingActiveChatMessages] =
		useState(false)
	const [locationHasWith, setLocationHasWith] = useState(false)
	const [firstLoad, setFirstLoad] = useState(true)
	const [searchKeyword, setSearchKeyword] = useState(false)

	const active_conversation_index = useMemo(() => {
		let index = -1
		if (
			Array.isArray(conversations) &&
			String.isString(active_conversation) &&
			!String.isEmpty(active_conversation)
		) {
			index = conversations.findIndex(
				conversation =>
					conversation.uuid === active_conversation ||
					conversation._id === active_conversation
			)
		}
		conversationRef.current = conversations[index]
		return index
	}, [active_conversation])



	const scrollToBottomOfConversation = useCallback(() => {
		if (conversationBottomRef.current) {
			conversationBottomRef.current.scrollIntoView()
		}
	}, [conversationBottomRef])

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
		Sockets.emit("archive-conversation", {
			conversation: conversation,
			user: auth.user,
		})
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

		Sockets.emit("delete-conversation-for-user", {
			conversation: conversation,
			user: auth.user,
		})
	}

	const handleNewChat = recipients => {
		if (recipients) {
			let recipients_ids = []
			recipients = Array.isArray(recipients) ? recipients : [recipients]

			recipients.map(recipient => {
				if (JSON.isJSON(recipient) && "_id" in recipient) {
					recipients_ids.push(recipient._id)
				} else if (!String.isEmpty(recipient)) {
					recipients_ids.push(recipient)
				}
			})

			createConversation({ recipients: recipients })
				.then(new_conversation => {
					setDraft({
						is_reply: false,
						sender: auth.user,
						reply_for: null,
						type: "text",
						content: "",
						conversation: new_conversation._id,
					})
				})
				.catch(err => {})

			setContactsDrawerOpen(false)
		}
	}

	const handleRefresh = () => {
		fetchInbox()
	}

	const handlePresenceChanged = ({ user, presence }) => {
		setContacts(currentContacts => {
			try {
				let newContacts = JSON.parse(JSON.stringify(currentContacts))
				let user_id = user
				if (JSON.isJSON(user)) {
					user_id = user._id
				}
				newContacts.forEach(function (contact) {
					if (user_id === contact._id) {
						contact.presence = presence
					}
				})
				return newContacts
			} catch (err) {
				return currentContacts
			}
		})
		dispatch(
			setMessagingCache("conversations", currentChats => {
				try {
					let newChats = JSON.parse(JSON.stringify(currentChats))
					let user_id = user
					if (JSON.isJSON(user)) {
						user_id = user._id
					}
					newChats.forEach(function (chat) {
						if (chat.type === "individual") {
							let chat_owner_id = chat.owner
							if (JSON.isJSON(chat.owner)) {
								chat_owner_id = chat.owner._id
							}
							if (chat_owner_id === user_id) {
								if (JSON.isJSON(chat.owner)) {
									chat.owner.presence = presence
								}
							} else {
								if (
									Array.isArray(chat.recipients) &&
									chat.recipients.length > 0
								) {
									if (JSON.isJSON(chat.recipients[0])) {
										chat.recipients[0].presence = presence
									}
								}
							}
						}
					})
					return newChats
				} catch (err) {
					return currentChats
				}
			})
		)
	}

	const handleOnChangeDraftType = type => {
		setDraft(currentDraft => {
			try {
				let newDraft = JSON.parse(JSON.stringify(currentDraft))
				newDraft.type = type
				return newDraft
			} catch (err) {
				return currentDraft
			}
		})
	}

	const handleOnConversationMessages = ({ conversation, messages }) => {
		setLoadingActiveChatMessages(false)
		dispatch(setMessagingCache("active_conversation_messages", messages))
	}

	const handleOnConversationCreated = conversation => {}

	const getConversationMessages = (
		conversation,
		query = { desc: "created_on", p: "1", page: 1, pagination: 10 }
	) => {
		if (conversation) {
			let conversation_id = conversation._id
				? conversation._id
				: conversation
			setLoadingActiveChatMessages(true)
			dispatch(setMessagingCache("active_conversation_messages", []))
			setError(false)
			apiCallRequest(definations.messages.name, {
				uri: definations.messages.endpoint,
				type: "records",
				params: { conversation: conversation_id, ...query },
				data: {},
				cache: false,
			})
				.then(data => {
					//
					setError(false)
				})
				.catch(e => {
					let errorMsg = e
					if (JSON.isJSON(e)) {
						if ("msg" in e) {
							errorMsg = e.msg
						} else {
							errorMsg = JSON.stringify(e)
						}
					}

					setError(errorMsg)
				})
			//Sockets.emit("get-conversation-messages", {conversation: conversation._id, user: auth.user});
		} else {
			setLoadingActiveChatMessages(false)
		}
	}

	const handleOnSendMessage = (messageToSend, conversation) => {
		if (conversation) {
			let conversation_id = conversation._id
				? conversation._id
				: conversation
			let newMessage = {
				...draft,
				sender: auth.user._id,
				conversation: conversation_id,
				created_on: new Date(),
			}
			if (messageToSend) {
				if (JSON.isJSON(messageToSend)) {
					newMessage = JSON.merge(messageToSend, newMessage)
				} else if (String.isString(messageToSend)) {
					newMessage.content = messageToSend.trim()
				}
			}

			if (
				!String.isEmpty(newMessage.content) ||
				(["audio", "file", "video", "image"].includes(
					newMessage.type
				) &&
					(Array.isArray(newMessage.attachments)
						? newMessage.attachments.length > 0
						: false))
			) {
				sendMessage(newMessage)

				if (textInputRef.current) {
					textInputRef.current.value = ""
					textInputRef.current.focus()
				}

				scrollToBottomOfConversation()

				setDraft({
					is_reply: false,
					sender: auth.user,
					reply_for: null,
					type: "text",
					content: "",
					conversation: conversation_id,
				})
			}
		}
	}

	const handleMessageInputKeyDown = conversation => event => {
		if (event.key === "Enter" && conversation) {
			event.preventDefault()
			let conversation_id = conversation._id
				? conversation._id
				: conversation
			let newMessageValue = event.target.value
			if (String.isString(newMessageValue)) {
				newMessageValue = newMessageValue.trim()
			} else {
				newMessageValue = ""
			}
			if (
				!String.isEmpty(newMessageValue) ||
				(["audio", "file", "video", "image"].includes(draft.type) &&
					(Array.isArray(draft.attachments)
						? draft.attachments.length > 0
						: false))
			) {
				Sockets.emit("stopped-typing-message", {
					conversation: conversation_id,
					user: auth.user,
				})
				handleOnSendMessage(newMessageValue, conversation)
			}
		}
	}

	const handleSocketActionError = error => {
		setError("Something went wrong!. " + error)
	}

	const handleOnMessageDeletedForUser = ({ message, user }) => {
		updateMessage(message)
	}

	const handleOnMessageDeletedForAll = ({ message, user }) => {
		updateMessage(message)
	}

	const handleOnMessageStateChangedBySocketAction = ({ message, user }) => {
		updateMessage(message)
	}

	useEffect(() => {
		scrollToBottomOfConversation()
	}, [])

	useEffect(() => {
		if (conversationRef.current && firstLoad) {
			fetchMessages(conversationRef.current)
			setFirstLoad(false)
		}
	}, [conversationRef.current, firstLoad])

	useEffect(() => {
		if (location && !locationHasWith) {
			let params = new URLSearchParams(location.search)
			const withRecipient = params.get("with")
			if (!String.isEmpty(withRecipient)) {
				if (withRecipient.indexOf("@") !== -1) {
					setContactsQuery({ email_address: withRecipient.trim() })
				} else {
					setContactsQuery({ _id: withRecipient.trim() })
				}
				setLocationHasWith(true)
			}
		}
	}, [location, locationHasWith])

	useEffect(() => {}, [contactsQuery])

	useEffect(() => {
		if (Array.isArray(conversations)) {
			let newIndividualConversationsRecipients = []
			conversations.map(chat => {
				if (chat.type === "individual") {
					let chat_owner_id = chat.owner
					if (JSON.isJSON(chat.owner)) {
						chat_owner_id = chat.owner._id
					}
					if (chat_owner_id !== auth.user._id) {
						newIndividualConversationsRecipients.push(chat_owner_id)
					} else {
						if (
							Array.isArray(chat.recipients) &&
							chat.recipients.length > 0
						) {
							if (JSON.isJSON(chat.recipients[0])) {
								newIndividualConversationsRecipients.push(
									chat.recipients[0]._id
								)
							} else {
								newIndividualConversationsRecipients.push(
									chat.recipients[0]
								)
							}
						}
					}
				}
			})
			setIndividualConversationsRecipients(
				newIndividualConversationsRecipients
			)
		}
	}, [conversations])

	useDidMount(() => {
		fetchInbox()
	})

	useDidMount(() => {
		Sockets.on("presence-changed", handlePresenceChanged)
		Sockets.on("user-changed-presence", handlePresenceChanged)
		//Sockets.on("message-typing-started", handleOnUserStartedTypingMessage);
		//Sockets.on("message-typing-stopped", handleOnUserStoppedTypingMessage);
		//Sockets.on("conversation-messages", handleOnConversationMessages);
		/*Sockets.on("new-message", handleOnNewMessage);
		Sockets.on("message-sent", handleOnMessageSent);*/
		Sockets.on("messages-deleted-for-user", handleOnMessageDeletedForUser)
		Sockets.on("messages-deleted-for-all", handleOnMessageDeletedForAll)
		Sockets.on(
			"message-marked-as-received",
			handleOnMessageStateChangedBySocketAction
		)
		Sockets.on(
			"message-received",
			handleOnMessageStateChangedBySocketAction
		)
		Sockets.on(
			"message-marked-as-read",
			handleOnMessageStateChangedBySocketAction
		)
		Sockets.on("message-read", handleOnMessageStateChangedBySocketAction)
		Sockets.on(
			"delete-conversation-for-user-error",
			handleSocketActionError
		)
		Sockets.on("delete-message-for-user-error", handleSocketActionError)
		Sockets.on("delete-message-for-all-error", handleSocketActionError)
	})

	useWillUnmount(() => {
		Sockets.off("presence-changed", handlePresenceChanged)
		Sockets.off("user-changed-presence", handlePresenceChanged)
		//Sockets.off("conversation-messages", handleOnConversationMessages);
		/*Sockets.off("new-message", handleOnNewMessage);
		Sockets.off("message-sent", handleOnMessageSent);*/
		Sockets.off("messages-deleted-for-user", handleOnMessageDeletedForUser)
		Sockets.off("messages-deleted-for-all", handleOnMessageDeletedForAll)
		Sockets.off(
			"delete-conversation-for-user-error",
			handleSocketActionError
		)
		Sockets.off(
			"message-marked-as-received",
			handleOnMessageStateChangedBySocketAction
		)
		Sockets.off(
			"message-received",
			handleOnMessageStateChangedBySocketAction
		)
		Sockets.off(
			"message-marked-as-read",
			handleOnMessageStateChangedBySocketAction
		)
		Sockets.off("message-read", handleOnMessageStateChangedBySocketAction)
		Sockets.off("delete-message-for-user-error", handleSocketActionError)
		Sockets.off("delete-message-for-all-error", handleSocketActionError)
		Sockets.off("create-conversation-error", handleSocketActionError)
		EventRegister.emit("clear-selections")
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
			<AppBar position="relative" className={""}>
				<Toolbar>
					{active_conversation_index !== -1 && (
						<IconButton
							onClick={() => {
								if (history && locationHasWith) {
									history.push(history.location.pathname)
								}
								dispatch(setActiveConversation(null))
							}}
							className={"mr-2"}
							edge="start"
							color="inherit"
							aria-label="back-to-conversations"
						>
							<ArrowBackIcon />
						</IconButton>
					)}
					{!!conversationRef.current &&
						(conversationRef.current.type == "individual" ? (
							(auth.user._id ===
								conversationRef.current.owner._id ||
								auth.user._id ===
									conversationRef.current.owner) &&
							Array.isArray(
								conversationRef.current.participants
							) &&
							conversationRef.current.participants.length > 0 &&
							conversationRef.current.participants[0].avatar ? (
								<Avatar
									className={"mr-6 w-6 h-6"}
									src={ApiService.getAttachmentFileUrl(
										conversationRef.current.participants[0]
											.avatar
									)}
								/>
							) : conversationRef.current.started_by &&
							  conversationRef.current.started_by.avatar ? (
								<Avatar
									className={"mr-6 w-6 h-6"}
									src={ApiService.getAttachmentFileUrl(
										conversationRef.current.started_by
											.avatar
									)}
								/>
							) : (
								<Avatar
									className={
										"mr-2 w-6 h-6 bg-transparent accent-text"
									}
								>
									<PersonIcon />
								</Avatar>
							)
						) : conversationRef.current.group_avatar ? (
							<Avatar
								className={"mr-6"}
								src={ApiService.getAttachmentFileUrl(
									conversationRef.current.group_avatar
								)}
							/>
						) : (
							<Avatar
								className={
									"mr-6 w-6 h-6 bg-transparent accent-text"
								}
							>
								{" "}
								{conversationRef.current.type === "group" ? (
									<PeopleIcon />
								) : (
									<PersonIcon />
								)}
							</Avatar>
						))}
					{!!conversationRef.current && (
						<Typography
							variant="h6"
							className={"capitalize flex-grow"}
						>
							{conversationRef.current.type == "individual"
								? (auth.user._id ===
										conversationRef.current.owner._id ||
										auth.user._id ===
											conversationRef.current.owner) &&
								  Array.isArray(
										conversationRef.current.participants
								  ) &&
								  conversationRef.current.participants.length >
										0
									? conversationRef.current.participants[0]
											.first_name +
									  " " +
									  conversationRef.current.participants[0]
											.last_name
									: conversationRef.current.started_by
									? conversationRef.current.started_by
											.first_name +
									  " " +
									  conversationRef.current.started_by
											.last_name
									: ""
								: conversationRef.current.type == "group"
								? conversationRef.current.group_name
								: "Realfield"}
						</Typography>
					)}

					{!conversationRef.current && (
						<Typography
							variant="h6"
							className={"capitalize flex-grow"}
						>
							Conversations
						</Typography>
					)}

					{!conversationRef.current && !contactsDrawerOpen && (
						<IconButton
							onClick={() => setContactsDrawerOpen(true)}
							className={"mr-2"}
							edge="end"
							color="inherit"
							aria-label="Contacts"
						>
							<ContactsIcon />
						</IconButton>
					)}
				</Toolbar>
			</AppBar>

			{!conversationRef.current && (
				<GridItem md={12} className={"p-0 relative h-screen"}>
					<Box
						sx={{
							height: theme => `calc(100% - ${theme.spacing(8)})`,
							paddingTop: 0,
							paddingBottom: 0,
						}}
					>
						<Conversations
							onConversationClick={(
								event,
								index,
								conversation
							) => {
								dispatch(
									setActiveConversation(conversation.uuid)
								)
							}}
							onConversationContextMenu={(
								event,
								index,
								conversation
							) =>
								handleContextOpen(
									"conversation",
									conversation
								)(event)
							}
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
							<IconButton
								edge="start"
								color="inherit"
								aria-label="Refresh"
								onClick={handleRefresh}
							>
								<RefreshIcon />
							</IconButton>

							<Fab
								color="primary"
								aria-label="add"
								className={`absolute left-2/4 -top-2/4 -translate-x-2/4 -translate-y-2/4`}
								onClick={() =>
									setContactsDrawerOpen(!contactsDrawerOpen)
								}
							>
								{!contactsDrawerOpen && (
									<ChatBubbleOutlineIcon />
								)}
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

			{!!conversationRef.current && (
				<GridItem md={12} className={"p-0 block relative flex flex-col h-screen"}>
					<Box
						sx={{
							paddingTop: 0,
							paddingBottom: 0,
							backgroundColor: theme => theme.palette.divider,
							backgroundImage: `url("/img/${
								preferences?.theme?.theme === "dark"
									? "chat-bg-dark.jpg"
									: "chat-bg.jpg"
							}") !important`,
						}}
					>
						<Conversation
							onMessageClick={(event, index, message) => {}}
							onMessageContextMenu={(event, index, message) =>
								handleContextOpen("message", message)(event)
							}
							data={conversationRef.current}
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
							dispatch(
								setActiveConversation(contextMenu?.entry?.uuid)
							)
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
					contextMenu.entry.sender._id !== auth.user._id &&
					contextMenu.entry.sender !== auth.user._id && (
						<MenuItem
							onClick={event => {
								handleContextClose(event)
								setDraft({
									is_reply: true,
									sender: auth.user,
									reply_for: contextMenu.entry,
									content: "",
									conversation: conversationRef.current._id,
								})
								if (textInputRef.current) {
									textInputRef.current.value = ""
									textInputRef.current.focus()
								}
							}}
						>
							Reply Message
						</MenuItem>
					)}
				{contextMenu.type === "message" &&
					(contextMenu.entry.sender._id === auth.user._id ||
						contextMenu.entry.sender === auth.user._id) && (
						<MenuItem
							onClick={event => {
								handleContextClose(event)
								updateMessage({
									...contextMenu.entry,
									state: "deleted-for-sender",
									deletions: Array.isArray(
										contextMenu.entry.deletions
									)
										? contextMenu.entry.deletions.concat([
												auth.user._id,
										  ])
										: [auth.user._id],
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
					(contextMenu.entry.sender._id === auth.user._id ||
						contextMenu.entry.sender === auth.user._id) && (
						<MenuItem
							onClick={event => {
								handleContextClose(event)

								updateMessage({
									...contextMenu.entry,
									state: "deleted-for-all",
									deletions:
										conversationRef.current.recipients.concat(
											[conversationRef.current.owner]
										),
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
				<Snackbar
					open={Boolean(error)}
					autoHideDuration={10000}
					onClose={() => setError(false)}
				>
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
