import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { colors } from "assets/jss/app-theme.jsx";
import typographyStyle from "assets/jss/components/typographyStyle.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
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
		[classes.tiny]: tiny,
		[classes.small]: small,
		[classes.large]: large,
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
	let splitted = false; 
	if (String.isString(children)) {
		splitted = children.indexOf("\n") === -1? false : true;
		if (splitted) {
			children = children.split("\n");
		}		
	}

	return (
		<Typography className={typographyClasses} {...rest}>
			{splitted? children.map((child, index)=> {
				let tabbed = child.indexOf("\t") === -1? false : true;
				if (tabbed) {
					let tabbed_children = child.split("\t")
					return (
						tabbed_children.map((tabbed_child, cursor) => (
							<span key={"typography-tabbed_child-"+cursor}> &nbsp; &nbsp; {tabbed_child} </span>
						))
					);
				}
				else {
					return (
						<span key={"typography-child-"+index}>{child} <br /> </span>
					);
				}
					
			}) : children}
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
