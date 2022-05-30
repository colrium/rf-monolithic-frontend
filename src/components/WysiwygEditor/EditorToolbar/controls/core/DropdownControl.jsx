/** @format */

import React from "react"
import PropTypes from "prop-types"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import { makeStyles } from "@mui/styles"
import useEditor from "../../../hooks/useEditor"
import { translateLiteralWithPrefix } from "../../../utils/translateUtils"

const useStyles = makeStyles(theme => ({
	selectControl: {
		margin: theme.spacing(1),
	},
}))

function DropdownControl({ value, label, onChange, options, minWidth = 120, ...rest }) {
	const classes = useStyles()
	const editor = useEditor()
	const genId = String.isString(label) ? label.variablelize() : "dropdown-control"
	return (
		<FormControl sx={{ m: 1, minWidth: minWidth }} size="small">
			<InputLabel id={genId}>{label}</InputLabel>
			<Select labelId={genId} id={genId} value={value} label={label} onChange={ev => onChange(ev.target.value)} {...rest}>
				{options.map(option => (
					<MenuItem key={option.value || "empty"} value={option.value}>
						{option.text ? translateLiteralWithPrefix(option.text, editor.translate) : ""}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

DropdownControl.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	minWidth: PropTypes.number,
}

export default DropdownControl
