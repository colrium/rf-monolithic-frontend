import React from "react";
import ReactHtmlParser from 'react-html-parser';
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { colors } from "assets/jss/app-theme.jsx";
import typographyStyle from "assets/jss/components/typographyStyle.jsx";


import withRoot from "utils/withRoot";

function CustomTypography({ ...props }) {
	const {
		classes,
		color,
		statusColor,
		fullWidth,
		quote,
		quoteText,
		quoteAuthor,
		mutedText,
		headline,
		title,
		subtitle,
		tiny,
		small,
		large,
		mute,
		center,
		underline,
		overline,
		overlineunderline,
		strikethrough,
		singlespaced,
		onehalfspaced,
		doublespaced,
		bold,
		italic,
		oblique,
		textcase,
		className,
		...rest
	} = props;

	const typographyClasses = classNames({
		[classes.defaultfont]: true,
		[color + "_text"]: color,
		[classes.fullWidth]: fullWidth,
		[classes.quote]: quote,
		[classes.quoteText]: quoteText,
		[classes.quoteAuthor]: quoteAuthor,
		[classes.mutedText]: mutedText,
		[classes.title]: title,
		[classes.subtitle]: subtitle,
		["text-xs"]: tiny,
		["text-sm"]: small,
		["text-lg"]: large,
		[classes.mute]: mute,
		[classes.underline]: underline,
		[classes.overline]: overline,
		[classes.centerAlign]: center,
		[classes.overlineunderline]: overlineunderline,
		[classes.strikethrough]: strikethrough,
		[classes.singlespaced]: singlespaced,
		[classes.onehalfspaced]: onehalfspaced,
		[classes.doublespaced]: doublespaced,
		[classes.bold]: bold,
		[classes.italic]: italic,
		[classes.oblique]: oblique,
		[classes[textcase]]: textcase,
		[className]: className
	});
	let {children} = props;
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
			<Typography className={typographyClasses} {...rest} >
				{ isHTML? ReactHtmlParser(children) : children }
			</Typography>
	);
		
}

CustomTypography.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(colors.names),
	statusColor: PropTypes.string,
	fullWidth: PropTypes.bool,
	quote: PropTypes.bool,
	quoteText: PropTypes.bool,
	mutedText: PropTypes.bool,
	quoteAuthor: PropTypes.bool,
	title: PropTypes.bool,
	subtitle: PropTypes.bool,
	tiny: PropTypes.bool,
	small: PropTypes.bool,
	large: PropTypes.bool,
	mute: PropTypes.bool,
	underline: PropTypes.bool,
	center: PropTypes.bool,
	overline: PropTypes.bool,
	overlineunderline: PropTypes.bool,
	strikethrough: PropTypes.bool,
	singlespaced: PropTypes.bool,
	onehalfspaced: PropTypes.bool,
	doublespaced: PropTypes.bool,
	bold: PropTypes.bool,
	italic: PropTypes.bool,
	oblique: PropTypes.bool,
	textcase: PropTypes.oneOf([
		"lowercase",
		"uppercase",
		"wordcase",
		"nocase",
		"inheritcase"
	])
};

export default withRoot(withStyles(typographyStyle)(CustomTypography));
