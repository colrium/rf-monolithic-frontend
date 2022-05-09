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
import GridItem from "components/Grid/GridItem"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"

import { useNetworkServices } from "contexts"
import * as definations from "definations"
import { connect, useDispatch, useSelector } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
import { setActiveConversation } from "state/actions"
import { getIndexOfConversation } from "state/actions/communication/utils"
import { useDidMount, useDidUpdate, useSetState, useDeepMemo } from "hooks"

const Header = props => {
	const { onClickSecondaryAction, conversation, typing } = props
	const auth = useSelector(state => state.auth)
	const { Api: ApiService } = useNetworkServices()

	const typingRef = useRef([])

	const [state, setState, getState] = useSetState({
		title: "Inbox",
		subtitle: "",
		avatar: null,
		typing: [],
	})

	const title = useDeepMemo(() => {
		let titleStr = "Inbox"

		if (!!conversation) {
			titleStr = "Conversation"
			if (conversation.type == "individual") {
				if (
					auth.user?._id === conversation?.owner?._id ||
					auth.user?._id === conversation?.owner ||
					auth.user?._id === conversation?.started_by?._id ||
					auth.user?._id === conversation?.started_by
				) {
					if (
						(auth.user?._id === conversation.started_by?._id || auth.user?._id === conversation?.started_by) &&
						!String.isEmpty(conversation?.participants[0]?.first_name)
					) {
						titleStr = `${conversation.participants[0].first_name} ${conversation.participants[0].last_name}`
					} else if (Array.isArray(conversation?.participants)) {
						for (let i = 0; i < conversation.participants.length; i++) {
							if (conversation.participants[i]?._id === auth.user?._id) {
								titleStr = `${conversation.participants[i]?.first_name} ${conversation.participants[i]?.last_name}`
								break
							}
						}
					}
				} else if (!String.isEmpty(conversation.started_by?.first_name)) {
					titleStr = `${conversation.started_by.first_name} ${conversation.started_by.last_name}`
				}
			} else if (conversation.type == "group") {
				titleStr = conversation.group_name || "Group Chat"
			} else {
				titleStr = "Realfield"
			}
		}

		return titleStr
	}, [conversation, auth])

	const subtitle = useDeepMemo(() => {
		let subtitleStr = ""
		if (!!conversation && !Array.isEmpty(typing)) {
			let typingFirstNames = []

			if (Array.isArray(conversation.participants)) {
				typingFirstNames = conversation.participants.reduce((currentNames, participant) => {
					if (typing.indexOf(participant?._id) !== -1) {
						currentNames.push(participant.first_name)
					}
					return currentNames
				}, [])
			}
			if (typing.indexOf(conversation.started_by?._id) !== -1) {
				typingFirstNames.push(conversation.started_by.first_name)
			}

			if (typingFirstNames.length > 0) {
				subtitleStr = `${typingFirstNames.join(",")} typing ....`
			}
		} else if (!!conversation) {
			subtitleStr = ""
			if (conversation.type == "individual") {
				if (
					auth.user?._id === conversation.owner?._id ||
					auth.user?._id === conversation.owner ||
					auth.user?._id === conversation.started_by?._id ||
					auth.user?._id === conversation.started_by
				) {
					if (
						(auth.user?._id === conversation.started_by?._id || auth.user?._id === conversation.started_by) &&
						!String.isEmpty(conversation.participants[0]?.first_name)
					) {
						subtitleStr = `${conversation.participants[0]?.presence}`
					} else if (Array.isArray(conversation.participants)) {
						for (let i = 0; i < conversation.participants.length; i++) {
							if (conversation.participants[i]?._id === auth.user?._id) {
								subtitleStr = `${conversation.participants[i]?.presence}`
								break
							}
						}
					}
				} else if (!String.isEmpty(conversation.started_by?.first_name)) {
					subtitleStr = `${conversation.started_by?.presence}`
				}
			} else if (conversation.type == "group") {
				subtitleStr = conversation.participants.length
			} else {
				subtitleStr = ""
			}
		}

		return subtitleStr
	}, [conversation, auth, typing])

	const avatar = useDeepMemo(() => {
		let avatarStr = null

		return avatarStr
	}, [conversation, auth])

	return (
		<AppBar
			position="relative"
			className={""}
			sx={{ color: theme => theme.palette.text.secondary, backgroundColor: theme => theme.palette.background.default }}
		>
			<Toolbar>
				{!!conversation &&
					(conversation.type == "individual" ? (
						(auth.user?._id === conversation.owner._id || auth.user?._id === conversation.owner) &&
						Array.isArray(conversation.participants) &&
						conversation.participants.length > 0 &&
						conversation.participants[0].avatar ? (
							<Avatar className={"mr-6 w-6 h-6"} src={ApiService.getAttachmentFileUrl(conversation.participants[0].avatar)} />
						) : conversation.started_by && conversation.started_by.avatar ? (
							<Avatar className={"mr-6 w-6 h-6"} src={ApiService.getAttachmentFileUrl(conversation.started_by.avatar)} />
						) : (
							<Avatar className={"mr-2 w-6 h-6 bg-transparent mx-2"}>
								<PersonIcon />
							</Avatar>
						)
					) : conversation.group_avatar ? (
						<Avatar className={"mr-6"} src={ApiService.getAttachmentFileUrl(conversation.group_avatar)} />
					) : (
						<Avatar className={"mr-6 w-6 h-6 bg-transparent accent-text"}>
							{" "}
							{conversation.type === "group" ? <PeopleIcon /> : <PersonIcon />}
						</Avatar>
					))}
				<Box className={"capitalize flex-grow flex-col"}>
					<Typography variant="h6">{title}</Typography>
					<Typography variant="body2">{subtitle}</Typography>
				</Box>

				{!conversation && (
					<IconButton className={"mr-2"} onClick={onClickSecondaryAction} edge="end" color="inherit" aria-label="Contacts">
						<ContactsIcon />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	)
}

export default React.memo(Header)
