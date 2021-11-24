/** @format */

import React from "react";
import { connect } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
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
