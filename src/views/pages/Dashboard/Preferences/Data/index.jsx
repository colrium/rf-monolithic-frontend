/** @format */
import React from "react"
import { connect } from "react-redux"
import { Typography } from "@mui/material"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget(props) {
	const { preferences } = props
	const {
		TextField,
		Autocomplete,
		observer$,
		formState: { errors },
	} = usePersistentForm({
		name: "data-preferences",
		volatile: true,
		defaultValues: {
			pagination: 10,
			defaultMapZoom: 15,
			...preferences.data,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			let data_values = { ...formData.values }
			data_values.pagination = parseInt(data_values.pagination)
			data_values.defaultMapZoom = parseInt(data_values.defaultMapZoom)
			EventRegister.emit("change-preferences", { data: data_values })
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card elevation={0}>
			<Grid container className="px-2">
				<Grid item xs={12} className="mb-2">
					<Typography variant="h3">Display and Visualization</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item xs={12} className="mb-2">
						<Typography variant="h5">Data</Typography>
					</Grid>
					<Grid item xs={12} className="mb-2">
						<Autocomplete
							name="pagination"
							label="Records per Page"
							type="number"
							options={{
								5: "5",
								10: "10",
								25: "25",
								50: "50",
								100: "100",
								250: "250",
								500: "500",
								"-1": "All",
							}}
							rules={{
								validate: {
									isSet: val => val === "-1" || val >= 5 || "Value is Required",
								},
							}}
						/>
					</Grid>

					<Grid item xs={12} className="mb-4">
						<TextField
							name="defaultMapZoom"
							label="Default Map Zoom"
							type="number"
							rules={{
								validate: {
									isAboveMin: val => val >= 5 || "Value should be greater than or equal to 5 ",
									isBelowMax: val => val <= 25 || "Value should be greater than or equal to 5 ",
								},
								valueAsNumber: true,
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}
const mapStateToProps = state => ({
	preferences: state.app.preferences || {},
})

export default connect(mapStateToProps, {})(React.memo(Widget))
