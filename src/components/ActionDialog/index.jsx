/** @format */

import React from "react";
import ReactHtmlParser from "react-html-parser";
import { Dialog } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "components/Button";

import { useDispatch, useSelector } from "react-redux";
import * as Actions from "state/actions";

function ActionDialog(props) {
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
									: "default"
							}
							simple
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
}

export default ActionDialog;
