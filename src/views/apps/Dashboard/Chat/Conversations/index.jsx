/** @format */

import React, { useCallback, useRef } from "react"
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
	ensureMessage,
	fetchContacts,
	fetchInbox,
	createConversation,
} from "state/actions"
import { CellMeasurer, List, AutoSizer, CellMeasurerCache } from "react-virtualized"
import { EventRegister } from "utils"
import { useDidMount, useDeepMemo, useSetState } from "hooks"
import Conversation from "./Conversation"
import { useLiveQuery } from "dexie-react-hooks"
import dexieDB from "config/dexie/database"

const Conversations = props => {
	const { fetchData, className, onConversationContextMenu, typing, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector(state => state.auth)
	const listRef = useRef(null)
	const records = useLiveQuery(() => dexieDB.conversations.toArray(), [], [])
	const conversations = useDeepMemo(
		() =>
			records.sort((a, b) => {
				return Date.parseFrom(b.last_used || b.created_on) - Date.parseFrom(a.last_used || a.created_on)
			}),
		[records]
	)
	const [state, setState, getState] = useSetState({
		loading: Boolean(fetchData),
		selected: -1,
		focused: -1,
	})
	const itemSizeRef = useRef(62)
	const onUnselectEventRef = useRef(null)
	const cellMeasurerCache = new CellMeasurerCache({
		defaultHeight: 30,
		fixedWidth: false,
	})
	const loadMoreConversations = useCallback((startIndex, stopIndex) => {}, [])

	const handleOnConversationClick = useCallback(
		index => event => {
			dispatch(setActiveConversation(conversations[index]))
			setState({
				focused: index,
			})
		},
		[conversations]
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
		({ data: indexData, index, isScrolling, key, parent, style }) => {
			const { selected, focused } = getState()
			return (
				<CellMeasurer cache={cellMeasurerCache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
					{({ measure, registerChild }) => (
						<Conversation
							data={conversations[index]}
							onClick={handleOnConversationClick(index)}
							onContextMenu={handleOnConversationContextMenu(index)}
							selected={index === selected}
							focused={index === focused}
							onLoad={measure}
							style={style}
							ref={registerChild}
						/>
					)}
				</CellMeasurer>
			)
		},
		[conversations, cellMeasurerCache]
	)
	useDidMount(() => {
		const onClearConversationsSelection = EventRegister.on("clear-conversation-selection", event => {
			setState({
				focused: -1,
			})
		})
		dispatch(fetchInbox())
		return () => {
			onClearConversationsSelection.remove()
		}
	})

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
						<InboxIcon fontSize="inherit" />
					</Typography>
					<Typography variant="body2" color="textSecondary" className="mx-0" sx={{ color: theme => theme.palette.text.disabled }}>
						You don't have any conversations yet
					</Typography>
				</Grid>
			</Grid>
		)
	}, [])
	return (
		<AutoSizer className={`w-full relative ${className ? className : ""}`}>
			{({ height, width }) => (
				<List
					rowCount={Array.isArray(conversations) ? conversations?.length : 0}
					deferredMeasurementCache={cellMeasurerCache}
					rowHeight={cellMeasurerCache.rowHeight}
					width={width}
					height={height}
					rowRenderer={rowRenderer}
					noRowsRenderer={noRowsRenderer}
					ref={listRef}
				/>
			)}
		</AutoSizer>
	)
}

export default React.memo(Conversations)
