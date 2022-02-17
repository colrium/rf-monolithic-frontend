/** @format */

import React, { useCallback, useRef, useEffect } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import InfiniteLoader from "react-window-infinite-loader"
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import Typography from "@mui/material/Typography"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { sendMessage } from "state/actions"
import Message from "./Message"
import MessageComposer from "./MessageComposer"
import { useDidMount, useDidUpdate, useSetState } from "hooks"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import List from "react-virtualized/dist/commonjs/List"

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
	const theme = useTheme()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector(state => state.auth)
	const containerRef = useRef()
	const listRef = useRef()
	const maxMessageWidthRef = useRef(100)
	const fontSizeRef = useRef(14)
	const lineHeightRef = useRef(14)
	const noOfMessagesRef = useRef(data.messages?.length || 0)
	const scrollToBottomRef = useRef(true)
	const messageHeightRef = useRef(14 * 4)
	const heightsRef = useRef([])

	const [state, setState, getState] = useSetState({
		loading: false,
		selected: -1,
		focused: -1,
		messages: [],
		dateIndexes: [],
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
		const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"))
		const context = canvas.getContext("2d")
		context.font = font
		const metrics = context.measureText(text)
		return metrics.width
	}

	const getTextHeight = (text, font) => {
		// re-use canvas object for better performance
		const canvas = getTextHeight.canvas || (getTextHeight.canvas = document.createElement("canvas"))
		// canvas.width = maxMessageWidthRef.current
		const context = canvas.getContext("2d")
		context.font = font
		const maxWidth = maxMessageWidthRef.current - lineHeightRef.current * 2.5
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

	const getMessages = useCallback(() => {
		let messages = []
		if (Array.isArray(data?.messages)) {
			messages = data?.messages.filter(
				message =>
					message?.conversation?._id === data._id ||
					message?.conversation === data._id ||
					(!!data.uuid && message?.conversation_uuid && message?.conversation_uuid === data.uuid)
			)
		}
		return messages
	}, [data])

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
		let heights = []
		if (Array.isArray(data?.messages)) {
			heights = data.messages.reduce((currentHeights, message, messageIndex) => {
				let messageHeight = messageHeightRef.current
				if (String.isString(message.content) && !String.isEmpty(message.content)) {
					if (String.containsUrl(message.content)) {
						messageHeight = messageHeight + 100
					}
					const contentTextHeight = getTextHeight(message.content, fontSizeRef.current)

					messageHeight = messageHeight + contentTextHeight
				}
				if (messageNeedsDateHeader(messageIndex)) {
					messageHeight = messageHeight + lineHeightRef.current * 2
				}
				if (message.type === "image") {
					if (message.attachments?.length > 0) {
						if (message.attachments?.length > 2) {
							messageHeight = messageHeight + lineHeightRef.current * 40
						} else {
							messageHeight = messageHeight + lineHeightRef.current * 20
						}
					}
				}
				currentHeights.push(messageHeight)
				return currentHeights
			}, [])
		}
		return heights
	}, [data, messageSize])

	useDidUpdate(() => {
		if (noOfMessagesRef.current !== data.messages?.length) {
			noOfMessagesRef.current = data.messages?.length
		}
		heightsRef.current = getHeights()
		setState({
			messages: getMessages(),
		})
	}, [data.messages])

	useDidUpdate(() => {
		console.log("scrollToBottomRef.current", scrollToBottomRef.current)
	}, [scrollToBottomRef.current])

	const getRowHeight = useCallback(({ index }) => {
		return heightsRef.current[index]
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
		const last_message_height = heightsRef.current[heightsRef.current.length - 1]
		scrollToBottomRef.current =
			Math.round(scrollHeight - scrollTop) - Math.round(clientHeight) <= (last_message_height || messageHeightRef.current)
	}, [])

	const rowRenderer = useCallback(({ data: indexData, index, ...rowProps }) => {
		const { selected, focused, messages } = getState()
		// return <div {...rowProps}>Message {index}</div>
		return (
			<Message
				conversation={data}
				data={messages[index]}
				onClick={handleOnMessageClick(index)}
				onContextMenu={handleOnMessageContextMenu(index)}
				selected={index === selected}
				focused={index === focused}
				className=""
				maxContentWidth={maxMessageWidthRef.current}
				showDateHeader={messageNeedsDateHeader(index)}
				{...rowProps}
			/>
		)
	}, [])

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
			maxMessageWidthRef.current = Math.round(containerRef.current.getBoundingClientRect().width * 0.45)
			fontSizeRef.current = getCanvasFontSize(containerRef.current)
			lineHeightRef.current = getTextWidth("A", fontSizeRef.current) * 1.75
			messageHeightRef.current = lineHeightRef.current * 4
			heightsRef.current = getHeights()
			setState({
				messages: getMessages(),
			})
		}
	})

	return (
		<Box className={`relative h-screen flex flex-col bg-transparent text-base ${className} `} ref={containerRef}>
			<div className="flex-grow">
				<AutoSizer>
					{({ height, width }) => (
						<List
							rowCount={state.messages.length}
							onScroll={handleOnScroll}
							rowHeight={getRowHeight}
							width={width}
							height={height}
							rowRenderer={rowRenderer}
							noRowsRenderer={noRowsRenderer}
							scrollToIndex={scrollToBottomRef.current ? state.messages.length - 1 : -1}
							{...rest}
							ref={listRef}
						/>
					)}
				</AutoSizer>
			</div>

			<MessageComposer onSubmit={handleOnMessageComposerSubmit} className="" conversation={data} />
		</Box>
	)
}

export default React.memo(Conversation)
