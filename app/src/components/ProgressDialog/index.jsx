/** @format */

import React from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import ProgressIndicator from "components/ProgressIndicator";

function ProgressDialog(props) {
	const { open, progressIndicatorProps, ...rest } = props;
	return (
		<Dialog open={open} {...rest} aria-labelledby="progress-dialog">
			<DialogContent>
				<ProgressIndicator type="circular" size={24} thickness={3} {...progressIndicatorProps} />
			</DialogContent>
		</Dialog>
	);
}

const mapStateToProps = state => ({
	nav: state.nav,
});

export default connect(mapStateToProps, {})(ProgressDialog);
