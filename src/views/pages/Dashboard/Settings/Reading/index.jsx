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
	let settings = app.settings.reading
	const {
		TextField,
		Checkbox,
		observer$,
		formState: { errors },
	} = usePersistentForm({
		name: "reading-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					reading: { ...settings, ...formData.values },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Reading
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item xs={12} className="mb-1">
						<Checkbox name="enable-blog" label="Enable Blog" />
					</Grid>
					<Grid item xs={12} className="mb-1">
						<Checkbox name="enable-press" label="Enable Press" />
					</Grid>
					<Grid item xs={12} className="mb-1">
						<Checkbox name="enable-faq" label="Enable FAQ" />
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
