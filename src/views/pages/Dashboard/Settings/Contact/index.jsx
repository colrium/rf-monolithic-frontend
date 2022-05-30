/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.contact }))
	const {
		TextField,
		observer$,
		formState: { errors },
	} = usePersistentForm({
		name: "contact-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					contact: { ...settings, ...formData.values },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card>
			<Grid container className="px-8 pb-8">
				<Grid item xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Contact Settings
					</Typography>
				</Grid>

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField name="phone" variant="filled" label="Phone" />
					</Grid>

					<Grid item xs={12}>
						<TextField name="email" variant="filled" label="email" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="address" variant="filled" label="Address" multiline minRows={5} />
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
