/** @format */

import React, { useRef, useCallback } from "react"
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertFromHTML, ContentState } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import {
	FormatBold as BoldIcon,
	FormatItalic as ItalicIcon,
	FormatUnderlined as UnderlinedIcon,
	FormatStrikethrough as StrikethroughIcon,
	VerticalAlignTop as SuperscriptIcon,
	VerticalAlignBottom as SubscriptIcon,
	FormatListBulleted as UnorderedListIcon,
	FormatListNumbered as OrderedListIcon,
	FormatIndentIncrease as IndentIcon,
	FormatIndentDecrease as OutdentIcon,
	FormatAlignLeft as LeftAlignIcon,
	FormatAlignRight as RightAlignIcon,
	FormatAlignCenter as CenterAlignIcon,
	FormatAlignJustify as JustifyAlignIcon,
	InsertLink as InsertLinkIcon,
	LinkOff as RemoveLinkIcon,
	InsertPhoto as InsertPhotoIcon,
	Delete as EraseIcon,
	Undo as UndoIcon,
	Redo as RedoIcon,
	ExpandMore,
	ExpandLess,
} from "@mui/icons-material"
import IconsOnlyComponent from "./IconsOnly"
import BlockTypeComponent from "./BlockType"
import FontFamilyComponent from "./FontFamily"
import FontSizeComponent from "./FontSize"
import IconAndPopoverComponent from "./IconAndPopover"
import InsertLinkIconComponent from "./InsertLink"
import LinkAddComponent from "./LinkAdd"
import { useDidMount, useSetState, useDidUpdate, useDeepMemo, useForwardedRef } from "hooks"

const WysiwygEditor = React.forwardRef((props, ref) => {
	const { className, controls, value, defaultValue, onChange, type, ...rest } = props
	const [state, setState] = useSetState({
		touched: false,
	})
	const editorStateRef = useRef(null)
	const contentStateRef = useRef(null)
	const inputRef = useForwardedRef(ref)

	const contentState = useDeepMemo(() => {
		if (!!editorStateRef.current) {
			return editorStateRef.current.currentContent
		} else if (!!contentStateRef.current) {
			return contentStateRef.current
		} else {
			const current_value = value || defaultValue
			if (String.isString(current_value)) {
				//check if HTML or plain text
				return /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(current_value)
					? ContentState.createFromBlockArray(convertFromHTML(current_value).contentBlocks)
					: ContentState.createFromText(current_value)
			} else if (Array.isArray(current_value)) {
				return ContentState.createFromBlockArray(current_value)
			} else {
				return EditorState.createEmpty().currentContent
			}
		}
	}, [value, defaultValue, contentStateRef.current])

	const editorState = useDeepMemo(() => {
		console.log("contentState", contentState)
		if (!!editorStateRef.current) {
			return editorStateRef.current
		} else if (!!contentState) {
			return EditorState.createWithContent(contentState)
		}
		return EditorState.createEmpty()
	}, [contentState, editorStateRef.current])

	const handleOnChange = useCallback(async () => {
		if (Function.isFunction(onChange)) {
			let onChangeValue = null
			if (type === "html" || type === "text") {
				if (editorStateRef.current) {
					onChangeValue = stateToHTML(editorStateRef.current.getCurrentContent())
				}
			}
			console.log("onChangeValue", onChangeValue)
			console.log("WysiwygEditor type", type)
			// onChange(onChangeValue)
		}
	}, [onChange, type])

	const onEditorStateChange = newEditorState => {
		editorStateRef.current = newEditorState
		handleOnChange()
	}

	const onContentStateChange = newContentState => {
		contentStateRef.current = newContentState
		// setState({ contentState: newContentState })
	}

	useDidUpdate(() => {
		console.log("editorState", editorState)
	}, [editorState])

	useDidMount(() => {
		console.log("useDidMount rest", rest)
		console.log("useDidMount inputRef", inputRef)
	})

	return (
		<Editor
			toolbarClassName={`flex flex-row items-center w-full`}
			wrapperClassName={`w-full ${className}`}
			editorClassName={`editorClassName`}
			defaultEditorState={editorState}
			onEditorStateChange={onEditorStateChange}
			onContentStateChange={onContentStateChange}
			toolbar={{
				blockType: {
					component: BlockTypeComponent,
					title: "Type",
				},
				fontSize: {
					component: FontSizeComponent,
					className: undefined,
					dropdownClassName: undefined,
				},
				fontFamily: {
					component: FontFamilyComponent,
					title: "Font family",
				},
				inline: {
					// component: IconsOnlyComponent,
					className: "flex",
					bold: {
						icon: <BoldIcon fontSize="inherit" />,
						className: "demo-option-custom",
					},
					italic: {
						icon: <ItalicIcon />,
						className: "demo-option-custom",
					},
					underline: {
						icon: <UnderlinedIcon />,
						className: "demo-option-custom",
					},
					strikethrough: {
						icon: <StrikethroughIcon />,
						className: "demo-option-custom",
					},
					monospace: { className: "demo-option-custom" },
					superscript: {
						icon: <SuperscriptIcon />,
						className: "demo-option-custom",
					},
					subscript: {
						icon: <SubscriptIcon />,
						className: "demo-option-custom",
					},
				},
				list: {
					// component: IconsOnlyComponent,
					className: "inline-block",
					unordered: {
						icon: <UnorderedListIcon />,
						className: "demo-option-custom",
					},
					ordered: {
						icon: <OrderedListIcon />,
						className: "demo-option-custom",
					},
					indent: {
						icon: <IndentIcon />,
						className: "demo-option-custom",
					},
					outdent: {
						icon: <OutdentIcon />,
						className: "demo-option-custom",
					},
				},
				textAlign: {
					component: IconsOnlyComponent,
					className: "inline-block",
					left: {
						icon: <LeftAlignIcon />,
						className: "demo-option-custom",
					},
					center: {
						icon: <CenterAlignIcon />,
						className: "demo-option-custom",
					},
					right: {
						icon: <RightAlignIcon />,
						className: "demo-option-custom",
					},
					justify: {
						icon: <JustifyAlignIcon />,
						className: "demo-option-custom",
					},
				},
				colorPicker: {
					// component: IconsOnlyComponent,
					className: "demo-option-custom",
				},
				link: {
					// component: LinkAddComponent,

					link: { icon: <InsertLinkIcon /> },
					unlink: { icon: <RemoveLinkIcon /> },
				},
				emoji: {
					// component: IconsOnlyComponent,
					className: "demo-option-custom",
				},
				embedded: {
					// component: IconsOnlyComponent,
					className: "demo-option-custom",
				},
				image: {
					// component: InsertPhotoIconComponent,
					className: "demo-option-custom",
				},
				remove: {
					// component: EraseIconComponent,
					className: "demo-option-custom",
				},
				history: {
					// component: IconsOnlyComponent,
					undo: {
						icon: <UndoIcon />,
						className: "demo-option-custom",
					},
					redo: {
						icon: <RedoIcon />,
						className: "demo-option-custom",
					},
				},
			}}
			{...rest}
			editorRef={editorRef => (inputRef.current = editorRef)}
		/>
	)
})

WysiwygEditor.defaultProps = {
	value: "",
	type: "html",
}

export default WysiwygEditor
