/** @format */

import React, { Component } from "react"
import { LinkOff as RemoveLinkIcon } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"

export default class RemoveLinkIconComponent extends Component {
	render() {
		return (
			<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900">
				{" "}
				<RemoveLinkIcon />{" "}
			</IconButton>
		)
	}
}
