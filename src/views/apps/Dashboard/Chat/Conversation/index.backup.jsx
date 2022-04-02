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
import { CellMeasurer, List, AutoSizer } from "react-virtualized"
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
	const [mark, update] = useMark()

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

	const getCanvasContextWrappedLines = (ctx, text, maxWidth) => {
		var words = text.split(" ")
		var lines = []
		var currentLine = words[0]

		for (var i = 1; i < words.length; i++) {
			var word = words[i]
			var width = ctx.measureText(currentLine + " " + word).width
			if (width < maxWidth) {
				currentLine += " " + word
			} else {
				lines.push(currentLine)
				currentLine = word
			}
		}
		lines.push(currentLine)
		return lines
	}

	const getTextWidth = (text, font) => {
		// re-use canvas object for better performance
		if (!canvasRef.current) {
			canvasRef.current = document.createElement("canvas")
		}
		// const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"))
		// const canvas = document.createElement("canvas")
		const context = canvasRef.current.getContext("2d")
		context.font = font
		const metrics = context.measureText(text)
		return metrics.width
	}

	const getTextHeight = (text, font) => {
		// re-use canvas object for better performance
		// const canvas = getTextHeight.canvas || (getTextHeight.canvas = document.createElement("canvas"))
		// const canvas = document.createElement("canvas")
		if (!canvasRef.current) {
			canvasRef.current = document.createElement("canvas")
		}

		const context = canvasRef.current.getContext("2d")
		context.font = font
		const maxWidth = maxMessageWidthRef.current - lineHeightRef.current * 3
		const wrappedLinesArr = getCanvasContextWrappedLines(context, text, maxWidth)

		return wrappedLinesArr.length * lineHeightRef.current
	}

	const getCssStyle = (element, styleProp) => {
		// return window.getComputedStyle(element, null).getPropertyValue(styleProp)
		let propValue = null
		if (window.getComputedStyle) {
			propValue = window.getComputedStyle(element, null).getPropertyValue(styleProp)
		} else if (element.currentStyle) {
			propValue = element.currentStyle[styleProp]
		}

		return propValue
	}

	const getCanvasFontSize = (el = document.body) => {
		const fontWeight = getCssStyle(el, "font-weight") || "normal"
		const fontSize = getCssStyle(el, "font-size") || "14px"
		const fontFamily = getCssStyle(el, "font-family") || "Times New Roman"

		return `${fontWeight} ${fontSize} ${fontFamily}`
	}

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

	const getHeights = useCallback(() => {
		let heightsArr = []
		if (Array.isArray(data?.messages)) {
			heightsArr = data.messages.reduce((currentHeights, message, messageIndex) => {
				let messageHeight = messageHeightRef.current
				let needsDateHeader = messageNeedsDateHeader(messageIndex)
				if (String.isString(message.content) && !String.isEmpty(message.content)) {
					if (String.containsUrl(message.content)) {
						messageHeight = messageHeight + messageLinkHeightRef.current
					}
					// let lineBreaks = message.content.match(/(\r\n|\n|\r)/gm)

					let contentTextHeight = getTextHeight(message.content, fontSizeRef.current)

					messageHeight = messageHeight + contentTextHeight
				}
				if (needsDateHeader) {
					messageHeight = messageHeight + messageHeaderHeightRef.current
				}

				if (message.type !== "text") {
					let mediaSize = messageMediaHeightRef.current
					if (message.attachments?.length > 0) {
						if (message.attachments?.length > 2) {
							mediaSize = mediaSize * 2
						}
						messageHeight = messageHeight + mediaSize
					}
				}
				currentHeights.push(messageHeight)
				return currentHeights
			}, [])
		}
		return heightsArr
	}, [data, mark])

	useDidUpdate(() => {
		if (noOfMessagesRef.current !== data.messages?.length) {
			noOfMessagesRef.current = data.messages?.length
		}
	}, [data.messages])

	useDidUpdate(() => {
		heightsRef.current = getHeights()
		update()
	}, [messages])

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
		({ data: indexData, index, ...rowProps }) => {
			const { selected, focused } = getState()
			if (index < messages.length) {
				return (
					<Message
						className={`${index == messages.length - 1 ? "border-b-8 border-transparent" : ""}`}
						conversation={data}
						data={messages[index]}
						onClick={handleOnMessageClick(index)}
						onContextMenu={handleOnMessageContextMenu(index)}
						selected={index === selected}
						focused={index === focused}
						maxContentWidth={maxMessageWidthRef.current}
						showDateHeader={messageNeedsDateHeader(index)}
						prevMessage={messages[index - 1]}
						nextMessage={messages[index + 1]}
						mediaSize={messageMediaHeightRef.current}
						headerHeight={messageHeaderHeightRef.current}
						linkHeight={messageLinkHeightRef.current}
						{...rowProps}
					/>
				)
			} else {
				return <TypingIndicator className={"absolute left-0"} {...rowProps} />
			}
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

	useDidMount(() => {
		if (!!containerRef.current) {
			// maxMessageWidthRef.current = Math.round(containerRef.current.getBoundingClientRect().width * 0.45)
			/* maxMessageWidthRef.current = Math.round(containerRef.current.getBoundingClientRect().width * 0.45)
			fontSizeRef.current = getCanvasFontSize(containerRef.current)
			lineHeightRef.current = getTextWidth("A", fontSizeRef.current) * 2
			messageHeightRef.current = lineHeightRef.current * 3
			messageHeaderHeightRef.current = lineHeightRef.current * 3
			messageMediaHeightRef.current = lineHeightRef.current * 10
			messageLinkHeightRef.current = lineHeightRef.current * 5 */
			heightsRef.current = getHeights()
			update()
		}
	})

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
				backgroundColor: theme => theme.palette.divider,
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
							rowHeight={getRowHeight}
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
