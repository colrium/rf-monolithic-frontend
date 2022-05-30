/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget() {
	const app = useSelector(state => ({ ...state.app }))
	let settings = app.settings.tracking
	const {
		TextField,
		Autocomplete,
		Checkbox,
		RadioGroup,
		observer$,
		getValues,
		formState: { errors },
	} = usePersistentForm({
		name: "tracking-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	const values = getValues()
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					tracking: { ...settings, ...formData.values },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card>
			<Grid container className="p-4">
				<Grid container spacing={2}>
					<Grid item xs={12} className="mb-2">
						<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
							Location Tracking settings
						</Typography>
					</Grid>

					<Grid item xs={12} className="mb-1">
						<Autocomplete
							name="contexts"
							variant="filled"
							size="small"
							margin="dense"
							multiple
							options={{ roam: "Roam", commission: "Commission" }}
							label="Contexts"
						/>
					</Grid>
					<Grid item xs={12} className="mb-1">
						<RadioGroup name="interval-type" options={{ distance: "Distance", time: "Time" }} label="Type of interval" />
					</Grid>
					<Grid item xs={12} className="mb-1">
						<TextField
							type="number"
							name="interval"
							label="Interval"
							variant="filled"
							size="small"
							margin="dense"
							helperText={values["interval-type"] === "distance" ? "Interval in Meters" : "Interval in Seconds"}
						/>
					</Grid>
					<Grid item xs={12} className="mb-1">
						<TextField
							type="number"
							name="min-positions-per-track"
							variant="filled"
							size="small"
							margin="dense"
							label="Minimum Positions per Track"
							rules={{
								required: true,
								min: 2,
								deps: [`max-positions-per-track`],
								validate: {
									checkMax: value =>
										value < values["max-positions-per-track"] || "Min must be less than Max Positions per Track",
								},
							}}
						/>
					</Grid>
					<Grid item xs={12} className="mb-1">
						<TextField
							type="number"
							name="max-positions-per-track"
							label="Max Positions per Track"
							variant="filled"
							size="small"
							margin="dense"
							rules={{
								required: true,
								deps: [`min-positions-per-track`],
								validate: {
									checkMax: value =>
										value > values["min-positions-per-track"] || "Must be greater than Minimum Positions per Track",
								},
							}}
						/>
					</Grid>
					<Grid item xs={12} className="mb-1">
						<Checkbox name="enforce-context-location-availability" label="Enforce on-location context availability" />
					</Grid>
					<Grid item xs={12} className="mb-1">
						<Checkbox name="enforce-onlocation-actions" label="Enforce on-location actions availability" />
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
