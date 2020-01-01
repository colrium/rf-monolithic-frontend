import React from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

function ProgressDialog(props) {
  const { open, ...rest } = props;
  return (
    <Dialog open={open} aria-labelledby="transition-dialog">
    	<DialogContent>
			<DialogContentText id="transition-dialog-content">
          		Loading
			</DialogContentText>
		</DialogContent>
    </Dialog>
  );
}

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect( mapStateToProps, {})(ProgressDialog);
