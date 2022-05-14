/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid'
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.contact }))
	const {
		TextField,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "contact-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				contact: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Contact Settings
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<TextField name="phone" label="Phone" />
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<TextField name="email" label="email" />
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField name="address" label="Address" multiline minRows={5} />
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
