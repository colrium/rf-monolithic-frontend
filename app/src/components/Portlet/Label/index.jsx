/** @format */

import { Typography } from "@mui/material";

import { colors } from "assets/jss/app-theme";
// Material helpers
// Material components
import GridContainer from "components/Grid/GridContainer";
import PropTypes from "prop-types";
import React from "react";



const PortletLabel = props => {
	const {

		className,
		icon,
		title,
		subtitle,
		description,
		color,
		icon_color,
		title_color,
		subtitle_color,
	} = props;

	return (
		<GridContainer
			className={className}
			style={color ? { color: color } : {}}
		>
			{icon && (
				<Typography
					variant="h3"
					style={icon_color ? { color: icon_color } : {}}
				>
					{" "}
					{icon}{" "}
				</Typography>
			)}
			{title && (
				<Typography
					variant="h5"
					style={title_color ? { color: title_color } : {}}
				>
					{" "}
					{title}{" "}
				</Typography>
			)}
			{subtitle && (
				<Typography
					variant="subtitle2"
					style={subtitle_color ? { color: subtitle_color } : {}}
				>
					{subtitle}
				</Typography>
			)}
		</GridContainer>
	);
};

PortletLabel.propTypes = {
	children: PropTypes.node,
	icon: PropTypes.node,
	subtitle: PropTypes.string,
	description: PropTypes.string,
	title: PropTypes.string,
	color: PropTypes.string,
	icon_color: PropTypes.string,
	title_color: PropTypes.string,
	subtitle_color: PropTypes.string,
	description_color: PropTypes.string,
};

PortletLabel.defaultProps = {

	color: colors.hex.default,
	title_color: colors.hex.default,
	subtitle_color: colors.hex.grey,
	icon_color: colors.hex.default,
	description_color: colors.hex.default,
};

export default (PortletLabel);
