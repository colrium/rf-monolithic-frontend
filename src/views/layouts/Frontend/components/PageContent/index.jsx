import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import ScrollBars from "components/ScrollBars";
import Typography from "components/Typography";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import withRoot from "utils/withRoot";

class PageContent extends Component {
	render() {
		const { className } = this.props;

		return (
			<ScrollBars className={classes.bodyWrapper}>
				<GridContainer className={ className }>
					 
				</GridContainer>
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

export default withRoot(PageContent);
