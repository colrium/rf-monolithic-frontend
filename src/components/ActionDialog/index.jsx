import React from "react";
import ReactHtmlParser from "react-html-parser";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { useDispatch, useSelector } from "react-redux";
import * as Actions from "state/actions";

const ActionDialog = React.memo((props) => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.dialog.state);
	const options = useSelector(state => state.dialog.options);
	let { title, body, actions } = options;
	if (String.isString(title)) {
		title = title.hasHTML() ? ReactHtmlParser(title) : title;
	}
	if (String.isString(body)) {
		body = body.hasHTML() ? ReactHtmlParser(body) : body;
	}

	return (
		<Dialog
			open={state}
			onClose={ev => dispatch(Actions.closeDialog())}
			aria-labelledby="action-dialog-title"
		>
			{title ? (
				<DialogTitle id="action-dialog-title" variant="h4">
					{title}
				</DialogTitle>
			) : (
				<DialogTitle id="action-dialog-title" variant="h4">
					Heads up!
				</DialogTitle>
			)}
			{body ? (
				<DialogContent>
					<DialogContentText id="action-dialog-content">
						{body}
					</DialogContentText>
				</DialogContent>
			) : (
				""
			)}

			{options.actions ? (
				<DialogActions>
					{Object.keys(options.actions).map(action => (
						<Button
							onClick={
								options.actions[action].onClick
									? options.actions[action].onClick
									: () => dispatch(Actions.closeDialog())
							}
							color={
								options.actions[action].color
									? options.actions[action].color
									: "primary"
							}
							key={"action-dialog-action-" + action}
						>
							{options.actions[action].text
								? options.actions[action].text
								: action}
						</Button>
					))}
				</DialogActions>
			) : (
				""
			)}
		</Dialog>
	);
});

export default ActionDialog;
