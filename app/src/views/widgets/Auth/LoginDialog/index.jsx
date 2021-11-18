/** @format */

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ScrollBars from "components/ScrollBars";
import Typography from "components/Typography";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import LoginForm from "views/forms/LoginForm";

function Widget(props) {
	const { auth, open, onLogin, onCancel, title, className } = props;
	const [isOpen, setIsOpen] = useState(open);
	const [error, setError] = useState(false);
	useEffect(() => {
		setIsOpen(props.open);
	}, [props.open]);

	function onLoginInternal(user) {
		if (isOpen && Function.isFunction(onLogin)) {
			onLogin(user);
		}
		setIsOpen(false);
	}
	function onLoginCancel(event) {
		if (Function.isFunction(onCancel)) {
			onCancel();
		}
		setIsOpen(false);
	}
	return (
		<Dialog
			onClose={e => setIsOpen(false)}
			className={className}
			aria-labelledby="login-dialog-title"
			open={isOpen}
		>
			<DialogTitle id="login-dialog-title">
				<Typography variant="h5">{title ? title : "Login"} </Typography>
			</DialogTitle>
			<ScrollBars>
				<DialogContent>
					<GridContainer className="px-4">
						<GridItem xs={12} className="p-0 m-0">
							<LoginForm onLogin={onLoginInternal} />
						</GridItem>
					</GridContainer>
				</DialogContent>
			</ScrollBars>

			<DialogActions>
				<Button color="error" onClick={onLoginCancel}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default (connect(mapStateToProps, {})(Widget));
