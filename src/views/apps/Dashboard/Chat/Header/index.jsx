/** @format */
import React, { useCallback, useRef, useMemo } from "react"
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
import { Routes, Route, useSearchParams, useLocation } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import Fab from "@mui/material/Fab"

import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"

import { useNetworkServices } from "contexts"
import * as definations from "definations"
import { connect, useDispatch, useSelector } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
import { setActiveConversation } from "state/actions"
import { getIndexOfConversation } from "state/actions/communication/utils"
import { useDidMount, useDidUpdate, useSetState } from "hooks"
import { EventRegister } from "utils"

const Header = props => {
	const { onClickSecondaryAction } = props
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const conversations = useSelector(state => state?.communication?.messaging?.conversations || [])
	const active_conversation = useSelector(state => state?.communication?.messaging?.active_conversation)
	const { Api: ApiService } = useNetworkServices()

	const [locationSearchParams, setLocationSearchParams] = useSearchParams()
	const indexOfActiveConversation = getIndexOfConversation(conversations, active_conversation)
	const activeConversation = conversations[indexOfActiveConversation]
	const typingRef = useRef([])

	const [state, setState, getState] = useSetState({
		title: "Inbox",
		subtitle: "",
		avatar: null,
		typing: [],
	})

	const getTitle = useCallback(() => {
		let title = "Inbox"

		if (!!activeConversation) {
			title = "Conversation"
			if (activeConversation.type == "individual") {
				if (
					auth.user?._id === activeConversation.owner?._id ||
					auth.user?._id === activeConversation.owner ||
					auth.user?._id === activeConversation.started_by?._id ||
					auth.user?._id === activeConversation.started_by
				) {
					if (
						(auth.user?._id === activeConversation.started_by?._id || auth.user?._id === activeConversation.started_by) &&
						!String.isEmpty(activeConversation.participants[0].first_name)
					) {
						title = `${activeConversation.participants[0].first_name} ${activeConversation.participants[0].last_name}`
					} else if (Array.isArray(activeConversation.participants)) {
						for (let i = 0; i < activeConversation.participants.length; i++) {
							if (activeConversation.participants[i]?._id === auth.user?._id) {
								title = `${activeConversation.participants[i]?.first_name} ${activeConversation.participants[i]?.last_name}`
								break
							}
						}
					}
				}
			} else if (activeConversation.type == "group") {
				title = activeConversation.group_name || "Group Chat"
			} else {
				title = "Realfield"
			}
		}

		return title
	}, [activeConversation, auth])

	const getSubtitle = useCallback(() => {
		let subtitle = ""
		const typing = typingRef.current || []
		if (!!activeConversation && !Array.isEmpty(typing)) {
			let typingFirstNames = []

			if (Array.isArray(activeConversation.participants)) {
				typingFirstNames = activeConversation.participants.reduce((currentNames, participant) => {
					if (typing.indexOf(participant?._id) !== -1) {
						currentNames.push(participant.first_name)
					}
					return currentNames
				}, [])
			}
			if (typing.indexOf(activeConversation.started_by?._id) !== -1) {
				typingFirstNames.push(activeConversation.started_by.first_name)
			}

			if (typingFirstNames.length > 0) {
				subtitle = `${typingFirstNames.join(",")} typing ....`
			}
		}

		return subtitle
	}, [activeConversation, auth])

	const getAvatar = useCallback(() => {
		let avatar = null

		return avatar
	}, [activeConversation, auth])

	const handleOnUserStartedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail || {}
			if (conversation === activeConversation?.uuid) {
				typingRef.current = !Array.isArray(typingRef.current)
					? [user]
					: typingRef.current.filter(entry => entry !== user).concat([user])
				setState({
					title: getTitle(),
					subtitle: getSubtitle(),
					avatar: getAvatar(),
				})
			}
		},
		[activeConversation]
	)

	const handleOnUserStoppedTyping = useCallback(
		event => {
			const { user, conversation } = event.detail || {}
			if (conversation === activeConversation?.uuid) {
				typingRef.current = !Array.isArray(typingRef.current) ? [] : typingRef.current.filter(entry => entry !== user)
				setState({
					title: getTitle(),
					subtitle: getSubtitle(),
					avatar: getAvatar(),
				})
			}
		},
		[activeConversation]
	)

	useDidMount(() => {
		setState({ title: getTitle(), subtitle: getSubtitle(), avatar: getAvatar() })

		const onComposeMessagingStartedListener = EventRegister.on("compose-message-started", handleOnUserStartedTyping)
		const onComposeMessagingStoppedListener = EventRegister.on("compose-message-stopped", handleOnUserStoppedTyping)

		return () => {
			onComposeMessagingStartedListener.remove()
			onComposeMessagingStoppedListener.remove()
		}
	})

	useDidUpdate(() => {
		setState({ title: getTitle(), subtitle: getSubtitle(), avatar: getAvatar() })
	}, [activeConversation])

	return (
		<AppBar position="relative" className={""}>
			<Toolbar>
				{indexOfActiveConversation !== -1 && (
					<IconButton
						onClick={() => {
							if (locationSearchParams.get("with")) {
								setSearchParams({})
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
				{!!activeConversation &&
					(activeConversation.type == "individual" ? (
						(auth.user?._id === activeConversation.owner._id || auth.user?._id === activeConversation.owner) &&
						Array.isArray(activeConversation.participants) &&
						activeConversation.participants.length > 0 &&
						activeConversation.participants[0].avatar ? (
							<Avatar
								className={"mr-6 w-6 h-6"}
								src={ApiService.getAttachmentFileUrl(activeConversation.participants[0].avatar)}
							/>
						) : activeConversation.started_by && activeConversation.started_by.avatar ? (
							<Avatar
								className={"mr-6 w-6 h-6"}
								src={ApiService.getAttachmentFileUrl(activeConversation.started_by.avatar)}
							/>
						) : (
							<Avatar className={"mr-2 w-6 h-6 bg-transparent accent-text"}>
								<PersonIcon />
							</Avatar>
						)
					) : activeConversation.group_avatar ? (
						<Avatar className={"mr-6"} src={ApiService.getAttachmentFileUrl(activeConversation.group_avatar)} />
					) : (
						<Avatar className={"mr-6 w-6 h-6 bg-transparent accent-text"}>
							{" "}
							{activeConversation.type === "group" ? <PeopleIcon /> : <PersonIcon />}
						</Avatar>
					))}
				<Box className={"capitalize flex-grow flex-col"}>
					<Typography variant="h6">{state.title}</Typography>
					<Typography variant="body2">{getSubtitle()}</Typography>
				</Box>

				{!activeConversation && (
					<IconButton className={"mr-2"} onClick={onClickSecondaryAction} edge="end" color="inherit" aria-label="Contacts">
						<ContactsIcon />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	)
}

export default React.memo(Header)
