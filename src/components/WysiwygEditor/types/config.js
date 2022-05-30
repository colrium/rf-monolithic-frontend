/** @format */

import { defaultToolbarControls, defaultToolbarControlsConfiguration } from "./editorToolbar"
import Box from "@mui/material/Box"

export const defaultConfig = {
	lang: "en",
	translations: {},
	draftEditor: {},
	editor: {
		wrapperElement: Box,
		className: "w-full my-2",
		style: {},
	},
	toolbar: {
		className: "",
		style: {},
		visible: false,
		position: "top",
		controls: defaultToolbarControls,
		controlsConfig: defaultToolbarControlsConfiguration,
	},
}
