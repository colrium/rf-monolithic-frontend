/** @format */

// Material helpers
import { Divider, Typography } from "@material-ui/core";
import { app } from "assets/jss/app-theme";
// Externals
import PropTypes from "prop-types";
import React, { Component } from "react";
import {withErrorHandler} from "hoc/ErrorHandler";

// Component styles
const styles = theme => ({
	root: {
		padding: theme.spacing(4),
	},
	company: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(0.5),
	},
});

class Footer extends Component {
	render() {
		const { className } = this.props;

		return (
			<div
				className={
					"p-4 absolute bottom-0 mt-16" +
					(className ? " " + className : "")
				}
			>
				<Divider />
				<Typography className="mt-2 mb-1" variant="body1">
					&copy; {app.name}. {new Date().format("Y")}
				</Typography>
				<Typography variant="caption">{app.description}</Typography>
			</div>
		);
	}
}

Footer.propTypes = {
	className: PropTypes.string,
};

export default withErrorHandler(Footer);
