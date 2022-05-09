/** @format */

import React from "react"
import { ExpandMore, ExpandLess } from "@mui/icons-material"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useSetState } from "hooks"

const BlockTypeComponent = props => {
	const { config, currentState, onChange } = props
	const blockTypes = {
		normal: "Normal",
		h1: "Heading 1",
		h2: "Heading 2",
		h3: "Heading 3",
		h4: "Heading 4",
		h5: "Heading 5",
		h6: "Heading 6",
		blockquote: "Blockquote",
		code: "Code",
	}
	const blockValues = {
		normal: "Normal",
		h1: "H1",
		h2: "H2",
		h3: "H3",
		h4: "H4",
		h5: "H5",
		h6: "H6",
		blockquote: "Blockquote",
		code: "Code",
	}
	const blockTypeVariants = {
		normal: "body1",
		h1: "h1",
		h2: "h2",
		h3: "h3",
		h4: "h4",
		h5: "h5",
		h6: "h6",
		blockquote: "caption",
		code: "body2",
	}
	const blockType = currentState.blockType ? currentState.blockType.toLowerCase() : "normal"
	const [state, setState] = useSetState({
		open: false,
		popOverAnchorEl: null,
		id: String.uuid(),
	})

	console.log("BlockTypeComponent props ", props)

	const handleOnPopoverOpen = event => {
		setState({ open: true, popOverAnchorEl: event.currentTarget })
	}
	const handleOnPopoverClose = () => {
		setState({ open: false, popOverAnchorEl: null })
	}

	const handleOnChange = value => event => {
		setState({ open: false, popOverAnchorEl: null })
		onChange(value)
	}

	return (
		<div className="inline-block">
			<Button
				aria-controls={state.id}
				aria-haspopup="true"
				className="capitalize"
				sx={{
					color: theme => (state.open ? theme.palette.text.disabled : theme.palette.text.secondary),
				}}
				onClick={handleOnPopoverOpen}
				title={`${config?.title || "Type"}`}
				size="small"
			>
				{blockTypes[blockType]}
			</Button>

			<Menu id={state.id} open={state.open} anchorEl={state.popOverAnchorEl} onClose={handleOnPopoverClose}>
				{Array.isArray(config.options) &&
					config.options.map((option, index) => (
						<MenuItem onClick={handleOnChange(blockValues[option.toLowerCase()])} key={"option-" + index}>
							<Typography variant={blockTypeVariants[option.toLowerCase()]}>{blockTypes[option.toLowerCase()]}</Typography>
						</MenuItem>
					))}
			</Menu>
		</div>
	)
}

export default React.memo(BlockTypeComponent, (prevProps, nextProps) => Object.areEqual(prevProps.currentState, nextProps.currentState))
