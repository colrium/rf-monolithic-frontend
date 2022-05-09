/** @format */

import React from "react"
import { ExpandMore, ExpandLess, InsertLink } from "@mui/icons-material"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { useSetState } from "hooks"

const InsertLinkIconComponent = props => {
	const { config, currentState, onChange } = props
	const fontSize = currentState?.fontSize || 12

	const [state, setState] = useSetState({
		open: false,
		popOverAnchorEl: null,
		id: String.uuid(),
	})

	const handleOnPopoverOpen = event => {
		event.stopPropagation()
		setState({ open: true, popOverAnchorEl: event.currentTarget })
	}
	const handleOnPopoverClose = () => {
		setState({ open: false, popOverAnchorEl: null })
	}

	const handleOnChange = value => event => {
		event.stopPropagation()
		setState({ open: false, popOverAnchorEl: null })
		console.log("LinkAddComponent onChange ", onChange)
		// onChange("fontSize", value)
	}

	return (
		<div onClick={event => event.stopPropagation()} className="inline-block">
			<IconButton
				aria-controls={state.id}
				aria-haspopup="true"
				className="text-gray-700 hover:text-gray-900 focus:text-gray-900"
				onClick={handleOnPopoverOpen}
				title={`Font Size`}
			>
				<InsertLink className="ml-2" />
			</IconButton>

			<Menu id={state.id} open={state.open} anchorEl={state.popOverAnchorEl} onClose={handleOnPopoverClose}>
				<MenuItem>
					<Typography variant={"body2"}>Add Link</Typography>
				</MenuItem>
			</Menu>
		</div>
	)
}

export default React.memo(InsertLinkIconComponent, (prevProps, nextProps) =>
	Object.areEqual(prevProps.currentState, nextProps.currentState)
)
