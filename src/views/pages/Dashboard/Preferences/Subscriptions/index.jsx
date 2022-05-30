/** @format */
import React, { useState } from "react"
import { connect } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget(props) {
	const { app } = props
	let preferences = app.preferences.subscriptions
	const {
		Checkbox,
		observer$,
		formState: { errors },
	} = usePersistentForm({
		name: "subscriptions-preferences",
		volatile: true,
		defaultValues: {
			...preferences,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(errors)) {
				EventRegister.emit("change-preferences", {
					subscriptions: { ...preferences, ...formData.values },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item xs={12} className="mb-2">
					<Typography variant="h3">Subscriptions</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item xs={12} className="mb-2">
						<Checkbox name="newsletter" label="Newsletter" />
					</Grid>

					<Grid item xs={12} className="mb-2">
						<Checkbox name="posts" label="Blog posts" />
					</Grid>

					<Grid item xs={12} className="mb-2">
						<Checkbox name="updates" label="Updates" />
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
