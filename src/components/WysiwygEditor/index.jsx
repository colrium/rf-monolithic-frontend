/** @format */

import React from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, RichUtils, convertFromHTML, ContentState } from "draft-js"
import EditorFactories from "./utils/EditorFactories"
import EditorToolbar from "./EditorToolbar"
import { Paper, Grid, Typography, FormHelperText, FormControl, TextField, InputLabel } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { defaultConfig } from "./types/config"
import Translator from "./lang/Translator"
import toHTML from "./conversion/toHTML"
import useEditor from "./hooks/useEditor"
import useEditorFocus from "./hooks/useEditorFocus"
import { useDerivedState, useForwardedRef, useThrottledCallback, useSetState } from "hooks"
import { stateToHTML } from "draft-js-export-html"
import { convertToHTML } from "draft-convert"
import "draft-js/dist/Draft.css"

export { toolbarControlTypes } from "./types/editorToolbar"
export { LANG_PREFIX } from "./types/lang"
export { fileToBase64 } from "./utils/fileUtils"
export { toHTML, useEditor, useEditorFocus }

export const EditorContext = React.createContext({})

export const MUIEditorState = {
	createEmpty: config => {
		const editorFactories = new EditorFactories(config)
		return EditorState.createEmpty(editorFactories.getCompositeDecorator())
	},
	createWithContent: (config, contentState) => {
		const editorFactories = new EditorFactories(config)
		return EditorState.createWithContent(contentState, editorFactories.getCompositeDecorator())
	},
}

const useStyles = makeStyles(theme => ({
	"@global": {
		".mui-editor-left-aligned-block": {
			textAlign: "left !important",
			"& > div": {
				textAlign: "left !important",
			},
		},
		".mui-editor-center-aligned-block": {
			textAlign: "center !important",
			"& > div": {
				textAlign: "center !important",
			},
		},
		".mui-editor-right-aligned-block": {
			textAlign: "right !important",
			"& > div": {
				textAlign: "right !important",
			},
		},
		".mui-editor-justify-aligned-block": {
			textAlign: "justify !important",
			"& > div": {
				textAlign: "justify !important",
			},
		},
	},
}))

