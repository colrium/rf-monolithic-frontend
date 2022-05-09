/** @format */

import React, { memo, useCallback } from "react"
import { convertFromHTML, convertToHTML, convertFromRaw } from "draft-js"
import TextField from "@mui/material/TextField"
import Editor from "./Editor"
import { useSetState, useDeepMemo } from "hooks"

const WysiwygEditor = React.forwardRef((props, ref) => {
	const {
		className,
		readOnly,
		disabled,
		minRows,
		maxRows,
		rows,
		color,
		helperText,
		error,
		sx,
		variant,
		label,
		fullWidth = true,
		required,
		editorConfig = {},
		...rest
	} = props

	return (
		<TextField
			InputProps={{
				inputComponent: Editor,
				inputProps: {
					...rest,
				},
			}}
			className={`${className ? className : ""} `}
			variant={variant || "filled"}
			readOnly={readOnly}
			disabled={disabled}
			helperText={helperText}
			error={error}
			label={label}
			required={required}
			fullWidth={fullWidth}
			multiline
			minRows={minRows}
			maxRows={maxRows}
			rows={rows}
			color={color}
			sx={sx}
			inputRef={ref}
		/>
	)
})

export default memo(WysiwygEditor)
