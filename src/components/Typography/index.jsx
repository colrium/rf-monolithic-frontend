/** @format */

import React from "react";
import ReactHtmlParser from "react-html-parser";
import Typography from "@mui/material/Typography";



function CustomTypography(props) {

	let { children, ...rest } = props;
	let isHTML = false;
	let splitted = false;
	if (String.isString(children)) {
		isHTML = children.hasHTML();
		if (children.indexOf("\t") !== -1 || children.indexOf("\n") !== -1) {
			isHTML = true;
			children = children.replaceAll("\n", "<br />");
			children = children.replaceAll("\t", "&nbsp; &nbsp;");
		}
	}

	return (
		<Typography {...rest}>
			{isHTML ? ReactHtmlParser(children) : children}
		</Typography>
	);
}


export default (CustomTypography);
