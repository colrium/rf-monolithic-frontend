/** @format */

import React, { useState, useEffect, useCallback } from "react"
import { Dialog } from "@mui/material"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Slide from "@mui/material/Slide"
import { connect } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
import Grid from "@mui/material/Grid"
import { apiCallRequest, setEmailingCache, clearEmailingCache } from "state/actions"
import ScrollBars from "components/ScrollBars"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import { usePersistentForm } from "hooks"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

function ComposeEmailDialog(props) {
	const {
		communication: {
			emailing: { popup_open, recipient_address, recipient_name, cc, bcc, subject, content, context, record },
		},
		apiCallRequest,
		setEmailingCache,
		clearEmailingCache,
	} = props

	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()

	const { Form, TextField, Autocomplete, WysiwygEditor, getValues, submit, register, formState } = usePersistentForm({
		name: "compose-email-dialog",
		onSubmit: (formData, e) => {
			const contentText = String.htmlToText(formData.html)
			console.log("contentText", contentText)
			setEmailingCache("popup_open", false)
			Api.post("/emails", { ...formData, text: contentText }, { params: { p: "1" } })
				.then(res => {
					const { data } = res.body
					clearEmailingCache()

					queueNotification({
						severity: "success",
						title: `Email sent`,
						content: `Email sent to ${formData.to}`,
					})
				})
				.catch(err => {
					queueNotification({
						severity: "error",
						title: `Something went wrong`,
						content: `Error sending email to ${formData.to} - ${err.message || err.msg}`,
					})
				})
		},
		defaultValues: {
			to: recipient_address,
			subject: subject,
		},
	})

	const handleDiscardEmail = () => {
		clearEmailingCache()
		setEmailingCache("popup_open", false)
	}

	const descriptionElementRef = React.useRef(null)

	return (
		<Dialog
			open={popup_open}
			onClose={event => setEmailingCache("popup_open", false)}
			TransitionComponent={Transition}
			scroll="paper"
			fullScreen
		>
			<DialogTitle id="compose-mail-dialog-title">
				<div className="w-full flex flex-row items-center">
					<Typography variant="subtitle1" className={"flex-grow"}>
						Send Mail
					</Typography>

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
					<DialogContentText id="compose-mail-scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant={"filled"}
									size={"small"}
									margin="dense"
									{...register("to", { required: true })}
									label={"Recipient"}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant={"filled"}
									size={"small"}
									margin="dense"
									{...register("subject", { required: true })}
									label={"Subject"}
									fullWidth
								/>
							</Grid>

							<Grid item xs={12}>
								<WysiwygEditor
									variant={"filled"}
									size={"small"}
									margin="dense"
									{...register("html", { required: true })}
									placeholder={"Enter your message here"}
									label="Message"
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

				<Button onClick={submit} color={"primary"} disabled={!formState.isValid}>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
	device: state.device,
	communication: state.communication,
})

export default compose(connect(mapStateToProps, { apiCallRequest, setEmailingCache, clearEmailingCache }), withTheme)(ComposeEmailDialog)
