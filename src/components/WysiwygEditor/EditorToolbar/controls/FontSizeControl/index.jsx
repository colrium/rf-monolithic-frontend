/** @format */

import React from "react"
import PropTypes from "prop-types"
import useEditor from "../../../hooks/useEditor"
import useEditorFocus from "../../../hooks/useEditorFocus"
import DropdownControl from "../core/DropdownControl"
import inlineStyles from "../../../types/inlineStyles"
import { getCurrentMappedInlineStyle, toggleMappedInlineStyle } from "../../../utils/editorStateUtils"
import MenuItem from "@mui/material/MenuItem"
FontSizeControl.propTypes = {
	pluginData: PropTypes.object.isRequired,
}

function FontSizeControl({ pluginData }) {
	const editor = useEditor()
	const editorFocus = useEditorFocus()
	const [selectedFontSizeStyle, setSelectedFontSizeStyle] = React.useState(`${inlineStyles.FONT_SIZE}-default`)
	const styleKeys = Object.keys(pluginData.customStyleMap)

	React.useEffect(() => {
		setSelectedFontSizeStyle(getCurrentMappedInlineStyle(editor.editorState, styleKeys, `${inlineStyles.FONT_SIZE}-default`))
	}, [editor.editorState, styleKeys])

	const handleChange = newInlineStyle => {
		setSelectedFontSizeStyle(newInlineStyle)
		const newEditorState = toggleMappedInlineStyle(editor.editorState, styleKeys, newInlineStyle)
		editor.onChange(newEditorState)
		editorFocus()
	}

	return (
		<DropdownControl
			options={styleKeys.map(inlineStyle => ({
				text: pluginData.customStyleMap[inlineStyle].fontSize ? (
					<span
						style={{
							height: pluginData.customStyleMap[inlineStyle].fontSize,
							lineHeight: pluginData.customStyleMap[inlineStyle].fontSize,
							fontSize: pluginData.customStyleMap[inlineStyle].fontSize,
						}}
					>
						{pluginData.customStyleMap[inlineStyle].fontSize}
					</span>
				) : (
					"default"
				),
				value: inlineStyle,
			}))}
			label="Font size"
			onChange={handleChange}
			renderValue={style => {
				// return <MenuItem sx={{height: }}>{pluginData.customStyleMap[style].fontSize || editor.translate("controls.fontSize.labels.default")}</MenuItem>
				// console.log("pluginData.customStyleMap[style]", pluginData.customStyleMap[style].fontSize)
				return pluginData.customStyleMap[style].fontSize || editor.translate("controls.fontSize.labels.default")
			}}
			value={selectedFontSizeStyle}
			minWidth={50}
		/>
	)
}

export default FontSizeControl
