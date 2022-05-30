/** @format */

import React from "react"
import PropTypes from "prop-types"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"

function EditorToolbar({ children, visible = true, className, ...rest }) {
	return (
		<Grid container alignItems="center" className={`${!visible ? "hidden" : ""} ${className || ""}`} {...rest}>
			{children}
		</Grid>
	)
}

EditorToolbar.propTypes = {
	children: PropTypes.any,
	visible: PropTypes.bool,
}

export default EditorToolbar
