/** @format */

import React, { useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setCurrentUser, setPreferences, setSettings, setActiveConversation } from "state/actions"
import Api from "services/Api"
import SocketIO from "services/SocketIO"
import { onMessage, onConversation, onInbox, database as dexieDB } from "config/dexie"
import { EventRegister } from "utils"
import { useDidMount } from "hooks"

// Regular expression to check if string is a valid UUID
const uuidRegexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

const WebSocketService = props => {
	const { children } = props
	const dispatch = useDispatch()
	const preferences = useSelector(state => ({ ...state.app?.preferences }))
	const settings = useSelector(state => ({ ...state.app?.settings }))
	const { user, isAuthenticated } = useSelector(state => state.auth)



	const handleOnPresenceChanged = useCallback(
		({ presence }) => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				dispatch(setCurrentUser({ ...user, presence: presence }))
			}
		},
		[user, isAuthenticated]
	)

	const handleOnUserChangedPresence = useCallback(
		data => {
			if (isAuthenticated && !JSON.isEmpty(user) && (data.user?._id === user._id || data.user === user._id)) {
				dispatch(setCurrentUser({ ...user, presence: data.presence }))
			}
		},
		[user, isAuthenticated]
	)

	const handleOnMessageMarkedAsRead = useCallback(
		async data => {
			if (isAuthenticated && !JSON.isEmpty(user)) {

				const nextMessage = { uuid: data.message, state: "read", reads: [data.user] }
				onMessage(nextMessage)
			}
		},
		[user, isAuthenticated]
	)
	const handleOnMessageMarkedAsReceived = useCallback(
		async data => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				const nextMessage = { uuid: data.message, state: "received", receipts: [data.user] }
				onMessage(nextMessage)
			}
		},
		[user, isAuthenticated]
	)

	const handleOnMessageDeletedForAll = useCallback(
		async data => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				const nextMessage = { uuid: data.message, state: "deleted-for-all", deletions: [data.user] }
				onMessage(nextMessage)
			}
		},
		[user, isAuthenticated]
	)
	const handleOnMessageDeletedForUser = useCallback(
		async data => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				const nextMessage = { uuid: data.message, state: "deleted-for-user", deletions: [data.user] }
				onMessage(nextMessage)
			}
		},
		[user, isAuthenticated]
	)

	const handleOnMessageSent = useCallback(
		async message => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				onMessage(message)
			}
		},
		[user, isAuthenticated]
	)

	const handleOnNewConversation = useCallback(
		async data => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				onConversation(data)
				dispatch(setActiveConversation(data))
			}
		},
		[user, isAuthenticated]
	)

	const handleOnNewMessage = useCallback(
		async message => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				onMessage(message, true)
				SocketIO.emit("mark-message-as-received", {
					message: message._id || message.uuid,
				})
			}
		},
		[user, isAuthenticated]
	)

	const handleOnConversation = useCallback(
		async conversation => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				onConversation(conversation)
			}
		},
		[user, isAuthenticated]
	)

	const handleOnInbox = useCallback(
		async conversations => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				onInbox(conversations)
			}
		},
		[user, isAuthenticated]
	)

	const initializeSubscriptions = useCallback(() => {
		SocketIO.on("settings", settings => {
			dispatch(setSettings(settings))
		})
		if (isAuthenticated && !JSON.isEmpty(user)) {

			SocketIO.on("presence-changed", handleOnPresenceChanged)
			SocketIO.on("user-changed-presence", handleOnUserChangedPresence)

			SocketIO.on("message-marked-as-read", handleOnMessageMarkedAsRead)
			SocketIO.on("message-marked-as-received", handleOnMessageMarkedAsReceived)
			SocketIO.on("message-deleted-for-all", handleOnMessageDeletedForAll)
			SocketIO.on("message-deleted-for-user", handleOnMessageDeletedForUser)
			SocketIO.on("message-sent", handleOnMessageSent)
			SocketIO.on("new-message", handleOnNewMessage)
			SocketIO.on("preferences", preferences => {
				dispatch(setPreferences(preferences))
			})
			SocketIO.on("inbox", handleOnInbox)
			SocketIO.on("new-conversation", handleOnNewConversation)

			SocketIO.on("authorized", ({ user }) => {
				const token = Api.getAccessToken()
				SocketIO.auth = { token: token.access_token }
			})
			SocketIO.on("unauthorized", ({}) => {
				const token = Api.getAccessToken()
				console.log("unauthorized", token)
				SocketIO.emit("authorization", { token: token.access_token })
			})
			SocketIO.on("authorization-failed", data => {
				console.log("authorization-failed data", data)
				// EventRegister.emit("logout")
			})
			SocketIO.on("create-conversation-error", error => {
				const {data} = {...error}
				if (!JSON.isEmpty(data)) {
					handleOnNewConversation(data)
				}
				console.error("create-conversation-error data", data)
			})
			if (SocketIO.connected) {
				SocketIO.emit("get-preferences", {})
				SocketIO.emit("get-inbox", {})
			} else {
				SocketIO.on("connect", () => {
					SocketIO.emit("get-preferences", {})
					SocketIO.emit("get-inbox", {})
				})
			}
		}
		if (SocketIO.connected) {
			SocketIO.emit("get-settings")
		} else {
			SocketIO.on("connect", () => {
				SocketIO.emit("get-settings")
			})
		}
	}, [isAuthenticated, user])

	// EventRegister Events Handlers
	const handleOnSendMessage = useCallback(
		async message => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				let dbEntry = null
				try {
					if (JSON.isJSON(message)) {
						if (!String.isEmpty(message.uuid)) {
							message.uuid = String.uuid()
						}
						message.state = "pending"
						dbEntry = depopulate(message)
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dbEntry = dexieDB.messages.put(dbEntry)
					}
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}
		},
		[user, isAuthenticated]
	)

	const handleOnDeleteMessageForUser = useCallback(
		async message => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				const messageID = message?.uuid || message?._id || message
				if (SocketIO.connected) {
					SocketIO.emit("delete-message-for-user", { message: messageID })
				} else {
					SocketIO.on("connect", () => {
						SocketIO.emit("delete-message-for-user", { message: messageID })
					})
				}
			}
		},
		[user, isAuthenticated]
	)

	const handleOnDeleteMessageForAll = useCallback(
		async message => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				const messageID = message?.uuid || message?._id || message
				if (SocketIO.connected) {
					SocketIO.emit("delete-message-for-all", { message: messageID })
				} else {
					SocketIO.on("connect", () => {
						SocketIO.emit("delete-message-for-all", { message: messageID })
					})
				}
			}
		},
		[user, isAuthenticated]
	)

	useDidMount(() => {
		initializeSubscriptions()
		const onSendMessageListener = EventRegister.on("send-message", handleOnSendMessage)
		const onDeleteMessageForUserListener = EventRegister.on("delete-message-for-user", handleOnDeleteMessageForUser)
		const onDeleteMessageForAllListener = EventRegister.on("delete-message-for-all", handleOnDeleteMessageForAll)
		const onLoginListener = EventRegister.on("login", initializeSubscriptions)
		const onLogoutListener = EventRegister.on("logout", e => SocketIO.off())

		return () => {
			onSendMessageListener.remove()
			onDeleteMessageForUserListener.remove()
			onDeleteMessageForAllListener.remove()
			onLoginListener.remove()
			onLogoutListener.remove()
		}
	})

	return children(SocketIO)
}

export default React.memo(WebSocketService)
