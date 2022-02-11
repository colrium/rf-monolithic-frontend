/** @format */

import React, { useCallback, useRef, useMemo } from "react"
import Box from "@mui/material/Box"
import { VariableSizeList } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import AutoSizer from "react-virtualized-auto-sizer"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { sendMessage } from "state/actions"
import Message from "./Message"
import MessageComposer from "./MessageComposer"
import { useDidMount, useDidUpdate, useSetState } from "hooks"

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
	const maxMessageWidthRef = useRef(100)
	const fontSizeRef = useRef(14)
	const lineHeightRef = useRef(14)

	const [state, setState, getState] = useSetState({
		loading: false,
		selected: -1,
		focused: -1,
		messages: [],
		heights: [],
		dateIndexes: [],
	})

	const getTextWidth = (text, font) => {
		// re-use canvas object for better performance
		const canvas =
			getTextWidth.canvas ||
			(getTextWidth.canvas = document.createElement("canvas"))
		const context = canvas.getContext("2d")
		context.font = font
		const metrics = context.measureText(text)
		return metrics.width
	}

	const getCssStyle = (element, styleProp) => {
		// return window.getComputedStyle(element, null).getPropertyValue(styleProp)
		let propValue = null
		if (window.getComputedStyle) {
			propValue = window
				.getComputedStyle(element, null)
				.getPropertyValue(styleProp)
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
					(!!data.uuid &&
						message?.conversation_uuid &&
						message?.conversation_uuid === data.uuid)
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
					Date.parseFrom(data.messages[index].timestamp).format(
						"Y M d"
					) !==
						Date.parseFrom(
							data.messages[index - 1].timestamp
						).format("Y M d")
			}

			return needsDateHeader
		},
		[data]
	)

	const getHeights = useCallback(() => {
		let heights = []
		if (Array.isArray(data?.messages)) {
			heights = data.messages.reduce(
				(currentHeights, message, messageIndex) => {
					let messageHeight = lineHeightRef.current * 4
					if (
						String.isString(message.content) &&
						!String.isEmpty(message.content)
					) {
						if (String.containsUrl(message.content)) {
							messageHeight =
								messageHeight + lineHeightRef.current * 10
						}
						const contentTextSize = getTextWidth(
							message.content,
							fontSizeRef.current
						)
						if (contentTextSize > maxMessageWidthRef.current) {
							messageHeight =
								messageHeight +
								Math.ceil(
									(contentTextSize /
										maxMessageWidthRef.current) *
										lineHeightRef.current
								) +
								lineHeightRef.current * 5
						}
					}
					if (messageNeedsDateHeader(messageIndex)) {
						messageHeight =
							messageHeight + lineHeightRef.current * 5
					}
					if (message.type === "image") {
						if (message.attachments?.length > 0) {
							if (message.attachments?.length > 2) {
								messageHeight =
									messageHeight + lineHeightRef.current * 40
							} else {
								messageHeight =
									messageHeight + lineHeightRef.current * 20
							}
						}
					}
					currentHeights.push(messageHeight)
					return currentHeights
				},
				[]
			)
		}
		return heights
	}, [data, messageSize])

	useDidUpdate(() => {
		// setState({
		// 	messages: getMessages(),
		// 	heights: getHeights(),
		// })
	}, [data?.messages])

	const getItemSize = useCallback(
		index => {
			return state.heights[index]
		},
		[state.heights]
	)

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
			console.log(
				"handleOnMessageComposerSubmit composed_message",
				composed_message
			)
			dispatch(sendMessage(composed_message, data))
		},
		[data]
	)

	const loadMoreMessages = useCallback((startIndex, stopIndex) => {}, [])

	const rowRenderer = useCallback(
		({ data: indexData, index, ...rowProps }) => {
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
		},
		[]
	)

	useDidMount(() => {
		if (!!containerRef.current) {
			maxMessageWidthRef.current = Math.round(
				containerRef.current.getBoundingClientRect().width * 0.45
			)
			fontSizeRef.current = getCanvasFontSize(containerRef.current)
			lineHeightRef.current = getTextWidth("A", fontSizeRef.current)
			setState({
				messages: getMessages(),
				heights: getHeights(),
			})
		}
	})

	return (
		<Box
			className={`relative h-screen flex flex-col bg-transparent ${className} `}
			ref={containerRef}
		>
			<div className="flex-grow">
				<InfiniteLoader
					isItemLoaded={() => true}
					itemCount={state.messages.length}
					loadMoreItems={loadMoreMessages}
					className={`bg-transparent `}
				>
					{({ onItemsRendered, ref }) => (
						<AutoSizer>
							{({ height, width }) => (
								<VariableSizeList
									height={height}
									itemCount={state.messages.length}
									onItemsRendered={onItemsRendered}
									itemSize={getItemSize}
									width={width}
									{...rest}
									ref={ref}
								>
									{itemProps => rowRenderer(itemProps)}
								</VariableSizeList>
							)}
						</AutoSizer>
					)}
				</InfiniteLoader>
			</div>

			<MessageComposer
				onSubmit={handleOnMessageComposerSubmit}
				className=""
				conversation={data}
			/>
		</Box>
	)
}

export default React.memo(Conversation)
