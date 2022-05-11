/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { connect } from "react-redux";
import { withTheme } from "@mui/styles";

import compose from "recompose/compose";
import Grid from '@mui/material/Grid';
;
import { apiCallRequest, setEmailingCache, clearEmailingCache } from "state/actions";
import { TextInput } from "components/FormInputs";
import ScrollBars from "components/ScrollBars";
import { useNetworkServices, useNotificationsQueue } from "contexts"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


function ComposeEmailDialog(props) {
	const { communication: { emailing: { popup_open, recipient_address, recipient_name, cc, bcc, subject, content, context, record } }, apiCallRequest, setEmailingCache, clearEmailingCache } = props;
	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()
	const [emailRecipientAddress, setEmailRecipientAddress] = useState(recipient_address);
	const [emailCC, setEmailCC] = useState(cc);
	const [emailBCC, setEmailBCC] = useState(bcc);
	const [emailSubject, setEmailSubject] = useState(subject);
	const [emailContent, setEmailContent] = useState(content);
	const [emailContext, setEmailContext] = useState(context);
	const [emailRecord, setEmailRecord] = useState(record);
	const [canSend, setCanSend] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(false);
	const [alert, setAlert] = useState(false);
	const [hasCC, setHasCC] = useState(!String.isEmpty(cc));
	const [hasBCC, setHasBCC] = useState(!String.isEmpty(bcc));

	const handleSendEmail = useCallback(() => {
		setSubmitting(true)
		setAlert(false)
		setError(false)
		Api.post(
			"/emails",
			{
				folder: "outbox",
				subject: emailSubject,
				recipient_address: emailRecipientAddress,
				cc: emailCC,
				bcc: emailBCC,
				content: emailContent,
				context: emailContext,
				record: emailRecord,
				attachments: null,
			},
			{ params: { p: "1" } }
		)
			.then(res => {
				const { data } = res.body
				clearEmailingCache()
				setEmailingCache("popup_open", false)
				setSubmitting(false)
				queueNotification({
					severity: "success",
					title: `Email sent`,
					content: `Email sent to ${emailRecipientAddress}`,
				})
			})
			.catch(err => {
				setSubmitting(false)
				queueNotification({
					severity: "error",
					title: `Something went wrong`,
					content: `Error sending email to ${emailRecipientAddress}`,
				})
			})
	}, [emailSubject, emailRecipientAddress, emailCC, emailBCC, emailContent, emailContext, emailRecord, record, emailSubject])

	const handleDiscardEmail = () => {
		clearEmailingCache();
		setEmailingCache("popup_open", false)
	}



	const descriptionElementRef = React.useRef(null);
	useEffect(() => {
		if (popup_open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [popup_open]);

	useEffect(() => {
		setCanSend(!String.isEmpty(emailRecipientAddress) && !String.isEmpty(emailSubject) && !String.isEmpty(emailContent));
	}, [emailRecipientAddress, emailSubject, emailContent]);

	useEffect(() => {
		setEmailRecipientAddress(recipient_address);
	}, [recipient_address]);

	useEffect(() => {
		setEmailCC(cc);
	}, [cc]);

	useEffect(() => {
		setEmailBCC(bcc);
	}, [bcc]);

	useEffect(() => {
		setEmailSubject(subject);
	}, [subject]);

	useEffect(() => {
		setEmailContent(content);
	}, [content]);

	useEffect(() => {
		setEmailContext(context);
	}, [context]);

	useEffect(() => {
		setEmailRecord(record);
	}, [record]);

	useEffect(() => {
		return () => {
			setEmailingCache("recipient_address", emailRecipientAddress);
			setEmailingCache("subject", emailSubject);
			setEmailingCache("content", emailContent);
			setEmailingCache("context", emailContext);
			setEmailingCache("cc", emailCC);
			setEmailingCache("bcc", emailBCC);
			setEmailingCache("context", emailContext);
			setEmailingCache("record", emailRecord);
		}
	}, []);



	return (
		<Dialog
			open={popup_open}
			onClose={event => setEmailingCache("popup_open", false)}
			TransitionComponent={Transition}
			scroll="paper"
			fullScreen
		>
			<DialogTitle
				id="compose-mail-dialog-title"

			>
				<div className="w-full flex flex-row items-center">

					<Typography variant="subtitle1" className={"flex-grow"}> Compose Mail </Typography>

					<Button
						onClick={() => {
							handleDiscardEmail()
						}}
						color={"warning"}
					>
						Discard Draft
					</Button>
				</div>
			</DialogTitle>


			<DialogContent dividers={true} className={"flex flex-col"}>
				<ScrollBars className={`overflow-y-scroll overflow-x-hidden top-0 flex-grow p-4`}>
					<DialogContentText
						id="compose-mail-scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>

						<Grid container id="compose-email-dialog-body">
							<Grid item  xs={12}>
								<TextInput
									variant={"outlined"}
									defaultValue={emailSubject}
									onChange={(new_value) => {
										setEmailSubject(new_value);
									}}
									label={"Subject:"}
									inputProps={{
										onKeyDown: (event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												let new_value = event.target.value;
												if (String.isString(new_value)) {
													new_value = new_value.trim();
												}
												else {
													new_value = "";
												}
												setEmailSubject(new_value);
												event.target.blur()

											}
										},
									}}
									required
									validate
									fullWidth
								/>
							</Grid>

							<Grid item  xs={12}>
								<TextInput
									variant={"outlined"}
									defaultValue={emailRecipientAddress}
									onChange={(new_value) => {
										setEmailRecipientAddress(new_value);
									}}
									placeholder="Enter Recipient Email Address"
									label={"To:"}
									inputProps={{
										onKeyDown: (event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												let new_value = event.target.value;
												if (String.isString(new_value)) {
													new_value = new_value.trim();
												}
												else {
													new_value = "";
												}
												setEmailRecipientAddress(new_value);
												event.target.blur()

											}
										},
									}}
									required
									validate
									fullWidth
								/>
							</Grid>
							{hasCC && <Grid item  xs={12}>
								<TextInput
									variant={"outlined"}
									defaultValue={emailCC}
									onChange={(new_value) => {
										setEmailCC(new_value);
									}}
									placeholder="CC Email Address"
									label={"CC:"}
									inputProps={{
										onKeyDown: (event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												let new_value = event.target.value;
												if (String.isString(new_value)) {
													new_value = new_value.trim();
												}
												else {
													new_value = "";
												}
												setEmailCC(new_value);
												event.target.blur()

											}
										},
									}}
									fullWidth
								/>
							</Grid>}

							{!hasCC && <Grid item  xs={12} className={"flex flex-row-reverse"}>
								<Button
									onClick={() => setHasCC(true)}
									color={"secondary"}
								>
									Add CC
								</Button>
							</Grid>}

							{hasBCC && <Grid item  xs={12}>
								<TextInput
									variant={"outlined"}
									defaultValue={emailBCC}
									onChange={(new_value) => {
										setEmailBCC(new_value);
									}}
									placeholder="BCC Email Address"
									label={"BCC:"}
									inputProps={{
										onKeyDown: (event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												let new_value = event.target.value;
												if (String.isString(new_value)) {
													new_value = new_value.trim();
												}
												else {
													new_value = "";
												}
												setEmailBCC(new_value);
												event.target.blur()

											}
										},
									}}
									fullWidth
								/>
							</Grid>}

							{(!hasBCC && hasCC) && <Grid item  xs={12} className={"flex flex-row-reverse"}>
								<Button
									onClick={() => setHasBCC(true)}
									color={"secondary"}
								>
									Add BCC
								</Button>
							</Grid>}



							<Grid item  xs={12}>
								<TextInput
									variant={"outlined"}
									defaultValue={emailContent}
									onChange={(new_value) => {
										setEmailContent(new_value);
									}}
									placeholder="Enter Email Message here ..."
									multiline
									rows={20}
									label={"Message"}
									required
									validate
									fullWidth

								/>
							</Grid>
						</Grid>

					</DialogContentText>
				</ScrollBars>
			</DialogContent>

			<DialogActions>
				<Button
						onClick={() => {
							handleDiscardEmail()
						}}
						color={"warning"}
					>
						Discard Draft
				</Button>

				<Button
					onClick={() => handleSendEmail()}
					color={"primary"}
					disabled={!canSend}
				>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
	device: state.device,
	communication: state.communication,
});

export default compose(

	connect(mapStateToProps, { apiCallRequest, setEmailingCache, clearEmailingCache }),
	withTheme,
)((ComposeEmailDialog));
