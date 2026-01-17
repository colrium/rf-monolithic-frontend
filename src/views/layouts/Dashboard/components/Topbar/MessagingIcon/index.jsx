/** @format */

import React from "react"
import dexieDB from "config/dexie/database"
import { Link } from "react-router-dom"
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import { Badge, IconButton } from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import { useSelector, useDispatch } from "react-redux"

const MessagingIcon = () => {
	const auth = useSelector(state => state.auth)
	const unreadCount = useLiveQuery(
		() =>
			dexieDB.messages.filter(
				item => {
						let isUnread =
							item.state === "sent" /*  || item.state === "received" || item.state === "partially-received" */ &&
							item.sender !== auth.user?._id

					if (isUnread && Array.isArray(item.reads) && item.reads.indexOf(auth.user) !== -1) {
						isUnread = false
					}

						return isUnread
					}

				)
				.count(),
		[auth],
		0
	)
	return (
		<Link className={"cursor-pointer md:mx-2"} to={"/messaging/conversations".toUriWithDashboardPrefix()}>
			<IconButton color="inherit">
				<Badge invisible={unreadCount === 0} badgeContent={unreadCount} color="primary">
					<ForumOutlinedIcon />
				</Badge>
			</IconButton>
		</Link>
	)
}

export default React.memo(MessagingIcon)
