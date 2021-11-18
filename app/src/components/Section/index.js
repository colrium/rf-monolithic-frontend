import React, { useEffect } from 'react';


import { withTheme } from '@mui/styles';
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import compose from "recompose/compose";
import classNames from 'classnames';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
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
		<GridContainer name={id} className={classNames({ "p-0 flex ": true, [className]: true, })} id={id} {...rest}>
			{title && <GridItem xs={12} className={"p-0 pb-8"}>
				<Typography {...titleProps}>{title}</Typography>
			</GridItem>}

			<GridItem xs={12} className={"p-0"}>
				{children}
			</GridItem>
		</GridContainer>
	);
};

Section.defaultProps = {
	id: String.uid(20),
	titleProps: {
		variant: "h3",
		color: "textSecondary"
	}
}


const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
	withTheme,
	connect(mapStateToProps, {})
)(Section);