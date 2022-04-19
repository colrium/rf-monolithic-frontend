/** @format */

import React from "react"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Typography from "components/Typography"
import { useSetState } from "hooks"

const IconAndPopoverComponent = props => {
	const { config } = props
	const [state, setState] = useSetState({
		open: false,
		popOverAnchorEl: null,
	})

	const handleOnPopoverOpen = event => {
		setState({ open: true, popOverAnchorEl: event.currentTarget })
	}
	const handleOnPopoverClose = () => {
		setState({ open: false, popOverAnchorEl: null })
	}

	return (
		<div className="inline-block">
			<IconButton
				aria-haspopup="true"
				className="text-gray-700 hover:text-gray-900 focus:text-gray-900"
				onClick={handleOnPopoverOpen}
			>
				{String.isString(config.icon) ? <img src={config.icon} /> : config.icon}
			</IconButton>

			<Menu open={state.open} anchorEl={state.popOverAnchorEl} onClose={handleOnPopoverClose}>
				{Array.isArray(config.options) &&
					config.options.map((option, index) => (
						<MenuItem key={"option-" + index}>
							<Typography variant="h5" className="p-2" key={"option-" + index}>
								{option}
							</Typography>
						</MenuItem>
					))}
			</Menu>
		</div>
	)
}

export default IconAndPopoverComponent