const MUIEditor = React.forwardRef((props, ref) => {
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
		placeholder,
		variant,
		label,
		fullWidth = true,
		required,
		editorConfig = {},
		value,
		onChange,
		onFocus = null,
		onBlur = null,
		config = defaultConfig,
		type,
		size,
		margin,
		InputProps,
		...rest
	} = props
	const idRef = React.useRef(String.isString(label) ? label.variablelize() : `wysiwyg-${String.uuid()}`)
	const editorFactories = new EditorFactories(config)
	const editorRef = useForwardedRef(ref)
	const translateRef = React.useRef(function () {})
	const translationsRef = React.useRef(null)
	const editorStateRef = React.useRef(null)
	const contentStateRef = React.useRef(null)
	const toolbarVisibleConfig = editorFactories.getConfigItem("toolbar", "visible")

	const [state, setState, getState] = useSetState({
		isToolbarVisible: toolbarVisibleConfig,
		isResizeImageDialogVisible: false,
		resizeImageEntityKey: null,
		focused: false,
	})

	const [editorState, setEditorState, getEditorState] = useDerivedState(
		() => {
			let contentState = EditorState.createEmpty().currentContent
			if (String.isString(value)) {
				//check if HTML or plain text
				if (/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(value)) {
					const blocksFromHTML = convertFromHTML(value)
					contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
				} else {
					contentState = ContentState.createFromText(value)
				}
			} else if (Array.isArray(value)) {
				contentState = ContentState.createFromBlockArray(value)
			} else {
				contentState = EditorState.createEmpty().currentContent
			}
			if (!!contentState) {
				return EditorState.createWithContent(contentState)
			}
			return EditorState.createEmpty()
		},
		[value],
		EditorState.createEmpty()
	)

	translationsRef.current = editorFactories.getTranslations()
	translateRef.current = React.useCallback(id => {
		const translator = new Translator(translationsRef.current)
		return translator.get(id)
	}, [])
	const classes = useStyles()

	React.useEffect(() => {
		setState({ isToolbarVisible: toolbarVisibleConfig })
	}, [toolbarVisibleConfig])

	const toolbar = (
		<EditorToolbar
			visible={state.isToolbarVisible}
			style={editorFactories.getConfigItem("toolbar", "style")}
			className={`${editorFactories.getConfigItem("toolbar", "className")} relative`}
		>
			{editorFactories.getToolbarControlComponents()}
		</EditorToolbar>
	)

	const top = editorFactories.getToolbarPosition() === "top" ? toolbar : null
	const bottom = editorFactories.getToolbarPosition() === "bottom" ? toolbar : null

	const handleKeyCommand = command => {
		const newState = RichUtils.handleKeyCommand(editorState, command)
		if (newState) {
			// onChange(newState)
			return "handled"
		}
		return "not-handled"
	}

	const handleFocus = ev => {
		setState({ focused: true })
		if (onFocus) onFocus(ev)
	}

	const editorWrapperProps = {
		style: editorFactories.getConfigItem("editor", "style"),
		className: `my-1 ${editorFactories.getConfigItem("editor", "className")}`,
		onClick: () => editorRef.current.focus(),
	}

	const editorWrapperElement = editorFactories.getConfigItem("editor", "wrapperElement")

	if (editorWrapperElement === Paper) {
		editorWrapperProps.elevation = 3
	}

	const handleOnChange = React.useCallback(newEditorState => {
		setEditorState(newEditorState)
		if (Function.isFunction(onChange)) {
			let onChangeValue = newEditorState
			if (type === "html" || type === "text") {
				onChangeValue = convertToHTML(newEditorState.getCurrentContent())
				// onChangeValue = stateToHTML(newEditorState.getCurrentContent())
			}
			if (Function.isFunction(onChange)) {
				onChange(onChangeValue)
			}
		}
	}, [])

	const handleOnBlur = React.useCallback(
		ev => {
			setState({ focused: false })
			if (onBlur) onBlur(ev)
		},
		[onBlur]
	)
	const EditorWrapper = React.createElement(
		editorWrapperElement,
		editorWrapperProps,
		<Editor
			{...editorFactories.getConfigItem("draftEditor")}
			ref={editorRef}
			onChange={handleOnChange}
			editorState={editorState}
			onFocus={handleFocus}
			onBlur={handleOnBlur}
			handleKeyCommand={handleKeyCommand}
			blockStyleFn={editorFactories.getBlockStyleFn()}
			customStyleMap={editorFactories.getCustomStyleMap()}
			blockRenderMap={editorFactories.getBlockRenderMap()}
			blockRendererFn={editorFactories.getBlockRendererFn()}
			placeholder={placeholder}
		/>
	)

	return (
		<EditorContext.Provider
			value={{
				editorState,
				onChange: handleOnChange,
				ref: editorRef.current,
				translate: translateRef.current,
				showResizeImageDialog: entityKey => {
					setState({
						isResizeImageDialogVisible: true,
						resizeImageEntityKey: entityKey,
					})
				},
				hideResizeImageDialog: () => {
					setState({
						isResizeImageDialogVisible: false,
						resizeImageEntityKey: null,
					})
				},
				isResizeImageDialogVisible: state.isResizeImageDialogVisible,
				resizeImageEntityKey: state.resizeImageEntityKey,
			}}
		>
			<FormControl size={size} variant={variant || "filled"}>
				<Grid container className="p-0">
					<Grid item xs={12} className="relative p-0">
						<InputLabel
							id={idRef.current}
							variant={variant || "filled"}
							required={required}
							focused={state.focused}
							shrink
							error={error}
						>
							{label}
						</InputLabel>
					</Grid>
					<Grid item xs={12} className="p-0">
						{top}
					</Grid>
					<Grid item xs={12} className="p-0">
						{EditorWrapper}
					</Grid>
					<Grid item xs={12} className="p-0">
						{bottom}
					</Grid>
				</Grid>
			</FormControl>
		</EditorContext.Provider>
	)
})

MUIEditor.displayName = "MUIEditor"

MUIEditor.propTypes = {
	/** Immutable object that represents the entire state of the editor */
	editorState: PropTypes.object.isRequired,
	/** The function to be executed by the Editor when edits and selection changes occur. The new editor state is passed by parameter. */
	onChange: PropTypes.func.isRequired,
	/** The function to be executed by the Editor when a focus event is triggered. The new editor state is passed by parameter. */
	onFocus: PropTypes.func,
	/** The function to be executed by the Editor when a blur event is triggered. The new editor state is passed by parameter. */
	onBlur: PropTypes.func,
	/** All the editor configuration options */
	config: PropTypes.object,
}

MUIEditor.defaultProps = {
	config: defaultConfig,
	type: "html",
	placeholder: "Enter you content...",
}

export default MUIEditor
