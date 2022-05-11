/** @format */

import React, { useCallback, useRef, useLayoutEffect } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import Typography from "@mui/material/Typography"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { sendMessage, ensureMessage, fetchMessages } from "state/actions"
import Message from "./Message"
import Header from "./Header"
import MessageComposer from "./MessageComposer"
import TypingIndicator from "./TypingIndicator"
import { useDidMount, useDidUpdate, useSetState, useDeepMemo, useMark } from "hooks"
import { CellMeasurer, List, AutoSizer, CellMeasurerCache, ScrollSync } from "react-virtualized"
import { EventRegister } from "utils"
import { useWindowSize } from "react-use"
import { useNetworkServices } from "contexts"
import { onMessages, database as dexieDB } from "config/dexie"
import { useLiveQuery } from "dexie-react-hooks"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import CircularProgress from "@mui/material/CircularProgress"

const Conversation = props => {
	const {
		style,
		className,
		conversation,
		messageSize = 48,
		onMessageClick,
		onMessageContextMenu,
		canShowMessageComposer,
		fetchData,
		selected,
		...rest
	} = props

	const theme = useTheme()
	const dispatch = useDispatch()
	const { user } = useSelector(state => state.auth)
	const active_conversation = useSelector(state => state.communication?.messaging?.active_conversation)
	const preferences = useSelector(state => state.app?.preferences || {})

	const [state, setState, getState] = useSetState({
		loading: false,
		loaded: true,
		selected: -1,
		focused: -1,
		dateIndexes: [],
		typing: [],
		contextMenu: { mouseX: null, mouseY: null },
	})

	const messages = useLiveQuery(
		async () => {
			let results = []
			setState({ loading: true })
			try {
				results = await dexieDB.messages
					.where("conversation")
					.equalsIgnoreCase(active_conversation || "")
					.or("conversation_uuid")
					.equalsIgnoreCase(active_conversation || "")
					.toArray()
			} catch (error) {}
			if (results?.length > 1) {
				results = results.sort((a, b) => Date.parseFrom(a.timestamp || a.created_on) - Date.parseFrom(b.timestamp || b.created_on))
			}

			setState({ loading: false, loaded: true })
			return results
		},
		[active_conversation],
		[]
	)

	const containerRef = useRef(null)
	const replyForRef = useRef(null)
	const listRef = useRef(null)
	const conversationRef = useRef(conversation)
	const { SocketIO, Api } = useNetworkServices()
	const heightsRef = useRef([])
	const scrollToAlignmentRef = useRef("end")
	const scrollToBottomRef = useRef(true)
	const scrollToTopRef = useRef(false)
	const messageHeightRef = useRef(32)
	const messageHeaderHeightRef = useRef(48)
	const messageMediaHeightRef = useRef(250)
	const messageLinkHeightRef = useRef(18 * 4)
	const cellMeasurerCache = new CellMeasurerCache({
		defaultHeight: 30,
		fixedWidth: true,
	})

	const messageNeedsDateHeader = useCallback(
		index => {
			let needsDateHeader = false
			if (Array.isArray(messages) && messages[index]) {
				needsDateHeader =
					index === 0 ||
					(index > 0 &&
						Date.parseFrom(messages[index].timestamp, new Date())?.format("Y M d") !==
							Date.parseFrom(messages[index - 1].timestamp, new Date())?.format("Y M d"))
			}

			return needsDateHeader
		},
		[messages]
	)

	const getRowHeight = useCallback(({ index }) => {
		if (index < messages.length) {
			return heightsRef.current[index]
		}
		return messageHeightRef.current * 2
	}, [])

	const handleOnMessageClick = useCallback(
		index => event => {
			setState({
				focused: index,
			})
			if (Function.isFunction(onMessageClick)) {
				onMessageClick(event, index, messages[index])
			}
		},
		[onMessageClick, messages]
	)
	const handleOnMessageContextMenu = useCallback(
		index => event => {
			event.preventDefault()
			const entry = messages[index]
			setState({
				focused: index,
			})

			setState({
				focused: index,
				contextMenu: {
					entry: entry,
					mouseX: event.clientX - 2,
					mouseY: event.clientY - 4,
					open: true,
				},
			})
		},
		[messages]
	)

	const handleContextClose = () => {
		setState({ contextMenu: { mouseX: null, mouseY: null, open: false } })
	}

	const handleOnMessageComposerSubmit = useCallback(composed_message => {
		let message_to_send = {
			...composed_message,
			conversation: conversationRef.current._id,
			conversation_uuid: conversationRef.current.uuid,
		}
		scrollToBottomRef.current = true
		dispatch(sendMessage(message_to_send))
	}, [])

	const loadMoreMessages = useCallback((startIndex, stopIndex) => {

	}, [])

	const handleOnScroll = useCallback(({ clientHeight, scrollHeight, scrollTop }) => {
		// const first_message_height = heightsRef.current[0]
		// const last_message_height = heightsRef.current[heightsRef.current.length - 1]
		// scrollToBottomRef.current =
		// 	Math.round(scrollHeight - scrollTop) - Math.round(clientHeight) <= (last_message_height || messageHeightRef.current)
		// if (!scrollToBottomRef.current) {
		// 	scrollToTopRef.current = scrollTop <= (first_message_height || messageHeightRef.current)
		// 	scrollToAlignmentRef.current = scrollToTopRef.current ? "start" : "auto"
		// } else {
		// 	scrollToAlignmentRef.current = "end"
		// 	scrollToTopRef.current = false
		// }
	}, [])

	const rowRenderer = useCallback(
		({ data: indexData, index, isScrolling, key, parent, style }) => {
			const { selected, focused } = getState()
			return (
				<CellMeasurer cache={cellMeasurerCache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
					{({ measure, registerChild }) =>
						index < messages.length ? (
							<Message
								className={`${index == messages.length - 1 ? "border-b-8 border-transparent" : ""}`}
								conversation={conversation}
								index={index}
								message={messages[index]}
								onClick={handleOnMessageClick(index)}
								onContextMenu={handleOnMessageContextMenu(index)}
								selected={index === selected}
								focused={index === focused}
								showDateHeader={messageNeedsDateHeader(index)}
								prevMessage={messages[index - 1]}
								nextMessage={messages[index + 1]}
								mediaSize={messageMediaHeightRef.current}
								headerHeight={messageHeaderHeightRef.current}
								linkHeight={messageLinkHeightRef.current}
								ref={registerChild}
								style={style}
								onLoad={measure}
							/>
						) : (
							<TypingIndicator className={"absolute left-0 pb-8 pt-4"} style={style} ref={registerChild} onLoad={measure} />
						)
					}
				</CellMeasurer>
			)
			// return <div {...rowProps}>Message {index}</div>
		},
		[messages, conversation, cellMeasurerCache]
	)

	const noRowsRenderer = useCallback(() => {
		const { loading } = getState()
		return (
			<Grid container spacing={2} className="flex flex-col items-center justify-center h-full">
				<Grid item md={12} className={"flex flex-col items-center relative p-0 px-4 my-4 justify-center h-full"}>
					<Typography
						variant="subtitle1"
						color="textSecondary"
						className="mx-0 my-12 h-20 w-20 md:w-40  md:h-40 rounded-full text-4xl md:text-6xl flex flex-row items-center justify-center"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme => theme.palette.background.paper,
						}}
					>
						{loading ? <CircularProgress /> : <ForumOutlinedIcon fontSize="inherit" />}
					</Typography>
					<Typography variant="body2" color="textSecondary" className="mx-0" sx={{ color: theme => theme.palette.text.disabled }}>
						{loading ? `Loading` : `You don't have any messages here yet`}
					</Typography>
				</Grid>
			</Grid>
		)
	}, [])

	const handleOnUserStartedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail || {}
			if (event.detail?.conversation === conversation._id || event.detail?.conversation === conversation.uuid) {
				scrollToBottomRef.current = true
				setState(prevState => ({
					typing: !Array.isArray(prevState.typing) ? [user] : prevState.typing.filter(entry => entry !== user).concat([user]),
				}))
			}
		},
		[conversation]
	)

	const handleOnUserStoppedTyping = useCallback(
		event => {
			const { user } = event.detail || {}
			if (event.detail?.conversation === conversation._id || event.detail?.conversation === conversation.uuid) {
				setState(prevState => ({
					typing: !Array.isArray(prevState.typing) ? [] : prevState.typing.filter(entry => entry !== user),
				}))
			}
		},
		[conversation]
	)

	const handleOnDeleteMessageForAll = useCallback(
		event => {
			const { contextMenu } = getState()
			handleContextClose(event)
			const updatedMessage = {
				...contextMenu.entry,
				state: "deleted-for-all",
				deletions: conversationRef.current.recipients.concat([conversationRef.current.owner]),
			}
			dispatch(ensureMessage(updatedMessage))
			SocketIO.emit("delete-message-for-all", {
				message: updatedMessage?._id || updatedMessage?.uuid,
				user: user,
			})
		},
		[user]
	)

	const handleOnDeleteMessageForUser = useCallback(
		event => {
			const { contextMenu } = getState()

			handleContextClose(event)
			const updatedMessage = {
				...contextMenu.entry,
				state: "deleted-for-sender",
				deletions: Array.isArray(state.contextMenu.entry?.deletions)
					? state.contextMenu?.entry?.deletions?.concat([user?._id])
					: [user?._id],
			}
			handleContextClose(event)
			dispatch(ensureMessage(updatedMessage))
			SocketIO.emit("delete-message-for-user", {
				message: updatedMessage.entry?._id || updatedMessage.entry?.uuid,
				user: user,
			})
		},
		[user]
	)

	const markAllMessagesAsRead = useCallback(async () => {
		const conversationID = conversation?.uuid || conversation?._id || conversation
		const conversationUUID = conversation?.uuid || conversation?._id || conversation
		const userID = user?._id

		if (!String.isEmpty(userID) && (!String.isEmpty(conversationID) || !String.isEmpty(conversationUUID))) {
			const unreadMessages = await dexieDB.messages
				.filter(
					item =>
						(item?.conversation === conversationID ||
							item?.conversation === conversationUUID ||
							(item?.conversation_uuid &&
								(item?.conversation_uuid === conversationID || item?.conversation_uuid === conversationUUID))) &&
						item?.sender !== userID &&
						(item.state === "sent" || item.state === "received" || item.state === "partially-received")
				)
				.toArray()

			if (Array.isArray(unreadMessages) && unreadMessages.length > 0) {
				let updatedUnreadMessages = unreadMessages.reduce((acc, unreadMessage) => {
					SocketIO.emit("mark-message-as-received", {
						message: unreadMessage._id,
					})
					// dispatch(ensureMessage({ ...unreadMessage, state: "received" }, false))
					acc.push({ ...unreadMessage, state: "received" })
					return acc
				}, [])

			}
		}
	}, [conversation, user])

	const getCount = useCallback(() => {
		const { loading, typing, loaded } = getState()
		let count = messages?.length
		if (loading && !loaded) {
			count = 0
		} else if (typing?.length > 0) {
			count = (messages?.length || 0) + 1
		}
		return count
	}, [messages])

	useDidMount(() => {
		const onComposeMessagingStartedListener = EventRegister.on("compose-message-started", handleOnUserStartedTyping)
		const onComposeMessagingStoppedListener = EventRegister.on("compose-message-stopped", handleOnUserStoppedTyping)
		markAllMessagesAsRead()

		return () => {
			onComposeMessagingStartedListener.remove()
			onComposeMessagingStoppedListener.remove()
		}
	})

	useDidUpdate(() => {
		replyForRef.current = null
		markAllMessagesAsRead()
	}, [conversation?.uuid, conversation?._id, messages.length])

	useDidUpdate(() => {
		conversationRef.current = conversation
	}, [conversation])

	useDidUpdate(() => {
		setState({ loaded: false })
	}, [active_conversation])

	useDidUpdate(() => {
		if (scrollToBottomRef.current && !!listRef.current && Array.isArray(messages) && messages.length > 0) {
			// listRef.current.scrollToRow(messages.length)
			const scrollToPosition = listRef.current.getOffsetForRow({ alignment: "end", index: messages.length })
			listRef.current.scrollToPosition(scrollToPosition)
		}
		return () => {}
	}, [messages.length])

	return (
		<Box
			className={`relative flex flex-col bg-transparent text-base ${className} `}
			sx={{
				paddingTop: 0,
				paddingBottom: 0,
				backgroundColor: theme => `${theme.palette.action.disabledBackground} !important`,
				backgroundImage: `url("/img/${preferences?.theme === "dark" ? "chat-bg-dark.jpg" : "chat-bg.jpg"}") !important`,
				height: theme => `calc(100vh - ${theme.spacing(14)})`,
				maxHeight: theme => `calc(100vh - ${theme.spacing(14)})`,
			}}
			ref={containerRef}
		>
			{state.loaded && <Header conversation={conversation} typing={state.typing} />}
			{Array.isArray(messages) && (
				<div className={`flex-grow relative border-b-8 border-transparent`}>
					<AutoSizer>
						{({ height, width }) => (
							<List
								rowCount={getCount()}
								onScroll={handleOnScroll}
								rowHeight={cellMeasurerCache.rowHeight}
								width={width}
								height={height}
								rowRenderer={rowRenderer}
								noRowsRenderer={noRowsRenderer}
								overscanRowCount={2}
								{...rest}
								ref={listRef}
							/>
						)}
					</AutoSizer>
				</div>
			)}

			{state.loaded && <MessageComposer onSubmit={handleOnMessageComposerSubmit} conversation={conversation} />}
			<Menu
				keepMounted={true}
				open={state.contextMenu?.open}
				onClose={handleContextClose}
				anchorReference="anchorPosition"
				anchorPosition={state.contextMenu.open ? { top: state.contextMenu.mouseY, left: state.contextMenu.mouseX } : undefined}
			>
				{state.contextMenu.entry?.sender?._id !== user?._id && state.contextMenu?.entry?.sender !== user?._id && (
					<MenuItem
						onClick={event => {
							replyForRef.current = state.contextMenu?.entry
							handleContextClose(event)
						}}
					>
						Reply Message
					</MenuItem>
				)}

				{(state.contextMenu?.entry?.sender?._id === user?._id || state.contextMenu?.entry?.sender === user?._id) && (
					<MenuItem onClick={handleOnDeleteMessageForUser}>Delete For Me</MenuItem>
				)}
				{(state.contextMenu?.entry?.sender?._id === user?._id || state.contextMenu?.entry?.sender === user?._id) &&
					state.contextMenu?.entry?.state !== "read" && <MenuItem onClick={handleOnDeleteMessageForAll}>Delete For All</MenuItem>}
			</Menu>
		</Box>
	)
}

export default React.memo(Conversation)
