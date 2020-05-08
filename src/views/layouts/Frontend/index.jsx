/** @format */

import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import compose from "recompose/compose";
import ActionDialog from "components/ActionDialog";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styles from "./styles";
import {withErrorHandler} from "hoc/ErrorHandler";

class Frontend extends Component {
	render() {
		const {
			classes,
			className,
			children,
			navItems,
			showHeader,
			showFooter,
			nav,
		} = this.props;

		return (
			<div className={"p-0 m-0"}>
				{showHeader && <Header navItems={navItems} />}
				<main className={showHeader ? classes.mainContent : ""}>
					<ActionDialog />
					{children}
				</main>
				{showFooter && <Footer color="accent" />}
			</div>
		);
	}
}

Frontend.propTypes = {
	className: PropTypes.string,
	navItems: PropTypes.object,
	showFooter: PropTypes.bool,
	showHeader: PropTypes.bool,
};

Frontend.defaultProps = {
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

	)(Frontend)
);
