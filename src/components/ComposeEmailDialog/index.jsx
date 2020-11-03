/** @format */

import React, {useState, useEffect} from "react";
import ReactHtmlParser from "react-html-parser";
import { Dialog } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import compose from "recompose/compose";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { apiCallRequest, setEmailingCache, clearEmailingCache } from "state/actions";
import {
	FileInput,
	TextInput,
	WysiwygInput,
} from "components/FormInputs";
import ScrollBars from "components/ScrollBars";
import { attachments as AttachmentsService } from "services";
import styles from "./styles";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ComposeEmailDialog(props) {
	const { classes, cache: { emailing : { popup_open, recipient_address, recipient_name, cc, bcc, subject, content, context, record} }, apiCallRequest, setEmailingCache, clearEmailingCache} = props;

	const [emailRecipientAddress, setEmailRecipientAddress] = useState(recipient_address); 
	const [emailCC, setEmailCC] = useState(cc); 
	const [emailBCC, setEmailBCC] = useState(bcc);
	const [emailSubject, setEmailSubject] = useState(subject);
	const [emailContent, setEmailContent] = useState(content); 
	const [emailContext, setEmailContext] = useState(context); 
	const [emailRecord, setEmailRecord] = useState(record); 
	const [canSend, setCanSend] = useState(false);
	const [hasCC, setHasCC] = useState(!String.isEmpty(cc)); 
	const [hasBCC, setHasBCC] = useState(!String.isEmpty(bcc)); 

	const handleSendEmail = () => {
		setEmailingCache("popup_open", false)
	}

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
						color={"default"}
					>
						Discard Draft
					</Button>
				</div>
			</DialogTitle>

			
			<DialogContent dividers={true} className={"flex flex-col"}>
				<ScrollBars className={classes.contentScrollWrapper}>
				<DialogContentText
					id="compose-mail-scroll-dialog-description"
					ref={descriptionElementRef}
					tabIndex={-1}
				>
					
					<GridContainer id="compose-email-dialog-body">
						<GridItem xs={12}>
							<TextInput
									variant={"outlined"}								
									defaultValue={emailSubject}
									onChange={(new_value)=>{
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
							/>
						</GridItem>

						 <GridItem xs={12}>
							<TextInput
									variant={"outlined"}								
									defaultValue={emailRecipientAddress}
									onChange={(new_value)=>{
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
							/>
						 </GridItem>
						 {hasCC && <GridItem xs={12}>
							<TextInput
									variant={"outlined"}								
									defaultValue={emailCC}
									onChange={(new_value)=>{
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
							/>
						 </GridItem>}

						 {!hasCC && <GridItem xs={12} className={"flex flex-row-reverse"}>
							<Button
								onClick={() => setHasCC(true)}
								color={"secondary"}
							>
								Add CC
							</Button>
						 </GridItem>}

						 {hasBCC && <GridItem xs={12}>
							<TextInput
									variant={"outlined"}								
									defaultValue={emailBCC}
									onChange={(new_value)=>{
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
							/>
						 </GridItem>}

						 {(!hasBCC && hasCC) && <GridItem xs={12} className={"flex flex-row-reverse"}>
							<Button
								onClick={() => setHasBCC(true)}
								color={"secondary"}
							>
								Add BCC
							</Button>
						 </GridItem>}

						 

						 <GridItem xs={12}>
							<TextInput
									variant={"outlined"}								
									defaultValue={emailContent}
									onChange={(new_value)=>{
										setEmailContent(new_value);
									}}
									placeholder="Enter Email Message here ..."
									multiline
									rows={20}
									label={"Message"}
									required
									validate
									
							/>
						 </GridItem>
					</GridContainer>
					
				</DialogContentText>
				</ScrollBars>
			</DialogContent>
			
			<DialogActions>
				

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
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps, {apiCallRequest, setEmailingCache, clearEmailingCache}),
	withTheme,
)((ComposeEmailDialog));

