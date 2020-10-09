/** @format */

import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import compose from "recompose/compose";
import LandingPageRoutes from "routes/LandingPageRoutes";
import ActionDialog from "components/ActionDialog";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styles from "./styles";
import { HashRouter } from "react-router-dom";
import {withErrorHandler} from "hoc/ErrorHandler";

class LandingPage extends Component {
	render() {
		const {
			classes,
			className,
			children,
			navItems,
			showHeader,
			showFooter,
			nav,
			sidebar_items,
			indexUri,
			contexts,
			...rest
		} = this.props;

		return (	
				<div>
					
					{showHeader && <Header navItems={navItems} {...rest}/>}
					<main  className={(showHeader ? (classes.mainContent+" p-0 mt-16 pb-32 relative") : " p-0 pb-32 mt-16 relative")}>
						
						<ActionDialog  {...rest}/>
						{children}
						
					</main>
					{showFooter && <Footer color="accent"  {...rest}/>}
				</div>
			
		);
	}
}

LandingPage.propTypes = {
	className: PropTypes.string,
	navItems: PropTypes.object,
	showFooter: PropTypes.bool,
	showHeader: PropTypes.bool,
};

LandingPage.defaultProps = {
	showFooter: true,
	showHeader: true,
};

const mapStateToProps = state => ({
	nav: state.nav,
});


export default withErrorHandler(
	compose(
		withStyles(styles),
		connect(
			mapStateToProps,
			{}
		)

	)(LandingPage)
);
