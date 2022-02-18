/** @format */

import React, { useCallback, useRef } from "react"
import { FixedSizeList } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import AutoSizer from "react-virtualized-auto-sizer"
import { useSelector, useDispatch } from "react-redux"
import InboxIcon from "@mui/icons-material/Inbox"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
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
import { useDidMount, useWillUnmount, useSetState } from "hooks"
import Conversation from "./Conversation"

const Conversations = props => {
	const { fetchData, className, onConversationClick, onConversationContextMenu, typing, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector(state => state.auth)
	const conversations = useSelector(
		state => state.communication.messaging.conversations
	)
	const [state, setState, getState] = useSetState({
		loading: Boolean(fetchData),
		selected: -1,
		focused: -1,
	})
	const itemSizeRef = useRef(62)
	const onUnselectEventRef = useRef(null)

	const loadMoreConversations = useCallback((startIndex, stopIndex) => {}, [])

	const handleOnConversationClick = useCallback(
		index => event => {
			setState({
				focused: index,
			})
			if (Function.isFunction(onConversationClick)) {
				onConversationClick(event, index, conversations[index])
			}
		},
		[onConversationClick, conversations]
	)
	const handleOnConversationContextMenu = useCallback(
		index => event => {
			setState({
				focused: index,
			})
			if (Function.isFunction(onConversationContextMenu)) {
				onConversationContextMenu(event, index, conversations[index])
			}
		},
		[onConversationContextMenu, conversations]
	)

	const rowRenderer = useCallback(
		({ data, index, ...rowProps }) => {
			const { selected, focused } = getState()
			// console.log("data", data)
			return (
				<Conversation
					data={conversations[index]}
					onClick={handleOnConversationClick(index)}
					onContextMenu={handleOnConversationContextMenu(index)}
					selected={index === selected}
					focused={index === focused}
					{...rowProps}
				/>
			)
		},
		[conversations]
	)

	useDidMount(() => {
		let itemSize = `${theme.spacing(7.5)}`.replace("px", "")
		itemSize = parseInt(itemSize)

		if (itemSize > 0) {
			itemSizeRef.current = itemSize
		}

		onUnselectEventRef.current = EventRegister.on(
			"clear-conversation-selection",
			event => {
				console.log("clear-conversation-selection called event", event)
				setState({
					focused: -1,
				})
			}
		)
	})

	useWillUnmount(() => {
		if (Function.isFunction(onUnselectEventRef.current?.remove)) {
			onUnselectEventRef.current.remove()
		}
	})

	if (!conversations?.length || conversations?.length === 0) {
		return (
			<Grid
				container
				spacing={2}
				className="flex flex-col items-center justify-center h-full"
			>
				<Grid
					item
					md={12}
					className={
						"flex flex-col items-center relative p-0 px-4 my-4 justify-center h-full"
					}
				>
					<Typography
						variant="subtitle1"
						color="textSecondary"
						className="mx-0 my-12 h-20 w-20 md:w-40  md:h-40 rounded-full text-4xl md:text-6xl flex flex-row items-center justify-center"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme =>
								theme.palette.background.paper,
						}}
					>
						<InboxIcon fontSize="inherit" />
					</Typography>
					<Typography
						variant="body2"
						color="textSecondary"
						className="mx-0"
						sx={{ color: theme => theme.palette.text.disabled }}
					>
						You don't have any conversations yet
					</Typography>
				</Grid>
			</Grid>
		)
	} else {
		return (
			<InfiniteLoader
				isItemLoaded={() => true}
				itemCount={conversations?.length}
				loadMoreItems={loadMoreConversations}
				className={`py-16 ${className}`}
			>
				{({ onItemsRendered, ref }) => (
					<AutoSizer>
						{({ height, width }) => (
							<FixedSizeList
								height={height}
								itemCount={conversations?.length}
								itemSize={itemSizeRef.current}
								onItemsRendered={onItemsRendered}
								width={width}
								{...rest}
								ref={ref}
							>
								{itemProps => rowRenderer(itemProps)}
							</FixedSizeList>
						)}
					</AutoSizer>
				)}
			</InfiniteLoader>
		)
	}
}

export default React.memo(Conversations)
