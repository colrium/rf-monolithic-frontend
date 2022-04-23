/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import GridContainer from "components/Grid/GridContainer"
import Card from "components/Card"
import GridItem from "components/Grid/GridItem"
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget() {
	const settings = useSelector(state => ({ ...state?.app?.settings?.auth }))
	const {
		TextField,
		Autocomplete,
		Checkbox,
		RadioGroup,
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
				auth: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Authorization settings
					</Typography>
				</GridItem>

				<GridItem xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Login
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12}>
						<Checkbox name="logins_enabled" label="New user logins allowed" />
					</GridItem>
					<GridItem xs={12}>
						<Checkbox name="registrations_enabled" label="New registrations allowed" />
					</GridItem>
					<GridItem xs={12}>
						<Checkbox name="account_recovery_enabled" label="Account recovery allowed" />
					</GridItem>
					<GridItem xs={12}>
						<Checkbox name="OAuth2_enabled" label="OAuth2.0 authorization" />
					</GridItem>
				</GridContainer>

				<GridItem xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Websockets
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12}>
						<Checkbox name="enforce_socketio_authorization" label="Enforce socketIo authorization" />
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}

export default React.memo(Widget)
