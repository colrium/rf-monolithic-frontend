/** @format */

import React, { memo, useCallback } from "react"
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg"
import { convertFromHTML, convertToHTML, convertFromRaw } from "draft-js"
import TextField from "@mui/material/TextField"
import Editor from "./Editor"
import { useSetState, useDeepMemo } from "hooks"

const WysiwygEditor = React.forwardRef((props, ref) => {
	const { className, readOnly, disabled, helperText, error, variant, label, required, editorConfig = {}, ...rest } = props

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
			fullWidth
			multiline
			inputRef={ref}
		/>
	)
})

export default memo(WysiwygEditor)
