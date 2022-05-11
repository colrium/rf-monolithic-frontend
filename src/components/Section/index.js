import React, { useEffect } from 'react';


import { withTheme } from '@mui/styles';
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import compose from "recompose/compose";
import classNames from 'classnames';
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';


const Section = (props) => {
	let location = useLocation();


	const { children, className, auth, title, theme, titleProps, id, ...rest } = props;


	useEffect(() => {
		if (location) {
			const { hash } = location;
			if (String.isString(hash)) {
				let elementId = hash.trim();
				if (elementId.startsWith("#")) {
					elementId = elementId.replace("#", "");
					let section = document.getElementById(elementId);
					if (section && elementId === id) {
						section.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}
			}
		}

	}, [location]);

	return (
		<Grid container name={id} className={`${className || ""}  flex px-4 md:px-32 pt-20 `} id={id} {...rest}>
			{title && (
				<Grid item  xs={12} className={"p-0 pb-8"}>
					<Typography {...titleProps}>{title}</Typography>
				</Grid>
			)}

			<Grid item  xs={12} className={"p-0"}>
				{children}
			</Grid>
		</Grid>
	)
};

Section.defaultProps = {
	id: String.uid(20),
	titleProps: {
		variant: "h4",
		color: "text.secondary"
	}
}


const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
	withTheme,
	connect(mapStateToProps, {})
)(Section);
