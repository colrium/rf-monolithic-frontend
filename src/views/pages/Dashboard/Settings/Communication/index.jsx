/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid'
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget() {
	const settings = useSelector(state => ({ ...state?.app?.settings?.communication }))
	const {
		TextField,
		Autocomplete,
		Checkbox,
		RadioGroup,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "communication-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				communication: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Communication settings
					</Typography>
				</Grid>

				<Grid item  xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Outgoing Mail (SMTP)
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<TextField name="smtp_host" label="Host" />
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField name="smtp_user" label="SMTP Email Address" type="email" />
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField name="smtp_password" label="SMTP Password" type="password" />
					</Grid>

					<Grid item  xs={12}>
						<Checkbox name="smtp_secure" label="Secure SMTP" />
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<TextField name="smtp_sender_name" label="SMTP Sender Name" debounce={1000} />
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<TextField name="courierAuthorizationToken" label="Courier Authorization Token" type="password" debounce={1000} />
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<Checkbox name="smtp_pool" label="SMTP Pool" />
					</Grid>

					<Grid item  xs={12} className="my-4">
						<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
							Password recovery template
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
