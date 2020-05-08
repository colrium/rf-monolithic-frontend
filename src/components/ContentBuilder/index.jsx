/** @format */

import React, { useState } from "react";

// The editor core
import { Editor } from "@react-page/core/editor";
import "@react-page/core/core/lib/index.css"; // we also want to load the stylesheets
// Require editor ui stylesheet
import "@react-page/core/ui/lib/index.css";

// Load some exemplary plugins:
import slate from "@react-page/core/plugins-slate"; // The rich text area plugin
import "@react-page/core/plugins-slate/lib/index.css"; // Stylesheets for the rich text area plugin
import background from "@react-page/core/plugins-background"; // A plugin for background images
import "@react-page/core/plugins-background/lib/index.css"; // Stylesheets for  background layout plugin

// Define which plugins we want to use. We only have slate and background available, so load those.
const plugins = {
	content: [slate()], // Define plugins for content cells. To import multiple plugins, use [slate(), image, spacer, divider]
	layout: [background({ defaultPlugin: slate() })], // Define plugins for layout cells
};

const ContentBuilder = props => {
	const [editorValue, setEditorValue] = useState(initialState);
	// save the state somewhere
	const saveToDatabase = useCallback(() => {
		return fetch("/my/save/url", { method: "POST", body: editorvalue });
	}, []);
	return (
		<div>
			<Editor
				plugins={plugins}
				value={editorValue}
				onChange={setEditorValue}
			/>
			<toolbar>
				<button onClick={saveToDatabase}>Save</button>
			</toolbar>
		</div>
	);
};

export default ContentBuilder;
