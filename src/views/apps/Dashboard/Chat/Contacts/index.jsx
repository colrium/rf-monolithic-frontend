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
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { EventRegister } from "utils"
import { useDidMount, useDidUpdate, useSetState, useDeepMemo } from "hooks"
import { useNetworkServices } from "contexts"
import Contact from "./Contact"
import { database as dexieDB, onContacts } from "config/dexie"
import { useLiveQuery } from "dexie-react-hooks"
import { useNavigate } from "react-router-dom"

const Contacts = props => {
	const { loadData, className, onClick, onContextMenu, keyword, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const { isAuthenticated, user } = useSelector(state => state.auth)
	const { Api } = useNetworkServices()
	const navigate = useNavigate()
	const [state, setState, getState] = useSetState({
		selections: [],
		pagination: {page: 1, pagination: 10},
		loading: false,
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

	const contacts = useLiveQuery(
		() =>
			dexieDB.contacts
				.toArray(),
		[],
		[]
	)

	const items = useDeepMemo(
		deps => {
			let itemsArr = []
			if (Array.isArray(contacts)) {
				if (!String.isEmpty(state.keyword)) {
					itemsArr = contacts.filter(
						entry => `${entry.first_name || ""} ${entry.last_name || ""}`.search(new RegExp(`${state.keyword}`, `i`)) !== -1
					)
				} else {
					itemsArr = contacts
				}
			}
			return itemsArr
		},
		[contacts, state.keyword]
	)

	const handleOnClick = useCallback(
		index => event => {
			event.preventDefault()
			/* setState(prevState => ({
				selections:
					prevState.selections.indexOf(items[index]?._id) === -1
						? prevState.selections.concat([items[index]?._id])
						: prevState.selections.filter(entry => entry !== items[index]?._id),
			}))
			if (Function.isFunction(onClick)) {
				onClick(event, index, items[index])
			} */
			if (!!items[index]) {
				navigate(`/messaging/conversations?with=${items[index].email_address || items[index]._id}`.toUriWithDashboardPrefix())
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
			setState({ loading: true })
			Api.get("/contacts", { params: { ...queryRef.current } })
				.then(res => {
					const {
						body: { data, page, pages, count },
					} = res
					setState(prevState => ({ loading: false, pagination: { ...prevState.pagination, page, pages, count } }))
					onContacts(data)
				})
				.catch(error => {
					console.error("Get Contacts error", error)
					setState({ loading: false })
				})
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
			const {loading} = getState()
			console.log("onSearchFormSubmit searchInputRef.current.val", searchInputRef.current.value)
			if (!loading && !String.isEmpty(searchInputRef.current?.value)) {
				setState({ loading: true })
				Api.get("/contacts", { params: { ...queryRef.current, q: searchInputRef.current.value } })
					.then(res => {
						const {
							body: { data, page, pages, count },
						} = res
						console.log("onSearchFormSubmit res", res)
						setState(prevState => ({ loading: false /* pagination: { ...prevState.pagination, page, pages, count }  */ }))
						onContacts(data)
					})
					.catch(error => {
						console.error("Get Contacts error", error)
						setState({ loading: false })
					})
			}
		},
		[]
	)

	const getRowHeight = useCallback(({ index }) => {
		return itemSizeRef.current
	}, [])

	const handleOnScroll = useCallback(
		({ clientHeight, scrollHeight, scrollTop }) => {
			const {loading, pagination, keyword } = getState()
			console.log("handleOnScroll pagination", pagination)
			console.log("handleOnScroll loading", loading)
			if (!loading) {
				const scrollBottom = Math.round(scrollHeight - scrollTop) - Math.round(clientHeight)
				scrollToBottomRef.current = scrollBottom <= itemSizeRef.current
				if (!scrollToBottomRef.current) {
					scrollToTopRef.current = scrollTop <= itemSizeRef.current
				} else {
					scrollToTopRef.current = false
				}
				if (scrollToBottomRef.current && pagination.page < pagination.pages && String.isEmpty(keyword)) {
					setState({loading: true})
					Api.get("/contacts", { params: { ...queryRef.current, page: pagination.page + 1 } }).then(res => {
						const {body: {data, page, pages, count}} = res
						setState(prevState => ({ loading: false, pagination: { ...prevState.pagination, page, pages, count } }))
						onContacts(data)
						console.log("handleOnScroll res", res)
					}).catch(error => {
						console.error("On Contacts Scroll error", error)
						setState({ loading: false })
					})
				}
			}
		},
		[]
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
				<Box className="flex item-center justify-center" {...rowProps}>
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
						className="mx-0 my-12 h-20 w-20 md:w-40  md:h-40 rounded-full text-4xl md:text-6xl flex flex-row items-center justify-center"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme => theme.palette.background.paper,
						}}
					>
						<ContactsIcon fontSize="inherit" />
					</Typography>
					<Typography variant="body2" color="textSecondary" className="mx-0" sx={{ color: theme => theme.palette.text.disabled }}>
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
				<Paper component="form" className="flex items-center mx-2 p-1 mt-2" onSubmit={onSearchFormSubmit}>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Search Contacts"
						defaultValue={state.keyword}
						onChange={onChangeKeyword}
						inputProps={{ "aria-label": "search contacts" }}
						inputRef={searchInputRef}
					/>
					{!state.loading ? <IconButton type="submit" size="small" aria-label="search">
						<SearchIcon fontSize="inherit" />
					</IconButton> : <CircularProgress size={18} />}

				</Paper>
			</Box>

			<Box className="flex-1 py-1">
				<AutoSizer className="w-full">
					{({ width, height }) => (
						<List
							rowCount={state.loading ? items.length + 1 : items.length}
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

export default React.memo(Contacts)
