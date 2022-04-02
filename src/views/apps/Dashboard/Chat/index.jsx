/** @format */

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import classNames from "classnames"

import MuiAlert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import { useLocation } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import Paper from "@mui/material/Paper"

import Content from "./Content"
import Sidebar from "./Sidebar"

import { useNetworkServices } from "contexts"
import * as definations from "definations"
import { connect, useDispatch, useSelector } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
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
	getIndexOfConversation,
} from "state/actions"
import { EventRegister } from "utils"

import { useDidMount, useSetState, useEvent } from "hooks"

import { useTheme } from "@mui/material/styles"

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

function Chat(props) {
	const { className, ...rest } = props

	const theme = useTheme()
	const location = useLocation()

	// console.log("Chat location", location)

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

export default compose(
	connect(mapStateToProps, {
		apiCallRequest,
		sendMessage,
		fetchMessages,
		updateMessage,
		fetchContacts,
		fetchInbox,
		createConversation,
	}),
	withTheme
)(Chat)
