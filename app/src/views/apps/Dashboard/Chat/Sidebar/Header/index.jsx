/** @format */

import * as React from "react"
import { styled } from "@mui/material/styles"
import ConversationsHeader from "./Conversations"
import { useLocation } from "react-router-dom"
import ContactsHeader from "./Contacts"

const HeaderComponent = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	backgroundColor: theme.palette.action.disabledBackground,
	color: theme.palette.text.secondary,
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-start",
}))

const Header = props => {
	const location = useLocation()

	return (
		<HeaderComponent {...props}>
			{location.pathname !== "/dashboard/messaging/contacts" ? <ConversationsHeader /> : <ContactsHeader />}
		</HeaderComponent>
	)
}

export default Header
