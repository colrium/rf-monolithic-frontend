/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

import { EventRegister } from "utils"
import { withErrorBoundary } from "hoc"
import { usePersistentForm, useDidMount } from "hooks"

function Widget() {
	const settings = useSelector(state => ({ ...state?.app?.settings?.communication }))
	const {
		TextField,
		Autocomplete,
		Checkbox,
		RadioGroup,
		WysiwygEditor,
		getValues,
		observer$,
		register,
		formState: { errors },
	} = usePersistentForm({
		name: "communication-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					communication: { ...settings, ...formData.values, smtp_port: Number.parseNumber(formData.values?.smtp_port, 587) },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	const user = useSelector(state => state.auth.user)

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Communication settings
					</Typography>
				</Grid>

				<Grid item xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Outgoing Mail (SMTP)
					</Typography>
				</Grid>

				<Grid container className="px-0 py-4" spacing={2}>
					<Grid item xs={12}>
						<TextField name="smtp_host" label="Host" variant="filled" size="small" margin="dense" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="smtp_user" label="SMTP Email Address" type="email" variant="filled" size="small" margin="dense" />
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="smtp_password"
							label="SMTP Password"
							type="password"
							variant="filled"
							size="small"
							margin="dense"
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="SMTP port"
							variant="filled"
							size="small"
							margin="dense"
							{...register("smtp_port", { valueAsNumber: true })}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField name="smtp_sender_name" label="SMTP Sender Name" debounce={1000} variant="filled" />
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="courierAuthorizationToken"
							label="Courier Authorization Token"
							type="password"
							debounce={1000}
							variant="filled"
							size="small"
							margin="dense"
						/>
					</Grid>
					<Grid item xs={12}>
						<Checkbox name="smtp_pool" label="SMTP Pool" />
					</Grid>

					<Grid item xs={12}>
						<Checkbox name="smtp_secure" label="SMTP Secure" />
					</Grid>

					<Grid item xs={12}>
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
								<Typography variant="subtitle1" sx={{ color: theme => theme.palette.text.disabled }}>
									Email confirmation mail template
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											name="password_recovery_subject"
											label="Subject"
											debounce={1000}
											variant="filled"
											size="small"
											margin="dense"
										/>
									</Grid>
									<Grid item xs={12}>
										<WysiwygEditor name="password_recovery_template" label="Template" />
									</Grid>
								</Grid>
							</AccordionDetails>
						</Accordion>
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
								<Typography variant="subtitle1" sx={{ color: theme => theme.palette.text.disabled }}>
									Password recovery mail template
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											name="password_recovery_subject"
											label="Subject"
											debounce={1000}
											variant="filled"
											size="small"
											margin="dense"
										/>
									</Grid>
									<Grid item xs={12}>
										<WysiwygEditor name="password_recovery_template" label="Template" />
									</Grid>
								</Grid>
							</AccordionDetails>
						</Accordion>
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
								<Typography variant="subtitle1" sx={{ color: theme => theme.palette.text.disabled }}>
									Applicant User account mail template
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											name="password_recovery_subject"
											label="Subject"
											debounce={1000}
											variant="filled"
											size="small"
											margin="dense"
										/>
									</Grid>
									<Grid item xs={12}>
										<WysiwygEditor name="password_recovery_template" label="Template" />
									</Grid>
								</Grid>
							</AccordionDetails>
						</Accordion>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default withErrorBoundary(React.memo(Widget))
