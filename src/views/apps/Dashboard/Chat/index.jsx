/** @format */

import React, { useEffect, useCallback} from "react"
import classNames from "classnames"

import MuiAlert from "@mui/material/Alert"
import { useSearchParams } from "react-router-dom"
import Paper from "@mui/material/Paper"

import Content from "./Content"
import Sidebar from "./Sidebar"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import { useNetworkServices } from "contexts"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
	sendUnsentMessages,
	setActiveConversation,
} from "state/actions"
import { EventRegister } from "utils"

import { database as dexieDB } from "config/dexie"

import { useTheme } from "@mui/material/styles"
import { useSetState, useDidMount } from "hooks"

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

function Chat(props) {
	const { className, ...rest } = props

	const theme = useTheme()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { user } = useSelector(state => state.auth)
	const { network, SocketIO, Api } = useNetworkServices()
	const [searchParams, setSearchParams] = useSearchParams()
	const withRecipient = searchParams.get("with")

	const [state, setState] = useSetState({
		loading: false
	})
	//
	//
	const handleWithRecipient = useCallback(async recipient => {
		setState({loading: true})
		const existingConversation = await dexieDB.conversations
			.filter(
				item =>
					item?.type === "individual" &&
					(((item?.started_by?._id === recipient ||
						item?.started_by?.email_address === recipient ||
						item?.started_by?.uuid === recipient) &&
						Array.isArray(item?.participants) &&
						item.participants[0]?._id === user?._id) ||
						(Array.isArray(item?.participants) &&
							(item.participants[0]?._id === recipient ||
								item?.participants[0]?.email_address === recipient ||
								item?.participants[0]?.uuid === recipient) &&
							item.started_by?._id === user?._id))
			)
			.last()
		if (!!existingConversation) {
			dispatch(setActiveConversation(existingConversation))
			setState({ loading: false })
		}
		else {
			await Api.get("/contacts", { params: { q: recipient } })
				.then(res => {
					if (res?.body?.data?.length === 1) {
						const conversation = {
							owner: user._id,
							recipients: [res?.body?.data[0]._id],
							uuid: String.uuid(),
							type: "individual",
						}
						SocketIO.emit("create-conversation", conversation)

					}
					else {
						EventRegister.emit("notification", {
							title: "Create Conversation error",
							content: "Error creating conversation. O or > 1 contancts found with such details",
							type: "error",
							mode: "snackbar",
							icon: "error",
						})
					}
				})
				.catch(err => {
					console.error(err)
					EventRegister.emit("notification", {
						title: "Conversation error",
						content: "Error creating conversation",
						type: "error",
						mode: "snackbar",
						icon: "error",
					})
				})
		}


	}, [user])

	const handleOnConversationEvent = useCallback((data)=> {
		// let allParams = {}
		// searchParams.forEach(function (value, key) {
		// 	allParams[key] = value
		// })
		// delete allParams.with
		// setSearchParams(allParams)
		setState({ loading: false })
		navigate(`/messaging/conversations`.toUriWithDashboardPrefix())
	}, [])

	useEffect(() => {
		if (!String.isEmpty(withRecipient)) {
			handleWithRecipient(withRecipient)

		}
	}, [withRecipient])

	useEffect(() => {
		if (network.online) {
			dispatch(sendUnsentMessages())
		}
	}, [network.online])

	useDidMount(() => {
		SocketIO.on("conversation-created", handleOnConversationEvent)
		SocketIO.on("create-conversation-error", handleOnConversationEvent)
		SocketIO.on("new-conversation", handleOnConversationEvent)
		return () => {
			SocketIO.off("conversation-created", handleOnConversationEvent)
			SocketIO.off("create-conversation-error", handleOnConversationEvent)
			SocketIO.off("new-conversation", handleOnConversationEvent)
		}
	})

	return (
		<Paper
			className={classNames({
				"p-0 m-0 relative overflow-x-hidden overflow-y-visible ": true,
				[className]: !!className,
			})}
		>
			<Box
				className="flex flex-row w-full"
				sx={{
					height: `calc(100vh - ${theme.spacing(20)})`,
				}}
			>
				<Sidebar className={``} />
				<Content className="flex-1" />
				<Dialog onClose={()=> setState({loading: false})} open={state.loading}>
					<DialogTitle>A moment...</DialogTitle>
					<DialogContent className="flex items-center justify-center">
						<CircularProgress />
					</DialogContent>
				</Dialog>
			</Box>
		</Paper>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
	communication: state.communication,
	device: state.device,
})

Chat.defaultProps = {
	layout: "full",
	firstView: "conversations",
	activeConversation: undefined,
}

export default React.memo(Chat)
