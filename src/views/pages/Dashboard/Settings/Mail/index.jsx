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
	const settings = useSelector(state => ({ ...state?.app?.settings?.mail }))
	const {
		TextField,
		Autocomplete,
		Checkbox,
		RadioGroup,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "mail-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				mail: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	console.log("Mail Settings", settings)

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Mail settings
					</Typography>
				</GridItem>

				<GridItem xs={12} className="my-4">
					<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
						Outgoing Mail (SMTP)
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<TextField name="smtp_host" label="Host" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="smtp_user" label="Account Address" type="email" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="smtp_password" label="Account Password" type="password" />
					</GridItem>

					<GridItem xs={12}>
						<Checkbox name="smtp_tls" label="TLS" />
					</GridItem>
					<GridItem xs={12}>
						<Checkbox name="smtp_ssl" label="SSL" />
					</GridItem>

					<GridItem xs={12} className="mb-1">
						<TextField name="smtp_sender_name" label="Sender Name" />
					</GridItem>

					{/* <GridItem xs={12} className="mb-1">
						<Checkbox name="private" label="Private" />
					</GridItem> */}

					<GridItem xs={12} className="my-4">
						<Typography variant="h6" sx={{ color: theme => theme.palette.text.disabled }}>
							Password recovery template
						</Typography>
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}

export default React.memo(Widget)
