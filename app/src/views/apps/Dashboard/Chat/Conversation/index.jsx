/** @format */

import React, { useCallback, useRef, useLayoutEffect } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import Typography from "@mui/material/Typography"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { sendMessage } from "state/actions"
import Message from "./Message"
import Header from "./Header"
import MessageComposer from "./MessageComposer"
import TypingIndicator from "./TypingIndicator"
import { useDidMount, useDidUpdate, useSetState, useDeepMemo, useMark } from "hooks"
import { CellMeasurer, List, AutoSizer, CellMeasurerCache } from "react-virtualized"
import { EventRegister } from "utils"
import { useWindowSize } from "react-use"

const Conversation = props => {
	const {
		style,
		className,
		data,
		messageSize = 48,
		onMessageClick,
		onMessageContextMenu,
		canShowMessageComposer,
		fetchData,
		selected,
		...rest
	} = props
	const windowSize = useWindowSize()
	const theme = useTheme()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector(state => state.auth)
	const preferences = useSelector(state => state.app?.preferences || {})
	const canvasRef = useRef(null)
	const containerRef = useRef(null)
	const listRef = useRef(null)
	const maxMessageWidthRef = useRef(windowSize.width * 0.45)
	const fontSizeRef = useRef(
		'400 16px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
	)
	const heightsRef = useRef([])
	const lineHeightRef = useRef(16)
	const noOfMessagesRef = useRef(data.messages?.length || 0)
	const scrollToBottomRef = useRef(true)
	const scrollToTopRef = useRef(false)
	const messageHeightRef = useRef(32)
	const messageHeaderHeightRef = useRef(48)
	const messageMediaHeightRef = useRef(18 * 6)
	const messageLinkHeightRef = useRef(18 * 4)
	const cellMeasurerCache = new CellMeasurerCache({
		defaultHeight: 30,
		fixedWidth: true,
	})
	let messages = useDeepMemo(() => {
		let messagesArr = []
		if (Array.isArray(data?.messages)) {
			messagesArr = data?.messages.filter(
				message =>
					message?.conversation?._id === data._id ||
					message?.conversation === data._id ||
					(!!data.uuid && message?.conversation_uuid && message?.conversation_uuid === data.uuid)
			)
		}
		return messagesArr
	}, [data])

	const [state, setState, getState] = useSetState({
		loading: false,
		selected: -1,
		focused: -1,
		dateIndexes: [],
		typing: [],
	})

	const messageNeedsDateHeader = useCallback(
		index => {
			let needsDateHeader = false
			if (Array.isArray(data?.messages) && data.messages[index]) {
				needsDateHeader =
					index === 0 ||
					(index > 0 &&
						Date.parseFrom(data.messages[index].timestamp, new Date())?.format("Y M d") !==
							Date.parseFrom(data.messages[index - 1].timestamp, new Date())?.format("Y M d"))
			}

			return needsDateHeader
		},
		[data]
	)

	useDidUpdate(() => {
		if (noOfMessagesRef.current !== data.messages?.length) {
			noOfMessagesRef.current = data.messages?.length
		}
	}, [data.messages])

	const getRowHeight = useCallback(({ index }) => {
		if (index < messages.length) {
			return heightsRef.current[index]
		}
		return messageHeightRef.current * 2
	}, [])

	const handleOnMessageClick = useCallback(
		index => event => {
			const { messages } = getState()
			setState({
				focused: index,
			})
			if (Function.isFunction(onMessageClick)) {
				onMessageClick(event, index, messages[index])
			}
		},
		[onMessageClick]
	)
	const handleOnMessageContextMenu = useCallback(
		index => event => {
			const { messages } = getState()
			setState({
				focused: index,
			})
			if (Function.isFunction(onMessageContextMenu)) {
				onMessageContextMenu(event, index, messages[index])
			}
		},
		[onMessageContextMenu]
	)

	const handleOnMessageComposerSubmit = useCallback(
		composed_message => {
			let message_to_send = {
				...composed_message,
				conversation: data._id,
				conversation_uuid: data.uuid,
			}
			scrollToBottomRef.current = true
			dispatch(sendMessage(message_to_send))
		},
		[data]
	)

	const loadMoreMessages = useCallback((startIndex, stopIndex) => {
		console.log("loadMoreMessages startIndex", startIndex)
		console.log("loadMoreMessages stopIndex", stopIndex)
	}, [])

	const handleOnScroll = useCallback(({ clientHeight, scrollHeight, scrollTop }) => {
		const first_message_height = heightsRef.current[0]
		const last_message_height = heightsRef.current[heightsRef.current.length - 1]
		scrollToBottomRef.current =
			Math.round(scrollHeight - scrollTop) - Math.round(clientHeight) <= (last_message_height || messageHeightRef.current)
		if (!scrollToBottomRef.current) {
			scrollToTopRef.current = scrollTop <= (first_message_height || messageHeightRef.current)
		} else {
			scrollToTopRef.current = false
		}
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
								conversation={data}
								data={messages[index]}
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
		[messages]
	)

	const noRowsRenderer = useCallback(() => {
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
						<ForumOutlinedIcon fontSize="inherit" />
					</Typography>
					<Typography variant="body2" color="textSecondary" className="mx-0" sx={{ color: theme => theme.palette.text.disabled }}>
						You don't have any messages here yet
					</Typography>
				</Grid>
			</Grid>
		)
	}, [])

	const handleOnUserStartedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail || {}
			if (conversation === data._id || conversation === data.uuid) {
				scrollToBottomRef.current = true
				setState(prevState => ({
					typing: !Array.isArray(prevState.typing) ? [user] : prevState.typing.filter(entry => entry !== user).concat([user]),
				}))
			}
		},
		[data]
	)

	const handleOnUserStoppedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail || {}
			if (conversation === data._id || conversation === data.uuid) {
				setState(prevState => ({
					typing: !Array.isArray(prevState.typing) ? [] : prevState.typing.filter(entry => entry !== user),
				}))
			}
		},
		[data]
	)

	useDidMount(() => {
		const onComposeMessagingStartedListener = EventRegister.on("compose-message-started", handleOnUserStartedTyping)
		const onComposeMessagingStoppedListener = EventRegister.on("compose-message-stopped", handleOnUserStoppedTyping)

		return () => {
			onComposeMessagingStartedListener.remove()
			onComposeMessagingStoppedListener.remove()
		}
	})

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
			<Header conversation={data} typing={state.typing} />
			<div className={`flex-grow relative border-b-8 border-transparent`}>
				<AutoSizer>
					{({ height, width }) => (
						<List
							rowCount={!Array.isEmpty(state.typing) ? messages.length + 1 : messages.length}
							onScroll={handleOnScroll}
							deferredMeasurementCache={cellMeasurerCache}
							rowHeight={cellMeasurerCache.rowHeight}
							width={width}
							height={height}
							rowRenderer={rowRenderer}
							noRowsRenderer={noRowsRenderer}
							scrollToIndex={
								scrollToBottomRef.current ? (!Array.isEmpty(state.typing) ? messages.length : messages.length - 1) : -1
							}
							{...rest}
							ref={listRef}
						/>
					)}
				</AutoSizer>
				{/*!Array.isEmpty(state.typing) && <TypingIndicator className={"absolute bottom-0 left-0"} />*/}
			</div>

			<MessageComposer onSubmit={handleOnMessageComposerSubmit} className="" conversation={data} />
		</Box>
	)
}

export default React.memo(Conversation)
