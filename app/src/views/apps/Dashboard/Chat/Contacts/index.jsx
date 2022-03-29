/** @format */

import React, { useCallback, useRef } from "react"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import List from "react-virtualized/dist/commonjs/List"
import { useSelector, useDispatch } from "react-redux"
import ContactsIcon from "@mui/icons-material/Contacts"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import SearchIcon from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { EventRegister } from "utils"
import { useDidMount, useDidUpdate, useSetState, useDeepMemo } from "hooks"
import { useApiData, withApiDataProvider } from "contexts"
import Contact from "./Contact"

const Contacts = props => {
	const { loadData, className, onClick, onContextMenu, keyword, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector(state => state.auth)

	const { data, pagination, get, loading } = useApiData("users")

	const [state, setState, getState] = useSetState({
		selections: [],
		focused: [],
		noDataText: "No Contacts available",
	})
	const queryRef = useRef({ sort: "first_name,last-name" })
	const keywordRef = useRef(keyword)
	const searchInputRef = useRef(null)
	const listRef = useRef(null)
	const scrollToBottomRef = useRef(true)
	const scrollToTopRef = useRef(false)
	const itemSizeRef = useRef(64)
	const onUnselectEventRef = useRef(null)

	const items = useDeepMemo(
		deps => {
			let itemsArr = []
			if (Array.isArray(data)) {
				if (!String.isEmpty(state.keyword)) {
					itemsArr = data.filter(
						entry => `${entry.first_name || ""} ${entry.last_name || ""}`.search(new RegExp(`${state.keyword}`, `i`)) !== -1
					)
				} else {
					itemsArr = data
				}
			}
			return itemsArr
		},
		[data, state.keyword]
	)

	const handleOnClick = useCallback(
		index => event => {
			event.preventDefault()
			setState(prevState => ({
				selections:
					prevState.selections.indexOf(items[index]?._id) === -1
						? prevState.selections.concat([items[index]?._id])
						: prevState.selections.filter(entry => entry !== items[index]?._id),
			}))
			if (Function.isFunction(onClick)) {
				onClick(event, index, items[index])
			}
		},
		[onClick, items]
	)
	const handleOnContextMenu = useCallback(
		index => event => {
			event.preventDefault()
			setState(prevState => ({
				focused:
					prevState.focused.indexOf(items[index]?._id) === -1
						? prevState.focused.concat([items[index]?._id])
						: prevState.focused.filter(entry => entry !== items[index]?._id),
			}))
			if (Function.isFunction(onContextMenu)) {
				onContextMenu(event, index, items[index])
			}
		},
		[onContextMenu, items]
	)

	useDidMount(() => {
		// let itemSize = parseInt(`${theme.spacing(7)}`.replace("px", ""))

		// if (itemSize > 0) {
		// 	itemSizeRef.current = itemSize
		// }
		onUnselectEventRef.current = EventRegister.on("clear-contacts-selection", event => {
			console.log("clear-contacts-selection called event", event)
			setState({
				selections: [],
			})
		})
		if (items.length === 0 || loadData) {
			get({ params: { ...queryRef.current } })
		}

		return () => {
			if (Function.isFunction(onUnselectEventRef.current?.remove)) {
				onUnselectEventRef.current.remove()
			}
		}
	})

	const onSearchFormSubmit = useCallback(
		event => {
			event.preventDefault()
			if (searchInputRef.current) {
				get({ persist: true, params: { ...queryRef.current, q: searchInputRef.current.val } })
			}
		},
		[loading]
	)

	const getRowHeight = useCallback(({ index }) => {
		return itemSizeRef.current
	}, [])

	const handleOnScroll = useCallback(
		({ clientHeight, scrollHeight, scrollTop }) => {
			const scrollBottom = Math.round(scrollHeight - scrollTop) - Math.round(clientHeight)
			scrollToBottomRef.current = scrollBottom <= itemSizeRef.current
			if (!scrollToBottomRef.current) {
				scrollToTopRef.current = scrollTop <= itemSizeRef.current
			} else {
				scrollToTopRef.current = false
			}
			if (!loading && scrollToBottomRef.current && pagination.page < pagination.pages && String.isEmpty(state.keyword)) {
				console.log("handleOnScroll pagination", pagination)
				get({ params: { ...queryRef.current, page: pagination.page + 1 } })
			}
		},
		[loading, pagination, state.keyword]
	)

	const rowRenderer = useCallback(
		({ data: indexData, index, ...rowProps }) => {
			const { selections, focused, keyword } = getState()
			if (index < items.length) {
				return (
					<Contact
						data={items[index]}
						onClick={handleOnClick(index)}
						onContextMenu={handleOnContextMenu(index)}
						selected={selections.indexOf(items[index]?._id) !== -1}
						focused={focused.indexOf(items[index]?._id) !== -1}
						{...rowProps}
					/>
				)
			} else {
				;<Box className="flex item-center justify-center" {...rowProps}>
					<CircularProgress color="accent" />
				</Box>
			}
		},
		[items]
	)

	const noRowsRenderer = useCallback(() => {
		return (
			<Grid container spacing={2} className="flex flex-col items-center justify-center h-full">
				<Grid item md={12} className={"flex flex-col items-center relative p-0 px-4 my-4 justify-center h-full"}>
					<Typography
						variant="subtitle1"
						color="textSecondary"
						className="mx-0 mb-8 h-12 w-12 md:w-20  md:h-20 rounded-full text-xl md:text-4xl flex flex-row items-center justify-center"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme => theme.palette.background.paper,
						}}
					>
						<ContactsIcon fontSize="inherit" />
					</Typography>
					<Typography
						variant="body2"
						color="textSecondary"
						className="mx-0 text-xs"
						sx={{ color: theme => theme.palette.text.disabled }}
					>
						{state.noDataText}
					</Typography>
				</Grid>
			</Grid>
		)
	}, [])

	const onChangeKeyword = useCallback(
		Function.debounce(event => {
			setState({
				keyword: event.target.value,
				noDataText: String.isEmpty(event.target.value) ? "No Contacts available" : "No Results",
			})
		}, 500),
		[]
	)

	return (
		<Box className="flex flex-col h-full">
			<Box>
				<Paper component="form" className="flex item-center mx-2 p-1 mt-2" onSubmit={onSearchFormSubmit}>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Search Contacts"
						defaultValue={state.keyword}
						onChange={onChangeKeyword}
						inputProps={{ "aria-label": "search contacts" }}
						inputRef={searchInputRef}
					/>
					<IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
						<SearchIcon />
					</IconButton>
				</Paper>
			</Box>

			<Box className="flex-1 py-1">
				<AutoSizer className="w-full">
					{({ width, height }) => (
						<List
							rowCount={loading ? items.length + 1 : items.length}
							onScroll={handleOnScroll}
							rowHeight={getRowHeight}
							height={height}
							width={width}
							rowRenderer={rowRenderer}
							noRowsRenderer={noRowsRenderer}
							{...rest}
							ref={listRef}
						/>
					)}
				</AutoSizer>
			</Box>
		</Box>
	)
}

export default withApiDataProvider(Contacts)
