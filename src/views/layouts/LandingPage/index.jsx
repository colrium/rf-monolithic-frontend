/** @format */

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import compose from "recompose/compose";
import ActionDialog from "components/ActionDialog";
import Header from "./Header"
import Footer from "./Footer"

import { useErrorBoundary } from "hooks";

const LandingPage = (props) => {
	const {
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
	} = props;

	// const { ErrorBoundary, didCatch, error } = useErrorBoundary()


	// return (
	// 	// <>
	// 	// 	{didCatch ? (
	// 	// 		<p>An error has been caught: {error.message}</p>
	// 	// 	) : (
	// 	// 		<ErrorBoundary>
	// 	// 			{showHeader && <Header navItems={navItems} {...rest} />}
	// 	// 			<main className={(showHeader ? (" p-20 mt-16  relative") : " p-0  mt-16 relative")}>

	// 	// 				<ActionDialog  {...rest} />
	// 	// 				{children}

	// 	// 			</main>
	// 	// 			{showFooter && <Footer color="accent"  {...rest} />}
	// 	// 		</ErrorBoundary>
	// 	// 	)}
	// 	// </>

	// );

	return (
		<>
			{showHeader && <Header navItems={navItems} {...rest} />}
			<main className={"min-h-screen p-0 relative"}>

				<ActionDialog  {...rest} />
				{children}

			</main>
			{showFooter && <Footer color="accent"  {...rest} />}
		</>

	);

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


export default compose(

	connect(
		mapStateToProps,
		{}
	)

)(LandingPage);
