/** @format */

import GridContainer from "components/Grid/GridContainer";
import ScrollBars from "components/ScrollBars";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {withErrorHandler} from "hoc/ErrorHandler";




class PageContent extends Component {
	render() {
		const { className } = this.props;

		return (
			<ScrollBars className={classes.bodyWrapper}>
				<GridContainer className={className}></GridContainer>
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

export default withErrorHandler(PageContent);
