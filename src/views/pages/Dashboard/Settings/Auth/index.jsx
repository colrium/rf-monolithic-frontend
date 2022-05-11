/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid'
import Card from "components/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget() {
	const settings = useSelector(state => ({ ...state?.app?.settings?.auth }))
	const {
		TextField,
		Autocomplete,
		Checkbox,
		register,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "auth-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				auth: {
					...settings,
					...values,
					websockets: {
						...values.websockets,
						send_authorization_timeout: Number.parseNumber(values?.websockets?.send_authorization_timeout, 1000),
					},
				},
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Authorization settings
					</Typography>
				</Grid>

				<Grid item  xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Login
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12}>
						<Checkbox name="logins_enabled" label="New user logins allowed" />
					</Grid>
					<Grid item  xs={12}>
						<Checkbox name="registrations_enabled" label="New registrations allowed" />
					</Grid>
					<Grid item  xs={12}>
						<Checkbox name="account_recovery_enabled" label="Account recovery allowed" />
					</Grid>
					<Grid item  xs={12}>
						<Checkbox name="OAuth2_enabled" label="OAuth2.0 authorization" />
					</Grid>
				</Grid>

				<Grid item  xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Websockets
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12}>
						<Checkbox name="websockets.enforce_authorization" label="Enforce socketIo authorization" />
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField
							type="number"
							name="websockets.send_authorization_timeout"
							label="Send Authorization Timeout (Ms)"
							rules={{
								valueAsNumber: true,
								deps: [`websockets.enforce_authorization`],
								// validate: {
								// 	checkMin: value =>
								// 		(values[`websockets.enforce_authorization`] && parseInt(value) < 1000) || "Min value is 1000",
								// 	checkMax: value => parseInt(value) > 10000 || "Max value is 10 seconds",
								// },
							}}
							disabled={!values.websockets.enforce_authorization}
							helperText="The time in milliseconds server should wait for a client to send authorization request."
						/>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
