/** @format */
import React from "react"
import { connect } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget(props) {
	const { app } = props
	let settings = app.settings.social
	const {
		TextField,
		observer$,
		formState: { errors },
	} = usePersistentForm({
		name: "social-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					social: { ...settings, ...formData.values },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card>
			<Grid container className="p-4">
				<Grid container spacing={2}>
					<Grid item xs={12} className="pb-2">
						<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
							Social Links
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="facebook"
							variant="filled"
							size="small"
							margin="dense"
							size="small"
							margin="dense"
							label="Facebook"
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField name="twitter" variant="filled" size="small" margin="dense" label="Twitter" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="instagram" variant="filled" size="small" margin="dense" label="Instagram" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="youtube" variant="filled" size="small" margin="dense" label="Youtube" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="linkedin" variant="filled" size="small" margin="dense" label="Linkedin" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="whatsapp" variant="filled" size="small" margin="dense" label="Whatsapp" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="instagram" variant="filled" size="small" margin="dense" label="Instagram" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="google_plus" variant="filled" size="small" margin="dense" label="Google +" />
					</Grid>
					<Grid item xs={12}>
						<TextField name="pinterest" variant="filled" size="small" margin="dense" label="Pinterest" />
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
})

export default connect(mapStateToProps, {})(React.memo(Widget))
