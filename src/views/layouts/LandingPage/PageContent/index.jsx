/** @format */

import Grid from '@mui/material/Grid';
import ScrollBars from "components/ScrollBars";
import PropTypes from "prop-types";
import React, { Component } from "react";




class PageContent extends Component {
	render() {
		const { className } = this.props;

		return (
			<ScrollBars className={classes?.bodyWrapper}>
				<Grid container className={className}></Grid>
			</ScrollBars>
		);
	}
}

PageContent.propTypes = {
	className: PropTypes.string,
	layout: PropTypes.oneOf(["simple", "carded"]),
	tabs: PropTypes.object,
	leftSidebarContent: PropTypes.node,
	rightSidebarContent: PropTypes.node,
	bannerContent: PropTypes.node,
};

export default PageContent;
