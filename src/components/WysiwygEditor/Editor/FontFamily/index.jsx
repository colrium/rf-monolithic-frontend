/** @format */

import React from "react"
import { ExpandMore, ExpandLess } from "@mui/icons-material"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useSetState } from "hooks"

const FontFamilyComponent = props => {
	const { config, currentState, onChange } = props
	const fontFamilies = {
		arial: "Arial",
		georgia: "Georgia",
		impact: "Impact",
		tahoma: "Tahoma",
		"times new roman": "Times New Roman",
		verdana: "Verdana",
	}
	const fontFamily = currentState.fontFamily ? currentState.fontFamily.toLowerCase() : "arial"

	const [state, setState] = useSetState({
		open: false,
		popOverAnchorEl: null,
		id: String.uuid(),
	})

	const handleOnPopoverOpen = event => {
		setState({ open: true, popOverAnchorEl: event.currentTarget })
	}
	const handleOnPopoverClose = () => {
		setState({ open: false, popOverAnchorEl: null })
	}

	const handleOnChange = value => event => {
		setState({ open: false, popOverAnchorEl: null })
		onChange("fontFamily", value)
	}

	return (
		<div className="inline-block">
			<Button
				aria-controls={state.id}
				aria-haspopup="true"
				sx={{
					color: theme => (state.open ? theme.palette.text.disabled : theme.palette.text.secondary),
				}}
				size="small"
				onClick={handleOnPopoverOpen}
				endIcon={state.open ? <ExpandLess /> : <ExpandMore />}
			>
				{fontFamilies[fontFamily]}
			</Button>

			<Menu id={state.id} open={state.open} anchorEl={state.popOverAnchorEl} onClose={handleOnPopoverClose}>
				{Array.isArray(config.options) &&
					config.options.map((option, index) => (
						<MenuItem onClick={handleOnChange(option)} key={"option-" + index}>
							<Typography variant={"body2"}>{option}</Typography>
						</MenuItem>
					))}
			</Menu>
		</div>
	)
}

export default React.memo(FontFamilyComponent)
